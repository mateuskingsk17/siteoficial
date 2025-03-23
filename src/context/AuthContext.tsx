
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { 
  saveUser, 
  getUserByEmail, 
  setCurrentUser, 
  getCurrentUser, 
  clearCurrentUser,
  updateUser,
  setupAdminUser 
} from '@/utils/storage';
import { validateEmail, validatePassword } from '@/utils/validation';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, confirmPassword: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupAdminUser();
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return false;
    }

    const user = getUserByEmail(email);
    if (!user || user.password !== password) {
      toast({
        title: "Erro",
        description: "Email ou senha incorretos.",
        variant: "destructive"
      });
      return false;
    }

    setCurrentUser(user);
    setUser({ 
      id: user.id, 
      email: user.email, 
      name: user.name,
      bio: user.bio,
      profileImage: user.profileImage,
      isAdmin: user.isAdmin 
    });
    
    toast({
      title: "Sucesso",
      description: "Login realizado com sucesso.",
    });
    return true;
  };

  const register = async (email: string, password: string, confirmPassword: string, name: string): Promise<boolean> => {
    if (!email || !password || !confirmPassword || !name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return false;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Erro",
        description: "Email inválido. Utilize seu email institucional (@estudante.ifto.edu.br).",
        variant: "destructive"
      });
      return false;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return false;
    }

    if (getUserByEmail(email)) {
      toast({
        title: "Erro",
        description: "Este email já está cadastrado.",
        variant: "destructive"
      });
      return false;
    }

    const newUser = {
      id: 'user-' + Date.now(),
      email,
      password,
      name
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    setUser({ id: newUser.id, email: newUser.email, name: newUser.name });
    
    toast({
      title: "Sucesso",
      description: "Cadastro realizado com sucesso.",
    });
    return true;
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    
    updateUser(user.id, data);
    setUser({ ...user, ...data });
    
    toast({
      title: "Sucesso",
      description: "Perfil atualizado com sucesso.",
    });
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
    toast({
      title: "Sucesso",
      description: "Logout realizado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
