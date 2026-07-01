export default function Layout({ page, navigate, children }) {
  const active = page === 'goal-detail' ? 'goals' : page
  return <div className="app-shell"><main>{children}</main><nav className="bottom-nav" aria-label="メインナビゲーション">
    {[['home','⌂','ホーム'],['goals','◇','目標'],['review','◷','振り返り']].map(([id, icon, label]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => navigate(id)}><span>{icon}</span>{label}</button>)}
  </nav></div>
}
