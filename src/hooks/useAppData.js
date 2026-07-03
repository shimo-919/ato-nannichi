import { useEffect, useState } from 'react'
import { dateKey, initialData, makeSampleData, uid } from '../data'

const KEY = 'ato-nannichi-data-v1'

const migrate = saved => {
  if (!saved || typeof saved !== 'object') return initialData
  const goals = (saved.goals || []).filter(g => g?.title && g?.deadline).map(g => ({ id: g.id || uid(), title: g.title, deadline: g.deadline, photos: Array.isArray(g.photos) ? g.photos.slice(0, 5) : [], progressMarker: g.progressMarker || '🌱', createdAt: g.createdAt || dateKey() }))
  const milestones = (saved.milestones || []).filter(m => m?.goalId && (m.content || m.title)).map(m => ({ id: m.id || uid(), goalId: m.goalId, content: m.content || m.title, deadline: m.deadline || '', completedAt: m.completedAt || '', createdAt: m.createdAt || dateKey() }))
  const habits = (saved.habits || []).filter(h => h?.name || h?.title).map(h => { const { completions, ...rest } = h; return { ...rest, name: h.name || h.title, id: h.id || uid(), goalId: h.goalId || null, startDate: h.startDate || dateKey(), recurrence: h.recurrence || 'daily', weekdays: h.weekdays || [], interval: Number(h.interval || h.intervalDays || 3), weeklyTarget: Number(h.weeklyTarget || 3), monthlyDay: Number(h.monthlyDay || h.monthDay || 1) } })
  const oldRecords = saved.habitRecords || saved.records || []
  const habitRecords = oldRecords.filter(r => !r.type || r.type === 'habit').map(r => ({ id: r.id || uid(), habitId: r.habitId || r.actionId, date: r.date, completedAt: r.completedAt || r.createdAt || r.date })).filter(r => r.habitId && r.date)
  for (const h of saved.habits || []) for (const day of h.completions || []) if (!habitRecords.some(r => r.habitId === h.id && r.date === day)) habitRecords.push({ id: uid(), habitId: h.id, date: day, completedAt: day })
  return { goals, milestones, habits, habitRecords }
}

export function useAppData() {
  const [data, setData] = useState(() => { try { const raw = localStorage.getItem(KEY); return raw === null ? initialData : migrate(JSON.parse(raw)) } catch { return initialData } })
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(data)), [data])
  const upsert = (key, item) => setData(d => ({ ...d, [key]: d[key].some(x => x.id === item.id) ? d[key].map(x => x.id === item.id ? item : x) : [...d[key], item] }))
  const saveGoal = goal => upsert('goals', { ...goal, id: goal.id || uid(), createdAt: goal.createdAt || dateKey() })
  const deleteGoal = id => setData(d => ({ ...d, goals: d.goals.filter(g => g.id !== id), milestones: d.milestones.filter(m => m.goalId !== id), habits: d.habits.map(h => h.goalId === id ? { ...h, goalId: null } : h) }))
  const saveMilestone = m => upsert('milestones', { ...m, id: m.id || uid(), completedAt: m.completedAt || '', createdAt: m.createdAt || dateKey() })
  const deleteMilestone = id => setData(d => ({ ...d, milestones: d.milestones.filter(m => m.id !== id) }))
  const toggleMilestone = (id, day = dateKey()) => setData(d => ({ ...d, milestones: d.milestones.map(m => m.id === id ? { ...m, completedAt: m.completedAt ? '' : day } : m) }))
  const saveHabit = h => upsert('habits', { ...h, id: h.id || uid(), createdAt: h.createdAt || dateKey() })
  const deleteHabit = id => setData(d => ({ ...d, habits: d.habits.filter(h => h.id !== id), habitRecords: d.habitRecords.filter(r => r.habitId !== id) }))
  const toggleHabit = (habitId, day = dateKey()) => setData(d => { const found = d.habitRecords.find(r => r.habitId === habitId && r.date === day); return { ...d, habitRecords: found ? d.habitRecords.filter(r => r.id !== found.id) : [...d.habitRecords, { id: uid(), habitId, date: day, completedAt: new Date().toISOString() }] } })
  const restoreSamples = () => setData(makeSampleData())
  const resetAll = () => setData({ goals: [], milestones: [], habits: [], habitRecords: [] })
  return { ...data, saveGoal, deleteGoal, saveMilestone, deleteMilestone, toggleMilestone, saveHabit, deleteHabit, toggleHabit, restoreSamples, resetAll }
}
