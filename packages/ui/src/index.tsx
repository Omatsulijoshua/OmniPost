import React from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
}> = ({ children, onClick, variant = 'primary' }) => {
  const baseStyle = 'px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm text-sm';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 shadow-md active:scale-98',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 shadow-md active:scale-98',
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};
