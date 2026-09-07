import { useState } from 'react'
import { Bell, Database, Globe, Lock, Save, Server } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { useToast } from '../components/common/Toast'
import { cn } from '../utils/helpers'

interface SettingsSection {
  id: string
  title: string
  description: string
  icon: typeof Globe
}

const sections: SettingsSection[] = [
  { id: 'spatial', title: 'Spatial Services', description: 'EPSG, elevation datum & tile services', icon: Globe },
  { id: 'validation', title: 'Validation Engine', description: 'Tolerance and rule thresholds', icon: Database },
  { id: 'ai', title: 'AI Models', description: 'Inference endpoints and confidence limits', icon: Server },
  { id: 'notifications', title: 'Notifications', description: 'Alert channels and cadence', icon: Bell },
  { id: 'security', title: 'Security', description: '2FA, sessions and audit retention', icon: Lock },
]

export function SystemSettings() {
  const toast = useToast()
  const [active, setActive] = useState('spatial')

  const save = () => toast.success('Settings saved', 'Configuration persisted to the registry.')

  return (
    <div className="space-y-5">
      <PageHeader title="System Settings" subtitle="Configure the cadastral engine, validation and security rules" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="space-y-1.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActive(section.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-150',
                active === section.id
                  ? 'border-primary-400/40 bg-primary-500/10 shadow-glow-sm'
                  : 'border-white/[0.06] bg-navy-900/50 hover:border-white/[0.12]',
              )}
            >
              <section.icon size={16} className={active === section.id ? 'text-primary-400' : 'text-slate-500'} />
              <div>
                <p className={cn('text-xs font-medium', active === section.id ? 'text-primary-300' : 'text-slate-200')}>
                  {section.title}
                </p>
                <p className="mt-0.5 text-[10px] leading-3.5 text-slate-600">{section.description}</p>
              </div>
            </button>
          ))}
        </div>

        <Card className="lg:col-span-3" title={sections.find((s) => s.id === active)?.title} subtitle={sections.find((s) => s.id === active)?.description}>
          <div className="space-y-4">
            {active === 'spatial' && (
              <>
                <SettingRow label="Coordinate Reference System" hint="EPSG:4326 with geoid undulation correction">
                  <Badge tone="blue">EPSG:4326</Badge>
                </SettingRow>
                <SettingRow label="Vertical Datum" hint="MSL referenced to GTS benchmark 2020">
                  <Badge tone="cyan">GIS / MSL</Badge>
                </SettingRow>
                <SettingRow label="Elevation Interpolation" hint="Bilinear with NGH correction">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>Bilinear + NGH</option>
                    <option>Nearest neighbour</option>
                    <option>TIN surfaces</option>
                  </select>
                </SettingRow>
                <SettingRow label="Tile Cache TTL" hint="Stale tiles regenerated after expiry">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>12 hours</option>
                    <option>24 hours</option>
                    <option>7 days</option>
                  </select>
                </SettingRow>
              </>
            )}

            {active === 'validation' && (
              <>
                <SettingRow label="Boundary Tolerance" hint="Maximum deviation from surveyed truth">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>± 0.5 m</option>
                    <option>± 1.0 m</option>
                    <option>± 2.0 m</option>
                  </select>
                </SettingRow>
                <SettingRow label="Vertical Overlap Block" hint="Auto-flag overlapping vertical volumes">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Auto-resolve Identical Geometry" hint="Merge duplicate registered volumes">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Confidence Threshold" hint="Below this, AI results require human review">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>85%</option>
                    <option>90%</option>
                    <option>95%</option>
                  </select>
                </SettingRow>
              </>
            )}

            {active === 'ai' && (
              <>
                <SettingRow label="Inference Endpoint" hint="Vision cluster API base URL">
                  <Badge tone="purple">https://ai.cadastre.gov.in/v1</Badge>
                </SettingRow>
                <SettingRow label="Model Version" hint="Deployed model revision">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>v2.4.1 (stable)</option>
                    <option>v2.5.0-rc (canary)</option>
                  </select>
                </SettingRow>
                <SettingRow label="Max Concurrency" hint="Parallel inference jobs per batch">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>4</option>
                    <option>8</option>
                    <option>16</option>
                  </select>
                </SettingRow>
              </>
            )}

            {active === 'notifications' && (
              <>
                <SettingRow label="Conflict Alerts" hint="Email + in-app for critical overlaps">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Daily Digest" hint="Register summary at 06:00 IST each morning">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Weekly Cadastral Digest" hint="PDF emailed to administrators">
                  <Toggle defaultOn />
                </SettingRow>
              </>
            )}

            {active === 'security' && (
              <>
                <SettingRow label="Two-Factor Authentication" hint="Enforce OTP for all privileged roles">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Session Timeout" hint="Automatic lockout after inactivity">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                  </select>
                </SettingRow>
                <SettingRow label="Audit Retention" hint="Immutable log storage window">
                  <select className="h-9 rounded-lg border border-white/10 bg-navy-950 px-2.5 text-xs text-slate-200 outline-none focus:border-primary-400/50">
                    <option>1 year</option>
                    <option>5 years</option>
                    <option>Indefinite</option>
                  </select>
                </SettingRow>
              </>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] pt-4">
              <Button variant="ghost" size="sm" onClick={() => toast.info('Discarded', 'No changes applied.')}>
                Cancel
              </Button>
              <Button size="sm" onClick={save}>
                <Save size={14} />
                Save changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function SettingRow({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <div>
        <p className="text-xs font-medium text-slate-200">{label}</p>
        <p className="mt-0.5 text-[10px] text-slate-600">{hint}</p>
      </div>
      {children}
    </div>
  )
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={cn(
        'relative h-6 w-11 rounded-full border transition-colors duration-200',
        on ? 'border-primary-400/40 bg-primary-500/30' : 'border-white/[0.1] bg-white/[0.05]',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-all duration-200',
          on ? 'left-[22px]' : 'left-0.5 opacity-60',
        )}
      />
    </button>
  )
}