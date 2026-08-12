import type { Metadata } from 'next'
import { LockedCoverPage } from '@/components/invitation/LockedCoverPage'
import { buildInvitationMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildInvitationMetadata()
}

export default function Home() {
  return <LockedCoverPage />
}