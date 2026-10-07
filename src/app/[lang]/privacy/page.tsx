import { PrivacyPolicyView } from '@/components/legal/privacy-policy'

import { privacyMetadata, privacyPageProps } from '../privacy-route'

// Solo /en/privacy: el otro idioma no coincide y cae en la 404 global (sin notFound(), Spec 006).
export const dynamicParams = false

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export async function generateMetadata() {
  return privacyMetadata('en')
}

export default function Page() {
  return <PrivacyPolicyView {...privacyPageProps('en')} />
}
