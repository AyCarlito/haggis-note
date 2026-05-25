import { useState, useEffect, useRef, useCallback } from 'react'

const DEBOUNCE_MS = 500

const STORAGE_KEY = 'haggisnote-data'

function estimateUsage() {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const value = localStorage.getItem(key)
    total += (key.length + value.length) * 2
  }
  return total
}

const USAGE_LIMIT = 5_000_000
const WARN_THRESHOLD = USAGE_LIMIT * 0.9

export function useStorage(defaultValue) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const [storageUsage, setStorageUsage] = useState(estimateUsage)
  const [isLow, setIsLow] = useState(() => estimateUsage() > WARN_THRESHOLD)
  const [quotaExceeded, setQuotaExceeded] = useState(false)
  const timeoutRef = useRef(null)

  const checkUsage = useCallback(() => {
    const usage = estimateUsage()
    setStorageUsage(usage)
    setIsLow(usage > WARN_THRESHOLD)
  }, [])

  const scheduleSave = useCallback((value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        setQuotaExceeded(false)
        checkUsage()
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
          setQuotaExceeded(true)
          setIsLow(true)
        }
      }
    }, DEBOUNCE_MS)
  }, [checkUsage])

  const updateData = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  useEffect(() => {
    checkUsage()
    try {
      navigator.storage?.estimate?.().then((estimate) => {
        if (estimate.usage && estimate.quota) {
          const pct = estimate.usage / estimate.quota
          if (pct > 0.9) setIsLow(true)
        }
      })
    } catch {
    }
  }, [checkUsage])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { data, updateData, storageUsage, isLow, quotaExceeded }
}
