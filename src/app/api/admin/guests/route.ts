import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// Middleware sederhana: cek password admin
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('x-admin-auth')
  return authHeader === process.env.ADMIN_PASSWORD
}

// DELETE tamu (operasi sensitif)
export async function DELETE(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    const { error } = await supabase.from('guests').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// UPDATE settings (operasi sensitif)
export async function PATCH(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, data } = await request.json()
    if (!id || !data) {
      return NextResponse.json({ error: 'ID and data required' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    const { error } = await supabase
      .from('wedding_settings')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}