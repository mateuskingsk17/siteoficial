
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import GameCard from '@/components/GameCard';
import Nav from '@/components/Nav';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-[-1]"></div>
        
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 bg-blue-100 text-primary text-xs font-medium rounded-full mb-4">
                  IFTO e-Sports 2025
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Campeonato de Games <br className="hidden md:block" />
                <span className="text-primary">do IFTO</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-600 mb-8 max-w-md mx-auto md:mx-0"
              >
                Venha participar do maior campeonato de jogos eletrônicos do Instituto Federal do Tocantins! Inscreva-se agora e mostre suas habilidades.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Button 
                  onClick={() => navigate(user ? '/register-team' : '/login')}
                  className="button-primary"
                >
                  {user ? 'Inscrever-se' : 'Fazer Login'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-secondary"
                >
                  Saiba Mais
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Gamers playing"
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Games Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Modalidades Disponíveis</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Escolha sua modalidade preferida e prepare-se para a competição. Inscreva-se em uma ou mais categorias e represente seu campus!
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameCard 
              game="valorant"
              title="Valorant"
              price="R$ 75,00 por equipe"
              description="Competição de Valorant 5v5. Monte sua equipe e dispute o título de melhor time do IFTO."
              imageSrc="https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-b7a9ac9bd8164de332a5fc9a2ad73f45"
              players="Equipes de 5 jogadores"
            />
            
            <GameCard 
              game="eafc-dupla"
              title="EA FC Dupla"
              price="R$ 30,00 por dupla"
              description="Competição de EA FC 24 em duplas. Reúna um parceiro e mostre quem domina o campo virtual."
              imageSrc="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              players="Duplas"
            />
            
            <GameCard 
              game="eafc-solo"
              title="EA FC Solo"
              price="R$ 15,00 individual"
              description="Competição individual de EA FC 24. Teste suas habilidades e conquiste o troféu de melhor jogador solo."
              imageSrc="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              players="Individual"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Pronto para competir?</h2>
            <p className="text-gray-600 mb-8">
              As inscrições estão abertas! Não perca a chance de representar seu campus
              e mostrar suas habilidades no maior campeonato de games do IFTO.
            </p>
            
            <Button 
              onClick={() => navigate(user ? '/register-team' : '/register')}
              className="button-primary"
            >
              {user ? 'Fazer Inscrição' : 'Criar Conta'}
            </Button>
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

export default Index;
