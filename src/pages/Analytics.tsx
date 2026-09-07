import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import {
  buildingsByHeight,
  conflictTrend,
  ownershipStatus,
  propertiesByDistrict,
  propertiesByType,
  undergroundDistribution,
  ulpinGenerationTrend,
  verticalDevelopment,
} from '../data/analyticsData'
import { PROPERTY_TYPE_HEX } from '../utils/constants'
import { cn } from '../utils/helpers'

const axisTick = { fill: '#64748b', fontSize: 10 }
const gridStroke = 'rgba(255,255,255,0.05)'

export function Analytics() {
  const totals = useMemo(() => {
    const byType = propertiesByType.reduce((acc, d) => acc + d.count, 0)
    const asUnits = 18_492
    const underground = undergroundDistribution.reduce((acc, d) => acc + d.value, 0)
    return { byType, asUnits, underground }
  }, [])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        subtitle="Cadastral intelligence: trends, distribution and volumetric growth"
      >
        <span className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
          <TrendingUp size={14} />
          Verticals growing 9.1% YoY
        </span>
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryStat label="Total Parcels" value={String(totals.byType + totals.asUnits).replace(/\B(?=(\d{2})+$)/g, ',')} sub="across surface & underground" />
        <SummaryStat label="Registered Units" value={`${totals.asUnits.toLocaleString('en-IN')}`} sub="apartments & occupancies" />
        <SummaryStat label="Underground Length" value={`${(totals.underground * 0.42).toFixed(1)} km`} sub="pipelines, ducts & tunnels" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Total Parcels by Type" subtitle="All registered vertical parcels">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertiesByType} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={40} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {propertiesByType.map((entry) => (
                    <Cell key={entry.type} fill={PROPERTY_TYPE_HEX[entry.type]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Buildings by Height Band" subtitle="Distribution of structure heights">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingsByHeight} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="range" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Vertical Development Trend" subtitle="Buildings and cumulative volumetric share">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={verticalDevelopment} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBuildings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={axisTick} axisLine={false} tickLine={false} unit="M m³" />
                <Tooltip content={<ChartTooltip />} />
                <Area yAxisId="left" type="monotone" dataKey="buildings" stroke="#60a5fa" strokeWidth={2} fill="url(#gradBuildings)" name="Buildings" />
                <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#c084fc" strokeWidth={2} dot={false} name="Volume (M m³)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Underground Asset Distribution" subtitle="Utility & transport networks below surface">
          <div className="flex h-72 items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={undergroundDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="none"
                >
                  {undergroundDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" formatter={(value: string) => <LegendLabel label={value} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Ownership Status" subtitle="Verification state of the register">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ownershipStatus} dataKey="count" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {ownershipStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_HEX[entry.status]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" formatter={(value: string) => <LegendLabel label={value} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Conflicts Detected vs Resolved" subtitle="Conflict lifecycle tracking">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conflictTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradDetected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="detected" stroke="#f87171" strokeWidth={2} fill="url(#gradDetected)" name="Detected" />
                <Area type="monotone" dataKey="resolved" stroke="#34d399" strokeWidth={2} fill="url(#gradResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DeltaStat label="Detected (last 6m)" value="152" delta="+18" up />
            <DeltaStat label="Resolved (last 6m)" value="131" delta="+20" up />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="ULPIN Generation Volume" subtitle="Issued volumetric identifiers per month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ulpinGenerationTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={{ r: 2, fill: '#34d399' }} name="ULPINs issued" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top Districts by Volume" subtitle="Registered parcels by district">
          <div className="h-64 space-y-2.5 overflow-y-auto pr-1">
            {propertiesByDistrict.map((row, index) => (
              <div key={row.district} className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="font-mono text-[10px] text-slate-600">{String(index + 1).padStart(2, '0')}</span>
                    {row.district}
                  </span>
                  <span className="font-mono font-semibold text-slate-200">{row.count.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                    style={{ width: `${(row.count / propertiesByDistrict[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

const STATUS_HEX: Record<string, string> = {
  verified: '#34d399',
  pending: '#f59e0b',
  new: '#38bdf8',
  conflict: '#f87171',
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number | string; color?: string; fill?: string }>; label?: string | number }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border border-white/10 bg-navy-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1 font-semibold text-slate-200">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-1.5 py-0.5 text-slate-400">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: entry.color ?? entry.fill }} />
          <span className="mr-2">{entry.name}</span>
          <span className="font-mono font-semibold text-white">{typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}</span>
        </p>
      ))}
    </div>
  )
}

function LegendLabel({ label }: { label: string }) {
  return <span className="text-[11px] text-slate-400">{label}</span>
}

function SummaryStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-navy-900/70 px-4 py-3.5">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
      <p className="text-[10px] text-slate-600">{sub}</p>
    </div>
  )
}

function DeltaStat({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
      <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', up ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300')}>
        {delta}
      </span>
    </div>
  )
}