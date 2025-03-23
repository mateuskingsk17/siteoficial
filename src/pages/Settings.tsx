
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import Nav from '@/components/Nav';

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      updateUserProfile({ bio });
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Nav />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8 rounded-lg">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Configurações</h1>
                <p className="text-gray-600 text-sm">Personalize sua experiência</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">Biografia</label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                    rows={6}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500">
                    Esta biografia será visível para outros participantes do torneio.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Preferências de Notificação</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="checkbox"
                      id="notifyEmail"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <label htmlFor="notifyEmail" className="text-sm">
                      Receber notificações por email
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="checkbox"
                      id="notifyResults"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <label htmlFor="notifyResults" className="text-sm">
                      Receber notificações sobre resultados dos jogos
                    </label>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="button-primary"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
      
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

export default Settings;
