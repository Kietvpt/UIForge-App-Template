import React, { useEffect } from 'react'
import { UIForgeApp, setApiBaseUrl } from '@uiforge/core'
import '@uiforge/core/style.css'
// Đăng ký toàn bộ các module Business Logic mẫu
import './logic'

export function App() {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5048'
    setApiBaseUrl(apiUrl)
  }, [])

  return <UIForgeApp />
}

export default App
