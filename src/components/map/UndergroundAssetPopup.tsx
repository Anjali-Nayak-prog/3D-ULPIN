import { X } from 'lucide-react'
import type { UndergroundAsset } from '../../types/map'
import { UG_KIND_NAMES, ugSpatialId } from '../../utils/underground'

export function UndergroundAssetPopup({
  asset,
  onClose,
  className = '',
}: {
  asset: UndergroundAsset
  onClose: () => void
  className?: string
}) {
  const typeName = UG_KIND_NAMES[asset.kind]
  const statusCls =
    asset.status === 'verified'
      ? 'bg-emerald-500/10 text-emerald-700'
      : asset.status === 'conflict'
        ? 'bg-red-500/10 text-red-700'
        : asset.status === 'pending'
          ? 'bg-amber-500/10 text-amber-700'
          : 'bg-sky-500/10 text-sky-700'

  return (
    <div className={`pointer-events-auto rounded-xl border border-violet-500/30 bg-white p-4 shadow-2xl ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600">Underground Asset</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{asset.name}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close asset information"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-3 space-y-1.5 text-[11px]">
        <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
          <span className="text-slate-500">Pipeline ID</span>
          <span className="font-mono text-slate-800">{asset.id}</span>
        </div>
        <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
          <span className="text-slate-500">Type</span>
          <span className="font-semibold text-slate-800">{typeName}</span>
        </div>
        <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
          <span className="text-slate-500">Elevation</span>
          <span className="font-mono text-slate-800">−{asset.depth} m MSL</span>
        </div>
        <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
          <span className="text-slate-500">Status</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusCls}`}>
            {asset.status}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">3D Spatial ID</span>
          <span className="font-mono text-primary-600">{ugSpatialId(asset)}</span>
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-slate-100/70 px-2.5 py-2 text-[10px] leading-relaxed text-slate-500">
        Illustrative prototype data — not a real cadastral record.
      </p>
    </div>
  )
}