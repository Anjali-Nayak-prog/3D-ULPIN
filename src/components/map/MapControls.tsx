import {
  Box,
  ChevronsLeftRight,
  Home,
  Maximize,
  Move,
  Plus,
  Minus,
  RotateCw,
  Ruler,
  ScanLine,
  Undo2,
  type LucideIcon,
} from 'lucide-react'
import type { MeasureTool } from '../../types/map'
import { cn } from '../../utils/helpers'

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
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-all duration-150',
        size === 'md' ? 'px-2.5 py-2' : 'p-2',
        active
          ? 'border-primary-400/60 bg-primary-500 text-white shadow-glow-sm'
          : 'border-slate-200 bg-white text-slate-500 hover:border-primary-400/30 hover:text-slate-900',
      )}
    >
      <Icon size={14} />
      {size === 'md' && <span className="hidden lg:inline">{label}</span>}
    </button>
  )
}

interface CameraControlsProps {
  onHome: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onRotate: () => void
  onReset: () => void
}

/** Camera group — top-right, controls the viewport transform. */
export function MapCameraControls({ onHome, onZoomIn, onZoomOut, onRotate, onReset }: CameraControlsProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 p-1.5 shadow-card backdrop-blur-sm">
      <ToolButton label="Home view" icon={Home} onClick={onHome} size="sm" />
      <div className="flex flex-col gap-1">
        <button
          type="button"
          title="Zoom in"
          aria-label="Zoom in"
          onClick={onZoomIn}
          className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Plus size={13} />
        </button>
        <button
          type="button"
          title="Zoom out"
          aria-label="Zoom out"
          onClick={onZoomOut}
          className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Minus size={13} />
        </button>
      </div>
      <ToolButton label="Rotate view 15°" icon={RotateCw} onClick={onRotate} size="sm" />
      <ToolButton label="Reset camera" icon={Undo2} onClick={onReset} size="sm" />
    </div>
  )
}

interface ToolControlsProps {
  measureTool: MeasureTool
  onMeasureToolChange: (tool: MeasureTool) => void
  layerPanelOpen: boolean
  onToggleLayers: () => void
}

/** Tool group — top-left, analysis and layer toggles. */
export function MapToolControls({
  measureTool,
  onMeasureToolChange,
  layerPanelOpen,
  onToggleLayers,
}: ToolControlsProps) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 p-1.5 shadow-card backdrop-blur-sm">
      <ToolButton
        label="Measure distance"
        icon={Ruler}
        onClick={() => onMeasureToolChange(measureTool === 'distance' ? null : 'distance')}
        active={measureTool === 'distance'}
      />
      <ToolButton
        label="Measure area"
        icon={ScanLine}
        onClick={() => onMeasureToolChange(measureTool === 'area' ? null : 'area')}
        active={measureTool === 'area'}
      />
      <ToolButton
        label="Measure height"
        icon={Box}
        onClick={() => onMeasureToolChange(measureTool === 'height' ? null : 'height')}
        active={measureTool === 'height'}
      />
      <ToolButton
        label="Pan map"
        icon={Move}
        onClick={() => onMeasureToolChange(null)}
        active={measureTool === null && !layerPanelOpen}
      />
      <ToolButton
        label="Toggle layers"
        icon={ChevronsLeftRight}
        onClick={() => {
          onMeasureToolChange(null)
          onToggleLayers()
        }}
        active={layerPanelOpen}
      />
    </div>
  )
}

/** Header bar — title + 2D/3D toggle + fullscreen, above the viewport. */
export function MapHeaderBar({
  onFullscreen,
}: {
  onFullscreen: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-slate-900">3D Cadastral Map</h2>
        <p className="truncate text-[11px] text-slate-500">
          Pune Municipal Corporation · vertical property volumes
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          title="Toggle fullscreen"
          onClick={onFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-primary-400/30 hover:text-slate-900"
        >
          <Maximize size={14} />
        </button>
      </div>
    </div>
  )
}