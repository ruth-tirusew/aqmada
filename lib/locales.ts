import type { Locale } from '@/i18n.config'

const dictionaries = {
  en: () => import('@/messages/en.json').then(module => module.default),
  am: () => import('@/messages/am.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
