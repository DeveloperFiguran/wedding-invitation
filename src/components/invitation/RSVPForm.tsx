'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Guest, WeddingSettings } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { Send, Check, Users, MessageCircleHeart } from 'lucide-react'
import { toast } from 'sonner'

interface RSVPFormProps {
  guest: Guest
  settings: WeddingSettings
}

export function RSVPForm({ guest, settings }: RSVPFormProps) {
  const [rsvpStatus, setRsvpStatus] = useState<string>(guest.rsvp_status || '')
  const [rsvpCount, setRsvpCount] = useState(guest.rsvp_count || 1)
  const [wish, setWish] = useState(guest.wish || '')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(!!guest.rsvp_status)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpStatus) {
      toast.error('Pilih status kehadiran Anda')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          rsvp_status: rsvpStatus as 'hadir' | 'tidak_hadir',
          rsvp_count: rsvpStatus === 'hadir' ? rsvpCount : 0,
          wish: wish || null,
        })
        .eq('id', guest.id)

      if (error) throw error
      setSubmitted(true)
      toast.success('RSVP berhasil disimpan! Terima kasih 🙏')
    } catch (err) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 px-6" style={{ backgroundColor: settings.background_color }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: settings.primary_color }}>
            RSVP
          </p>
          <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: settings.text_color }}>
            Konfirmasi Kehadiran
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }}></div>
            <MessageCircleHeart size={18} style={{ color: settings.primary_color }} />
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }}></div>
          </div>
        </motion.div>

        {submitted ? (
          <motion.div
            className="glass-effect rounded-3xl p-8 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${settings.primary_color}20` }}
            >
              <Check size={32} style={{ color: settings.primary_color }} />
            </div>
            <h3 className="font-display text-2xl mb-2" style={{ color: settings.text_color }}>
              Terima Kasih!
            </h3>
            <p className="text-sm" style={{ color: settings.text_color, opacity: 0.7 }}>
              Konfirmasi kehadiran Anda telah kami terima.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: settings.text_color }}>
                Apakah Anda akan hadir?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('hadir')}
                  className="flex-1 py-4 px-4 rounded-2xl border-2 font-medium text-sm transition-all"
                  style={{
                    borderColor: rsvpStatus === 'hadir' ? settings.primary_color : `${settings.text_color}30`,
                    backgroundColor: rsvpStatus === 'hadir' ? settings.primary_color : 'white',
                    color: rsvpStatus === 'hadir' ? 'white' : settings.text_color,
                  }}
                >
                  ✓ Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus('tidak_hadir')}
                  className="flex-1 py-4 px-4 rounded-2xl border-2 font-medium text-sm transition-all"
                  style={{
                    borderColor: rsvpStatus === 'tidak_hadir' ? settings.accent_color : `${settings.text_color}30`,
                    backgroundColor: rsvpStatus === 'tidak_hadir' ? settings.accent_color : 'white',
                    color: rsvpStatus === 'tidak_hadir' ? 'white' : settings.text_color,
                  }}
                >
                  ✗ Tidak Hadir
                </button>
              </div>
            </div>

            {rsvpStatus === 'hadir' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: settings.text_color }}>
                  <Users size={16} style={{ color: settings.primary_color }} />
                  Jumlah tamu (termasuk Anda)
                </label>
                <select
                  value={rsvpCount}
                  onChange={(e) => setRsvpCount(Number(e.target.value))}
                  className="w-full px-4 py-4 rounded-2xl border-2 outline-none bg-white"
                  style={{ borderColor: `${settings.primary_color}40`, color: settings.text_color }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} orang</option>
                  ))}
                </select>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: settings.text_color }}>
                Ucapan & Doa
              </label>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..."
                className="w-full px-4 py-4 rounded-2xl border-2 outline-none resize-none min-h-[120px] bg-white"
                style={{ borderColor: `${settings.primary_color}40`, color: settings.text_color }}
                rows={4}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-8 rounded-2xl font-medium text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              style={{ backgroundColor: settings.primary_color }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={18} />
                  Kirim RSVP
                </>
              )}
            </motion.button>
          </form>
        )}
      </div>
    </section>
  )
}