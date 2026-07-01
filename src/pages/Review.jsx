import { useMemo, useState } from 'react'
import { dateKey, formatDate, parseDate, weekRange } from '../data'

const dayLabel = value => new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }).format(parseDate(value))
export default function Review({ habits, habitRecords, milestones }) {
  const [range, setRange] = useState('week')
  const today = dateKey(), monthStart = `${today.slice(0, 7)}-01`, [weekStart] = weekRange(today)
  const monthHabitCount = habitRecords.filter(r => r.date >= monthStart && r.date <= today).length
  const weekHabitCount = habitRecords.filter(r => r.date >= weekStart && r.date <= today).length
  const completed = milestones.filter(m => m.completedAt)
  const monthMilestoneCount = completed.filter(m => m.completedAt.slice(0, 10) >= monthStart && m.completedAt.slice(0, 10) <= today).length
  const events = useMemo(() => {
    const items = [
      ...habitRecords.map(r => ({ id: `h-${r.id}`, date: r.date, type: 'habit', text: habits.find(h => h.id === r.habitId)?.name || '継続行動' })),
      ...completed.map(m => ({ id: `m-${m.id}`, date: m.completedAt.slice(0, 10), type: 'milestone', text: m.content }))
    ]
    const start = range === 'week' ? weekStart : range === 'month' ? monthStart : ''
    return items.filter(e => (!start || e.date >= start) && e.date <= today).sort((a, b) => b.date.localeCompare(a.date))
  }, [range, habits, habitRecords, completed, weekStart, monthStart, today])
  const grouped = events.reduce((map, e) => { (map[e.date] ||= []).push(e); return map }, {})
  return <div className="page review-page"><header className="page-header"><p>YOUR JOURNEY</p><h1>これまでのあゆみ</h1><span>積み重ねた一歩を、ここで振り返れます。</span></header>
    <section className="stats-grid"><div><strong>{weekHabitCount}</strong><span>今週の行動</span></div><div><strong>{monthHabitCount}</strong><span>今月の行動</span></div><div><strong>{monthMilestoneCount}</strong><span>今月の小目標</span></div><div><strong>{completed.length}</strong><span>小目標の合計</span></div></section>
    <div className="range-tabs">{[['week','今週'],['month','今月'],['all','すべて']].map(([id,label]) => <button key={id} className={range === id ? 'active' : ''} onClick={() => setRange(id)}>{label}</button>)}</div>
    <section className="timeline">{Object.entries(grouped).map(([day, dayEvents]) => <article key={day} className="timeline-day"><div className="timeline-date"><span>{dayLabel(day)}</span><i /></div><div className="timeline-events">{dayEvents.map(e => <div key={e.id} className={'timeline-event ' + e.type}><span>{e.type === 'milestone' ? '✦' : '●'}</span><div><strong>{e.type === 'milestone' ? '小目標を達成' : `${e.text}を完了`}</strong>{e.type === 'milestone' && <p>「{e.text}」</p>}</div></div>)}</div></article>)}{!events.length && <div className="empty journey-empty">この期間の記録はまだありません。<br />今日の一歩から、あゆみが始まります。</div>}</section>
  </div>
}
