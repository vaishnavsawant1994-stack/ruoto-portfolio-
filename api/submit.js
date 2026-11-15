/* Vercel Node function. No email is sent unless all three server-side secrets
   RESEND_API_KEY, RUOTA_INBOX_EMAIL and RUOTA_FROM_EMAIL are configured. */
module.exports = async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
 if(!String(req.headers["content-type"]||"").startsWith("application/json"))return res.status(415).json({error:"JSON required"});
 const size=Number(req.headers["content-length"]||"0");
 if(size>16000)return res.status(413).json({error:"Request too large"});
 const body=typeof req.body==="object"&&req.body!==null?req.body:{};
 const type=String(body.type||"");
 const data=body.data&&typeof body.data==="object"?body.data:{};
 if(!["booking","private","newsletter"].includes(type))return res.status(400).json({error:"Invalid form"});
 const clean=(value,max=400)=>String(value||"").trim().slice(0,max);
 const email=clean(data.email,254);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:"Invalid email"});
 let subject="",message="";
 if(type==="newsletter"){
  subject="Ruota newsletter subscription request";
  message="Subscription request: "+email+"\n\nThis is an inbox notification, not confirmation of mailing-list registration.";
 }else{
  const name=clean(data.name,100),date=clean(data.date,10),guests=Number(data.guests);
  const chosen=new Date(date+"T12:00:00Z");
  const validDate=/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(chosen.getTime())&&chosen.toISOString().slice(0,10)===date;
  const today=new Date();today.setUTCHours(0,0,0,0);
  const max=new Date(today);max.setUTCDate(max.getUTCDate()+30);
  if(!name||!validDate||chosen<today||chosen>max)return res.status(400).json({error:"Invalid name or date"});
  if(type==="booking"){
   const phone=clean(data.phone,60),time=clean(data.time,5);
   const allowed=["12:00","12:30","13:00","13:30","14:00","14:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];
   if(!Number.isInteger(guests)||guests<1||guests>8||!allowed.includes(time)||chosen.getUTCDay()===1||(chosen.getUTCDay()===0&&time>="18:00")||phone.replace(/\D/g,"").length<7)return res.status(400).json({error:"Invalid booking details"});
   subject="Ruota table enquiry: "+date+" "+time;
   message="New table request\nName: "+name+"\nEmail: "+email+"\nPhone: "+phone+"\nDate: "+date+"\nTime: "+time+"\nGuests: "+guests+"\nNotes: "+clean(data.notes,1000)+"\n\nThis is a request, not a confirmed reservation.";
  }else{
   if(!Number.isInteger(guests)||guests<9||guests>18||!clean(data.message,1000))return res.status(400).json({error:"Invalid group enquiry"});
   subject="Ruota private dining enquiry: "+date;
   message="New group dining enquiry\nName: "+name+"\nEmail: "+email+"\nDate: "+date+"\nGuests: "+guests+"\nMessage: "+clean(data.message,1000)+"\n\nThis is an enquiry, not a confirmed reservation.";
  }
 }
 const key=process.env.RESEND_API_KEY,to=process.env.RUOTA_INBOX_EMAIL,from=process.env.RUOTA_FROM_EMAIL;
 if(!key||!to||!from)return res.status(503).json({error:"Email delivery has not been configured"});
 try{
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8500);
  let response;
  try{
   response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],subject,text:message,reply_to:email}),signal:controller.signal});
  }finally{clearTimeout(timeout);}
  if(!response.ok){console.error("Email provider rejected request with status",response.status);return res.status(502).json({error:"Delivery provider failed"});}
  return res.status(200).json({delivered:true,notice:type==="booking"?"Await explicit restaurant confirmation.":"Request delivered."});
 }catch(error){console.error("Email provider request failed",String(error&&error.name||"unknown"));return res.status(502).json({error:"Delivery failure"});}
};