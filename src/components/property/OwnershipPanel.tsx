import { FileCheck2, Landmark, User2 } from 'lucide-react'
import type { Property } from '../../types/property'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'

interface OwnershipPanelProps {
  property: Property
}

const verifyToneMap: Record<string, 'green' | 'amber' | 'red' | 'blue'> = {
  verified: 'green',
  pending: 'amber',
  conflict: 'red',
  new: 'blue',
}

const verifyLabelMap: Record<string, string> = {
  verified: 'Verified',
  pending: 'Pending',
  conflict: 'Conflict',
  new: 'New',
}

export function OwnershipPanel({ property }: OwnershipPanelProps) {
  const owner = property.owner

  return (
    <Card
      title="Ownership"
      subtitle="Registered legal entity"
      className="h-full"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100/50 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/15">
            <User2 size={20} className="text-primary-600" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{owner.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{owner.ownershipType}</p>
            {owner.cidNumber && (
              <p className="mt-0.5 font-mono text-[11px] text-slate-600">{owner.cidNumber}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <FileCheck2 size={14} className="text-slate-500" />
            Verification status
          </span>
          <Badge tone={verifyToneMap[owner.verificationStatus] ?? 'slate'} dot>
            {verifyLabelMap[owner.verificationStatus] ?? owner.verificationStatus}
          </Badge>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100/50 px-3 py-2.5 text-xs text-slate-500">
          <Landmark size={14} className="shrink-0 text-slate-500" />
          Ownership type sanctioned under Maharashtra Land Revenue Code
        </div>

        {owner.coOwners && owner.coOwners.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Co-owners
            </p>
            <div className="space-y-1.5">
              {owner.coOwners.map((co, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500"
                >
                  <User2 size={13} className="text-slate-600" />
                  {co}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}