/* Independent Ruota-inspired implementation.
   Set window.RUOTA_CONFIG before this script to enable real integrations:
   { timeZone: "Europe/London", endpoints: {booking:"https://...", private:"https://...", newsletter:"https://..."} }
   Endpoints must implement POST JSON and return a 2xx response only on successful delivery.
   There is intentionally no fake-success fallback. */
(function(){
"use strict";
const config = window.RUOTA_CONFIG || {};
const endpoints = config.endpoints || {};
const routes = {"/":{id:"home-page",title:"Ruota — Pasta & natural wine",description:"A neighborhood table for fresh pasta and natural wine."},"/menu":{id:"menu-page",title:"The menu — Ruota",description:"Freshly rolled pasta, small plates, desserts and natural wine."},"/reservations":{id:"reservations-page",title:"Reservations — Ruota",description:"Request a table or enquire about a private dinner at Ruota."}};
const mobileToggle=document.getElementById("menu-toggle");
const mobileNav=document.getElementById("mobile-nav");
function closeMenu(returnFocus){
 if(!mobileToggle || !mobileNav)return;
 const wasOpen=mobileToggle.getAttribute("aria-expanded")==="true";
 mobileToggle.setAttribute("aria-expanded","false");mobileToggle.setAttribute("aria-label","Open navigation");mobileNav.hidden=true;
 if(returnFocus&&wasOpen)mobileToggle.focus();
}
function toggleMenu(){
 const open=mobileToggle.getAttribute("aria-expanded")==="true";
 mobileToggle.setAttribute("aria-expanded",String(!open));mobileToggle.setAttribute("aria-label",open?"Open navigation":"Close navigation");mobileNav.hidden=open;
 if(!open){const first=mobileNav.querySelector("a");if(first)first.focus();}
}
if(mobileToggle)mobileToggle.addEventListener("click",toggleMenu);
document.addEventListener("keydown",function(event){if(event.key==="Escape")closeMenu(true);});
document.addEventListener("click",function(event){if(mobileNav&&!mobileNav.hidden&&!event.target.closest(".site-header"))closeMenu(false);});
function pathname(){let p=decodeURI(location.pathname);if(p!=="/"&&p.endsWith("/"))p=p.slice(0,-1);return p;}
function navigate(path,opts){
 const options=opts||{};const url=new URL(path,location.href);
 const route=routes[url.pathname]?url.pathname:"/";
 if(!options.pop)history.pushState({},"",url.pathname+url.search+url.hash);
 document.querySelectorAll(".page").forEach(function(page){page.hidden=page.id!==routes[route].id;});
 const metadata=routes[route];document.title=metadata.title;
 document.querySelector('meta[name="description"]').setAttribute("content",metadata.description);
 document.querySelector('meta[property="og:title"]').setAttribute("content",metadata.title);
 document.querySelector('meta[property="og:description"]').setAttribute("content",metadata.description);
 document.querySelectorAll(".desktop-nav a,.mobile-nav a").forEach(function(a){
  const active=new URL(a.href,location.href).pathname===route&&!a.hash;
  if(active)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
 });
 closeMenu(false);
 const targetHash=url.hash;
 if(targetHash){requestAnimationFrame(function(){requestAnimationFrame(function(){
   const target=document.getElementById(decodeURIComponent(targetHash.substring(1)));
   if(target)target.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});else window.scrollTo(0,0);
 });});}
 else if(!options.preserveScroll)window.scrollTo(0,0);
 requestAnimationFrame(observeMotion);
}
document.addEventListener("click",function(event){
 const link=event.target.closest("a[href]");
 if(!link || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target==="_blank" || link.hasAttribute("download"))return;
 const url=new URL(link.href,location.href);
 if(url.origin!==location.origin)return;
 if(url.hash&&!url.pathname.includes("/menu")&&!url.pathname.includes("/reservations")&&url.pathname!=="/")return;
 if(!routes[url.pathname])return;
 event.preventDefault();
 if(location.pathname===url.pathname&&location.hash===url.hash){closeMenu(false);return;}
 navigate(url.pathname+url.hash);
});
window.addEventListener("popstate",function(){navigate(location.pathname+location.hash,{pop:true});});
navigate(location.pathname+location.hash,{pop:true,preserveScroll:!!location.hash});
document.getElementById("current-year").textContent=String(new Date().getFullYear());

