
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';

const About = () => {
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
            <span className="inline-block px-3 py-1 bg-blue-100 text-primary text-xs font-medium rounded-full mb-4">
              Sobre o Campeonato
            </span>
            
            <h1 className="text-4xl font-bold mb-8">IFTO e-Sports: Mais que um campeonato</h1>
            
            <div className="prose prose-lg mx-auto">
              <p>
                O crescimento da indústria de jogos eletrônicos tem sido exponencial, e os
                eSports se tornaram uma área de grande relevância educacional e profissional. A realização
                desse torneio busca não apenas o entretenimento, mas também o desenvolvimento de
                habilidades estratégicas, cognitivas e sociais dos participantes.
              </p>
              
              <p>
                Além disso, ao proporcionar
                um ambiente de competição estruturado, o projeto contribui para a valorização dos alunos e
                abre portas para futuras oportunidades acadêmicas e profissionais no setor de tecnologia e
                games.
              </p>
              
              <p>
                Além disso, o evento incentivará a participação ativa dos alunos na organização,
                promovendo o desenvolvimento de competências como liderança, gestão de eventos e
                trabalho em equipe. A visibilidade do torneio poderá atrair investidores e empresas do setor,
                fortalecendo a relação entre o IFTO e o mercado de eSports.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Objetivos do Campeonato</h2>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Promover a integração entre os campus do IFTO através dos eSports</li>
                <li>Desenvolver habilidades competitivas, estratégicas e de trabalho em equipe</li>
                <li>Fomentar a cultura gamer no ambiente acadêmico</li>
                <li>Criar oportunidades para os estudantes interessados em tecnologia e games</li>
                <li>Valorizar os talentos locais no cenário dos esportes eletrônicos</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Modalidades</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium">Valorant</h3>
                  <p className="text-gray-600">Competição por equipes de 5 jogadores</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium">EA FC Dupla</h3>
                  <p className="text-gray-600">Competição em duplas</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium">EA FC Solo</h3>
                  <p className="text-gray-600">Competição individual</p>
                </div>
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

export default About;
