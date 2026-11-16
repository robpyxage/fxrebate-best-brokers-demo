import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {companyPages,renderCompany} from '../src/company-pages.mjs';
const source=JSON.parse(readFileSync(new URL('../input/pages-company/content.json',import.meta.url)));
const normalize=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/[;\s]+/g,' ').trim();
test('both company pages retain all supplied paragraphs',()=>{for(const page of companyPages){const html=normalize(renderCompany(page));for(const text of source[page.id])assert.ok(html.includes(normalize(text)),`${page.id}: ${text}`)}});
test('careers clearly indicates no current positions and unconnected applications',()=>{const html=renderCompany(companyPages.find(p=>p.id==='careers'));assert.match(html,/Current vacancies: No open position/);assert.match(html,/Application channel to be confirmed/);assert.equal((html.match(/class="company-role"/g)||[]).length,8)});
