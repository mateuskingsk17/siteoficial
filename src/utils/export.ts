
import { Team } from '@/types';

// Function to export teams to CSV
export const exportToCSV = (teams: Team[]): void => {
  // Create CSV header
  const headers = [
    'ID', 
    'Nome da Equipe', 
    'Modalidade', 
    'Jogadores', 
    'Instituto', 
    'Status Pagamento', 
    'Status Inscrição',
    'Número de Registro'
  ].join(',');
  
  // Create rows
  const rows = teams.map(team => {
    const gameLabel = 
      team.game === 'valorant' ? 'Valorant' : 
      team.game === 'eafc-dupla' ? 'EA FC Dupla' : 
      'EA FC Solo';
    
    const paymentStatus = team.paymentStatus === 'approved' ? 'Aprovado' : 'Pendente';
    const status = 
      team.status === 'approved' ? 'Aprovada' : 
      team.status === 'rejected' ? 'Reprovada' : 
      'Pendente';
    
    const playerNames = team.players
      .map(player => player.name)
      .join('; ');
    
    return [
      team.id,
      team.name,
      gameLabel,
      playerNames,
      team.institute,
      paymentStatus,
      status,
      team.registrationNumber || 'N/A'
    ].map(value => `"${value}"`).join(',');
  });
  
  // Combine header and rows
  const csv = [headers, ...rows].join('\n');
  
  // Create a blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set link attributes
  link.setAttribute('href', url);
  link.setAttribute('download', `equipes_ifto_esports_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  // Append to document, trigger download, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to simulate email sending
export const sendStatusEmail = (teamId: string, status: 'approved' | 'rejected'): void => {
  console.log(`Email sent for team ${teamId} with status: ${status}`);
  // In a real application, this would call an API to send an email
};
