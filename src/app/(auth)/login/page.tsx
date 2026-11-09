'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleDemoLogin = async () => {
    setLoadingDemo(true);
    await signIn('mock-user', { callbackUrl: '/' });
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-6 text-folio-canvasLight">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#3D5A40] flex items-center justify-center text-white shadow-md">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-3xl font-semibold tracking-tight text-white font-sans lowercase">
          folio
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl text-folio-primary border border-border-subtle">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Welcome to Folio
          </h1>
          <p className="text-stone-500 text-sm mt-1.5">
            A mindful workspace for your priorities & deep work.
          </p>
        </div>

        <div className="space-y-4">
          {/* Instant 1-Click Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={loadingDemo || loadingGoogle}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-[#3D5A40] hover:bg-[#2F4732] text-white font-medium rounded-xl transition duration-150 shadow-sm disabled:opacity-70 group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <div className="text-left">
                <div className="text-sm font-semibold">1-Click Instant Demo</div>
                <div className="text-xs text-stone-200">Continue as Alex Morgan</div>
              </div>
            </div>
            {loadingDemo ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-stone-400 uppercase tracking-wider">
              or OAuth sign in
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Google Sign-in */}
          <button
            onClick={handleGoogleLogin}
            disabled={loadingDemo || loadingGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium rounded-xl transition duration-150 shadow-sm disabled:opacity-70 text-sm"
          >
            {loadingGoogle ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            Sign in with Google
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-stone-400">
          Designed with mindful calm. Keyboard-friendly navigation.
        </p>
      </div>
    </div>
  );
}

