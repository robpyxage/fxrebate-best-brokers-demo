"""Extract client educational DOCX content and figures into an ordered, portable projection."""
from pathlib import Path
from zipfile import ZipFile
import json
import re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent.parent
SOURCE=ROOT/'input/pages-2026-11-16'
ASSETS=ROOT/'assets/learning'
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
W='{'+NS['w']+'}'
FILES={'forex':'What is a Forex Broker.docx','crypto':'What is a Crypto Exchange.docx','prop':'What is a Prop Firm.docx'}

def paragraph(node):
    runs=[]
    for run in node.findall('.//w:r',NS):
        text=''.join((p.text or '') if p.tag==W+'t' else '\n' if p.tag==W+'br' else '\t' if p.tag==W+'tab' else '' for p in run)
        if not text:continue
        bold=run.find('w:rPr/w:b',NS);italic=run.find('w:rPr/w:i',NS)
        runs.append({'text':text,'bold':bold is not None and bold.get(W+'val')!='0','italic':italic is not None and italic.get(W+'val')!='0'})
    text=''.join(r['text'] for r in runs).strip()
    if not text:return None
    st=node.find('w:pPr/w:pStyle',NS);style=st.get(W+'val','Normal') if st is not None else 'Normal'
    return {'type':'paragraph','text':text,'runs':runs,'style':style}

pages={}
for market,filename in FILES.items():
    with ZipFile(SOURCE/filename) as z:
        root=ET.fromstring(z.read('word/document.xml'));relations=ET.fromstring(z.read('word/_rels/document.xml.rels'))
        targets={rel.get('Id'):rel.get('Target') for rel in relations};nodes=list(root.find('w:body',NS));blocks=[]
        for i,node in enumerate(nodes):
            if node.tag==W+'p':
                imgs=node.findall('.//a:blip',NS)
                nextblock=paragraph(nodes[i+1]) if i+1<len(nodes) and nodes[i+1].tag==W+'p' else None
                if imgs and nextblock and re.match(r'^Figure\s+\d+',nextblock['text']):
                    number=int(re.match(r'^Figure\s+(\d+)',nextblock['text']).group(1));target=targets[imgs[0].get('{'+NS['r']+'}embed')]
                    dest=ASSETS/market/f'figure-{number}.png';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(z.read('word/'+target))
                    blocks.append({'type':'figure','number':number,'image':'/assets/learning/'+market+f'/figure-{number}.png','caption':nextblock['text']})
                block=paragraph(node)
                if block:
                    if re.match(r'^Figure\s+\d+',block['text']):continue
                    if re.match(r'^\d{2}\s',block['text']):block['type']='section'
                    blocks.append(block)
            elif node.tag==W+'tbl':
                rows=[]
                for row in node.findall('w:tr',NS):
                    cells=[]
                    for cell in row.findall('w:tc',NS):
                        ps=[b for p in cell.findall('w:p',NS) if (b:=paragraph(p))]
                        cells.append({'text':'\n'.join(b['text'] for b in ps),'paragraphs':ps})
                    rows.append(cells)
                blocks.append({'type':'table','rows':rows})
        pages[market]={'source':filename,'blocks':blocks}
(SOURCE/'content.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n')
print('Imported',', '.join(f"{k}: {len(v['blocks'])} blocks, {sum(x['type']=='figure' for x in v['blocks'])} figures" for k,v in pages.items()))
