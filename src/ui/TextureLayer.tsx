// Global grain overlay (SVG fractal noise) plus the optional scanline layer
export function TextureLayer() {
  return (
    <>
      <div className="scanline-layer" aria-hidden />

      <svg className="grain-layer" aria-hidden>
        <filter id="global-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />

          <feColorMatrix type="saturate" values="0" />
        </filter>

        <rect width="100%" height="100%" filter="url(#global-grain)" />
      </svg>
    </>
  )
}
