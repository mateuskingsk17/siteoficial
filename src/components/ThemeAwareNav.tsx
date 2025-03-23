
import React from 'react';
import Nav from '@/components/Nav';
import ThemeToggle from '@/components/ThemeToggle';

const ThemeAwareNav: React.FC = () => {
  return (
    <div className="relative">
      <Nav />
      <div className="absolute top-4 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ThemeAwareNav;
