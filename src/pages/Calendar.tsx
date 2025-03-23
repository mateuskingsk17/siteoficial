import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Nav from '@/components/Nav';
const Calendar = () => {
  return <div className="min-h-screen">
      <Nav />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="max-w-4xl mx-auto">
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="rules">Regulamento</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="space-y-8">
                <div className="glass-card p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-6">Calendário do Campeonato</h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <span className="block text-sm text-gray-500 mb-1">4 de Agosto, 2025</span>
                      <h3 className="font-medium text-lg">Abertura das Inscrições</h3>
                      <p className="text-gray-600 text-sm">Início das inscrições para todas as modalidades</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <span className="block text-sm text-gray-500 mb-1">17 de Setembro, 2025</span>
                      <h3 className="font-medium text-lg">Encerramento das Inscrições</h3>
                      <p className="text-gray-600 text-sm">Último dia para realizar inscrições</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <span className="block text-sm text-gray-500 mb-1">24 de Setembro, 2025</span>
                      <h3 className="font-medium text-lg">Divulgação dos Grupos</h3>
                      <p className="text-gray-600 text-sm">Anúncio dos grupos e tabelas de competição</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <span className="block text-sm text-gray-500 mb-1">1 de Outubro, 2025</span>
                      <h3 className="font-medium text-lg">Início das Competições</h3>
                      <p className="text-gray-600 text-sm">Início dos jogos para todas as modalidades</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <span className="block text-sm text-gray-500 mb-1">2 de Outubro, 2025</span>
                      <h3 className="font-medium text-lg">Finais</h3>
                      <p className="text-gray-600 text-sm">Finais de todas as modalidades e premiação</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rules" className="space-y-8">
                <div className="glass-card p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-6">Regulamento Geral</h2>
                  
                  <div className="space-y-4 prose prose-sm max-w-none">
                    <div>
                      <h3 className="text-lg font-medium">1. Elegibilidade</h3>
                      <p>Podem participar do campeonato todos os alunos regularmente matriculados em qualquer campus do IFTO, mediante comprovação de vínculo com o Instituto.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">2. Inscrições</h3>
                      <ul className="list-disc pl-6">
                        <li>As inscrições devem ser realizadas exclusivamente por meio da plataforma oficial do evento.</li>
                        <li>O pagamento da taxa de inscrição é obrigatório para a confirmação da participação.</li>
                        <li>Cada aluno pode participar de uma ou mais modalidades, respeitando as taxas específicas para cada uma.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">3. Modalidade Valorant</h3>
                      <ul className="list-disc pl-6">
                        <li>Equipes compostas por 5 jogadores titulares.</li>
                        <li>Formato de competição: eliminatórias ate a grande final.</li>
                        <li>Mapas e formato específico serão divulgados após o encerramento das inscrições.</li>
                        <li>Penalidades para atrasos: após 15 minutos, a equipe ausente perde por W.O.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">4. Modalidade EA FC (Dupla e Solo)</h3>
                      <ul className="list-disc pl-6">
                        <li>Partidas realizadas no Computadores, conforme disponibilidade.</li>
                        <li>Duração das partidas: 3 minutos por tempo.</li>
                        <li>Configurações padrão do jogo, sem alterações personalizadas.</li>
                        <li>Sistema de eliminação dupla para ambas categorias.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">5. Conduta</h3>
                      <ul className="list-disc pl-6">
                        <li>É esperada conduta esportiva e respeitosa de todos os participantes.</li>
                        <li>Comportamentos tóxicos, ofensivos ou antidesportivos podem resultar em desqualificação.</li>
                        <li>Decisões da equipe de organização são finais e irrevogáveis.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">6. Premiação</h3>
                      <p>A premiação será anunciada oficialmente antes do início da competição e distribuída aos vencedores na cerimônia de encerramento.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
    </div>;
};
export default Calendar;