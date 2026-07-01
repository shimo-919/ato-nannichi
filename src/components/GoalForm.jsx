import { useState } from 'react'
import Modal from './Modal'
import DeadlinePicker from './DeadlinePicker'
export default function GoalForm({goal,onSave,onClose}){const[title,setTitle]=useState(goal?.title||''),[deadline,setDeadline]=useState(goal?.deadline||'');const submit=e=>{e.preventDefault();if(!title.trim()||!deadline)return;onSave({...goal,title:title.trim(),deadline});onClose()};return <Modal title={goal?'目標を編集':'目標を追加'} onClose={onClose}><form onSubmit={submit} className="form-stack"><label>目標名<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="いつまでに何を達成する？" required/></label><DeadlinePicker value={deadline} onChange={setDeadline} kind="goal"/><button className="primary-button" type="submit" disabled={!deadline}>保存する</button></form></Modal>}
