// Estilos en línea y flexbox: es lo único que admite Satori (next/og).
type OgImageCardProps = {
  name: string
  text: string
  logoSrc: string
}

const LOGO_SIZE = 320
// Color de fondo del JPEG del logo, medido en sus bordes: así no se ve recuadro.
const LOGO_BACKGROUND = '#0a0b10'

export function OgImageCard({ name, text, logoSrc }: OgImageCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 64,
        width: '100%',
        height: '100%',
        padding: 80,
        background: LOGO_BACKGROUND,
        color: '#ffffff',
      }}
    >
      <img src={logoSrc} alt="" width={LOGO_SIZE} height={LOGO_SIZE} />
      <div
        style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 24 }}
      >
        <div style={{ fontSize: 72 }}>{name}</div>
        <div style={{ fontSize: 32, lineHeight: 1.4, opacity: 0.7 }}>
          {text}
        </div>
      </div>
    </div>
  )
}
