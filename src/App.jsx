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

export default function App() {
  const data = useAppData()
  const [page, setPage] = useState('home')
  const [goalId, setGoalId] = useState('')
  const [modal, setModal] = useState(null)
  const navigate = p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openGoal = id => { setGoalId(id); navigate('goal-detail') }
  const goal = data.goals.find(g => g.id === goalId)
  const common = { ...data, onOpenGoal: openGoal, onToggleHabit: data.toggleHabit }
  let content = <Home {...common} onAddHabit={() => setModal({ type: 'habit' })} />
  if (page === 'goals') content = <Goals {...common} onAdd={() => setModal({ type: 'goal' })} />
  if (page === 'review') content = <Review {...common} />
  if (page === 'goal-detail' && goal) content = <GoalDetail {...common} goal={goal} onBack={() => navigate('goals')} onEdit={() => setModal({ type: 'goal', item: goal })} onDelete={() => { if (confirm('この目標を削除しますか？')) { data.deleteGoal(goal.id); navigate('goals') } }} onAddMilestone={() => setModal({ type: 'milestone', goalId: goal.id })} onEditMilestone={item => setModal({ type: 'milestone', goalId: goal.id, item })} onAddHabit={() => setModal({ type: 'habit', goalId: goal.id })} />
  return <Layout page={page} navigate={navigate}>{content}
    {modal?.type === 'goal' && <GoalForm goal={modal.item} onSave={data.saveGoal} onClose={() => setModal(null)} />}
    {modal?.type === 'milestone' && <MilestoneForm milestone={modal.item} goalId={modal.goalId} onSave={data.saveMilestone} onClose={() => setModal(null)} />}
    {modal?.type === 'habit' && <HabitForm goals={data.goals} defaultGoalId={modal.goalId} onSave={data.saveHabit} onClose={() => setModal(null)} />}
  </Layout>
}
