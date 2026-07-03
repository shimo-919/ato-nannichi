export const weekdays=['日','月','火','水','木','金','土']
export const recurrenceOptions=[{value:'daily',label:'毎日'},{value:'weekdays',label:'曜日指定'},{value:'interval',label:'○日ごと'},{value:'weekly',label:'週に○回'},{value:'monthly',label:'毎月○日'}]
export const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2)}`
export const dateKey=(d=new Date())=>{const x=new Date(d);return new Date(x.getTime()-x.getTimezoneOffset()*60000).toISOString().slice(0,10)}
export const parseDate=v=>new Date(`${v}T00:00:00`)
export const daysBetween=(a,b)=>Math.round((parseDate(b)-parseDate(a))/86400000)
export const daysLeft=v=>v?daysBetween(dateKey(),v):null
export const formatDate=v=>v?new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'long',day:'numeric'}).format(parseDate(v)):'未設定'
const relative=days=>{const d=new Date();d.setDate(d.getDate()+days);return dateKey(d)}
const monthsFromNow=months=>{const d=new Date();d.setMonth(d.getMonth()+months);return dateKey(d)}

export function makeSampleData(){
 const created=relative(-70), goals=[
  {id:'goal-body',title:'卒業までに体重70kgにする',deadline:monthsFromNow(18),createdAt:created},
  {id:'goal-toeic',title:'TOEIC 750点を取る',deadline:monthsFromNow(3),createdAt:relative(-50)},
  {id:'goal-money',title:'貯金20万円',deadline:monthsFromNow(6),createdAt:relative(-45)},
  {id:'goal-guitar',title:'ギターで1曲弾けるようになる',deadline:relative(24),createdAt:relative(-20)},
  {id:'goal-room',title:'夏までに部屋を整える',deadline:relative(6),createdAt:relative(-12)}]
 const m=(id,goalId,content,deadline,completedAt='',offset=-30)=>({id,goalId,content,deadline,completedAt,createdAt:relative(offset)})
 const milestones=[
  m('body-56','goal-body','体重56kgにする',relative(-45),relative(-47),-65),m('body-58','goal-body','体重58kgにする',relative(-20),relative(-22),-60),m('body-60','goal-body','体重60kgにする',relative(10),relative(-3),-55),m('body-63','goal-body','体重63kgにする',relative(60),'',-50),m('body-bench','goal-body','ベンチプレス80kg',monthsFromNow(8),'',-45),m('body-70','goal-body','体重70kgにする',monthsFromNow(18),'',-40),
  m('toeic-book','goal-toeic','単語帳を1周する',relative(-8),relative(-9),-40),m('toeic-mock','goal-toeic','模試を1回解く',relative(4),'',-35),m('toeic-700','goal-toeic','模試で700点を取る',relative(21),'',-30),m('toeic-750','goal-toeic','TOEIC 750点を取る',monthsFromNow(3),'',-25),
  m('money-10','goal-money','10万円貯める',relative(-32),relative(-30),-42),m('money-15','goal-money','15万円貯める',relative(-5),'',-38),m('money-20','goal-money','20万円貯める',monthsFromNow(6),'',-34),
  m('room-desk','goal-room','机の上を片付ける',relative(1),'',-10),m('room-clothes','goal-room','不要な服を処分する',relative(3),'',-9),m('room-books','goal-room','本棚を整理する',relative(5),'',-8)]
 const habits=[
  {id:'habit-training',name:'筋トレ',goalId:'goal-body',startDate:relative(-90),recurrence:'weekdays',weekdays:[1,3,5],interval:3,weeklyTarget:3,monthlyDay:1},
  {id:'habit-english',name:'英語学習',goalId:'goal-toeic',startDate:relative(-90),recurrence:'daily',weekdays:[],interval:3,weeklyTarget:7,monthlyDay:1},
  {id:'habit-research',name:'研究',goalId:null,startDate:relative(-90),recurrence:'weekdays',weekdays:[1,2,3,4,5],interval:3,weeklyTarget:5,monthlyDay:1},
  {id:'habit-sunscreen',name:'日焼け止め',goalId:null,startDate:relative(-90),recurrence:'daily',weekdays:[],interval:3,weeklyTarget:7,monthlyDay:1},
  {id:'habit-clean','name':'部屋の掃除',goalId:'goal-room',startDate:relative(-90),recurrence:'weekdays',weekdays:[0],interval:7,weeklyTarget:1,monthlyDay:1},
  {id:'habit-reading',name:'読書',goalId:null,startDate:relative(-90),recurrence:'weekdays',weekdays:[2,4,6],interval:3,weeklyTarget:3,monthlyDay:1}]
 const habitRecords=[]; const add=(habitId,offset,index)=>habitRecords.push({id:`record-${habitId}-${offset}-${index}`,habitId,date:relative(offset),completedAt:`${relative(offset)}T20:00:00`})
 ;[-1,-2,-4,-7,-10,-14,-21,-31,-40].forEach((o,i)=>{add('habit-english',o,i);if(i%2===0)add('habit-sunscreen',o,i);if(i%3===0)add('habit-research',o,i)})
 add('habit-english',0,99); add('habit-sunscreen',0,99); add('habit-training',-2,99); add('habit-research',-2,99); add('habit-reading',-2,99); add('habit-clean',-5,99)
 return {goals,milestones,habits,habitRecords}
}
export const initialData=makeSampleData()
export const habitCompletedOn=(records,id,day=dateKey())=>records.some(r=>r.habitId===id&&r.date===day)
export const weekRange=(day=dateKey())=>{const d=parseDate(day),n=d.getDay()||7;d.setDate(d.getDate()-n+1);const a=dateKey(d);d.setDate(d.getDate()+6);return[a,dateKey(d)]}
export const weeklyCount=(records,id,day=dateKey())=>{const[a,b]=weekRange(day);return records.filter(r=>r.habitId===id&&r.date>=a&&r.date<=b).length}
export const isHabitScheduled=(h,day=dateKey())=>{if(day<(h.startDate||day))return false;const d=parseDate(day);if(h.recurrence==='daily'||h.recurrence==='weekly')return true;if(h.recurrence==='weekdays')return(h.weekdays||[]).includes(d.getDay());if(h.recurrence==='interval')return daysBetween(h.startDate,day)%Math.max(1,Number(h.interval||3))===0;if(h.recurrence==='monthly')return d.getDate()===Number(h.monthlyDay||1);return false}
export const recurrenceLabel=h=>h.recurrence==='daily'?'毎日':h.recurrence==='weekdays'?(h.weekdays||[]).map(i=>weekdays[i]).join('・')+'曜日':h.recurrence==='interval'?`${h.interval||3}日ごと`:h.recurrence==='weekly'?`週${h.weeklyTarget||3}回`:`毎月${h.monthlyDay||1}日`
export const deadlineState=n=>n<0?'past':n<=7?'urgent':n<=30?'soon':'normal'
export const deadlineText=n=>n<0?`期限超過 ${Math.abs(n)}日`:n===0?'今日まで':`あと ${n}日`
export const sortMilestones=ms=>[...ms].sort((a,b)=>a.deadline.localeCompare(b.deadline)||(a.createdAt||'').localeCompare(b.createdAt||''))
