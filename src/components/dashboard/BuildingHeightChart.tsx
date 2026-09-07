import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buildingsByHeight } from '../../data/analyticsData'
import { Card } from '../common/Card'

export function BuildingHeightChart() {
  return (
    <Card
      title="Buildings by Height"
      subtitle="Distribution of building heights"
      className="h-full"
    >
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={buildingsByHeight} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="range"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{
              background: '#0d1424',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" name="Buildings" fill="#60a5fa" radius={[5, 5, 0, 0]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}