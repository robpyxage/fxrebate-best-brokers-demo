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
 assert(await page.evaluate(()=>document.fonts.check('400 14px Satoshi')&&document.fonts.check('700 24px Satoshi')),'Satoshi fonts loaded');
 assert.equal(metrics.overflow,false,`${name} overflow`);assert.equal(metrics.cols,columns);assert.deepEqual(metrics.brokenImages,[]);if(columns>1)assert(metrics.cards.every(c=>Math.abs(c.cashback-metrics.cards[0].cashback)<1&&Math.abs(c.cta-metrics.cards[0].cta)<1),'cashback and CTA alignment');assert.deepEqual(errors,[]);
 await page.screenshot({path:`output/qa/${name}.png`,fullPage:true});await page.screenshot({path:`output/qa/${name}-fold.png`});
 await page.evaluate(()=>{window.demoEvents=[];window.addEventListener('fxrebate:analytics',e=>window.demoEvents.push(e.detail));});
 await page.getByRole('button',{name:'cTrader',exact:true}).click();const ct=await page.locator('.broker-card:visible').count();assert(ct>0&&ct<6);
 const filteredRanks=await page.locator('.broker-card:visible').evaluateAll(cards=>cards.map(c=>({rank:Number(c.dataset.rank),gold:c.classList.contains('podium-gold'),silver:c.classList.contains('podium-silver'),bronze:c.classList.contains('podium-bronze')})));assert(filteredRanks.every(c=>c.gold===(c.rank===1)&&c.silver===(c.rank===2)&&c.bronze===(c.rank===3)));
 await page.getByRole('button',{name:'Commission cashback',exact:true}).click();assert.equal(await page.locator('.broker-card:visible').count(),1);
 await page.getByRole('button',{name:'All brokers'}).click();assert.equal(await page.locator('.broker-card:visible').count(),6);
 const faq=page.locator('summary').first();await faq.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('details').first().getAttribute('open'),'');await page.waitForTimeout(100);assert(await page.evaluate(()=>window.demoEvents.some(e=>e.event==='faq_expand')));
 const links=await page.locator('.broker-cta').evaluateAll(as=>as.map(a=>a.href));assert(links.every(l=>l.startsWith('https://fxrebate.eu/brokers/')));
 const podium=await page.locator('.comparison tbody tr').evaluateAll(rows=>rows.slice(0,3).map(row=>{const n=row.querySelector('.broker-name');return {color:getComputedStyle(n).color,weight:getComputedStyle(n).fontWeight,rank:row.dataset.rank};}));
 assert.equal(new Set(podium.map(p=>p.color)).size,3);assert(podium.every(p=>Number(p.weight)>=700));
  const lightContrast=await page.locator('.comparison tbody tr').evaluateAll(rows=>{const luminance=color=>{const rgb=color.match(/\d+(?:\.\d+)?/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};return rows.slice(0,3).map(row=>{const name=row.querySelector('.broker-name');const fg=luminance(getComputedStyle(name).color);const rowBg=getComputedStyle(row).backgroundColor;const bg=luminance(rowBg==='rgba(0, 0, 0, 0)'?getComputedStyle(document.querySelector('.comparison')).backgroundColor:rowBg);return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);});});
 assert(lightContrast.every(c=>c>=4.5),'light podium text contrast');
 await page.locator('.comparison').screenshot({path:`output/qa/${name}-comparison-light.png`});
 await page.locator('.broker-grid').screenshot({path:`output/qa/${name}-cards-light.png`});
 await page.getByRole('button',{name:'Switch to dark mode',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('.broker-grid').screenshot({path:`output/qa/${name}-cards-dark.png`});
 await page.locator('.comparison').screenshot({path:`output/qa/${name}-comparison-dark.png`});
 const contrast=await page.locator('.comparison tbody tr').evaluateAll(rows=>{const luminance=color=>{const rgb=color.match(/\d+(?:\.\d+)?/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};return rows.slice(0,3).map(row=>{const name=row.querySelector('.broker-name');const fg=luminance(getComputedStyle(name).color);const rowBg=getComputedStyle(row).backgroundColor;const bg=luminance(rowBg==='rgba(0, 0, 0, 0)'?getComputedStyle(document.querySelector('.comparison')).backgroundColor:rowBg);return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);});});
 assert(contrast.every(c=>c>=4.5),'dark podium text contrast');
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.getByRole('button',{name:'Switch to light mode',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 await page.locator('.hero-meta a[href="#methodology"]').click();assert(page.url().endsWith('#methodology'));
 report.push({name,width,height,status:'passed',podium,lightPodiumContrast:lightContrast,darkPodiumContrast:contrast,themePersistence:true,...metrics,cTraderCount:ct,faqKeyboard:true});await page.close();
}
writeFileSync('output/qa/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
