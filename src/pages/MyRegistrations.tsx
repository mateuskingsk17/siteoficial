
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { getUserTeams } from '@/utils/storage';
import { Team } from '@/types';
import { Eye, AlertCircle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import Nav from '@/components/Nav';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    const userTeams = getUserTeams(user.id);
    setTeams(userTeams);
    setIsLoading(false);
  }, [user, navigate]);

  const getGameName = (gameCode: string) => {
    switch (gameCode) {
      case 'valorant': return 'Valorant';
      case 'eafc-solo': return 'EA FC 24 (Solo)';
      case 'eafc-dupla': return 'EA FC 24 (Dupla)';
      default: return gameCode;
    }
  };

  const getStatusBadge = (team: Team) => {
    if (team.status === 'approved') {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Aprovado para competir
        </div>
      );
    }
    
    if (team.status === 'rejected') {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Reprovado
        </div>
      );
    }
    
    if (team.paymentStatus === 'approved') {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Aguardando Aprovação do Administrador
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Aguardando Pagamento
      </div>
    );
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
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-8 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Minhas Inscrições</h1>
                  <p className="text-gray-600 text-sm">
                    Acompanhe o status das suas inscrições nos torneios
                  </p>
                </div>
                
                <Button
                  onClick={() => navigate('/register-team')}
                  className="button-primary mt-4 md:mt-0"
                >
                  Nova Inscrição
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Carregando...</p>
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Nenhuma inscrição encontrada</h3>
                  <p className="text-sm text-gray-500">
                    Você ainda não se inscreveu em nenhum torneio.
                  </p>
                  <Button
                    onClick={() => navigate('/register-team')}
                    className="button-primary mt-2"
                  >
                    Inscrever-se agora
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div 
                      key={team.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-medium">{team.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 text-sm text-gray-500 mt-1">
                            <span>{getGameName(team.game)}</span>
                            <span>{team.institute}</span>
                          </div>
                          <div className="mt-2">
                            {getStatusBadge(team)}
                          </div>
                          {team.status === 'approved' && (
                            <p className="text-sm text-green-600 mt-2 font-medium">
                              Sua equipe foi aprovada para participar do torneio!
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                          <Button
                            onClick={() => navigate(`/registration/${team.id}`)}
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default MyRegistrations;
