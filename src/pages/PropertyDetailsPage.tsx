import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { SkeletonCard } from '../components/common/Loading'
import { PropertyDetails } from '../components/property/PropertyDetails'
import { Property3DPreview } from '../components/property/Property3DPreview'
import { SpatialInfo } from '../components/property/SpatialInfo'
import { OwnershipPanel } from '../components/property/OwnershipPanel'
import { DataProvenance } from '../components/property/DataProvenance'
import { getPropertyById } from '../services/propertyService'
import type { Property } from '../types/property'

export function PropertyDetailsPage() {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    getPropertyById(id)
      .then((p) => {
        if (mounted) {
          setProperty(p)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setProperty(null)
          setLoading(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title="Property Details" subtitle="Loading registered vertical property…" />
        <SkeletonCard rows={8} />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="space-y-5">
        <PageHeader title="Property Details" subtitle="Registered vertical property" />
        <Card padding="lg">
          <EmptyState
            title="Property not found"
            description={`No record exists with id “${id ?? ''}”. It may have been merged or removed.`}
            actionLabel="Back to search"
            onAction={() => navigate('/properties')}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={property.name}
        subtitle={`${property.ulpin} · ${property.address}`}
      >
        <Link to="/properties">
          <Button variant="outline" size="sm">
            <ArrowLeft size={14} />
            Back to search
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Export PDF
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Property3DPreview property={property} />
          <PropertyDetails property={property} />
        </div>
        <div className="space-y-5">
          <OwnershipPanel property={property} />
          <SpatialInfo property={property} />
          <DataProvenance property={property} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link to="/properties">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={14} />
            Back to search
          </Button>
        </Link>
        {property.floors && property.floors.length > 0 && (
          <Link to={`/ulpin-generator`}>
            <Button size="sm" variant="outline">
              Generate renewal ULPIN
              <ArrowRight size={14} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}