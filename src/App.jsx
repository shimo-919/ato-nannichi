import { useState } from 'react'
import { useAppData } from './hooks/useAppData'
import Layout from './components/Layout'
import GoalForm from './components/GoalForm'
import HabitForm from './components/HabitForm'
import MilestoneForm from './components/MilestoneForm'
import Home from './pages/Home'
import Goals from './pages/Goals'
import GoalDetail from './pages/GoalDetail'
import Review from './pages/Review'
export default function App(){
 const data=useAppData(),[page,setPage]=useState('home'),[goalId,setGoalId]=useState(''),[modal,setModal]=useState(null)
 const navigate=p=>{setPage(p);window.scrollTo({top:0,behavior:'smooth'})},openGoal=id=>{setGoalId(id);navigate('goal-detail')},goal=data.goals.find(g=>g.id===goalId)
 const editHabit=(habit,lockGoal=false)=>setModal({type:'habit',item:habit,goalId:habit.goalId||'',lockGoal})
 const deleteHabit=habit=>{if(confirm(`「${habit.name}」を削除しますか？\n過去の完了履歴も削除されます。`))data.deleteHabit(habit.id)}
 const common={...data,onOpenGoal:openGoal,onToggleHabit:data.toggleHabit,onEditHabit:editHabit,onDeleteHabit:deleteHabit}
 let content=<Home {...common} onAddHabit={()=>setModal({type:'habit'})}/>
 if(page==='goals')content=<Goals {...common} onAdd={()=>setModal({type:'goal'})} onRestoreSamples={data.restoreSamples} onResetAll={data.resetAll}/>
 if(page==='review')content=<Review {...common}/>
 if(page==='goal-detail'&&goal)content=<GoalDetail {...common} goal={goal} onSaveGoal={data.saveGoal} onEditHabit={habit=>editHabit(habit,true)} onBack={()=>navigate('goals')} onEdit={()=>setModal({type:'goal',item:goal})} onDelete={()=>{if(confirm('この目標を削除しますか？')){data.deleteGoal(goal.id);navigate('goals')}}} onAddMilestone={()=>setModal({type:'milestone',goalId:goal.id})} onEditMilestone={item=>setModal({type:'milestone',goalId:goal.id,item})} onAddHabit={()=>setModal({type:'habit',goalId:goal.id,lockGoal:true})}/>
 return <Layout page={page} navigate={navigate}>{content}{modal?.type==='goal'&&<GoalForm goal={modal.item} onSave={data.saveGoal} onClose={()=>setModal(null)}/>} {modal?.type==='milestone'&&<MilestoneForm milestone={modal.item} goalId={modal.goalId} onSave={data.saveMilestone} onClose={()=>setModal(null)}/>} {modal?.type==='habit'&&<HabitForm habit={modal.item} goals={data.goals} defaultGoalId={modal.goalId} lockGoal={modal.lockGoal} onSave={data.saveHabit} onClose={()=>setModal(null)}/>}</Layout>
}
