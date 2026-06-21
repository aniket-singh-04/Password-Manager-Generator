export function StatCard({ label, value, icon: Icon, color = 'var(--primary)' }) {
  return (
    <div className="metric-card rounded-lg p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden border border-white/15" style={{ '--metric-color': color }}>
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white/85">{label}</p>
          {Icon ? <Icon size={24} className="text-white/55" /> : null}
        </div>
        <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
      </div>
    </div>
  );
}
