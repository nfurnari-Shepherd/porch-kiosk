import { Open_Sans } from 'next/font/google'
import "./globals.css"
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import VoiceChat from '@/app/_components/VoiceChat'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-open-sans',
})

export const metadata = {
  title: "The Porch — Shepherd Community Center",
  description: "Community services kiosk",
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value || 'en'

  const { data: services } = await supabase
    .from('services')
    .select('id, name, name_es, icon, description, description_es')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <html lang={lang === 'es' ? 'es' : 'en'} className={`h-full ${openSans.variable}`}>
      <body className="h-full">
        {children}
        <VoiceChat services={services || []} lang={lang} />
      </body>
    </html>
  )
}
