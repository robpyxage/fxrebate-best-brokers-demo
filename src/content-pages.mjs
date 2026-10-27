import {readFileSync} from 'node:fs';
import {escapeHtml as e, arrow, svg} from './components.mjs';

const documents = JSON.parse(readFileSync(new URL('../input/pages-2026-10-27/content.json', import.meta.url)));
const markets = {
 forex: {label:'Forex', singular:'forex broker', plural:'forex brokers', icon:'layers', rebateTitle:'Forex Broker Rebates', guideTitle:'How to Choose a Forex Broker', description:'Understand forex cashback, compare the complete cost of trading and check what qualifies.', guideDescription:'A practical guide to regulation, trading costs and broker comparisons', steps:['Check the legal entity','Compare total trading costs','Confirm rebate eligibility'], amount:100, rate:2.5, amountLabel:'Eligible trading volume', amountUnit:'lots', rateLabel:'Illustrative rebate per lot', rateUnit:'USD / lot', result:250, formula:'100 lots × $2.50', note:'Rebates reduce eligible costs. They do not remove trading risk.'},
 crypto: {label:'Crypto', singular:'crypto exchange', plural:'crypto exchanges', icon:'coins', rebateTitle:'Crypto Exchange Rebates', guideTitle:'How to Choose a Crypto Exchange', description:'Understand eligible trading-fee cashback, payment methods and the conditions behind the percentage.', guideDescription:'A practical guide to security, custody and trading costs', steps:['Understand custody & security','Compare fees & liquidity','Check eligible products'], amount:500, rate:20, amountLabel:'Eligible trading fees', amountUnit:'USD', rateLabel:'Illustrative rebate rate', rateUnit:'%', result:100, formula:'$500 eligible fees × 20%', note:'Cashback reduces eligible fees. It does not protect your assets or prevent losses.'},
 prop: {label:'Prop Firms', singular:'prop firm', plural:'prop firms', icon:'shield', rebateTitle:'Prop Firm Rebates', guideTitle:'How to Choose a Prop Firm', description:'Understand challenge-fee cashback, direct discounts and the eligibility rules that matter.', guideDescription:'A practical guide to challenges, drawdowns and payouts', steps:['Read the programme contract','Understand the loss limits','Compare costs & payout rules'], amount:500, rate:10, amountLabel:'Eligible challenge price', amountUnit:'USD', rateLabel:'Illustrative cashback rate', rateUnit:'%', result:50, formula:'$500 challenge fee × 10%', note:'Cashback does not change challenge rules or guarantee passing, funding or a payout.'},
};

export const pages = Object.entries(markets).flatMap(([market, config]) => ['rebates','guide'].map(kind => ({
 id:`${market}-${kind}`, market, kind, config,
 title:kind==='rebates'?config.rebateTitle:config.guideTitle,
 path:kind==='rebates'?`/rebates/${market==='forex'?'forex-broker':market==='crypto'?'crypto-exchange':'prop-firm'}-rebates`:`/guides/how-to-choose-a-${market==='forex'?'forex-broker':market==='crypto'?'crypto-exchange':'prop-firm'}`,
 document:documents[`${market}-${kind}`],
})));

