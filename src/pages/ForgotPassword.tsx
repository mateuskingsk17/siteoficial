
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateEmail } from '@/utils/validation';
import { toast } from '@/components/ui/use-toast';
import { generatePasswordResetToken, savePasswordResetToken } from '@/utils/storage';
import ThemeAwareNav from '@/components/ThemeAwareNav';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate token and save it
      const token = generatePasswordResetToken(email);
      if (token) {
        savePasswordResetToken(email, token);
        
        // In a real application, we would send an email here
        console.log(`Password reset link: /reset-password?token=${token}&email=${encodeURIComponent(email)}`);
        
        toast({
          title: "Email enviado",
          description: "Instruções para redefinir sua senha foram enviadas para seu email.",
        });
        
        setSubmitted(true);
      } else {
        toast({
          title: "Erro",
          description: "Email não encontrado.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
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
                <h1 className="text-2xl font-bold mb-2">Recuperação de Senha</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {!submitted 
                    ? "Digite seu email para receber instruções de recuperação de senha" 
                    : "Verifique seu email para instruções de recuperação de senha"}
                </p>
              </div>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@estudante.ifto.edu.br"
                      className="input-primary"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="button-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Email de Recuperação"}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <Link to="/login" className="text-primary hover:underline">
                      Voltar para o login
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-md text-sm">
                    Um link para redefinir sua senha foi enviado para <strong>{email}</strong>. 
                    Por favor, verifique sua caixa de entrada e spam.
                  </div>
                  
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="w-full"
                    variant="outline"
                  >
                    Enviar novamente
                  </Button>
                  
                  <div className="text-center text-sm">
                    <Link to="/login" className="text-primary hover:underline">
                      Voltar para o login
                    </Link>
                  </div>
                </div>
              )}
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

export default ForgotPassword;
