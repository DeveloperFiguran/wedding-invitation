import { InvitationPage } from '@/components/invitation/InvitationPage'

export default function UndanganPage({ params }: { params: { code: string } }) {
  return <InvitationPage code={params.code} />
}