function brand(){return '<span class="brand"><img class="brand-light" src="/assets/fxrebate-light.svg" alt="FXRebate — where every trade matters" width="200" height="40"><img class="brand-dark" src="/assets/fxrebate-dark.svg" alt="FXRebate — where every trade matters" width="200" height="40"></span>';}
function header(page){return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner"><a href="/preview" aria-label="FXRebate preview home">${brand()}</a><nav aria-label="Markets">${Object.entries(markets).map(([key,m])=>`<a ${page?.market===key?'class="current" aria-current="true"':''} href="${pages.find(p=>p.market===key&&p.kind==='rebates').path}">${m.label}</a>`).join('')}</nav><div class="header-actions"><button class="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false"><span class="theme-icon" aria-hidden="true">☾</span><span class="theme-label">Dark</span></button><a class="header-cta" href="/preview"><span class="cta-desktop">Explore pages</span><span class="cta-mobile">Pages</span><span aria-hidden="true">↗</span></a></div></div></header>`;}
function head(title,description){return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)} | FXRebate — Design Preview</title><meta name="description" content="${e(description)}"><meta name="robots" content="noindex,nofollow"><meta property="og:title" content="${e(title)} | FXRebate"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="website"><meta name="theme-color" content="#ffffff"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><script src="/theme-init.js"></script><link rel="preload" href="/assets/satoshi-regular.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/satoshi-bold.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/content-pages.css"><script src="/client.js" defer></script><script src="/content-client.js" defer></script></head>`;}
function footer(){return `<footer class="site-footer"><div class="container"><div class="footer-top"><a href="/preview" aria-label="FXRebate preview home">${brand()}</a><span>Where every trade matters.</span><a href="#main">Back to top ↑</a></div><div class="footer-legal"><p><strong>About this preview.</strong> Client design preview. Financial products, trading and evaluation programmes involve risk. Cashback reduces eligible costs and does not prevent losses or guarantee results. Content is general information, not personalised investment advice.</p><p><strong>Partnership disclosure.</strong> FXRebate may receive partner commissions and return a portion to eligible clients. Availability, eligibility and payment conditions vary by provider and programme. Refer to the applicable offer and terms.</p></div><div class="footer-bottom"><span>© 2026 FXRebate</span><a href="/preview">Client concept preview · All pages</a></div></div></footer>`;}
function rich(block){
 const merged=[];
 for(const run of block.runs){const previous=merged.at(-1);if(previous&&!!previous.bold===!!run.bold&&!!previous.italic===!!run.italic)previous.text+=run.text;else merged.push({...run});}
 return merged.map(run=>{let text=e(run.text).replace(/\n/g,'<br>');if(run.bold)text=`<strong>${text}</strong>`;if(run.italic)text=`<em>${text}</em>`;return text;}).join('');
}
function slug(text){return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

export function sectionsFor(page){
 const sections=[];let current;
 for(const block of page.document.blocks){
  if(block.type==='title'||block.type==='subtitle')continue;
  if(block.type==='heading'){
   current={title:block.text,id:slug(block.text),blocks:[]};sections.push(current);
  }else{
   if(!current){current={title:'Start with what matters',id:'start-with-what-matters',blocks:[],intro:true};sections.push(current);}
   current.blocks.push(block);
  }
 }
 return sections;
}

function renderTable(block,page,sectionId,index){
 const [headerRow,...rows]=block.rows;
 const editable=rows.some(row=>row.some(cell=>/^Enter (details|amount)$/.test(cell.text)));
 const id=`${sectionId}-table-${index}`;
 return `<div class="article-table ${editable?'editable-comparison':''}">${editable?'<div class="worksheet-heading"><span class="eyebrow">YOUR COMPARISON WORKSHEET</span><span>Notes stay in this tab · not submitted</span></div>':''}<div class="table-scroll" role="region" aria-label="${e(headerRow.map(c=>c.text).join(' / '))}" tabindex="0"><table id="${id}"><thead><tr>${headerRow.map(c=>`<th scope="col">${e(c.text)}</th>`).join('')}</tr></thead><tbody>${rows.map((row,rowIndex)=>`<tr>${row.map((cell,col)=>col===0?`<th scope="row">${e(cell.text)}</th>`:`<td>${editable?`<textarea rows="2" aria-label="${e(headerRow[col].text)} — ${e(row[0].text)}" placeholder="${e(cell.text)}" data-worksheet="${page.id}-${rowIndex}-${col}"></textarea>`:cell.paragraphs.map(rich).join('<br>')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${editable?`<div class="worksheet-footer"><span>Compare the same account, terms and date.</span><button class="article-button secondary" type="button" data-export-table="${id}">Download comparison <span aria-hidden="true">↓</span></button></div>`:'<div class="table-hint">Scroll the table sideways on smaller screens <span aria-hidden="true">↔</span></div>'}</div>`;
}

function renderBlocks(section,page){
 let html='',list=[];
 const closeList=()=>{
  if(!list.length)return;
  const checklist=page.kind==='guide'&&/^Before /i.test(section.title);
  const benefits=list.some(block=>block.runs?.[0]?.bold&&block.text.includes('\n'));
  const listClass=checklist?'decision-checklist':benefits?'article-list benefit-list':list.length>=6?'article-list grouped-list':'article-list';
  const item=block=>checklist?`<li><label><input type="checkbox" data-checklist><span>${rich(block)}</span></label></li>`:`<li>${rich(block)}</li>`;
  const limit=benefits?4:6;
  const visible=checklist||section.title==='Important Information'||list.length-limit<3?list.length:limit;
  html+=`<ul class="${listClass}">${list.slice(0,visible).map(item).join('')}</ul>`;
  if(list.length>visible){const remaining=list.length-visible;html+=`<details class="more-items"><summary><span class="more-closed">Show ${remaining} more ${benefits?'benefits':'items'}</span><span class="more-open">Show fewer ${benefits?'benefits':'items'}</span><span class="expand-icon" aria-hidden="true">+</span></summary><ul class="${listClass}">${list.slice(visible).map(item).join('')}</ul></details>`;}
  list=[];
 };
 section.blocks.forEach((block,index)=>{
  if(block.type==='list-item'){list.push(block);return;}
  closeList();
  if(block.type==='table')html+=renderTable(block,page,section.id,index);
  else if(block.type==='subheading')html+=`<h3>${rich(block)}</h3>`;
  else if(block.type==='flow')html+=`<div class="commission-flow" aria-label="How the rebate works">${block.text.split('→').map((step,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><p>${e(step.trim())}</p></div>`).join('')}</div>`;
  else if(block.type==='formula')html+=`<p class="source-formula">${rich(block)}</p>`;
  else if(/^Compare (Forex Brokers|Crypto Exchanges|Prop Firms)$/.test(block.text))html+=`<a class="article-button" href="${page.market==='forex'?'/brokers/best-forex-brokers#comparison':pages.find(p=>p.market===page.market&&p.kind==='rebates').path}">${e(block.text)} ${arrow}</a>`;
  else if(/^(Test before committing:|Watch for warning signs:|Check before|Be careful)/.test(block.text))html+=`<div class="editor-note">${rich(block)}</div>`;
  else html+=`<p>${rich(block)}</p>`;
 });closeList();return html;
}

const rebateEssentials={
 forex:[['The benefit','Part of an eligible partner commission may be returned as cashback.'],['The calculation','Rebates can be expressed per lot, in pips or as a share of commission.'],['Payment & eligibility','Timing and methods vary by broker. Check account and instrument eligibility.']],
 crypto:[['The benefit','Eligible exchange trading fees may generate cashback or a fee reduction.'],['The calculation','Offers can depend on fees, volume, product and partnership terms.'],['Payment & eligibility','Timing and methods vary by exchange. Check eligible markets and fee tiers.']],
 prop:[['The benefit','An eligible challenge purchase may qualify for cashback or a discount.'],['The calculation','Offers may be a percentage, fixed cashback or another benefit.'],['Payment & eligibility','Timing and methods vary by firm. Check programme and attribution rules.']],
};
function quickTake(page,sections){
 const targets=[sections.find(s=>/^What Are /i.test(s.title)),sections.find(s=>/^How Do /i.test(s.title)),sections.find(s=>/^How Are .* Paid/i.test(s.title))];
 return `<div class="quick-take" aria-label="Cashback essentials"><div class="quick-take-header"><div><p class="eyebrow">THE ESSENTIALS</p><h2>A clearer picture, at a glance.</h2></div><span>Start here, then explore the details below.</span></div><div class="quick-take-grid">${rebateEssentials[page.market].map(([title,description],i)=>`<a href="#${targets[i].id}" class="quick-take-item"><span class="quick-take-number">0${i+1}</span><span><strong>${e(title)}</strong><span>${e(description)}</span></span><span class="quick-take-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></div>`;
}
function arrangeSections(page,sections){
 if(page.kind!=='rebates')return sections;
 const intro=sections.filter(s=>s.intro),primary=[],faq=[],important=[];
 for(const section of sections.filter(s=>!s.intro)){
  if(section.title==='Important Information')important.push(section);
  else if(/^(What Are |How Do |What Other Benefits |How Are .* Paid|When Will |How Much )/i.test(section.title))primary.push(section);
  else faq.push({...section,collapsible:true});
 }
 const priority=title=>/^What Are /i.test(title)?0:/^How Do /i.test(title)?1:/^How Are .* Paid/i.test(title)?2:/^When Will /i.test(title)?3:/^How Much /i.test(title)?4:5;
 primary.sort((a,b)=>priority(a.title)-priority(b.title));
 return [...intro,...primary,...faq,...important];
}
function renderArticle(sections,page){
 let faqStarted=false;
 return sections.filter(s=>!s.intro).map((section,i)=>{
  const number=String(i+1).padStart(2,'0');
  if(section.collapsible){
   const intro=faqStarted?'':`<div class="questions-intro"><p class="eyebrow">THE DETAILS THAT MATTER</p><h2>Questions, answered.</h2><p>Explore the conditions that apply to your situation.</p></div>`;faqStarted=true;
   return `${intro}<section id="${section.id}" class="article-section question-section" data-article-section><details class="question-disclosure"><summary><span class="question-number">${number}</span><span class="question-title"><span>YOUR QUESTIONS</span><span role="heading" aria-level="2">${e(section.title)}</span></span><span class="question-toggle" aria-hidden="true">+</span></summary><div class="question-answer">${renderBlocks(section,page)}</div></details></section>`;
  }
  return `<section id="${section.id}" class="article-section ${section.title==='Important Information'?'important-information':''}" data-article-section><div class="article-section-heading"><span class="section-number">${number}</span><h2>${e(section.title)}</h2></div>${renderBlocks(section,page)}</section>`;
 }).join('');
}

function toc(sections){return sections.filter(s=>!s.intro).map((s,i)=>`<a href="#${s.id}" data-toc-link><span>${String(i+1).padStart(2,'0')}</span>${e(s.title)}</a>`).join('');}
function relatedCard(page){return `<a class="related-page" href="${page.path}"><span class="eyebrow">${page.kind==='guide'?'MAKE A MORE INFORMED CHOICE':'UNDERSTAND YOUR CASHBACK'}</span><h3>${e(page.title)}</h3><p>${e(page.kind==='guide'?page.config.guideDescription:page.config.description)}</p><span class="related-arrow" aria-hidden="true">↗</span></a>`;}
function calculator(page){const m=page.config;return `<section id="calculator" class="rebate-calculator" aria-labelledby="calculator-title"><div><span class="eyebrow">PUT THE EXAMPLE INTO NUMBERS</span><h2 id="calculator-title">What could that<br>look like for you?</h2><p>Explore the illustrative calculation from this guide. These figures are examples, not an available offer or a promised payment.</p></div><form data-calculator="${page.market}"><div class="calculator-inputs"><label>${m.amountLabel}<span class="input-unit"><input type="number" name="amount" value="${m.amount}" min="0" max="1000000000" step="any" required inputmode="decimal"><span>${m.amountUnit}</span></span></label><label>${m.rateLabel}<span class="input-unit"><input type="number" name="rate" value="${m.rate}" min="0" max="${page.market==='forex'?'1000000':'100'}" step="any" required inputmode="decimal"><span>${m.rateUnit}</span></span></label></div><div class="calculator-result"><span>Estimated cashback</span><output aria-live="polite">$${m.result.toFixed(2)}</output></div><p class="calculator-message">${e(m.note)} Check the provider’s terms and eligible activity.</p><button class="article-button calculator-submit" type="submit">Calculate example ${arrow}</button></form></section>`;}

export function renderPage(page){
 const m=page.config,guide=page.kind==='guide',sections=arrangeSections(page,sectionsFor(page));
 const intro=sections.find(s=>s.intro);
 const description=guide?m.guideDescription:m.description;
 const sibling=pages.find(p=>p.market===page.market&&p.kind!==page.kind);
 const words=page.document.blocks.reduce((count,b)=>count+(b.text?.split(/\s+/).length??b.rows?.flat().reduce((n,c)=>n+c.text.split(/\s+/).length,0)??0),0);
 const tocLinks=toc(sections);
 return `${head(page.title,description)}<body class="content-page ${guide?'guide-page':'rebates-page'}" data-page-id="${page.id}">${header(page)}<main id="main" class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/preview">Preview home</a><span aria-hidden="true">/</span><a href="${pages.find(p=>p.market===page.market&&p.kind==='rebates').path}">${m.label}</a><span aria-hidden="true">/</span><span aria-current="page">${guide?'Choosing a provider':'Rebates explained'}</span></nav><nav class="content-tabs" aria-label="${m.label} resources"><a href="${pages.find(p=>p.market===page.market&&p.kind==='rebates').path}" ${!guide?'aria-current="page"':''}>${m.label} rebates</a><a href="${pages.find(p=>p.market===page.market&&p.kind==='guide').path}" ${guide?'aria-current="page"':''}>Choosing a ${m.singular}</a></nav><section class="content-hero" aria-labelledby="page-title"><div class="content-hero-copy"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${guide?'THE FXREBATE DECISION GUIDE':`${m.label.toUpperCase()} / CASHBACK EXPLAINED`}</p><h1 id="page-title">${e(page.title)}</h1><p class="content-standfirst">${e(description)}</p><div class="content-hero-actions"><a class="article-button" href="#${sections.find(s=>!s.intro).id}">${guide?'Start with the essentials':'Understand your rebates'} ${arrow}</a><a class="quiet-link" href="${guide?'#'+sections.find(s=>/^Build your/.test(s.title)).id:'#calculator'}">${guide?'Build your shortlist':'Try the example calculator'} <span aria-hidden="true">↓</span></a></div><div class="content-meta"><span>${Math.max(3,Math.ceil(words/220))} min read</span><span aria-hidden="true">·</span><span>${guide?'Practical guide':'Rebate guide'}</span><span aria-hidden="true">·</span><span>Client preview</span></div></div><aside class="hero-feature ${guide?'guide-feature':'rebate-feature'}" aria-label="${guide?'Three priorities':'Illustrative cashback example'}"><span class="feature-icon">${svg(m.icon)}</span><p class="eyebrow">${guide?'A CLEARER WAY TO CHOOSE':'THE FXREBATE ADVANTAGE'}</p><h2>${guide?'The right questions.<br>A clearer choice.':'Keep more of<br>what’s yours.'}</h2>${guide?`<ol>${m.steps.map((step,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${step}</li>`).join('')}</ol>`:`<div class="hero-example"><span>ILLUSTRATIVE EXAMPLE</span><strong>$${m.result}</strong><p>${m.formula}</p></div><p class="feature-disclaimer">${e(m.note)}</p>`}</aside></section><div class="content-editorial-bar"><div><span class="editorial-mark">FX</span><span>FXRebate resources<small>Understand the terms. Compare the full picture.</small></span></div><span class="content-source-note">Client-provided editorial content · Design preview</span><button type="button" data-print class="print-button">Print ${guide?'guide':'page'} <span aria-hidden="true">↗</span></button></div>${!guide?quickTake(page,sections):''}<details class="mobile-contents"><summary>On this page <span aria-hidden="true">⌄</span></summary><nav aria-label="Page contents on mobile">${tocLinks}</nav></details><div class="article-layout"><article class="article-body" aria-label="${e(page.title)}">${intro?`<div class="article-intro">${renderBlocks(intro,page)}</div>`:''}${renderArticle(sections,page)}</article><aside class="article-sidebar"><div class="sticky-sidebar"><p class="eyebrow">ON THIS PAGE</p><nav aria-label="Page contents">${tocLinks}</nav><div class="sidebar-next"><span class="eyebrow">${guide?'THE NEXT PIECE':'BEFORE YOU CHOOSE'}</span><a href="${sibling.path}">${e(sibling.title)} ${arrow}</a><p>${guide?'Understand eligible benefits and payment terms.':'Look beyond cashback. Check the provider first.'}</p></div><a href="/preview" class="sidebar-all">Explore all six pages ${arrow}</a></div></aside></div>${!guide?calculator(page):''}<section class="content-next" aria-labelledby="next-title"><div class="section-heading"><div><p class="eyebrow">KEEP THE FULL PICTURE IN VIEW</p><h2 id="next-title">A little more clarity.</h2></div><a class="text-link" href="/preview">All resources ${arrow}</a></div><div class="related-grid">${relatedCard(sibling)}${relatedCard(pages.find(p=>p.market!==page.market&&p.kind===page.kind))}</div></section><p class="local-review-note">Client design preview. Provider catalogues, live rebate offers, account services and production analytics are not connected. Examples are illustrative; programme availability and terms require final review.</p></main>${footer()}</body></html>`;
}

export function renderIndex(){return `${head('FXRebate — Explore the new pages','Six FXRebate resources across forex brokers, crypto exchanges and prop firms. Local design review.')}<body class="content-page preview-index" data-page-id="content-preview">${header()}<main id="main" class="container"><section class="preview-hero"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>FXREBATE / THE RESOURCE COLLECTION</p><h1>A clearer view.<br><span>Across every market.</span></h1><p>Understand your cashback. Ask better questions.<br>Explore six resources, designed around the choices you make.</p><div class="preview-status"><span class="preview-pill">CLIENT PREVIEW</span><span>Six new pages · One shared FXRebate design</span></div></section><div class="market-collections">${Object.entries(markets).map(([key,m],i)=>`<section class="market-collection" aria-labelledby="market-${key}"><div class="market-heading"><span class="market-icon">${svg(m.icon)}</span><div><p class="eyebrow">${String(i+1).padStart(2,'0')} / UNDERSTAND. COMPARE. CHOOSE.</p><h2 id="market-${key}">${m.label}</h2></div></div><div class="preview-card-grid">${pages.filter(p=>p.market===key).map(p=>`<a class="preview-page-card ${p.kind==='rebates'?'rebate-preview-card':''}" href="${p.path}"><div class="preview-card-top"><span class="eyebrow">${p.kind==='rebates'?'CASHBACK EXPLAINED':'THE DECISION GUIDE'}</span><span aria-hidden="true">↗</span></div><h3>${p.title}</h3><p>${p.kind==='rebates'?m.description:m.guideDescription}</p><span class="preview-card-cta">Explore ${p.kind==='rebates'?'rebates':'the guide'} ${arrow}</span></a>`).join('')}</div></section>`).join('')}</div><a class="original-preview-link" href="/brokers/best-forex-brokers"><div><span class="eyebrow">THE ORIGINAL DESIGN</span><h2>Best Forex Brokers 2026</h2><p>The broker shortlist that brings this collection together.</p></div><span aria-hidden="true">↗</span></a><p class="local-review-note">Local review collection · Content from the six supplied Word documents · Structure informed by the supplied reference · Shared fonts, colours and theme from the approved FXRebate design.</p></main>${footer()}</body></html>`;}
