import { cn } from '@/utils/index'

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const CooldownBanner = ({ remainingSeconds, isActive, className = '' }) => {
  if (!isActive) return null

  return (
    <div
      className={cn(
        'rounded-md border border-warning/40 bg-warning/10 px-4 py-2 text-sm text-warning-content',
        className,
      )}
    >
      Próximo sobre disponible en <strong>{formatTime(remainingSeconds)}</strong>.
    </div>
  )
}

export default CooldownBanner