let observer;
function observeMotion(){
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("in-view");});return;}
 if(!("IntersectionObserver" in window))return;
 document.body.classList.add("js-motion");
 if(!observer)observer=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target);}});
 },{threshold:.13,rootMargin:"0px 0px -20px 0px"});
 document.querySelectorAll(".reveal:not(.in-view)").forEach(function(el){observer.observe(el);});
}
let countersStarted=false;
const statGrid=document.querySelector(".stats-grid");
function runCounters(){
 if(countersStarted)return;countersStarted=true;
 const nodes=Array.from(document.querySelectorAll("[data-counter]"));
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(reduce){nodes.forEach(function(node){node.textContent=node.dataset.counter+(node.dataset.suffix||"");});return;}
 const start=performance.now();const duration=1200;
 function tick(now){const t=Math.min(1,(now-start)/duration);const eased=1-Math.pow(1-t,3);
 nodes.forEach(function(node){const final=Number(node.dataset.counter);node.textContent=String(Math.round(final*eased))+(node.dataset.suffix||"");});
 if(t<1)requestAnimationFrame(tick);}
 requestAnimationFrame(tick);
}
if(statGrid && "IntersectionObserver" in window){
 const obs=new IntersectionObserver(function(entries){if(entries.some(function(e){return e.isIntersecting;})){runCounters();obs.disconnect();}},{threshold:.4});
 obs.observe(statGrid);
}else{runCounters();}

const now = new Date();
function setDateBounds(){
 const fields=document.querySelectorAll('input[type="date"]');
 const localDate=function(date){return String(date.getFullYear())+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");};
 const max=new Date(now);max.setDate(max.getDate()+30);
 fields.forEach(function(input){input.min=localDate(now);input.max=localDate(max);});
}
setDateBounds();
function updateOpeningStatus(){
 const pill=document.getElementById("opening-status"), note=document.getElementById("opening-note");
 if(!pill)return;
 if(!config.timeZone){pill.textContent="Hours unverified";note.textContent="Live open/closed status is disabled until the restaurant time zone is configured.";return;}
 try{
  const formatter=new Intl.DateTimeFormat("en-GB",{timeZone:config.timeZone,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
  const parts={};formatter.formatToParts(new Date()).forEach(function(part){parts[part.type]=part.value;});
  const day=parts.weekday,h=Number(parts.hour)+Number(parts.minute)/60;
  const isOpen=(["Tue","Wed","Thu","Fri"].includes(day)&&((h>=12&&h<15)||(h>=18&&h<23)))||(day==="Sat"&&h>=12&&h<23)||(day==="Sun"&&h>=12&&h<16);
  pill.textContent=isOpen?"Open now":"Currently closed";pill.classList.toggle("is-open",isOpen);pill.classList.toggle("is-closed",!isOpen);
  note.textContent="Status uses "+config.timeZone+" local time and sample hours. Confirm the actual schedule before launch.";
 }catch(e){pill.textContent="Hours unverified";note.textContent="Invalid time zone in RUOTA_CONFIG.";}
}
updateOpeningStatus();
setInterval(updateOpeningStatus,60000);

function setStatus(form,message,kind){
 const status=form.querySelector(".form-status");if(!status)return;
 status.textContent=message;status.classList.remove("error","success");
 if(kind)status.classList.add(kind);
}
function bookingRules(form){
 const formData=new FormData(form), rawDate=String(formData.get("date")||"");
 const time=String(formData.get("time")||"");
 const date=new Date(rawDate+"T12:00:00");
 if(Number.isNaN(date.getTime()))return "Choose a valid date.";
 const day=date.getDay();
 if(day===1)return "The sample schedule is closed on Mondays. Choose another day.";
 if(day===0&&time>="18:00")return "Sunday dinner isn't offered in the sample schedule.";
 if(time<"12:00"||(time>="15:00"&&time<"18:00")||time>="22:00")return "Choose an available lunch or dinner time.";
 const phone=String(formData.get("phone")||"").replace(/\D/g,"");
 if(phone.length<7||phone.length>15)return "Enter a valid phone number.";
 return null;
}
document.querySelectorAll("form[data-form]").forEach(function(form){
 form.addEventListener("input",function(){setStatus(form,"","");});
 form.addEventListener("submit",async function(event){
  event.preventDefault();
  if(!form.checkValidity()){form.reportValidity();setStatus(form,"Complete the required fields first.","error");return;}
  const type=form.dataset.form;
  if(type==="booking"){const error=bookingRules(form);if(error){setStatus(form,error,"error");return;}}
  const endpoint=endpoints[type];
  if(!endpoint){setStatus(form,"Not sent. This form needs a verified delivery endpoint before it can accept real requests.","error");return;}
  const submit=form.querySelector('button[type="submit"]');
  const payload=Object.fromEntries(new FormData(form).entries());
  const controller=new AbortController();const timeout=setTimeout(function(){controller.abort();},12000);
  try{
   submit.disabled=true;submit.setAttribute("aria-busy","true");setStatus(form,"Sending…","");
   const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:type,data:payload}),signal:controller.signal});
   if(!response.ok)throw new Error("Endpoint returned HTTP "+response.status);
   setStatus(form,type==="booking"?"Your request was delivered. The restaurant must still confirm your table.":type==="private"?"Your enquiry was delivered. Await confirmation from the restaurant.":"Subscription request delivered.","success");
   form.reset();
  }catch(error){setStatus(form,"Couldn't deliver your request. Please try again or contact the restaurant directly.","error");}
  finally{clearTimeout(timeout);submit.disabled=false;submit.removeAttribute("aria-busy");}
 });
});
})();