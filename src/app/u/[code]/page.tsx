import { InvitationPage } from '@/components/invitation/InvitationPage'

export default function PublicInvitation({ params }: { params: { code: string } }) {
  return <InvitationPage code={params.code} />
}