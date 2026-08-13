'use client'
// src/app/admin/test-preview/page.tsx
import { BackgroundStylePicker } from '@/components/admin/BackgroundStylePicker'
import { FontPicker } from '@/components/admin/FontPicker'

export default function Test() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Test Preview</h1>
      
      <div className="border-2 border-red-500 p-4">
        <h2>FontPicker:</h2>
        <FontPicker currentPreset="classic-elegance" onSelect={() => {}} />
      </div>
      
      <div className="border-2 border-blue-500 p-4">
        <h2>BackgroundStylePicker:</h2>
        <BackgroundStylePicker currentStyle="botanical" onSelect={() => {}} />
      </div>
    </div>
  )
}
