import { redirect } from 'next/navigation';

// Redirect to English by default
export default function Home() {
  redirect('/en');
}
