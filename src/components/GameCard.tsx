
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Game } from '@/types';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface GameCardProps {
  game: Game;
  title: string;
  price: string;
  description: string;
  imageSrc: string;
  players: string;
}

const GameCard = ({ game, title, price, description, imageSrc, players }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out-expo"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        </AspectRatio>
        <div className="absolute top-3 right-3">
          <span className="bg-primary/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            {price}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{players}</p>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        
        <Button 
          onClick={() => navigate(`/register-team?game=${game}`)}
          className="button-primary w-full"
        >
          Inscrever-se
        </Button>
      </div>
    </motion.div>
  );
};

export default GameCard;
