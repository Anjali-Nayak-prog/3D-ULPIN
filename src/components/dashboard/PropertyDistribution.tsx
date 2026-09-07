import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { propertyDistribution } from '../../data/analyticsData'
import { Card } from '../common/Card'

export function PropertyDistribution() {
  return (
    <Card
      title="Property Distribution"
      subtitle="Land-use composition of the corpus"
      className="h-full"
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={propertyDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={3}
              strokeWidth={0}
            >
              {propertyDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#0d1424',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(value) => [`${value ?? 0}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-white">124.5K</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Units</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {propertyDistribution.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-sm" style={{ background: item.color }} />
              {item.name}
            </span>
            <span className="font-medium text-slate-400">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}