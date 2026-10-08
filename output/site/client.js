// Integration hook only. No analytics provider or personal data collection in the demo.
function track(event,properties={}){window.dispatchEvent(new CustomEvent('fxrebate:analytics',{detail:{event,collection_id:'best_forex_brokers',placement:'best_forex_brokers',...properties}}));}
track('best_brokers_page_view');
document.addEventListener('click',event=>{const link=event.target.closest('[data-event]');if(link)track(link.dataset.event,{broker_id:link.dataset.brokerId,rank:link.dataset.rank});});
const cards=[...document.querySelectorAll('.broker-card')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 cards.forEach(card=>{card.hidden=filter!=='all'&&(filter==='commission'?card.dataset.rebateType!=='commission':!card.dataset.platforms.split(',').includes(filter));});
 document.querySelector('.filter-count').textContent=`Showing ${cards.filter(c=>!c.hidden).length} brokers`;
 track('broker_filter_click',{filter});
}));
document.querySelectorAll('.faq-list details').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)track('faq_expand',{faq_id:details.dataset.faq});}));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){track('broker_card_impression',{broker_id:entry.target.dataset.brokerId,rank:entry.target.dataset.rank});observer.unobserve(entry.target);}}),{threshold:0.5});cards.forEach(card=>observer.observe(card));}
