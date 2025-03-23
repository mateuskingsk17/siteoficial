import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Game, Institute, Team } from '@/types';
import { validateTeamName, validatePlayerName } from '@/utils/validation';
import { saveTeam, getTeamNames } from '@/utils/storage';
import { toast } from '@/components/ui/use-toast';
import Nav from '@/components/Nav';
import PixPayment from '@/components/PixPayment';

const RegisterTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const gameFromQuery = query.get('game') as Game | null;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [game, setGame] = useState<Game | ''>('');
  const [teamName, setTeamName] = useState('');
  const [institute, setInstitute] = useState<Institute | ''>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState<Team | null>(null);
  
  // Initialize game from query parameter
  useEffect(() => {
    if (gameFromQuery) {
      setGame(gameFromQuery);
    }
  }, [gameFromQuery]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Initialize players array based on game type
  useEffect(() => {
    if (game === 'valorant') {
      setPlayers(Array(5).fill(''));
    } else if (game === 'eafc-dupla') {
      setPlayers(Array(2).fill(''));
    } else if (game === 'eafc-solo') {
      setPlayers(['']);
    }
  }, [game]);
  
  // Handle player name change
  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };
  
  // Add new player for Valorant teams
  const handleAddPlayer = () => {
    if (game !== 'valorant' || players.length >= 5) return;
    
    if (!validatePlayerName(newPlayer)) {
      toast({
        title: "Erro",
        description: "Nome do jogador deve ter pelo menos 3 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    setPlayers([...players, newPlayer]);
    setNewPlayer('');
  };
  
  // Submit team registration
  const handleSubmit = async () => {
    if (!user) return;
    
    // Validate team name
    if (!validateTeamName(teamName, getTeamNames())) {
      toast({
        title: "Erro",
        description: "Nome da equipe inválido ou já existe.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate players
    const validPlayers = players.filter(p => validatePlayerName(p));
    if (
      (game === 'valorant' && validPlayers.length < 5) ||
      (game === 'eafc-dupla' && validPlayers.length < 2) ||
      (game === 'eafc-solo' && validPlayers.length < 1)
    ) {
      toast({
        title: "Erro",
        description: "Preencha os nomes de todos os jogadores corretamente.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate institute
    if (!institute) {
      toast({
        title: "Erro",
        description: "Selecione um instituto.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new team without setting payment status to pending immediately
      const newTeam: Team = {
        id: 'team-' + Date.now(),
        name: teamName,
        game: game as Game,
        players: validPlayers.map(name => ({ id: 'player-' + Date.now() + Math.random(), name })),
        institute: institute as Institute,
        paymentStatus: 'pending', // This will be confirmed after payment
        createdBy: user.id
      };
      
      saveTeam(newTeam);
      setRegisteredTeam(newTeam);
      setCurrentStep(3);
      
      toast({
        title: "Equipe registrada",
        description: "Agora realize o pagamento para confirmar sua inscrição.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a equipe.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Complete registration process
  const handleComplete = () => {
    toast({
      title: "Inscrição concluída",
      description: "Sua inscrição foi realizada com sucesso. Aguarde a confirmação do pagamento.",
    });
    navigate('/');
  };
  
  // Render step 1: Select game
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Selecione a Modalidade</label>
        <Select value={game} onValueChange={(value) => setGame(value as Game)}>
          <SelectTrigger className="input-primary">
            <SelectValue placeholder="Selecione a modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="valorant">Valorant (5 jogadores)</SelectItem>
            <SelectItem value="eafc-dupla">EA FC Dupla (2 jogadores)</SelectItem>
            <SelectItem value="eafc-solo">EA FC Solo (individual)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        disabled={!game}
        onClick={() => setCurrentStep(2)}
        className="button-primary w-full"
      >
        Continuar
      </Button>
    </motion.div>
  );
  
  // Render step 2: Team and player details
  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Team Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome da Equipe</label>
        <Input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Digite o nome da sua equipe"
          className="input-primary"
        />
      </div>
      
      {/* Institute */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Instituto</label>
        <Select value={institute} onValueChange={(value) => setInstitute(value as Institute)}>
          <SelectTrigger className="input-primary">
            <SelectValue placeholder="Selecione seu instituto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IFTO Campus Araguaína">IFTO Campus Araguaína</SelectItem>
            <SelectItem value="IFTO Campus Araguatins">IFTO Campus Araguatins</SelectItem>
            <SelectItem value="IFTO Campus Colinas do Tocantins">IFTO Campus Colinas do Tocantins</SelectItem>
            <SelectItem value="IFTO Campus Dianópolis">IFTO Campus Dianópolis</SelectItem>
            <SelectItem value="IFTO Campus Gurupi">IFTO Campus Gurupi</SelectItem>
            <SelectItem value="IFTO Campus Palmas">IFTO Campus Palmas</SelectItem>
            <SelectItem value="IFTO Campus Paraíso do Tocantins">IFTO Campus Paraíso do Tocantins</SelectItem>
            <SelectItem value="IFTO Campus Porto Nacional">IFTO Campus Porto Nacional</SelectItem>
            <SelectItem value="IFTO Campus Avançado Formoso do Araguaia">IFTO Campus Avançado Formoso do Araguaia</SelectItem>
            <SelectItem value="IFTO Campus Avançado Lagoa da Confusão">IFTO Campus Avançado Lagoa da Confusão</SelectItem>
            <SelectItem value="IFTO Campus Avançado Pedro Afonso">IFTO Campus Avançado Pedro Afonso</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Players */}
      <div className="space-y-4">
        <label className="text-sm font-medium">
          {game === 'valorant' 
            ? 'Jogadores (5)' 
            : game === 'eafc-dupla' 
              ? 'Jogadores (2)' 
              : 'Jogador'}
        </label>
        
        {players.map((player, index) => (
          <Input
            key={index}
            value={player}
            onChange={(e) => handlePlayerChange(index, e.target.value)}
            placeholder={`Nome do jogador ${index + 1}`}
            className="input-primary"
          />
        ))}
        
        {/* Add more players for Valorant teams */}
        {game === 'valorant' && players.length < 5 && (
          <div className="flex space-x-2">
            <Input
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Adicionar jogador"
              className="input-primary"
            />
            <Button
              onClick={handleAddPlayer}
              className="px-4"
              variant="outline"
            >
              +
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button
          onClick={() => setCurrentStep(1)}
          variant="outline"
          className="flex-1"
        >
          Voltar
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="button-primary flex-1"
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Equipe'}
        </Button>
      </div>
    </motion.div>
  );
  
  // Render step 3: Payment
  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {registeredTeam && (
        <PixPayment team={registeredTeam} onComplete={handleComplete} />
      )}
    </motion.div>
  );
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };
  
  if (!user) {
    return null;
  }

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
                <h1 className="text-2xl font-bold mb-2">Inscrição para o Campeonato</h1>
                <p className="text-gray-600 text-sm">
                  {currentStep === 1 && 'Selecione a modalidade para continuar'}
                  {currentStep === 2 && 'Preencha os dados da sua equipe'}
                  {currentStep === 3 && 'Realize o pagamento para confirmar sua inscrição'}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="relative mb-8">
                <div className="flex justify-between mb-2">
                  {['Modalidade', 'Dados', 'Pagamento'].map((step, index) => (
                    <div 
                      key={index}
                      className={`text-xs font-medium ${
                        currentStep > index ? 'text-primary' : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {renderStepContent()}
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

export default RegisterTeam;
