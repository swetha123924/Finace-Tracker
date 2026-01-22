import React from 'react';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const colors = [
  'from-purple-400 to-pink-500',
  'from-blue-400 to-indigo-500',
  'from-green-400 to-emerald-500',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-rose-500',
  'from-cyan-400 to-teal-500',
  'from-violet-400 to-purple-500',
  'from-fuchsia-400 to-pink-500',
];

const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ name, size = 'md', src, className = '' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colorClass = getColorFromName(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
    >
      {initials}
    </div>
  );
};

export const AvatarGroup = ({ members, max = 4, size = 'sm' }) => {
  const visibleMembers = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleMembers.map((member, index) => (
        <Avatar
          key={member.id || index}
          name={member.name}
          size={size}
          className="ring-2 ring-white dark:ring-gray-800"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`${sizes[size]} bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium ring-2 ring-white dark:ring-gray-800`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;
