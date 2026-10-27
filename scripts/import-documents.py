"""Rebuild the read-only page-content projection from the six client DOCX inputs."""
from pathlib import Path
from zipfile import ZipFile
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
INPUT = ROOT / 'input/pages-2026-10-27'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
W = '{' + NS['w'] + '}'
FILES = [
    ('forex-rebates', 'Forex Broker Rebates text.docx'),
    ('crypto-rebates', 'Crypto Exchange Rebates text.docx'),
    ('prop-rebates', 'Prop Firm Rebates text.docx'),
    ('forex-guide', 'How-to-Choose-a-Forex-Broker.docx'),
    ('crypto-guide', 'How-to-Choose-a-Crypto-Exchange.docx'),
    ('prop-guide', 'How-to-Choose-a-Prop-Firm.docx'),
]


def paragraph(node):
    runs = []
    for run in node.findall('.//w:r', NS):
        text = ''.join((part.text or '') if part.tag == W+'t' else '\n' if part.tag == W+'br' else '\t' if part.tag == W+'tab' else '' for part in run)
        if not text:
            continue
        bold = run.find('w:rPr/w:b', NS)
        italic = run.find('w:rPr/w:i', NS)
        runs.append({'text': text, 'bold': bold is not None and bold.get(W+'val') != '0',
                     'italic': italic is not None and italic.get(W+'val') != '0'})
    text = ''.join(r['text'] for r in runs).strip()
    if not text:
        return None
    style_node = node.find('w:pPr/w:pStyle', NS)
    style = style_node.get(W+'val', 'Normal') if style_node is not None else 'Normal'
    is_list = 'List' in style or node.find('w:pPr/w:numPr', NS) is not None
    is_bold = all(r['bold'] for r in runs if r['text'].strip())
    kind = 'paragraph'
    if style in ('Title', 'Subtitle'):
        kind = style.lower()
    elif style.startswith('Heading'):
        kind = 'heading'
    elif is_list:
        kind = 'list-item'
    elif is_bold and (text.endswith('?') or text == 'Important Information'):
        kind = 'heading'
    elif text.startswith('Example:') or (is_bold and 'Payment Options' in text):
        kind = 'subheading'
    elif is_bold and ('cashback' in text.lower() or '→' in text):
        kind = 'formula' if '→' not in text else 'flow'
    return {'type': kind, 'text': text, 'runs': runs, 'sourceStyle': style}


pages = {}
for key, filename in FILES:
    with ZipFile(INPUT / filename) as document:
        body = ET.fromstring(document.read('word/document.xml')).find('w:body', NS)
    blocks = []
    for node in body:
        if node.tag == W+'p':
            block = paragraph(node)
            if block:
                blocks.append(block)
        elif node.tag == W+'tbl':
            rows = []
            for row in node.findall('w:tr', NS):
                cells = []
                for cell in row.findall('w:tc', NS):
                    paragraphs = [p for n in cell.findall('w:p', NS) if (p := paragraph(n))]
                    cells.append({'text': '\n'.join(p['text'] for p in paragraphs), 'paragraphs': paragraphs})
                rows.append(cells)
            blocks.append({'type': 'table', 'rows': rows})
    pages[key] = {'source': filename, 'blocks': blocks}

(INPUT / 'content.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2) + '\n')
print('Imported:', ', '.join(f'{key} ({len(page["blocks"])} blocks)' for key, page in pages.items()))
