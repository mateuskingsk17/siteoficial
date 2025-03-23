
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Team } from '@/types';
import { updateTeamPaymentStatus } from '@/utils/storage';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PixPaymentProps {
  team: Team;
  onComplete: () => void;
}

const PixPayment = ({ team, onComplete }: PixPaymentProps) => {
  const navigate = useNavigate();
  
  const getPrice = () => {
    switch (team.game) {
      case 'valorant':
        return 'R$ 75,00';
      case 'eafc-dupla':
        return 'R$ 30,00';
      case 'eafc-solo':
        return 'R$ 15,00';
      default:
        return 'R$ 0,00';
    }
  };

  const getQRCodeImage = () => {
    switch (team.game) {
      case 'valorant':
        return "/lovable-uploads/f193b31d-3f23-43ba-91cb-9138c4438d5c.png";
      case 'eafc-dupla':
        return "/lovable-uploads/3e86049c-d361-4908-b92d-eca677471a3d.png";
      case 'eafc-solo':
        return "/lovable-uploads/356207b4-10f4-42cc-89bf-8dc97f49dde5.png";
      default:
        return "https://upload.wikimedia.org/wikipedia/commons/d/de/Qr-code-pattern.svg";
    }
  };

  const handlePaymentConfirmation = () => {
    // Update payment status to approved directly
    updateTeamPaymentStatus(team.id, 'approved');
    
    // Navigate to the confirmation page
    navigate(`/registration/${team.id}`);
    
    // Still call onComplete for backward compatibility
    onComplete();
  };

  const renderStatusAlert = () => {
    if (team.paymentStatus === 'pending' && !team.status) {
      return (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Aguardando pagamento</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Por favor, realize o pagamento para confirmar sua inscrição.
          </AlertDescription>
        </Alert>
      );
    } else if (team.paymentStatus === 'approved' && !team.status) {
      return (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Pagamento aprovado</AlertTitle>
          <AlertDescription className="text-blue-700">
            Seu pagamento foi aprovado. Aguardando aprovação da inscrição.
          </AlertDescription>
        </Alert>
      );
    } else if (team.status === 'approved') {
      return (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Inscrição aprovada</AlertTitle>
          <AlertDescription className="text-green-700">
            Sua equipe está inscrita e confirmada para o torneio!
          </AlertDescription>
        </Alert>
      );
    } else if (team.status === 'rejected') {
      return (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Inscrição reprovada</AlertTitle>
          <AlertDescription className="text-red-700">
            Sua inscrição foi reprovada. Entre em contato com a organização para mais detalhes.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 rounded-lg max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Pagamento via PIX</h2>
      
      <div className="mb-6">
        {renderStatusAlert()}
        
        <p className="text-sm text-gray-600 mb-2">Equipe: {team.name}</p>
        <p className="text-sm text-gray-600 mb-4">Valor: {getPrice()}</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="flex justify-center mb-4">
            <div className="border-2 border-gray-300 p-2 rounded-lg bg-white">
              <img 
                src={getQRCodeImage()} 
                alt="QR Code PIX" 
                className="w-64 h-64"
              />
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 mb-1">Escaneie o código QR com o app do seu banco</p>
            <p className="text-xs text-gray-500">ou</p>
            
            <div className="mt-2">
              <p className="text-sm font-medium">Chave PIX: gmateus919@gmail.com</p>
              <button 
                className="text-xs text-primary mt-1 hover:underline"
                onClick={() => {
                  navigator.clipboard.writeText('gmateus919@gmail.com');
                  toast({ description: "Chave PIX copiada!" });
                }}
              >
                Copiar chave
              </button>
            </div>
            
            <div className="mt-4 text-left">
              <h3 className="text-sm font-semibold mb-2">Sobre o QR Code</h3>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Nome</span>
                <span className="font-medium">MATEUS GOMES DA COSTA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chave Pix</span>
                <span className="font-medium">gmateus919@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {(!team.paymentStatus || team.paymentStatus === 'pending') && (
        <Button 
          onClick={handlePaymentConfirmation}
          className="button-primary w-full"
        >
          Confirmar Pagamento
        </Button>
      )}
      
      {team.paymentStatus === 'approved' && (
        <Button 
          disabled
          className="w-full bg-green-500 hover:bg-green-600 cursor-not-allowed"
        >
          Pagamento Aprovado
        </Button>
      )}
    </motion.div>
  );
};

export default PixPayment;
