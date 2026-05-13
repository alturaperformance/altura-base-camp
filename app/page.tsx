import { redirect } from 'next/navigation'

// Root redirects to the app home
export default function RootPage() {
  redirect('/home')
}
