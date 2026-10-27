import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {pages,renderPage,renderIndex} from '../src/content-pages.mjs';

for(const page of pages){
 mkdirSync(`output/site${page.path}`,{recursive:true});
 writeFileSync(`output/site${page.path}/index.html`,renderPage(page));
}
mkdirSync('output/site/preview',{recursive:true});
writeFileSync('output/site/preview/index.html',renderIndex());
for(const name of ['content-pages.css','content-client.js'])writeFileSync(`output/site/${name}`,readFileSync(`src/${name}`));
console.log(`Built ${pages.length} resource pages → output/site/preview/index.html`);
