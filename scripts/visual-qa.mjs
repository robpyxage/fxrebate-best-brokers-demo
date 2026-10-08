import {createRequire} from 'node:module';import {mkdirSync,writeFileSync,existsSync} from 'node:fs';import assert from 'node:assert/strict';
const workspacePackage=new URL('../../fxrebate-guide-bot/package.json',import.meta.url);
const require=createRequire(existsSync(workspacePackage)?workspacePackage:new URL('../package.json',import.meta.url));const {chromium}=require('playwright');
const localBrowser='/home/hermes/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE_PATH||(existsSync(localBrowser)?localBrowser:undefined);
const browser=await chromium.launch({headless:true,executablePath});mkdirSync('output/qa',{recursive:true});const report=[];
try{
for(const [name,width,height,columns] of [['wide',1600,1100,3],['laptop',1280,1000,3],['tablet',834,1100,2],['mobile',390,844,1],['small-mobile',320,800,1]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(process.env.DEMO_URL??'http://localhost:4173/brokers/best-forex-brokers',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 assert.equal(await page.locator('h1').textContent(),'Best Forex Brokers 2026');assert.equal(await page.locator('.broker-card').count(),6);
 const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,cols:getComputedStyle(document.querySelector('.broker-grid')).gridTemplateColumns.split(' ').length,brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),cards:[...document.querySelectorAll('.broker-card')].map(c=>({height:c.offsetHeight,cashback:c.querySelector('.cashback').getBoundingClientRect().top-c.getBoundingClientRect().top,cta:c.querySelector('.broker-cta').getBoundingClientRect().top-c.getBoundingClientRect().top}))}));
 assert.equal(metrics.overflow,false,`${name} overflow`);assert.equal(metrics.cols,columns);assert.deepEqual(metrics.brokenImages,[]);assert.deepEqual(errors,[]);
 await page.screenshot({path:`output/qa/${name}.png`,fullPage:true});await page.screenshot({path:`output/qa/${name}-fold.png`});
 await page.evaluate(()=>{window.demoEvents=[];window.addEventListener('fxrebate:analytics',e=>window.demoEvents.push(e.detail));});
 await page.getByRole('button',{name:'cTrader',exact:true}).click();const ct=await page.locator('.broker-card:visible').count();assert(ct>0&&ct<6);
 await page.getByRole('button',{name:'Commission cashback',exact:true}).click();assert.equal(await page.locator('.broker-card:visible').count(),1);
 await page.getByRole('button',{name:'All brokers'}).click();assert.equal(await page.locator('.broker-card:visible').count(),6);
 const faq=page.locator('summary').first();await faq.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('details').first().getAttribute('open'),'');await page.waitForTimeout(100);assert(await page.evaluate(()=>window.demoEvents.some(e=>e.event==='faq_expand')));
 const links=await page.locator('.broker-cta').evaluateAll(as=>as.map(a=>a.href));assert(links.every(l=>l.startsWith('https://fxrebate.eu/brokers/')));
 await page.locator('.hero-meta a[href="#methodology"]').click();assert(page.url().endsWith('#methodology'));
 report.push({name,width,height,status:'passed',...metrics,cTraderCount:ct,faqKeyboard:true});await page.close();
}
writeFileSync('output/qa/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
