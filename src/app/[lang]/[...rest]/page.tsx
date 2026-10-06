import { notFound } from 'next/navigation'

// Cualquier ruta bajo /es o /en que no existe muestra la 404 de su idioma.
export default function CatchAllPage(): never {
  notFound()
}
