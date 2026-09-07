const checks = [
  { name: 'Horizontal Topology', total: '4,182', passed: '4,148', rate: 99.2, tone: 'emerald' },
  { name: 'Vertical Topology', total: '2,904', passed: '2,871', rate: 98.9, tone: 'emerald' },
  { name: 'Boundary Integrity', total: '3,560', passed: '3,512', rate: 98.7, tone: 'emerald' },
  { name: 'Utility Clearance', total: '1,240', passed: '1,216', rate: 98.1, tone: 'amber' },
  { name: 'Ownership Consistency', total: '5,231', passed: '5,207', rate: 99.5, tone: 'emerald' },
]

export function TopologyStatus() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-navy-900/70 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Topology Status</h3>
          <p className="mt-0.5 text-xs text-slate-500">Live integrity of the volumetric graph</p>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
          Overall 98.8%
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {checks.map((check) => (
          <div key={check.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">{check.name}</span>
              <span className="font-mono text-[11px] text-slate-500">{check.passed}/{check.total}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className={`h-full rounded-full ${check.tone === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${check.rate}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[10px] text-slate-600">{check.rate}% pass rate</p>
          </div>
        ))}
      </div>
    </div>
  )
}