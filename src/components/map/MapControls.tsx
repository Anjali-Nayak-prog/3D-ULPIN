import {
  ChevronsLeftRight,
  Home,
  Maximize,
  Move,
  RotateCw,
  Ruler,
  ScanLine,
  Undo2,
  Box,
  Globe,
  type LucideIcon,
} from 'lucide-react'
import type { MeasureTool, ViewMode } from '../../types/map'
import { cn } from '../../utils/helpers'

interface MapControlsProps {
  onHome: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onRotate: () => void
  onResetView: () => void
  onToggleViewMode: () => void
  onFullscreen: () => void
  viewMode: ViewMode
  measureTool: MeasureTool
  onMeasureToolChange: (tool: MeasureTool) => void
}

interface ToolButtonProps {
  label: string
  icon: LucideIcon
  onClick: () => void
  active?: boolean
  size?: 'sm' | 'md'
}

function ToolButton({ label, icon: Icon, onClick, active = false, size = 'md' }: ToolButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-all duration-150',
        size === 'md' ? 'px-2.5 py-2' : 'p-2',
        active
          ? 'border-primary-400/50 bg-primary-500/15 text-primary-300 shadow-glow-sm'
          : 'border-white/[0.08] bg-navy-900/80 text-slate-400 hover:border-primary-400/30 hover:text-white',
      )}
    >
      <Icon size={14} />
      {size === 'md' && <span className="hidden lg:inline">{label}</span>}
    </button>
  )
}

export function MapControls({
  onHome,
  onZoomIn,
  onZoomOut,
  onRotate,
  onResetView,
  onToggleViewMode,
  onFullscreen,
  viewMode,
  measureTool,
  onMeasureToolChange,
}: MapControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-navy-900/80 p-1.5">
        <ToolButton label="Home" icon={Home} onClick={onHome} />
        <div className="mx-0.5 flex flex-col gap-1">
          <button
            title="Zoom in"
            onClick={onZoomIn}
            className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            +
          </button>
          <button
            title="Zoom out"
            onClick={onZoomOut}
            className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            −
          </button>
        </div>
        <ToolButton label="Rotate" icon={RotateCw} onClick={onRotate} />
        <ToolButton label="Reset" icon={Undo2} onClick={onResetView} />
      </div>

      <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-navy-900/80 p-1.5">
        <ToolButton
          label="2D / 3D"
          icon={Box}
          onClick={onToggleViewMode}
          active={viewMode === '3d'}
        />
        <ToolButton label="Fullscreen" icon={Maximize} onClick={onFullscreen} />
      </div>

      <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-navy-900/80 p-1.5">
        <ToolButton
          label="Measure"
          icon={Ruler}
          onClick={() => onMeasureToolChange(measureTool === 'distance' ? null : 'distance')}
          active={measureTool === 'distance'}
        />
        <ToolButton
          label="Area"
          icon={ScanLine}
          onClick={() => onMeasureToolChange(measureTool === 'area' ? null : 'area')}
          active={measureTool === 'area'}
        />
        <ToolButton
          label="Height"
          icon={Globe}
          onClick={() => onMeasureToolChange(measureTool === 'height' ? null : 'height')}
          active={measureTool === 'height'}
        />
        <ToolButton label="Pan" icon={Move} onClick={() => onMeasureToolChange(null)} />
        <ToolButton label="Layers" icon={ChevronsLeftRight} onClick={() => onMeasureToolChange(null)} />
      </div>
    </div>
  )
}