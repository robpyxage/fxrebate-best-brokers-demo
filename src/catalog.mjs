import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const workspaceCatalog=resolve('../fxrebate-guide-bot/output/catalog-blog-2026-08-12/normalized-blog-broker-catalog.json');
// The portable handoff ships a frozen read-only projection, not a new master database.
export const masterPath=existsSync(workspaceCatalog)?workspaceCatalog:resolve('input/catalog-snapshot.json');
export function adaptBroker(record,profile={}) {
  const slug=record.canonical_broker_slug;
  const regulators=profile.regulators?.length?profile.regulators:[...new Set((record.legal_entities_and_licenses??[]).flatMap(r=>(r.raw??'').match(/\b(?:ASIC|CySEC|FCA|FINMA|VFSC|FSCA|FSC|SCB|FSA|FCMC)\b/g)??[]))];
  // Display exact observed units; never compare unlike rates or infer a maximum.
  const rates=profile.forexRates??[];
  let rebate={value:'Multiple cashback options',note:'See current account-specific rates',type:'variable'};
  if(slug==='ic-markets'&&rates.includes('3 USD per lot'))rebate={value:'$3.00',unit:'/ lot',note:'Forex · Standard account',type:'usd_per_lot'};
  if(slug==='dukascopy'&&rates.includes('35% of commission'))rebate={value:'35%',unit:'of commission',note:'Forex · JForex API / FIX API',type:'commission'};
  if(slug==='fxpro'&&rates.includes('30% of spread'))rebate={value:'30%',unit:'of spread',note:'Eligible forex accounts · see rates',type:'spread'};
  if(slug==='fusion-markets'&&rates.includes('4 points per lot'))rebate={value:'4 points',unit:'/ lot',note:'Forex · Classic (Auto Rebate)',type:'points_per_lot'};
  return {id:record.broker_id,slug,name:record.broker_name,profileUrl:record.fxrebate_broker_url,sourceUrl:record.blog_article_url,
    logo:existsSync(`assets/${slug}.png`)?`/assets/${slug}.png`:null,
    rating:Number.isFinite(profile.rating)&&profile.rating>0&&profile.rating<=5?profile.rating:null,
    minimumDeposit:profile.minimumDeposit?.replace(/^(\d+) USD$/,(_,n)=>`$${Number(n).toLocaleString('en-US')}`)??'See profile',
    regulators,platforms:(record.platforms??[]).filter(p=>p.status==='explicit_yes').map(p=>p.canonical==='proprietary-platform'&&slug==='dukascopy'?'JForex':p.value).filter(p=>p!=='FIX API'),
    rebate,sourceDate:profile.fetchedAt??'2026-08-12'};
}
export function getCollectionBrokers(collection){
  const catalog=JSON.parse(readFileSync(masterPath,'utf8'));
  const profiles=JSON.parse(readFileSync('input/public-profile-facts.json','utf8'));
  return collection.placements.filter(p=>p.enabled).sort((a,b)=>a.displayOrder-b.displayOrder).map(placement=>{
    const master=catalog.brokers.find(b=>b.canonical_broker_slug===placement.brokerId);
    if(!master)throw new Error(`Missing master broker: ${placement.brokerId}`);
    return {broker:adaptBroker(master,profiles[placement.brokerId]),placement};
  });
}
