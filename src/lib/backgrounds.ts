export interface BackgroundStyle {
  id: string
  name: string
  description: string
  preview: 'botanical' | 'damask' | 'celestial' | 'artdeco' | 'glow' | 'floral'
}

export const BACKGROUND_STYLES: BackgroundStyle[] = [
  {
    id: 'botanical',
    name: 'Botanical Garden',
    description: 'Ranting & bunga elegan di sudut. Natural dan romantis.',
    preview: 'botanical',
  },
  {
    id: 'damask',
    name: 'Royal Damask',
    description: 'Pattern klasik mewah dengan frame ornamental. Sangat formal.',
    preview: 'damask',
  },
  {
    id: 'celestial',
    name: 'Celestial Night',
    description: 'Bintang & cahaya lembut. Dramatis dan memukau.',
    preview: 'celestial',
  },
  {
    id: 'artdeco',
    name: 'Art Deco',
    description: 'Garis geometris mewah ala Great Gatsby. Modern klasik.',
    preview: 'artdeco',
  },
  {
    id: 'glow',
    name: 'Minimalist Glow',
    description: 'Gradient lembut dan bersih. Simpel dan elegan.',
    preview: 'glow',
  },
  {
    id: 'floral',
    name: 'Floral Romance',
    description: 'Bunga-bunga besar yang mekar. Feminin dan mewah.',
    preview: 'floral',
  },
]

export function getBackgroundStyleById(id: string): BackgroundStyle | undefined {
  return BACKGROUND_STYLES.find((s) => s.id === id)
}