import { getSettings } from '@/lib/store'
import SettingsForm from '@/components/SettingsForm'

export default async function Home() {
  const settings = await getSettings()
  const { accessToken, ...safeSettings } = settings
  return <SettingsForm initial={safeSettings} />
}
