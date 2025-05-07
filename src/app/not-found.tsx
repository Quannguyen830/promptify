'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Không có gì ở đây cả. Alex đi</p>
      <Link href="/dashboard" className="text-blue-600 hover:underline text-lg">
        Go back to the Dashboard
      </Link>
    </div>
  );
}