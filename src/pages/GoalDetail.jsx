import { daysLeft, deadlineState, deadlineText, formatDate, sortMilestones } from '../data'

export default function GoalDetail({ goal, milestones, toggleMilestone, onBack, onEdit, onDelete, onAddMilestone, onEditMilestone }) {
  const journey = sortMilestones(milestones.filter(m => m.goalId === goal.id))
  const completedCount = journey.filter(m => m.completedAt).length
  const next = journey.find(m => !m.completedAt)
  const goalLeft = daysLeft(goal.deadline)
  return <div className="page goal-detail-page">
    <button className="back-button" onClick={onBack}>← 目標一覧</button>
    <header className="detail-hero"><span className="eyebrow">GOAL</span><h1>{goal.title}</h1><p>期限　{formatDate(goal.deadline)}</p><div className={'countdown huge ' + deadlineState(goalLeft)}>{deadlineText(goalLeft)}</div><div className="detail-achievement">小目標 <strong>{completedCount} / {journey.length}</strong> 達成</div></header>
    {next && <section className="featured-next"><span>次の小目標</span><strong>{next.content}</strong><div><small>{formatDate(next.deadline)}</small><b className={deadlineState(daysLeft(next.deadline))}>{deadlineText(daysLeft(next.deadline))}</b></div></section>}
    <section className="section journey-section"><div className="section-heading"><div><span className="eyebrow">MILESTONES</span><h2>小目標の道のり</h2></div><button className="text-button" onClick={onAddMilestone}>＋ 追加</button></div>
      {journey.length ? <div className="milestone-journey">{journey.map(m => {
        const done = Boolean(m.completedAt), isNext = next?.id === m.id, left = daysLeft(m.deadline), overdue = !done && left < 0
        return <article className={`journey-milestone ${done ? 'completed' : ''} ${isNext ? 'next' : ''} ${overdue ? 'overdue' : ''}`} key={m.id}>
          <button className="journey-dot" onClick={() => toggleMilestone(m.id)} aria-label={done ? '達成を取り消す' : '達成にする'}>{done ? '✦' : ''}</button>
          <div className="journey-content">{isNext && <span className="next-badge">NEXT</span>}<button className="milestone-edit" onClick={() => onEditMilestone(m)} aria-label="小目標を編集">編集</button><strong>{m.content}</strong><span className="journey-deadline">期限　{formatDate(m.deadline)}</span>{done ? <p className="completed-date">{formatDate(m.completedAt.slice(0, 10))}に達成　<span>✦</span></p> : <div className="journey-days"><b className={deadlineState(left)}>{deadlineText(left)}</b>{overdue && <small>期限を過ぎています</small>}</div>}</div>
        </article>
      })}</div> : <div className="empty">小目標を追加すると、ここに道のりができます。</div>}
    </section>
    <div className="danger-zone"><button onClick={onEdit}>目標を編集</button><button className="danger" onClick={onDelete}>目標を削除</button></div>
  </div>
}
