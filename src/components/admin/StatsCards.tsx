
import React from 'react';
import { Team } from '@/types';
import { 
  Users, 
  DollarSign, 
  BarChart, 
  MapPin,
  Gamepad2,
  Trophy
} from 'lucide-react';

interface StatsCardsProps {
  teams: Team[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ teams }) => {
  // Calculate total registered players
  const totalPlayers = teams.reduce((acc, team) => acc + team.players.length, 0);
  
  // Calculate total value
  const calculateTeamValue = (team: Team): number => {
    if (team.game === 'valorant') return 75;
    if (team.game === 'eafc-dupla') return 30;
    return 15; // eafc-solo
  };
  
  const totalValue = teams.reduce((acc, team) => {
    if (team.paymentStatus === 'approved') {
      return acc + calculateTeamValue(team);
    }
    return acc;
  }, 0);

  // Calculate stats by game
  const gameStats = {
    valorant: teams.filter(team => team.game === 'valorant').length,
    'eafc-dupla': teams.filter(team => team.game === 'eafc-dupla').length,
    'eafc-solo': teams.filter(team => team.game === 'eafc-solo').length,
  };
  
  // Find most represented institute
  const instituteCount: Record<string, number> = {};
  teams.forEach(team => {
    instituteCount[team.institute] = (instituteCount[team.institute] || 0) + 1;
  });
  
  let mostRepresentedInstitute = '';
  let highestCount = 0;
  
  Object.entries(instituteCount).forEach(([institute, count]) => {
    if (count > highestCount) {
      mostRepresentedInstitute = institute;
      highestCount = count;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Jogadores Inscritos</p>
            <p className="text-2xl font-bold">{totalPlayers}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Arrecadado</p>
            <p className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Equipes</p>
            <p className="text-2xl font-bold">{teams.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Modalidades</p>
            <div className="flex gap-2 text-sm mt-1">
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-xs">
                Valorant: {gameStats.valorant}
              </span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                EA FC Dupla: {gameStats['eafc-dupla']}
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                EA FC Solo: {gameStats['eafc-solo']}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700 md:col-span-2">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Campus Mais Representado</p>
            <p className="text-lg font-bold">{mostRepresentedInstitute || "Nenhum"}</p>
            {mostRepresentedInstitute && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Com {highestCount} equipe{highestCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
