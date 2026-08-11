export interface ThemePreset {
  id: string
  name: string
  description: string
  primary_color: string
  accent_color: string
  text_color: string
  background_color: string
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ivory-gold',
    name: 'Ivory & Gold',
    description: 'Klasik, mewah, timeless. Cocok untuk pernikahan formal & ballroom.',
    primary_color: '#B8935A',
    accent_color: '#D4A574',
    text_color: '#3D342B',
    background_color: '#FBF8F3',
  },
  {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    description: 'Romantis, lembut, feminin. Cocok untuk garden wedding.',
    primary_color: '#C08081',
    accent_color: '#E8B4B8',
    text_color: '#5C4A4E',
    background_color: '#FDF7F5',
  },
  {
    id: 'sage-garden',
    name: 'Sage Garden',
    description: 'Natural, fresh, modern. Cocok untuk outdoor & rustic wedding.',
    primary_color: '#8A9A7B',
    accent_color: '#B5C4A8',
    text_color: '#3F4A3D',
    background_color: '#F7F8F2',
  },
  {
    id: 'royal-burgundy',
    name: 'Royal Burgundy',
    description: 'Dramatis & luxurious. Cocok untuk evening wedding.',
    primary_color: '#7C2F3A',
    accent_color: '#C88B8F',
    text_color: '#3D262A',
    background_color: '#FDF8F6',
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Navy',
    description: 'Sophisticated & classy. Keseimbangan maskulin-feminin.',
    primary_color: '#2C3E5C',
    accent_color: '#C9A96E',
    text_color: '#2C3E50',
    background_color: '#F9F7F2',
  },
  {
    id: 'terracotta',
    name: 'Terracotta Boho',
    description: 'Hangat & artistic. Cocok untuk beach & bohemian wedding.',
    primary_color: '#C07856',
    accent_color: '#E0A888',
    text_color: '#5C4033',
    background_color: '#FAF5EE',
  },
]

export function getThemeById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((t) => t.id === id)
}