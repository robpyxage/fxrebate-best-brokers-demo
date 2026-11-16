import {readFileSync} from 'node:fs';
import {escapeHtml as e,arrow,svg} from './components.mjs';
import {head,header,footer,rich,slug} from './content-pages.mjs';
import {learningPages} from './learning-data.mjs';
import {renderDiagram} from './learning-figures.mjs';

const source=JSON.parse(readFileSync(new URL('../input/pages-2026-11-16/content.json',import.meta.url)));
const related={
 forex:{guide:['How to Choose a Forex Broker','/guides/how-to-choose-a-forex-broker'],rebates:['Forex Broker Rebates','/rebates/forex-broker-rebates'],label:'forex broker',review:['CFTC — OTC forex advisory','https://www.cftc.gov/PressRoom/PressReleases/8566-22']},
 crypto:{guide:['How to Choose a Crypto Exchange','/guides/how-to-choose-a-crypto-exchange'],rebates:['Crypto Exchange Rebates','/rebates/crypto-exchange-rebates'],label:'crypto exchange',review:['ESMA — MiCA information for consumers','https://www.esma.europa.eu/sites/default/files/2025-10/Joint_ESAs_Factsheet_on_crypto-assets.pdf']},
 prop:{guide:['How to Choose a Prop Firm','/guides/how-to-choose-a-prop-firm'],rebates:['Prop Firm Rebates','/rebates/prop-firm-rebates'],label:'prop firm',review:['FTMO — account information','https://ftmo.com/en/faq/what-capital-will-i-trade-on-an-ftmo-account/']},
};
export function learningDocument(page){
 const blocks=source[page.market].blocks,sections=[];let current=null;const preamble=[];
 for(const block of blocks){
  if(block.type==='section'){
   const match=block.text.match(/^(\d{2})\s+(.+)$/);current={number:match[1],title:match[2],sourceTitle:block.text,id:`chapter-${match[1]}-${slug(match[2])}`,blocks:[]};sections.push(current);
  }else if(current)current.blocks.push(block);else preamble.push(block);
 }
 return {preamble,sections,source:source[page.market].source};
}
function table(block,id){
 if(block.rows.length===1&&block.rows[0].length===1){const cell=block.rows[0][0];return `<aside class="learning-note">${cell.paragraphs.map(p=>`<p>${rich(p)}</p>`).join('')}</aside>`;}
 const [headers,...rows]=block.rows,editable=rows.some(row=>row.some(cell=>/^_{3,}$/.test(cell.text.trim())))||(headers.some(cell=>/^Firm A$/i.test(cell.text))&&rows.some(row=>row.slice(1).some(cell=>!cell.text.trim())));
 return `<div class="article-table ${editable?'editable-comparison':''}">${editable?'<div class="worksheet-heading"><span class="eyebrow">YOUR COMPARISON WORKSHEET</span><span>Notes stay in this tab · not submitted</span></div>':''}<div class="table-scroll" role="region" aria-label="${e(headers.map(x=>x.text).join(' / '))}" tabindex="0"><table id="${id}"><thead><tr>${headers.map(cell=>`<th scope="col">${e(cell.text)}</th>`).join('')}</tr></thead><tbody>${rows.map((row,i)=>`<tr>${row.map((cell,j)=>j===0?`<th scope="row">${e(cell.text)}</th>`:`<td>${editable&&(!cell.text.trim()||/^_{3,}$/.test(cell.text.trim())||cell.text==='Yes / No')?`<textarea rows="2" aria-label="${e(headers[j]?.text||'Comparison')} — ${e(row[0].text)}" placeholder="${e(cell.text==='Yes / No'?'Yes / No':'Enter details')}"></textarea>`:cell.paragraphs.map(rich).join('<br>')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${editable?`<div class="worksheet-footer"><span>Compare equivalent conditions and record your sources.</span><button class="article-button secondary" type="button" data-export-table="${id}">Download comparison <span aria-hidden="true">↓</span></button></div>`:'<div class="table-hint">Scroll the table sideways on smaller screens <span aria-hidden="true">↔</span></div>'}</div>`;
}
function figure(block,market){
 return `<figure class="learning-figure"><div class="learning-figure-header"><span class="eyebrow">VISUAL GUIDE / ${String(block.number).padStart(2,'0')}</span></div>${renderDiagram(market,block.number)}<figcaption>${e(block.caption)}</figcaption></figure>`;
}
function qa(section,quiz=false){
 let html='',pending=null;
 const render=(question,answers)=>`<details class="question-disclosure learning-question"><summary><span class="question-title"><span>${quiz?'KNOWLEDGE CHECK':'YOUR QUESTIONS'}</span><span role="heading" aria-level="3">${rich(question)}</span></span><span class="question-toggle" aria-hidden="true">+</span></summary><div class="question-answer">${answers.map(a=>`<p>${rich(a)}</p>`).join('')}</div></details>`;
 let answers=[];
 for(const block of section.blocks){
  if(block.type!=='paragraph')continue;
  const isQuestion=quiz?/^\d+\.\s/.test(block.text):block.text.endsWith('?');
  if(isQuestion){if(pending)html+=render(pending,answers);pending=block;answers=[];}else if(pending)answers.push(block);else html+=`<p>${rich(block)}</p>`;
 }
 if(pending)html+=render(pending,answers);
 return `<div class="learning-questions ${quiz?'knowledge-quiz':''}">${quiz?'<p class="learning-quiz-intro">Think about each question, then reveal the answer to check your understanding.</p>':''}${html}</div>`;
}
function prose(section,page){
 let html='',group=[],type='';
 const close=()=>{if(!group.length)return;html+=`<${type==='bullets'?'ul':'ol'} class="learning-${type}">${group.map(block=>`<li>${rich(block)}</li>`).join('')}</${type==='bullets'?'ul':'ol'}>`;group=[];type='';};
 section.blocks.forEach((block,index)=>{
  if(block.type==='paragraph'&&(/^[•●]\s*/.test(block.text)||/^\d+\.\s/.test(block.text))){const nextType=/^[•●]/.test(block.text)?'bullets':'steps';if(type&&type!==nextType)close();type=nextType;group.push(block);return;}
  close();
  if(block.type==='figure')html+=figure(block,page.market);
  else if(block.type==='table')html+=table(block,`${section.id}-table-${index}`);
  else if(block.style==='Smallnote')html+=`<aside class="learning-note subtle"><p>${rich(block)}</p></aside>`;
  else if(block.text.length<90&&!/[.!?]$/.test(block.text)&&index+1<section.blocks.length&&block.runs.some(r=>r.bold))html+=`<h3>${rich(block)}</h3>`;
  else html+=`<p>${rich(block)}</p>`;
 });close();return html;
}
function linkCard(entry,label){return `<a class="related-page" href="${entry[1]}"><span class="eyebrow">${label}</span><h3>${e(entry[0])}</h3><span class="related-arrow" aria-hidden="true">↗</span></a>`;}
export function renderLearning(page){
 const d=learningDocument(page),r=related[page.market],title=d.preamble[1].text,subtitle=d.preamble[2].text,disclaimer=d.preamble.find(b=>b.style==='Smallnote');
 const toc=d.sections.map(s=>`<a href="#${s.id}" data-toc-link><span>${s.number}</span>${e(s.title)}</a>`).join('');
 const body=d.sections.map(section=>{
  const isFAQ=section.title==='Frequently Asked Questions',quiz=section.title==='Knowledge Quiz',sources=section.title==='Editorial Source Notes';
  return `<section class="article-section learning-section" id="${section.id}" data-article-section><div class="article-section-heading"><span class="section-number">${section.number}</span><h2>${e(section.title)}</h2></div>${isFAQ||quiz?qa(section,quiz):prose(section,page)}${sources?`<div class="learning-review-source"><span class="eyebrow">ADDITIONAL SOURCE FOR REVIEW</span><a href="${e(r.review[1])}" target="_blank" rel="noopener noreferrer">${e(r.review[0])} <span aria-hidden="true">↗</span></a></div>`:''}</section>`;
 }).join('');
 const first=d.sections[0];
 return `${head(title,subtitle)}<body class="content-page learning-page" data-page-id="${page.id}">${header(page)}<main id="main" class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/preview">Preview home</a><span aria-hidden="true">/</span><span>Learning</span><span aria-hidden="true">/</span><span aria-current="page">${e(title)}</span></nav><nav class="content-tabs" aria-label="${e(page.market)} resources"><a href="${r.rebates[1]}">Rebates</a><a href="${r.guide[1]}">Choosing a ${r.label}</a><a href="${page.path}" aria-current="page">What is a ${r.label}?</a></nav><section class="content-hero learning-hero" aria-labelledby="page-title"><div class="content-hero-copy"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${e(d.preamble[0].text)} / THE ESSENTIALS</p><h1 id="page-title">${e(title)}</h1><p class="content-standfirst">${e(subtitle)}</p><div class="content-hero-actions"><a class="article-button" href="#${first.id}">Start learning ${arrow}</a><a class="quiet-link" href="#chapter-${d.sections.find(s=>s.title==='Knowledge Quiz').number}-knowledge-quiz">Test your knowledge <span aria-hidden="true">↓</span></a></div><div class="content-meta"><span>Educational guide</span><span aria-hidden="true">·</span><span>${d.sections.length} chapters</span><span aria-hidden="true">·</span><span>Client preview</span></div></div><aside class="hero-feature learning-feature"><span class="feature-icon">${svg(page.icon)}</span><p class="eyebrow">THE FXREBATE LEARNING GUIDE</p><h2>Understand more.<br>Choose with clarity.</h2><p>Start with the fundamentals, then explore the details at your own pace.</p><div class="learning-feature-bottom"><span>GUIDE</span><strong>${String(d.sections.length).padStart(2,'0')} chapters</strong></div></aside></section><div class="content-editorial-bar"><div><span class="editorial-mark">FX</span><span>FXRebate Learning<small>A practical guide to help you understand the essentials.</small></span></div><span class="content-source-note">Client-provided educational content · Design preview</span><button type="button" data-print class="print-button">Print guide <span aria-hidden="true">↗</span></button></div><div class="learning-risk-note"><span aria-hidden="true">i</span><p>${e(disclaimer?.text||'Educational content only.')}</p></div><div class="quick-take learning-take"><div class="quick-take-header"><div><p class="eyebrow">THE ESSENTIALS</p><h2>A clearer picture, at a glance.</h2></div><span>Start with these ideas, then explore the guide.</span></div><div class="quick-take-grid">${page.takeaways.map(([h,p],i)=>`<div class="quick-take-item"><span class="quick-take-number">0${i+1}</span><span><strong>${e(h)}</strong><span>${e(p)}</span></span></div>`).join('')}</div></div><details class="mobile-contents"><summary>On this page <span aria-hidden="true">⌄</span></summary><nav aria-label="Page contents on mobile">${toc}</nav></details><div class="article-layout"><article class="article-body" aria-label="${e(title)}">${body}</article><aside class="article-sidebar"><div class="sticky-sidebar"><p class="eyebrow">ON THIS PAGE</p><nav aria-label="Page contents">${toc}</nav><div class="sidebar-next"><span class="eyebrow">YOUR NEXT STEP</span><a href="${r.guide[1]}">${e(r.guide[0])} ${arrow}</a><p>Turn the fundamentals into a practical comparison.</p></div><a href="/preview" class="sidebar-all">Explore all resources ${arrow}</a></div></aside></div><section class="content-next" aria-labelledby="next-title"><div class="section-heading"><div><p class="eyebrow">KEEP LEARNING WITH FXREBATE</p><h2 id="next-title">Your next step.</h2></div><a class="text-link" href="/preview">All resources ${arrow}</a></div><div class="related-grid">${linkCard(r.guide,'MAKE A MORE INFORMED CHOICE')}${linkCard(r.rebates,'UNDERSTAND YOUR CASHBACK')}</div></section><p class="local-review-note">Client design preview · The educational text, examples and editorial notes are supplied by the client. Figures are illustrative. Provider rules and regulatory details should be reviewed against current official sources before production.</p></main>${footer()}</body></html>`;
}
export {learningPages};
