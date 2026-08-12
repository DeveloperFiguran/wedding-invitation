'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingSettings } from '@/types/database'
import { Gift, Copy, Check, QrCode } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

interface WeddingGiftProps {
  settings: WeddingSettings
}

export function WeddingGift({ settings }: WeddingGiftProps) {
  const [copied, setCopied] = useState(false)
  const [showQris, setShowQris] = useState(false)

  const hasBank = settings.bank_name && settings.bank_account_number
  const hasQris = settings.qris_url

  if (!hasBank && !hasQris) return null

  const handleCopy = async () => {
    if (settings.bank_account_number) {
      await copyToClipboard(settings.bank_account_number)
      setCopied(true)
      toast.success('Nomor rekening berhasil disalin!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section className="py-24 px-6" style={{ backgroundColor: settings.background_color }}>
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: settings.primary_color }}>
            Wedding Gift
          </p>
          <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: settings.text_color }}>
            Kirim Hadiah
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }}></div>
            <Gift size={18} style={{ color: settings.primary_color }} />
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }}></div>
          </div>
          <p className="mt-4 text-sm font-elegant italic" style={{ color: settings.text_color, opacity: 0.7 }}>
            Doa restu Anda merupakan karunia terindah. Namun jika ingin memberikan tanda kasih, kami menyediakan amplop digital.
          </p>
        </motion.div>

        <div className="space-y-4">
          {hasBank && (
            <motion.div
              className="glass-effect rounded-3xl p-6 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: settings.primary_color }}
                >
                  <Gift size={22} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: settings.text_color }}>
                    {settings.bank_name}
                  </p>
                  <p className="text-xs" style={{ color: settings.text_color, opacity: 0.6 }}>
                    a.n. {settings.bank_account_name}
                  </p>
                </div>
              </div>

              <div 
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{ backgroundColor: `${settings.primary_color}10` }}
              >
                <span className="text-lg font-display font-bold tracking-wider" style={{ color: settings.text_color }}>
                  {settings.bank_account_number}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl transition-colors"
                  style={{ backgroundColor: settings.primary_color }}
                >
                  {copied ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-white" />}
                </button>
              </div>
            </motion.div>
          )}

          {hasQris && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setShowQris(!showQris)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 text-sm font-medium transition-all"
                style={{ borderColor: settings.primary_color, color: settings.primary_color }}
              >
                <QrCode size={16} />
                {showQris ? 'Sembunyikan QRIS' : 'Tampilkan QRIS'}
              </button>

              {showQris && (
                <motion.div
                  className="mt-4 glass-effect rounded-3xl p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <Image
                    src={settings.qris_url!}
                    alt="QRIS"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}