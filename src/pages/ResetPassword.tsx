
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validatePassword } from '@/utils/validation';
import { toast } from '@/components/ui/use-toast';
import { verifyPasswordResetToken, resetPassword, clearPasswordResetToken } from '@/utils/storage';
import ThemeAwareNav from '@/components/ThemeAwareNav';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const emailParam = params.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      
      // Verify if token is valid
      const isValid = verifyPasswordResetToken(emailParam, tokenParam);
      setIsValidToken(isValid);
      
      if (!isValid) {
        toast({
          title: "Link inválido",
          description: "Este link de redefinição de senha expirou ou é inválido.",
          variant: "destructive"
        });
      }
    } else {
      setIsValidToken(false);
      toast({
        title: "Link inválido",
        description: "URL de redefinição de senha inválida.",
        variant: "destructive"
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = resetPassword(email, password);
      
      if (success) {
        // Clear the token after successful reset
        clearPasswordResetToken(email);
        
        toast({
          title: "Senha redefinida",
          description: "Sua senha foi redefinida com sucesso. Você já pode fazer login com sua nova senha.",
        });
        
        // Redirect to login page after short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível redefinir sua senha. Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao redefinir sua senha.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <ThemeAwareNav />
      
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
                <h1 className="text-2xl font-bold mb-2">Redefinir Senha</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {isValidToken 
                    ? "Crie uma nova senha para sua conta" 
                    : "Link de redefinição de senha inválido ou expirado"}
                </p>
              </div>
              
              {isValidToken ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Nova Senha</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua nova senha"
                      className="input-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Confirmar Senha</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      className="input-primary"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="button-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-4 rounded-md text-sm">
                    Este link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo link de redefinição.
                  </div>
                  
                  <Button
                    onClick={() => navigate('/forgot-password')}
                    className="w-full"
                  >
                    Solicitar Novo Link
                  </Button>
                </div>
              )}
              
              <div className="text-center text-sm mt-6">
                <Link to="/login" className="text-primary hover:underline">
                  Voltar para o login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} IFTO e-Sports. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Termos de Uso</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Privacidade</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;
