'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '../../../lib/api-client';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided.');
      return;
    }

    apiFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || 'Email verification failed.');
      });
  }, [token]);

  return (
    <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center">
      <h1 className="text-2xl font-bold text-slate-100 mb-4">Email Verification</h1>

      {status === 'verifying' && (
        <p className="text-slate-400">Verifying your email address...</p>
      )}

      {status === 'success' && (
        <div>
          <p className="text-emerald-400 mb-6">Your email address has been verified!</p>
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <p className="text-rose-400 mb-6">{errorMessage}</p>
          <Link href="/login" className="text-indigo-400 hover:underline">
            Back to Sign in
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <Suspense fallback={<div className="text-slate-400">Verifying...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
