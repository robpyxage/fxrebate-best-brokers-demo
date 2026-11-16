// Development server only. Never serve hidden files or paths outside the built site.
import {createServer} from 'node:http';
import {readFileSync,realpathSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const root=realpathSync(resolve('output/site'));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain','.woff2':'font/woff2'};
createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end();}
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.split(/[\\/]/).some(part=>part.startsWith('.'))){res.writeHead(403);return res.end('Forbidden');}
  let path=resolve(root,'.'+pathname);
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden');}
  path=realpathSync(path);
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden');}
  if(statSync(path).isDirectory())path=realpathSync(resolve(path,'index.html'));
  if(!path.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden');}
  const body=readFileSync(path);res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
 }catch(error){res.writeHead(error instanceof URIError?400:404);res.end('Not found');}
}).listen(Number(process.env.PORT||4173),process.env.HOST||'127.0.0.1',()=>console.log(`Demo: http://localhost:${process.env.PORT||4173}/brokers/best-forex-brokers`));
