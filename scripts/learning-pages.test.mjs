import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {learningPages,learningDocument,renderLearning} from '../src/learning-pages.mjs';
import {pages,renderIndex} from '../src/content-pages.mjs';
import {renderDiagram} from '../src/learning-figures.mjs';
const originals=JSON.parse(readFileSync('input/pages-2026-11-16/content.json','utf8'));
const norm=value=>value.replace(/\s+/g,'');
const plain=html=>html.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'");

test('all three client documents retain their paragraphs, figures, tables and question answers',()=>{
 assert.equal(learningPages.length,3);
 for(const page of learningPages){
  const html=renderLearning(page),visible=norm(plain(html)),doc=learningDocument(page);
  assert.equal(doc.sections.length,page.market==='crypto'?20:22);
  assert.equal(doc.sections.flatMap(s=>s.blocks).filter(b=>b.type==='figure').length,6);
  for(const block of originals[page.market].blocks){
   if(block.type==='figure'){assert(visible.includes(norm(block.caption)),`${page.id}: missing ${block.caption}`);assert(existsSync('output/site'+block.image));continue;}
   if(block.type==='table'){
    const editable=block.rows.some(row=>row.some(cell=>/^_{3,}$/.test(cell.text.trim())));
    for(const cell of block.rows.flat()){
     if(editable&&(/^_{3,}$/.test(cell.text.trim())||cell.text==='Yes / No'))continue;
     assert(visible.includes(norm(cell.text)),`${page.id}: missing cell ${cell.text}`);
    }
   }else assert(visible.includes(norm(block.text)),`${page.id}: missing ${block.text}`);
  }
  assert.equal((html.match(/class="question-disclosure learning-question"/g)||[]).length,page.market==='forex'?17:16);
 }
});

test('the generated routes link to all topic resources with no broken local anchors',()=>{
 const paths=new Set([...pages.map(p=>p.path),...learningPages.map(p=>p.path),'/preview','/brokers/best-forex-brokers']);
 for(const p of learningPages){
  const html=readFileSync(`output/site${p.path}/index.html`,'utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1);assert(html.includes('noindex,nofollow'));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const match of html.matchAll(/href="(#[^"]+)"/g))assert(ids.includes(match[1].slice(1)),`${p.id} missing ${match[1]}`);
  for(const match of html.matchAll(/href="(\/[^"#]+)(?:#[^"]*)?"/g))assert(paths.has(match[1])||existsSync(`output/site${match[1]}`),`${p.id} missing ${match[1]}`);
 }
 assert.equal((renderIndex().match(/class="preview-page-card/g)||[]).length,9);
});

test('visual diagrams retain the relationships and numerical examples from the source',()=>{
 for(const page of learningPages){const html=renderLearning(page);assert.equal((html.match(/data-diagram-type=/g)||[]).length,6);assert(!html.includes('View the original illustration'));assert.match(html,/target="_blank" rel="noopener noreferrer"/);}
 for(const [market,n,labels] of [['crypto',1,['Trader','Crypto exchange','Other traders','Liquidity','Blockchains']],['crypto',3,['68,005','67,995','10 USDT']],['forex',1,['Trader','Forex broker','Liquidity','Pricing','Hedging']],['forex',2,['1.10000','1.10020','2.0 pips spread']],['forex',5,['$1,000 margin','$100 margin']],['prop',1,['Trader','Evaluation','Funded stage','Live capital','Payout']],['prop',3,['$100,000 account','$10,000 maximum loss','$5,000 daily loss limit']]])for(const label of labels)assert(renderDiagram(market,n).includes(label),`${market}/${n}: ${label}`);
});
