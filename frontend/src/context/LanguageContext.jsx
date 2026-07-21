import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language')
    if (savedLang && (savedLang === 'en' || savedLang === 'si')) {
      setLang(savedLang)
    }
  }, [])

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'si' : 'en'
    setLang(nextLang)
    localStorage.setItem('app_language', nextLang)
  }

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
