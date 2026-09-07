export interface IsoPoint {
  x: number
  y: number
}

export interface IsoBox {
  top: string
  left: string
  right: string
}

/**
 * Isometric projection helper for the mock 3D city renderer.
 * Grid coordinate (gx, gz) on the ground plane, gy is elevation (positive = up).
 */
export function isoProject(
  gx: number,
  gz: number,
  gy: number,
  opts: { tile?: number; heightScale?: number; originX?: number; originY?: number } = {},
): IsoPoint {
  const tile = opts.tile ?? 34
  const heightScale = opts.heightScale ?? 1.1
  const originX = opts.originX ?? 0
  const originY = opts.originY ?? 0
  return {
    x: originX + (gx - gz) * tile * 0.5,
    y: originY + (gx + gz) * tile * 0.25 - gy * tile * heightScale,
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const num = Number.parseInt(full, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

export function shadeHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex)
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)))
  return `rgb(${clamp(r * factor)}, ${clamp(g * factor)}, ${clamp(b * factor)})`
}

/**
 * Builds the three polygon faces of an isometric box (building block).
 */
export function isoBoxGeometry(
  gx: number,
  gz: number,
  width: number,
  depth: number,
  height: number,
  opts?: Parameters<typeof isoProject>[3],
): IsoBox {
  const t = opts?.tile ?? 34
  const hs = opts?.heightScale ?? 1.1
  const ox = opts?.originX ?? 0
  const oy = opts?.originY ?? 0

  const A = isoProject(gx, gz, 0, { tile: t, heightScale: hs, originX: ox, originY: oy })
  const B = isoProject(gx + width, gz, 0, { tile: t, heightScale: hs, originX: ox, originY: oy })
  const C = isoProject(gx + width, gz + depth, 0, { tile: t, heightScale: hs, originX: ox, originY: oy })
  const A1 = isoProject(gx, gz, height, { tile: t, heightScale: hs, originX: ox, originY: oy })
  const B1 = isoProject(gx + width, gz, height, { tile: t, heightScale: hs, originX: ox, originY: oy })
  const C1 = isoProject(gx + width, gz + depth, height, { tile: t, heightScale: hs, originX: ox, originY: oy })
  const D1 = isoProject(gx, gz + depth, height, { tile: t, heightScale: hs, originX: ox, originY: oy })

  return {
    top: [A1, B1, C1, D1].map((p) => `${p.x},${p.y}`).join(' '),
    left: [B1, C1, C, B].map((p) => `${p.x},${p.y}`).join(' '),
    right: [A1, B1, B, A].map((p) => `${p.x},${p.y}`).join(' '),
  }
}

export function isoPointOf(
  gx: number,
  gz: number,
  opts?: Parameters<typeof isoProject>[3],
): IsoPoint {
  return isoProject(gx, gz, 0, opts)
}