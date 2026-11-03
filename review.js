const packet=JSON.parse(document.getElementById('packet-data').textContent);
document.getElementById('print').addEventListener('click',()=>window.print());
document.getElementById('export').addEventListener('click',()=>{
 const reviewer=document.getElementById('reviewer').value.trim();
 const reviewDate=document.getElementById('review-date').value;
 const answers=packet.questions.map(q=>({question_id:q.id,question:q.text,decision:document.getElementById(q.id+'-decision').value,note:document.getElementById(q.id+'-note').value.trim()}));
 const decision=document.getElementById('overall').value;
 const overallNote=document.getElementById('overall-note').value.trim();
 const errors=[];
 if(!reviewer||!reviewDate)errors.push('نام تأییدکننده و تاریخ را ثبت کنید.');
 if(answers.some(a=>['revise','reject'].includes(a.decision)&&!a.note))errors.push('برای اصلاح یا رد، متن پاسخ لازم است.');
 if(decision==='approved'&&answers.some(a=>a.decision!=='confirmed'))errors.push('تأیید کامل فقط وقتی ممکن است که همه سؤال‌ها تأیید شده باشند؛ اصلاحات باید ابتدا وارد نسخه جدید شوند.');
 if(['changes_requested','rejected'].includes(decision)&&!overallNote)errors.push('دلیل اصلاح یا رد پرونده را بنویسید.');
 const msg=document.getElementById('feedback');
 if(errors.length){msg.textContent=errors.join(' ');return;}
 const result={schema_version:1,epic_id:packet.id,packet_revision:packet.revision,packet_sha256:packet.packet_sha256,source_hashes:packet.source_hashes,reviewer,review_date:reviewDate,decision,answers,overall_note:overallNote,exported_at:new Date().toISOString(),trust_status:'user_recorded_pending_reconciliation'};
 const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=packet.id+'-vahid-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 msg.textContent='پاسخ‌ها دانلود شد. ثبت در پروژه و بررسی نسخه منبع هنوز لازم است؛ هیچ Epic یا استراتژی خودکار تأیید نشد.';
});