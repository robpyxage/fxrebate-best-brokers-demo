import {createRequire} from 'node:module';
import {existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {pages} from '../src/content-pages.mjs';
const workspacePackage=new URL('../../fxrebate-guide-bot/package.json',import.meta.url);
const require=createRequire(existsSync(workspacePackage)?workspacePackage:new URL('../package.json',import.meta.url));
const {chromium}=require('playwright');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE_PATH||'/home/hermes/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser=await chromium.launch({executablePath});
const base=process.env.DEMO_URL||'http://localhost:4173';
const results=[];
try {
 for(const config of pages.filter(p=>p.kind==='rebates')) for(const width of [1440,834,390,320]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+config.path,{waitUntil:'networkidle'});
  const section=page.locator('.question-section').first();
  assert((await page.locator('.question-section').count())>=4);
  const id=await section.getAttribute('id'),details=section.locator(':scope > details.question-disclosure'),summary=details.locator(':scope > summary');
  assert.equal(await details.evaluate(e=>e.open),false);
  await summary.focus();await page.keyboard.press('Enter');assert.equal(await details.evaluate(e=>e.open),true);
  await page.keyboard.press('Enter');assert.equal(await details.evaluate(e=>e.open),false);
  await page.goto(base+config.path+'#'+id,{waitUntil:'networkidle'});
  const answer=page.locator('#'+id+' > details');assert.equal(await answer.evaluate(e=>e.open),true);
  await answer.locator(':scope > summary').click();assert.equal(await answer.evaluate(e=>e.open),false);
  if(width<961)await page.locator('.mobile-contents > summary').click();
  await page.locator((width<961?'.mobile-contents':'.sticky-sidebar')+' a[href="#'+id+'"]').click();
  assert.equal(await answer.evaluate(e=>e.open),true);
  const more=page.locator('.more-items').first();await more.locator(':scope > summary').click();
  assert.equal(await more.evaluate(e=>e.open),true);assert.equal(await more.locator('.more-open').isVisible(),true);
  await more.locator(':scope > summary').click();
  await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
  assert.equal(await page.locator('.question-disclosure:not([open]), .more-items:not([open])').count(),0);
  await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  assert.equal(await answer.evaluate(e=>e.open),true);assert.equal(await more.evaluate(e=>e.open),false);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  results.push({page:config.id,width,status:'passed'});await page.close();
 }
 console.log(JSON.stringify({status:'passed',cases:results.length,checks:['keyboard','deep link and reload','same link after close','expand list','print state','responsive']}));
}finally{await browser.close();}
