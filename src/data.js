const today = new Date().toLocaleDateString('sv-SE')
export const weekdays=['日','月','火','水','木','金','土']
export const recurrenceOptions=[{value:'daily',label:'毎日'},{value:'weekdays',label:'曜日指定'},{value:'interval',label:'○日ごと'},{value:'weekly',label:'週に○回'},{value:'monthly',label:'毎月○日'}]
export const initialData={goals:[{id:'goal-sample',title:'卒業までに体重70kgにする',deadline:'2029-03-31',createdAt:today}],milestones:[{id:'m1',goalId:'goal-sample',content:'7月31日までに57kgにする',deadline:'2026-07-31',completedAt:'',createdAt:today},{id:'m2',goalId:'goal-sample',content:'8月31日までに59kgにする',deadline:'2026-08-31',completedAt:'',createdAt:today},{id:'m3',goalId:'goal-sample',content:'年内に体重63kg',deadline:'2026-12-31',completedAt:'',createdAt:today}],habits:[{id:'h1',name:'米を毎日3合食べる',goalId:'goal-sample',startDate:today,recurrence:'daily',weekdays:[],interval:3,weeklyTarget:3,monthlyDay:1},{id:'h2',name:'プロテインを2回飲む',goalId:'goal-sample',startDate:today,recurrence:'daily',weekdays:[],interval:3,weeklyTarget:3,monthlyDay:1},{id:'h3',name:'ジムに行く',goalId:'goal-sample',startDate:today,recurrence:'weekly',weekdays:[],interval:3,weeklyTarget:3,monthlyDay:1},{id:'h4',name:'筋トレをする',goalId:'goal-sample',startDate:today,recurrence:'interval',weekdays:[],interval:3,weeklyTarget:3,monthlyDay:1}],habitRecords:[]}
export const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2)}`
export const dateKey=(d=new Date())=>{const x=new Date(d);return new Date(x.getTime()-x.getTimezoneOffset()*60000).toISOString().slice(0,10)}
export const parseDate=v=>new Date(`${v}T00:00:00`)
export const daysBetween=(a,b)=>Math.round((parseDate(b)-parseDate(a))/86400000)
export const daysLeft=v=>v?daysBetween(dateKey(),v):null
export const formatDate=v=>v?new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'long',day:'numeric'}).format(parseDate(v)):'未設定'
export const habitCompletedOn=(records,id,day=dateKey())=>records.some(r=>r.habitId===id&&r.date===day)
export const weekRange=(day=dateKey())=>{const d=parseDate(day),n=d.getDay()||7;d.setDate(d.getDate()-n+1);const a=dateKey(d);d.setDate(d.getDate()+6);return[a,dateKey(d)]}
export const weeklyCount=(records,id,day=dateKey())=>{const[a,b]=weekRange(day);return records.filter(r=>r.habitId===id&&r.date>=a&&r.date<=b).length}
export const isHabitScheduled=(h,day=dateKey())=>{if(day<(h.startDate||day))return false;const d=parseDate(day);if(h.recurrence==='daily'||h.recurrence==='weekly')return true;if(h.recurrence==='weekdays')return(h.weekdays||[]).includes(d.getDay());if(h.recurrence==='interval')return daysBetween(h.startDate,day)%Math.max(1,Number(h.interval||3))===0;if(h.recurrence==='monthly')return d.getDate()===Number(h.monthlyDay||1);return false}
export const recurrenceLabel=h=>h.recurrence==='daily'?'毎日':h.recurrence==='weekdays'?(h.weekdays||[]).map(i=>weekdays[i]).join('・')+'曜日':h.recurrence==='interval'?`${h.interval||3}日ごと`:h.recurrence==='weekly'?`週${h.weeklyTarget||3}回`:`毎月${h.monthlyDay||1}日`
export const deadlineState=n=>n<0?'past':n<=7?'urgent':n<=30?'soon':'normal'
export const deadlineText=n=>n<0?`期限超過 ${Math.abs(n)}日`:n===0?'今日まで':`あと ${n}日`
export const sortMilestones=ms=>[...ms].sort((a,b)=>a.deadline.localeCompare(b.deadline)||(a.createdAt||'').localeCompare(b.createdAt||''))
