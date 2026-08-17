'use client';

import React from 'react';
import { PlatformType } from '@omnipost/types';

interface PlatformLogoProps {
  platformType: PlatformType;
  size?: number;
  className?: string;
}

export function PlatformLogo({ platformType, size = 40, className = '' }: PlatformLogoProps) {
  const s = `${size}px`;

  switch (platformType) {
    case 'INSTAGRAM':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      );

    case 'TIKTOK':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-black text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.32 1.54-1.29 2.54.02 1.19.74 2.27 1.84 2.73.9.38 1.98.28 2.8-.26.83-.54 1.34-1.5 1.32-2.49.03-5.26.01-10.53.02-15.79z" />
          </svg>
        </div>
      );

    case 'YOUTUBE':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-red-600 text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );

    case 'X':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-slate-950 text-white shadow-xs ${className}`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );

    case 'LINKEDIN':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#0A66C2] text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
          </svg>
        </div>
      );

    case 'FACEBOOK':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#1877F2] text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      );

    case 'THREADS':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-black text-white shadow-xs ${className}`}
        >
          <span className="font-black text-lg">@</span>
        </div>
      );

    case 'PINTEREST':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#E60023] text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.618 0 12.017 0z" />
          </svg>
        </div>
      );

    case 'TELEGRAM':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#24A1DE] text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </div>
      );

    case 'DISCORD':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#5865F2] text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </div>
      );

    case 'SLACK':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-slate-900 text-white shadow-xs ${className}`}
        >
          <span className="font-black text-lg text-emerald-400">#</span>
        </div>
      );

    case 'REDDIT':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#FF4500] text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.298.063.601.063.91 0 3.328-3.722 6.023-8.314 6.023-4.591 0-8.314-2.695-8.314-6.023 0-.306.022-.607.062-.904A1.754 1.754 0 0 1 1.7 12.043c0-.968.786-1.754 1.754-1.754.463 0 .88.18 1.185.476 1.187-.84 2.825-1.396 4.633-1.478l.942-4.411a.36.36 0 0 1 .425-.279l3.056.643c.123-.377.476-.649.897-.649zM9.08 13.752c-.896 0-1.624.728-1.624 1.624 0 .896.728 1.624 1.624 1.624.896 0 1.624-.728 1.624-1.624 0-.896-.728-1.624-1.624-1.624zm5.838 0c-.896 0-1.624.728-1.624 1.624 0 .896.728 1.624 1.624 1.624.896 0 1.624-.728 1.624-1.624 0-.896-.728-1.624-1.624-1.624zm-6.24 3.738a.36.36 0 0 0-.254.615c1.077 1.077 3.037 1.077 4.114 0a.36.36 0 1 0-.509-.509c-.796.796-2.3 1.056-3.1 0a.358.358 0 0 0-.251-.106z" />
          </svg>
        </div>
      );

    case 'GOOGLE_BUSINESS':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-white border border-slate-200 text-blue-600 font-black shadow-xs ${className}`}
        >
          <span className="text-xl">G</span>
        </div>
      );

    case 'QUORA':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#B92B27] text-white shadow-xs font-serif font-black text-xl ${className}`}
        >
          Q
        </div>
      );

    case 'BLUESKY':
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-[#0285FF] text-white shadow-xs ${className}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.01 1.5 1.556 1.5 3.5c0 .762.43 5.485 1.258 7.37.592 1.348 2.054 2.112 3.242 2.13-1.89.378-3.957 1.488-4.394 3.738C1.187 18.91 3.5 22.5 8 22.5c4.5 0 6.5-5 8-8 1.5 3 3.5 8 8 8 4.5 0 6.813-3.59 6.394-5.762-.437-2.25-2.504-3.36-4.394-3.738 1.188-.018 2.65-.782 3.242-2.13.828-1.885 1.258-6.608 1.258-7.37 0-1.944-1.066-2.49-3.702-.695C20.046 4.747 17.087 8.686 16 10.8c-.89-1.733-2.11-3.3-4-3.3s-3.11 1.567-4 3.3z" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          style={{ width: s, height: s }}
          className={`rounded-xl flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-600 font-extrabold shadow-xs ${className}`}
        >
          ✨
        </div>
      );
  }
}
