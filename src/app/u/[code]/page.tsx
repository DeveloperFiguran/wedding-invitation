import type { Metadata } from 'next'
import { InvitationPage } from '@/components/invitation/InvitationPage'
import { buildInvitationMetadata } from '@/lib/metadata'

interface Props {
  params: { code: string }
}

// ====== METADATA DINAMIS (SERVER) ======
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildInvitationMetadata(params.code)
}

// ====== RENDER (CLIENT) ======
export default function PublicInvitation({ params }: Props) {
  return <InvitationPage code={params.code} />
}