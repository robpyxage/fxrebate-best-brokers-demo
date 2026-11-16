import {createRequire} from 'node:module';
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {learningPages} from '../src/learning-pages.mjs';
const workspacePackage=new URL('../../fxrebate-guide-bot/package.json',import.meta.url);
const require=createRequire(existsSync(workspacePackage)?workspacePackage:new URL('../package.json',import.meta.url));
const {chromium}=require('playwright');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE_PATH||'/home/hermes/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser=await chromium.launch({executablePath});const base=process.env.DEMO_URL||'http://localhost:4173';const report=[];const dir='output/pages-2026-11-16';mkdirSync(dir,{recursive:true});
try{
 for(const [width,height] of [[1440,1000],[834,1100],[390,844],[320,800]])for(const config of learningPages){
  const page=await browser.newPage({viewport:{width,height},acceptDownloads:true});const errors=[],requests=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`)});page.on('request',request=>requests.push(request.url()));
  const response=await page.goto(base+config.path,{waitUntil:'networkidle'});assert.equal(response.status(),200);assert.equal(await page.locator('h1').count(),1);assert.equal((await page.locator('h1').textContent()).toLowerCase(),config.title.toLowerCase());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${config.id} ${width} overflow`);assert(await page.evaluate(()=>document.fonts.check('400 15px Satoshi')&&document.fonts.check('700 30px Satoshi')));
  assert.equal(await page.locator('.learning-figure').count(),6);assert.equal(await page.locator('.knowledge-quiz .learning-question').count(),10);
  const faq=page.locator('.learning-question').first(),summary=faq.locator(':scope > summary');await summary.focus();await page.keyboard.press('Enter');assert.equal(await faq.evaluate(e=>e.open),true);assert(await faq.locator('.question-answer p').first().isVisible());await page.keyboard.press('Enter');assert.equal(await faq.evaluate(e=>e.open),false);
  const quiz=page.locator('.knowledge-quiz .learning-question').first();await quiz.locator(':scope > summary').click();assert.equal(await quiz.evaluate(e=>e.open),true);assert((await quiz.locator('.question-answer').textContent()).includes('Answer:'));
  assert.equal(await page.getByText('View the original illustration').count(),0);assert.equal(await page.locator('.diagram').count(),6);const diagramOverflow=await page.locator('.learning-figure').evaluateAll(figures=>figures.map(figure=>({overflow:figure.scrollWidth>figure.clientWidth+1,text:figure.innerText.slice(0,80)})).filter(x=>x.overflow));assert.deepEqual(diagramOverflow,[],`${config.id} ${width} figure overflow`);
  const worksheet=page.locator('.editable-comparison').first();assert(await worksheet.count());await worksheet.locator('textarea').first().fill('=SUM(1,2)');const downloadPromise=page.waitForEvent('download');await worksheet.locator('[data-export-table]').click();const download=await downloadPromise;let csv='';for await(const chunk of await download.createReadStream())csv+=chunk.toString();assert(csv.includes("'=SUM(1,2)"));
  if(width<=960){const menu=page.locator('.mobile-contents');await menu.locator('summary').focus();await page.keyboard.press('Enter');assert(await menu.evaluate(e=>e.open));await menu.locator('a').nth(1).click();assert.equal(await menu.evaluate(e=>e.open),false);}
  await page.getByRole('button',{name:'Switch to dark mode',exact:true}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));assert.equal(await page.locator('.question-disclosure:not([open])').count(),0);await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  if(width===1440||width===390){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${dir}/${config.id}-${width}-dark.png`});await page.getByRole('button',{name:'Switch to light mode',exact:true}).click();await page.screenshot({path:`${dir}/${config.id}-${width}-light.png`});}
  assert.deepEqual(errors,[],`${config.id} ${width} browser errors`);assert(requests.every(url=>url.startsWith(base)||url.startsWith('blob:')),'no remote dependencies or data submission');
  report.push({page:config.id,width,status:'passed',chapters:await page.locator('[data-article-section]').count(),figures:6,quiz:10,keyboard:true,csv:true,themePersistence:true});await page.close();
 }
 for(const width of [1440,834,390,320]){const page=await browser.newPage({viewport:{width,height:900}});await page.goto(base+'/preview',{waitUntil:'networkidle'});assert.equal(await page.locator('.preview-page-card').count(),11);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.close();}
 writeFileSync(`${dir}/qa-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({status:'passed',cases:report.length,pages:3,widths:[1440,834,390,320],index:'passed'}));
}finally{await browser.close();}
