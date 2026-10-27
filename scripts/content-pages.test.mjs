import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {pages,sectionsFor,renderPage} from '../src/content-pages.mjs';

const normalize=text=>text.replace(/\s+/g,'').replaceAll('→','');
function plain(html){return html.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");}

test('all six source documents retain every content block and table cell',()=>{
 assert.equal(pages.length,6);
 for(const page of pages){
  const html=renderPage(page),text=normalize(plain(html));
  for(const block of page.document.blocks){
   if(block.type==='table'){
    for(const cell of block.rows.flat()){
     if(/^Enter (details|amount)$/.test(cell.text)){assert(html.includes(`placeholder="${cell.text}"`));continue;}
     assert(text.includes(normalize(cell.text)),`${page.id}: missing table cell ${cell.text}`);
    }
   }else if(block.type==='flow'){
    for(const step of block.text.split('→'))assert(text.includes(normalize(step)),`${page.id}: missing flow step ${step}`);
   }else assert(text.includes(normalize(block.text)),`${page.id}: missing ${block.text}`);
  }
 }
});

test('generated pages have working local routes, unique anchors and preview indexing protection',()=>{
 const paths=new Set([...pages.map(p=>p.path),'/preview','/brokers/best-forex-brokers']);
 for(const page of pages){
  const html=readFileSync(`output/site${page.path}/index.html`,'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert(html.includes('noindex,nofollow'));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`${page.id}: duplicate anchors`);
  for(const match of html.matchAll(/href="(#[^"]+)"/g))assert(ids.includes(match[1].slice(1)),`${page.id}: broken ${match[1]}`);
  for(const match of html.matchAll(/href="(\/[^"#]+)(?:#[^"]*)?"/g))assert(paths.has(match[1])||existsSync(`output/site${match[1]}`),`${page.id}: unknown ${match[1]}`);
  assert.equal(sectionsFor(page).filter(s=>!s.intro).length,(html.match(/data-article-section/g)||[]).length);
 }
});

test('content is escaped, source-only and does not impersonate a provider profile',()=>{
 const page=structuredClone(pages[0]);
 page.document.blocks.push({type:'paragraph',text:'<script>bad()</script>',runs:[{text:'<script>bad()</script>'}]});
 const html=renderPage(page);
 assert(html.includes('&lt;script&gt;bad()&lt;/script&gt;'));
 assert(!html.includes('<script>bad()'));
 assert(!html.includes('Overall Rating'));
 assert(!html.includes('Admirals (Admiral Markets)'));
 assert(!html.includes('undefined'));
});
