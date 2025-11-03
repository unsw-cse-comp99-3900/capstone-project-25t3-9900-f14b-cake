'use client';

import { redirect } from 'next/navigation';

export default function BankPage() {
  // Redirect to history by default
  redirect('/bank/history');
}
