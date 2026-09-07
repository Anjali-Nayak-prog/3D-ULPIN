import { PageHeader } from '../components/layout/PageHeader'
import { dashboardStats } from '../data/dashboardData'
import { StatCard } from '../components/dashboard/StatCard'
import { CityOverview } from '../components/dashboard/CityOverview'
import { PropertyStatus } from '../components/dashboard/PropertyStatus'
import { PropertyDistribution } from '../components/dashboard/PropertyDistribution'
import { BuildingHeightChart } from '../components/dashboard/BuildingHeightChart'
import { DistrictRanking } from '../components/dashboard/DistrictRanking'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { AlertsPanel } from '../components/dashboard/AlertsPanel'
import { QuickActions } from '../components/dashboard/QuickActions'
import { SystemStatus } from '../components/dashboard/SystemStatus'
import { useDashboard } from '../hooks/useDashboard'
import { SkeletonCard } from '../components/common/Loading'
import { Button } from '../components/common/Button'
import { FileDown, RefreshCw } from 'lucide-react'
import { useToast } from '../components/common/Toast'

export function Dashboard() {
  const { stats, activities, alerts, systemServices, loading } = useDashboard()
  const toast = useToast()

  const statsSafe = stats.length > 0 ? stats : dashboardStats

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your 3D cadastral system."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info('Refreshing', 'Dashboard data is up to date')}
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
        <Button size="sm" onClick={() => toast.success('Report queued', 'The weekly cadastral digest will be emailed shortly')}>
          <FileDown size={14} />
          Download Summary
        </Button>
      </PageHeader>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} rows={2} />
            ))}
          </div>
          <SkeletonCard rows={5} />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {statsSafe.map((stat, index) => (
              <StatCard key={stat.id} stat={stat} index={index} />
            ))}
          </section>

          <section>
            <CityOverview />
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
            <PropertyStatus />
            <PropertyDistribution />
            <BuildingHeightChart />
            <DistrictRanking />
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <QuickActions />
            </div>
            <SystemStatus services={systemServices} />
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <RecentActivity activities={activities} />
            <AlertsPanel alerts={alerts} />
          </section>
        </>
      )}
    </div>
  )
}
