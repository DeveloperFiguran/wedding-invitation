import type { Metadata } from 'next'
import { InvitationPage } from '@/components/invitation/InvitationPage'
import { buildInvitationMetadata } from '@/lib/metadata'

interface Props {
  params: { code: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildInvitationMetadata(params.code)
}

export default function UndanganPage({ params }: Props) {
  return <InvitationPage code={params.code} />
}