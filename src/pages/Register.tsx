
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Nav from '@/components/Nav';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await register(email, password, confirmPassword, name);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card p-8 rounded-lg">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
                <p className="text-gray-600 text-sm">Registre-se para participar do campeonato</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nome completo</label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Institucional</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@estudante.ifto.edu.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-primary"
                  />
                  <p className="text-xs text-gray-500">
                    Use seu email institucional do IFTO (@estudante.ifto.edu.br)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Senha</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input-primary"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="button-primary w-full"
                >
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Faça login
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} IFTO e-Sports. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Termos de Uso</a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Privacidade</a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
