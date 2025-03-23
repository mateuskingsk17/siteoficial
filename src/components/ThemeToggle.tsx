
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <span className="text-sm font-medium">
        {theme === 'light' ? (
          <div className="flex items-center gap-1">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Modo Claro</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Modo Escuro</span>
          </div>
        )}
      </span>
    </div>
  );
};

export default ThemeToggle;
