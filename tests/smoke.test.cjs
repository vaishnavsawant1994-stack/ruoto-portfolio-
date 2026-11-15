const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');

test('essential files and public routes are present',()=>{
 for(const f of ['index.html','styles.css','app.js','404.html','favicon.svg','vercel.json','api/submit.js'])assert.ok(fs.existsSync(path.join(root,f)),f);
 const html=read('index.html');
 for(const route of ['/','/menu','/reservations'])assert.ok(html.includes('data-page="'+route+'"'),route);
 for(const id of ['story','wine','visit','antipasti','pasta-menu','dolci','wine-menu','private'])assert.ok(html.includes('id="'+id+'"'),id);
});
test('static route rewrite configuration is valid',()=>{
 const config=JSON.parse(read('vercel.json'));
 assert.ok(config.rewrites.some(r=>r.source==='/menu'&&r.destination==='/index.html'));
 assert.ok(config.rewrites.some(r=>r.source==='/reservations'&&r.destination==='/index.html'));
});
test('forms and accessible labels are present',()=>{
 const html=read('index.html');
 for(const type of ['booking','private','newsletter'])assert.ok(html.includes('data-form="'+type+'"'),type);
 assert.ok(html.includes('aria-live="polite"'));
 assert.ok(html.includes('aria-expanded="false"'));
 assert.ok(html.includes('prefers-reduced-motion')||read('styles.css').includes('prefers-reduced-motion'));
});
test('serverless form endpoint rejects other HTTP methods',async()=>{
 const fn=require('../api/submit.js');
 const req={method:'GET',headers:{}};
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(v){this.statusCode=v;return this;},json(v){this.payload=v;return this;}};
 await fn(req,res);
 assert.equal(res.statusCode,405);
});
test('serverless form endpoint rejects invalid submissions',async()=>{
 const fn=require('../api/submit.js');
 const req={method:'POST',headers:{'content-type':'application/json'},body:{type:'booking',data:{email:'invalid'}}};
 const res={setHeader(){},status(v){this.statusCode=v;return this;},json(v){this.payload=v;return this;}};
 await fn(req,res);
 assert.equal(res.statusCode,400);
});
test('reference pictures not taken from external template host',()=>{
 const html=read('index.html');
 assert.equal(html.includes('framerusercontent.com'),false);
});
