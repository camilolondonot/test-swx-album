import { useEffect, useState } from 'react'

const TICK_MS = 1000

const useCooldownTimer = (cooldownEndsAt, onExpire) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    if (!cooldownEndsAt) {
      setRemainingSeconds(0)
      return undefined
    }

    const calculate = () => {
      const diff = Math.ceil((cooldownEndsAt - Date.now()) / 1000)
      if (diff <= 0) {
        setRemainingSeconds(0)
        onExpire?.()
        return false
      }
      setRemainingSeconds(diff)
      return true
    }

    let active = calculate()
    const intervalId = setInterval(() => {
      active = calculate()
      if (!active) {
        clearInterval(intervalId)
      }
    }, TICK_MS)

    return () => clearInterval(intervalId)
  }, [cooldownEndsAt, onExpire])

  return {
    remainingSeconds,
    isActive: remainingSeconds > 0,
  }
}

export default useCooldownTimer
