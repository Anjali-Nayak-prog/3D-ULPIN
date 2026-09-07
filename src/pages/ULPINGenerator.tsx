import { PageHeader } from '../components/layout/PageHeader'
import { ULPINForm } from '../components/ulpin/ULPINForm'
import { Badge } from '../components/common/Badge'

export function ULPINGenerator() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="ULPIN - 3D Generator"
        subtitle="Issue volumetric Unique Land Parcel Identification Numbers"
      >
        <Badge tone="purple" dot>
          Spatial engine v4
        </Badge>
      </PageHeader>
      <ULPINForm />
    </div>
  )
}