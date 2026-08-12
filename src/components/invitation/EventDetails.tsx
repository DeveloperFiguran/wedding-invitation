'use client'

import { motion } from 'framer-motion'
import { WeddingSettings } from '@/types/database'
import { MapPin, Clock, Shirt, CalendarHeart } from 'lucide-react'
import { AddToCalendar } from './AddToCalendar'
import { SafeLink } from '@/components/ui/SafeLink'
import { formatDate, formatTime } from '@/lib/utils'

interface EventDetailsProps {
  settings: WeddingSettings
}

function TicketCard({
  settings,
  type,
  date,
  time,
  location,
  mapsUrl,
  delay,
}: {
  settings: WeddingSettings
  type: 'akad' | 'resepsi'
  date?: string
  time?: string
  location?: string
  mapsUrl?: string
  delay: number
}) {
  if (!date) return null

  const isAkad = type === 'akad'
  const color = isAkad ? settings.primary_color : settings.accent_color

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      {/* Ticket notches */}
      <div
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-10"
        style={{ backgroundColor: settings.background_color }}
      />
      <div
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-10"
        style={{ backgroundColor: settings.background_color }}
      />

      <div
        className="relative bg-white rounded-3xl shadow-xl overflow-hidden border-2"
        style={{ borderColor: `${color}25` }}
      >
        {/* Header */}
        <div
          className="relative p-6 pb-5"
          style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-bold px-4 py-1.5 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {isAkad ? 'Akad Nikah' : 'Resepsi'}
            </span>
            <CalendarHeart size={20} style={{ color }} />
          </div>
          <p className="font-display text-xl md:text-2xl font-semibold" style={{ color: settings.text_color }}>
            {formatDate(date)}
          </p>
        </div>

        {/* Perforation line */}
        <div className="relative flex items-center px-4">
          <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: `${color}30` }} />
        </div>

        {/* Body */}
        <div className="p-6 pt-5 space-y-4">
          <div className="space-y-3">
            {time && (
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Clock size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-caption uppercase tracking-wider" style={{ color: settings.text_color, opacity: 0.5 }}>
                    Waktu
                  </p>
                  <p className="text-body-sm font-semibold" style={{ color: settings.text_color }}>
                    {formatTime(time)}
                  </p>
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <MapPin size={16} style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-caption uppercase tracking-wider" style={{ color: settings.text_color, opacity: 0.5 }}>
                    Lokasi
                  </p>
                  <p className="text-body-sm font-semibold leading-snug" style={{ color: settings.text_color }}>
                    {location}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <AddToCalendar
              title={`${isAkad ? 'Akad Nikah' : 'Resepsi'} - ${settings.bride_name} & ${settings.groom_name}`}
              startDate={date}
              location={location}
              primaryColor={color}
            />
            {mapsUrl && (
              <SafeLink
                href={mapsUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 active:scale-95 text-white"
                style={{ backgroundColor: color }}
              >
                <MapPin size={14} />
                Lihat Maps
              </SafeLink>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function EventDetails({ settings }: EventDetailsProps) {
  return (
    <section
      id="events"
      className="py-20 px-5"
      style={{ backgroundColor: settings.background_color }}
    >
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-label-md uppercase mb-3 font-medium"
            style={{ color: settings.primary_color }}
          >
            Save The Date
          </p>
          <h2 className="font-display text-heading-xl mb-4" style={{ color: settings.text_color }}>
            Rangkaian Acara
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: settings.primary_color }} />
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }} />
          </div>
        </motion.div>

        <div className="space-y-8">
          <TicketCard
            settings={settings}
            type="akad"
            date={settings.akad_date}
            time={settings.akad_time}
            location={settings.akad_location}
            mapsUrl={settings.akad_maps}
            delay={0.1}
          />

          <TicketCard
            settings={settings}
            type="resepsi"
            date={settings.reception_date}
            time={settings.reception_time}
            location={settings.reception_location}
            mapsUrl={settings.reception_maps}
            delay={0.25}
          />
        </div>

        {/* Dresscode */}
        {settings.dresscode && (
          <motion.div
            className="mt-10 text-center p-6 rounded-3xl"
            style={{
              backgroundColor: `${settings.primary_color}08`,
              border: `1px dashed ${settings.primary_color}40`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shirt size={22} className="mx-auto mb-2" style={{ color: settings.primary_color }} />
            <p className="text-caption uppercase tracking-[0.3em] mb-1" style={{ color: settings.primary_color }}>
              Dresscode
            </p>
            <p className="text-body-md font-medium" style={{ color: settings.text_color }}>
              {settings.dresscode}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}