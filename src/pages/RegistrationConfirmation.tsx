
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { getTeamById } from '@/utils/storage';
import { Check, Printer, ShieldCheck, Clock, XCircle } from 'lucide-react';
import Nav from '@/components/Nav';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const RegistrationConfirmation = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (teamId) {
      const foundTeam = getTeamById(teamId);
      if (foundTeam && foundTeam.createdBy === user.id) {
        setTeam(foundTeam);
      } else {
        navigate('/my-registrations');
      }
    } else {
      navigate('/my-registrations');
    }
  }, [teamId, user, navigate]);

  const getGameName = (gameCode: string) => {
    switch (gameCode) {
      case 'valorant': return 'Valorant';
      case 'eafc-solo': return 'EA FC 24 (Solo)';
      case 'eafc-dupla': return 'EA FC 24 (Dupla)';
      default: return gameCode;
    }
  };

  const getStatusText = () => {
    if (team.status === 'approved') return 'Aprovado para competir';
    if (team.status === 'rejected') return 'Reprovado';
    if (team.paymentStatus === 'approved') return 'Aguardando Aprovação do Administrador';
    return 'Aguardando Pagamento';
  };

  const getStatusColor = () => {
    if (team.status === 'approved') return 'text-green-600';
    if (team.status === 'rejected') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = () => {
    if (team.status === 'approved') return <ShieldCheck className="h-8 w-8 text-green-600" />;
    if (team.status === 'rejected') return <XCircle className="h-8 w-8 text-red-600" />;
    if (team.paymentStatus === 'approved') return <Clock className="h-8 w-8 text-blue-600" />;
    return <Clock className="h-8 w-8 text-yellow-600" />;
  };

  const getProgressValue = () => {
    if (team.status === 'approved') return 100;
    if (team.status === 'rejected') return 50; // Stalled at payment
    if (team.paymentStatus === 'approved') return 66;
    return 33;
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Sucesso",
      description: "Comprovante enviado para impressão.",
    });
  };

  if (!team) return null;

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <Nav />
      </div>
      
      <section className="pt-32 pb-16 print:pt-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card p-8 rounded-lg print:border print:shadow-none">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  {getStatusIcon()}
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {team.status === 'approved' 
                    ? 'Inscrição Aprovada!' 
                    : team.status === 'rejected'
                    ? 'Inscrição Reprovada'
                    : 'Inscrição Confirmada!'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {team.status === 'approved' 
                    ? 'Sua equipe foi aprovada para participar do torneio!' 
                    : team.status === 'rejected'
                    ? 'Sua inscrição foi reprovada. Entre em contato com a organização.'
                    : 'Seu pagamento foi processado com sucesso.'}
                </p>
              </div>
              
              <div className="mb-6 print:hidden">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Status da inscrição:</p>
                  <Progress value={getProgressValue()} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pagamento</span>
                    <span>Análise</span>
                    <span>Aprovação</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Registration details */}
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Torneio:</span>
                    <span>{getGameName(team.game)}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Equipe/Jogador:</span>
                    <span>{team.name}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Campus:</span>
                    <span>{team.institute}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Status:</span>
                    <span className={getStatusColor()}>{getStatusText()}</span>
                  </div>
                </div>
                
                {team.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <ShieldCheck className="h-5 w-5 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">
                      Parabéns! Sua equipe está confirmada para participar do torneio.
                    </p>
                  </div>
                )}
                
                <div className="text-center space-y-1 mt-6">
                  <p className="text-sm text-gray-600">
                    Um email de confirmação foi enviado para seu endereço de email.
                  </p>
                  <p className="text-sm font-medium">
                    Guarde o número de inscrição: {team.registrationNumber || '#0000'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 print:hidden">
                  <Button 
                    onClick={() => navigate('/my-registrations')}
                    variant="default"
                    className="w-full"
                  >
                    Voltar para Minhas Inscrições
                  </Button>
                  
                  <Button 
                    onClick={handlePrint}
                    variant="outline"
                    className="w-full"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Comprovante
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <footer className="bg-gray-50 py-8 print:hidden">
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

export default RegistrationConfirmation;
