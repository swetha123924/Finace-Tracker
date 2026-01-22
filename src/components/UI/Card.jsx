import React from 'react';

const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${
        hover
          ? 'hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 cursor-pointer transition-all duration-300'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 md:p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 md:p-6 border-t border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export default Card;
