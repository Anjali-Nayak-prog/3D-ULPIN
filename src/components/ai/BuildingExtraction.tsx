import { ScanSearch } from 'lucide-react'
import { Card } from '../common/Card'

const detections = [
  { id: 1, x: 10, y: 14, w: 22, h: 30, conf: 97.2, label: 'Tower A' },
  { id: 2, x: 40, y: 22, w: 16, h: 24, conf: 91.8, label: 'Block-C' },
  { id: 3, x: 64, y: 10, w: 18, h: 40, conf: 95.6, label: 'Skyline' },
  { id: 4, x: 30, y: 56, w: 24, h: 20, conf: 88.4, label: 'Warehouse' },
  { id: 5, x: 78, y: 60, w: 14, h: 26, conf: 93.1, label: 'Tower B' },
]

export function BuildingExtraction() {
  return (
    <Card
      title="Building Extraction"
      subtitle="AI rooftop detection from drone orthomosaic"
      className="h-full"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-navy-950/70">
        <svg viewBox="0 0 100 90" className="h-52 w-full">
          <defs>
            <pattern id="grid-bx" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(96,165,250,0.08)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="90" fill="url(#grid-bx)" />
          <polygon points="20,70 45,66 50,88 25,90" fill="#1e3a5f" opacity="0.5" />
          <polygon points="55,72 78,64 82,86 60,90" fill="#1e3a5f" opacity="0.45" />
          {detections.map((d) => (
            <g key={d.id}>
              <rect
                x={d.x}
                y={d.y}
                width={d.w}
                height={d.h}
                fill="none"
                stroke="#c084fc"
                strokeWidth={0.7}
                strokeDasharray="2 1.5"
                rx={1}
              />
              <circle cx={d.x} cy={d.y} r={0.9} fill="#e9d5ff" />
              <text x={d.x + 0.6} y={d.y - 1.2} fontSize={2.6} fill="#ddb6fe">
                {d.conf}%
              </text>
              <text x={d.x + d.w / 2} y={d.y + d.h + 3} fontSize={2.4} fill="rgba(226,232,240,0.6)" textAnchor="middle">
                {d.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-slate-400">Mean detection confidence</span>
            <span className="font-semibold text-purple-300">94.2%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <div className="h-full w-[94.2%] rounded-full bg-gradient-to-r from-purple-600 to-purple-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[11px] text-slate-400">
          <ScanSearch size={14} className="shrink-0 text-purple-400" />
          Extracted {detections.length} buildings from 1,240 ortho tiles · min confidence threshold 85%
        </div>
      </div>
    </Card>
  )
}