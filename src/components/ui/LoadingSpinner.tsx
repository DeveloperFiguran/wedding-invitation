export function LoadingSpinner({ text = 'Memuat...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin mb-4"></div>
      <p className="font-elegant text-[#6B5B5B]/60 italic">{text}</p>
    </div>
  )
}