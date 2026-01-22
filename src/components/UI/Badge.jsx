import React from 'react';

const variants = {
  default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  primary: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  success: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
  danger: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
  pink: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;
