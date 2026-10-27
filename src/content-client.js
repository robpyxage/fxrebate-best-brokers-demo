// Local editorial interactions. No account creation, backend calls or data submission.
function contentTrack(event,properties={}){window.dispatchEvent(new CustomEvent('fxrebate:analytics',{detail:{event,page_id:document.body.dataset.pageId,...properties}}));}

document.querySelectorAll('[data-calculator]').forEach(form=>{
 const amount=form.elements.amount,rate=form.elements.rate,output=form.querySelector('output');
 const update=()=>{
  if(!form.checkValidity()){output.textContent='—';return;}
  const result=Number(amount.value)*Number(rate.value)/(form.dataset.calculator==='forex'?1:100);
  output.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(result);
 };
 form.addEventListener('input',update);
 form.addEventListener('submit',event=>{event.preventDefault();update();contentTrack('rebate_example_calculate',{market:form.dataset.calculator});});
 update();
});

document.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>{contentTrack('guide_print');window.print();}));
document.querySelectorAll('[data-export-table]').forEach(button=>button.addEventListener('click',()=>{
 const table=document.getElementById(button.dataset.exportTable);
 // Prefix spreadsheet formulas so notes are always exported as text.
 const csvCell=value=>{let text=value.trim();if(/^[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
 const csv=[...table.rows].map(row=>[...row.cells].map(cell=>csvCell(cell.querySelector('textarea')?.value??cell.textContent)).join(',')).join('\r\n');
 const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download=`fxrebate-${document.body.dataset.pageId}-comparison.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 contentTrack('comparison_download');
}));
document.querySelectorAll('[data-checklist]').forEach(input=>input.addEventListener('change',()=>contentTrack('guide_checklist_change',{checked:input.checked})));
// Links from the contents and direct URLs reveal the answer before scrolling to it.
function revealHash(){
 if(!location.hash)return;
 let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target)return;
 const disclosure=target.matches('.question-section')?target.querySelector('.question-disclosure'):target.closest('details.question-disclosure, details.more-items');
 if(disclosure){disclosure.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
}
window.addEventListener('hashchange',revealHash);
document.querySelectorAll('[data-toc-link]').forEach(link=>link.addEventListener('click',()=>{if(link.hash===location.hash)revealHash();}));
revealHash();
document.querySelectorAll('.question-disclosure').forEach(disclosure=>disclosure.addEventListener('toggle',()=>{if(disclosure.open)contentTrack('resource_question_expand',{question_id:disclosure.closest('section').id});}));
let expandedForPrint=[];
window.addEventListener('beforeprint',()=>{expandedForPrint=[...document.querySelectorAll('.question-disclosure:not([open]),.more-items:not([open])')];expandedForPrint.forEach(details=>details.open=true);});
window.addEventListener('afterprint',()=>{expandedForPrint.forEach(details=>details.open=false);expandedForPrint=[];});
document.querySelectorAll('.mobile-contents a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.mobile-contents').open=false;}));
if('IntersectionObserver' in window){
 const links=[...document.querySelectorAll('.sticky-sidebar [data-toc-link]')];
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
  if(!visible.length)return;
  links.forEach(link=>{if(link.hash===`#${visible[0].target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 },{rootMargin:'-5% 0px -65% 0px',threshold:0});
 document.querySelectorAll('[data-article-section]').forEach(section=>observer.observe(section));
}
