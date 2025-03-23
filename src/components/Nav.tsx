
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, FileCheck } from 'lucide-react';

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getStatusBadge = () => {
    if (user?.isAdmin) return null;
    
    return (
      <div className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-black font-medium rounded-full px-2 py-0.5 border border-white">
        Aguardando
      </div>
    );
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-expo ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-lg text-primary">
            IFTO Games
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
            <NavLink to="/about" currentPath={location.pathname}>Saiba Mais</NavLink>
            <NavLink to="/calendar" currentPath={location.pathname}>Calendário e Regulamento</NavLink>
            {user && !user.isAdmin && (
              <NavLink to="/register-team" currentPath={location.pathname}>Inscrever-se</NavLink>
            )}
            {user && user.isAdmin && (
              <NavLink to="/admin" currentPath={location.pathname}>Painel Admin</NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-full outline-none focus:ring-2 focus:ring-primary">
                    {getStatusBadge()}
                    <Avatar>
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="font-medium">{user.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-registrations')}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    <span>Minhas Inscrições</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    navigate('/');
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="hover:text-primary"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="button-primary"
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

const NavLink = ({ to, currentPath, children }: { to: string; currentPath: string; children: React.ReactNode }) => {
  const isActive = currentPath === to;
  
  return (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-colors ${
        isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="navIndicator"
          className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
};

export default Nav;
