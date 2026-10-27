import {createRequire} from 'node:module';
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {pages} from '../src/content-pages.mjs';

const workspacePackage=new URL('../../fxrebate-guide-bot/package.json',import.meta.url);
const require=createRequire(existsSync(workspacePackage)?workspacePackage:new URL('../package.json',import.meta.url));
const {chromium}=require('playwright');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE_PATH||'/home/hermes/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser=await chromium.launch({executablePath});
const base=process.env.DEMO_URL||'http://localhost:4173';
const directory='output/pages-2026-10-27';mkdirSync(directory,{recursive:true});
const results=[];
try{
 for(const [width,height] of [[1440,1000],[834,1100],[390,844],[320,800]]){
  for(const config of pages){
   const page=await browser.newPage({viewport:{width,height},acceptDownloads:true});const errors=[],requests=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
   page.on('request',request=>requests.push(request.url()));
   const response=await page.goto(base+config.path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   assert.equal(await page.locator('h1').textContent(),config.title);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${config.id} ${width}: overflow`);
   assert(await page.evaluate(()=>document.fonts.check('400 15px Satoshi')&&document.fonts.check('700 30px Satoshi')));
   assert.equal(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||i.naturalWidth===0).length),0);
   const outside=await page.locator('a,button,input,textarea').evaluateAll(elements=>elements.filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.height&&(r.right>innerWidth+1||r.left< -1)&&!el.closest('.table-scroll')&&!el.matches('.skip-link');}).map(el=>el.outerHTML.slice(0,90)));
   assert.deepEqual(outside,[],`${config.id} ${width}: outside viewport`);
   await page.evaluate(()=>{window.qaEvents=[];window.addEventListener('fxrebate:analytics',event=>window.qaEvents.push(event.detail));});
   if(width<961){
    const summary=page.locator('.mobile-contents>summary');await summary.focus();await page.keyboard.press('Enter');assert(await page.locator('.mobile-contents').evaluate(el=>el.open));
    await page.locator('.mobile-contents nav a').nth(2).click();assert.equal(await page.locator('.mobile-contents').evaluate(el=>el.open),false);
   }else{
    await page.locator('.sticky-sidebar nav a').nth(2).click();
    const position=await page.locator('.sticky-sidebar').evaluate(el=>Math.round(el.getBoundingClientRect().top));assert(position>=0&&position<=30,'sticky contents');
   }
   if(config.kind==='rebates'){
    const calculator=page.locator('[data-calculator]');
    await calculator.locator('[name=amount]').fill('1000');await calculator.locator('[name=rate]').fill('5');
    assert.equal(await calculator.locator('output').textContent(),config.market==='forex'?'$5,000.00':'$50.00');
    await calculator.locator('[name=amount]').fill('-1');assert.equal(await calculator.locator('output').textContent(),'—');
    await calculator.locator('[name=amount]').fill('0');assert.equal(await calculator.locator('output').textContent(),'$0.00');
    if(config.market!=='forex'){await calculator.locator('[name=rate]').fill('101');assert.equal(await calculator.locator('output').textContent(),'—');await calculator.locator('[name=rate]').fill('5');}
    await calculator.locator('button').click();assert(await page.evaluate(()=>window.qaEvents.some(e=>e.event==='rebate_example_calculate')));
   }else{
    const checkbox=page.locator('[data-checklist]').first();await checkbox.check();assert(await checkbox.isChecked());
    const input=page.locator('.editable-comparison textarea').first();await input.fill('=SUM(1,2)');
    const downloadPromise=page.waitForEvent('download');await page.locator('[data-export-table]').click();const download=await downloadPromise;
    assert(download.suggestedFilename().endsWith('.csv'));
    const stream=await download.createReadStream();let csv='';for await(const chunk of stream)csv+=chunk.toString();
    assert(csv.includes("'=SUM(1,2)"));assert(csv.includes('Comparison point'));
    assert(await page.evaluate(()=>window.qaEvents.some(e=>e.event==='comparison_download')));
   }
   const dark=page.getByRole('button',{name:'Switch to dark mode',exact:true});await dark.click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
   await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(width===1440||width===390)await page.screenshot({path:`${directory}/${config.id}-${width}-dark.png`});
   await page.getByRole('button',{name:'Switch to light mode',exact:true}).click();
   await page.evaluate(()=>scrollTo(0,0));
   if(width===1440||width===390){await page.screenshot({path:`${directory}/${config.id}-${width}.png`,fullPage:true});await page.screenshot({path:`${directory}/${config.id}-${width}-fold.png`});}
   assert.deepEqual(errors,[],`${config.id} ${width}: browser errors`);
   assert(requests.every(url=>url.startsWith(base)||url.startsWith('blob:')),'no remote dependencies or data submission');
   results.push({page:config.id,width,status:'passed',themePersistence:true,contentNavigation:true,calculator:config.kind==='rebates',editableWorksheet:config.kind==='guide',noRemoteRequests:true});
   await page.close();
  }
  const index=await browser.newPage({viewport:{width,height}});await index.goto(base+'/preview',{waitUntil:'networkidle'});
  assert.equal(await index.locator('.preview-page-card').count(),6);assert.equal(await index.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await index.screenshot({path:`${directory}/index-${width}.png`,fullPage:true});await index.close();
 }
 writeFileSync(`${directory}/qa-report.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({status:'passed',cases:results.length,widths:[1440,834,390,320],pages:pages.length}));
}finally{await browser.close();}
