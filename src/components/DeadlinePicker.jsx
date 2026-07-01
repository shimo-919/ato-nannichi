import { useEffect, useMemo, useState } from 'react'
import { dateKey, daysBetween, deadlineState, deadlineText, formatDate, parseDate } from '../data'

const addMonths = count => { const d = new Date(); d.setMonth(d.getMonth() + count); return dateKey(d) }
const addDays = count => { const d = new Date(); d.setDate(d.getDate() + count); return dateKey(d) }
const monthEnd = offset => { const d = new Date(); return dateKey(new Date(d.getFullYear(), d.getMonth() + offset + 1, 0)) }
const yearEnd = () => `${new Date().getFullYear()}-12-31`
const graduation = () => { const d = new Date(), year = d.getMonth() >= 3 ? d.getFullYear() + 1 : d.getFullYear(); return `${year}-03-31` }
const daysInMonth = (year, month) => new Date(year, month, 0).getDate()

export default function DeadlinePicker({ value, onChange, kind = 'goal' }) {
  const [open, setOpen] = useState(false), [mode, setMode] = useState('date')
  const initial = value || addDays(30), [year, month, day] = initial.split('-').map(Number)
  const [parts, setParts] = useState({ year, month, day }), [afterDays, setAfterDays] = useState(Math.max(1, daysBetween(dateKey(), initial)))
  useEffect(() => { if (!open) return; const v = value || addDays(30), [y, m, d] = v.split('-').map(Number); setParts({ year: y, month: m, day: d }); setAfterDays(Math.max(1, daysBetween(dateKey(), v))) }, [open, value])
  const selected = useMemo(() => `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(Math.min(parts.day, daysInMonth(parts.year, parts.month))).padStart(2, '0')}`, [parts])
  const preview = mode === 'date' ? selected : addDays(Math.max(1, Number(afterDays) || 1))
  const left = daysBetween(dateKey(), preview)
  const setPart = (key, number) => setParts(p => ({ ...p, [key]: number, day: key === 'day' ? number : Math.min(p.day, daysInMonth(key === 'year' ? number : p.year, key === 'month' ? number : p.month)) }))
  const quicks = kind === 'goal' ? [['3か月後', () => addMonths(3)], ['半年後', () => addMonths(6)], ['年末', yearEnd], ['1年後', () => addMonths(12)], ['卒業まで', graduation]] : [['1週間後', () => addDays(7)], ['2週間後', () => addDays(14)], ['今月末', () => monthEnd(0)], ['来月末', () => monthEnd(1)], ['3か月後', () => addMonths(3)]]
  const chooseQuick = fn => { const result = fn(), diff = Math.max(1, daysBetween(dateKey(), result)); setAfterDays(diff) }
  const switchMode = nextMode => { if (nextMode === 'days') setAfterDays(Math.max(1, daysBetween(dateKey(), selected))); else { const v = addDays(Math.max(1, Number(afterDays) || 1)), [y, m, d] = v.split('-').map(Number); setParts({ year: y, month: m, day: d }) } setMode(nextMode) }
  const confirm = () => { onChange(preview); setOpen(false) }
  return <>
    <button type="button" className="deadline-trigger" onClick={() => setOpen(true)}><span>期限</span>{value ? <><strong>{formatDate(value)}まで</strong><b className={deadlineState(daysBetween(dateKey(), value))}>{deadlineText(daysBetween(dateKey(), value))}</b></> : <strong>期限を選ぶ</strong>}<i>›</i></button>
      {open && <div className="deadline-backdrop" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}><section className="deadline-sheet"><div className="sheet-handle"/><header><h3>期限を決める</h3><button type="button" onClick={() => setOpen(false)}>×</button></header><div className="deadline-tabs"><button type="button" className={mode === 'date' ? 'active' : ''} onClick={() => switchMode('date')}>日付で決める</button><button type="button" className={mode === 'days' ? 'active' : ''} onClick={() => switchMode('days')}>あと何日で決める</button></div>
      {mode === 'date' ? <div className="date-selectors"><label>年<select value={parts.year} onChange={e => setPart('year', Number(e.target.value))}>{Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - 1 + i).map(y => <option key={y}>{y}</option>)}</select></label><label>月<select value={parts.month} onChange={e => setPart('month', Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m}>{m}</option>)}</select></label><label>日<select value={Math.min(parts.day, daysInMonth(parts.year, parts.month))} onChange={e => setPart('day', Number(e.target.value))}>{Array.from({ length: daysInMonth(parts.year, parts.month) }, (_, i) => i + 1).map(d => <option key={d}>{d}</option>)}</select></label></div> : <div className="days-mode"><div className="quick-options">{quicks.map(([label, fn]) => <button type="button" key={label} onClick={() => chooseQuick(fn)}>{label}</button>)}</div><label className="days-input"><input type="number" min="1" step="1" value={afterDays} onChange={e => setAfterDays(Math.max(1, Math.floor(Number(e.target.value) || 1)))} /><span>日後まで</span></label></div>}
      <div className="deadline-preview"><span>{formatDate(preview)}まで</span><strong className={deadlineState(left)}>{deadlineText(left)}</strong></div><button type="button" className="primary-button sheet-confirm" onClick={confirm}>この期限にする</button>
    </section></div>}
  </>
}
