import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {pages,renderPage,renderIndex} from '../src/content-pages.mjs';
import {learningPages,renderLearning} from '../src/learning-pages.mjs';
import {companyPages,renderCompany} from '../src/company-pages.mjs';

for(const page of pages){
 mkdirSync(`output/site${page.path}`,{recursive:true});
 writeFileSync(`output/site${page.path}/index.html`,renderPage(page));
}
for(const page of learningPages){mkdirSync(`output/site${page.path}`,{recursive:true});writeFileSync(`output/site${page.path}/index.html`,renderLearning(page));}
for(const page of companyPages){mkdirSync(`output/site${page.path}`,{recursive:true});writeFileSync(`output/site${page.path}/index.html`,renderCompany(page));}
mkdirSync('output/site/preview',{recursive:true});
writeFileSync('output/site/preview/index.html',renderIndex().replace('<p class="local-review-note">', `<section class="content-next"><div class="section-heading"><div><p class="eyebrow">THE COMPANY</p><h2>Meet FXRebate.</h2></div></div><div class="related-grid">${companyPages.map(p=>`<a class="preview-page-card" href="${p.path}"><span class="eyebrow">FXREBATE</span><h3>${p.title}</h3><p>${p.subtitle}</p><span class="preview-card-cta">Explore page ↗</span></a>`).join('')}</div></section><p class="local-review-note">`));
for(const name of ['content-pages.css','content-client.js'])writeFileSync(`output/site/${name}`,readFileSync(`src/${name}`));
console.log(`Built ${pages.length+learningPages.length} resource pages → output/site/preview/index.html`);
