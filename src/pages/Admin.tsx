
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Team } from '@/types';
import { getTeams, updateTeamPaymentStatus, updateTeamStatus, deleteTeam, deleteTeamsByCriteria } from '@/utils/storage';
import { exportToCSV, sendStatusEmail } from '@/utils/export';
import { toast } from '@/components/ui/use-toast';
import ThemeAwareNav from '@/components/ThemeAwareNav';
import SearchBar from '@/components/admin/SearchBar';
import FilterOptions from '@/components/admin/FilterOptions';
import StatsCards from '@/components/admin/StatsCards';
import { 
  Trash, 
  AlertTriangle, 
  FileDown, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [instituteFilter, setInstituteFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [bulkDeleteOptions, setBulkDeleteOptions] = useState({
    unpaid: true,
    rejected: true,
    approved: false
  });

  useEffect(() => {
    // Redirect if not admin
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    // Load teams
    loadTeams();
  }, [user, navigate]);

  const loadTeams = () => {
    try {
      const loadedTeams = getTeams();
      console.log("Admin - Loaded teams:", loadedTeams);
      setTeams(loadedTeams);
    } catch (error) {
      console.error("Error loading teams:", error);
      toast({
        title: "Erro ao carregar equipes",
        description: "Ocorreu um erro ao carregar as equipes. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleApprovePayment = (teamId: string) => {
    updateTeamPaymentStatus(teamId, 'approved');
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, paymentStatus: 'approved' } : team
    ));
    toast({
      title: "Pagamento aprovado",
      description: "O pagamento da equipe foi aprovado com sucesso.",
    });
  };

  const handleApproveTeam = (teamId: string) => {
    updateTeamStatus(teamId, 'approved');
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, status: 'approved' } : team
    ));
    
    // Send email notification
    sendStatusEmail(teamId, 'approved');
    
    toast({
      title: "Equipe aprovada",
      description: "A equipe foi aprovada com sucesso e um email de notificação foi enviado.",
    });
  };

  const handleRejectTeam = (teamId: string) => {
    updateTeamStatus(teamId, 'rejected');
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, status: 'rejected' } : team
    ));
    
    // Send email notification
    sendStatusEmail(teamId, 'rejected');
    
    toast({
      title: "Equipe reprovada",
      description: "A equipe foi reprovada com sucesso e um email de notificação foi enviado.",
    });
  };

  const handleDeleteTeam = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete.id);
      setTeams(teams.filter(team => team.id !== teamToDelete.id));
      setTeamToDelete(null);
      toast({
        title: "Equipe excluída",
        description: "A equipe foi excluída com sucesso.",
      });
    }
  };

  const handleBulkDelete = () => {
    const deletedCount = deleteTeamsByCriteria({
      unpaid: bulkDeleteOptions.unpaid,
      rejected: bulkDeleteOptions.rejected,
      approved: bulkDeleteOptions.approved
    });
    
    if (deletedCount > 0) {
      loadTeams(); // Reload teams after deletion
      toast({
        title: "Exclusão em massa concluída",
        description: `${deletedCount} equipes foram excluídas com sucesso.`,
      });
    } else {
      toast({
        title: "Nenhuma equipe excluída",
        description: "Não foram encontradas equipes que correspondam aos critérios selecionados.",
      });
    }
    
    setShowBulkDeleteDialog(false);
  };

  const handleExportData = () => {
    try {
      exportToCSV(filteredTeams);
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Updated to allow deleting any team
  const canDeleteTeam = (team: Team) => {
    return true; // All teams can now be deleted
  };

  const countTeamsToDelete = () => {
    return teams.filter(team => 
      (bulkDeleteOptions.unpaid && team.paymentStatus === 'pending') || 
      (bulkDeleteOptions.rejected && team.status === 'rejected') ||
      (bulkDeleteOptions.approved && team.status === 'approved' && team.paymentStatus === 'approved')
    ).length;
  };

  // Apply all filters and search
  const filteredTeams = teams.filter(team => {
    // Game filter
    if (gameFilter !== 'all' && team.game !== gameFilter) return false;
    
    // Institute filter
    if (instituteFilter !== 'all' && team.institute !== instituteFilter) return false;
    
    // Payment status filter
    if (paymentFilter === 'approved' && team.paymentStatus !== 'approved') return false;
    if (paymentFilter === 'pending' && team.paymentStatus !== 'pending') return false;
    
    // Registration status filter
    if (statusFilter === 'approved' && team.status !== 'approved') return false;
    if (statusFilter === 'rejected' && team.status !== 'rejected') return false;
    if (statusFilter === 'pending' && team.status) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      
      // Check team name
      if (team.name.toLowerCase().includes(searchLower)) return true;
      
      // Check institute
      if (team.institute.toLowerCase().includes(searchLower)) return true;
      
      // Check players
      for (const player of team.players) {
        if (player.name.toLowerCase().includes(searchLower)) return true;
      }
      
      // No match found
      return false;
    }
    
    // Include by default if no search term
    return true;
  });

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <ThemeAwareNav />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            <div className="glass-card p-8 rounded-lg dark:bg-gray-900/80 dark:border-gray-800">
              <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Painel Administrativo</h1>
                  <p className="text-gray-600 dark:text-gray-400">Gerencie as inscrições e pagamentos do campeonato</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={loadTeams} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Atualizar
                  </Button>
                  
                  <Button 
                    onClick={handleExportData} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Exportar CSV
                  </Button>
                  
                  <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Trash className="h-4 w-4" />
                        Excluir em Massa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Excluir Equipes em Massa
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <p className="mb-4">Esta ação excluirá permanentemente as equipes selecionadas. Escolha quais tipos de equipes deseja excluir:</p>
                          
                          <div className="space-y-4 mb-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="unpaid"
                                checked={bulkDeleteOptions.unpaid}
                                onChange={() => setBulkDeleteOptions({
                                  ...bulkDeleteOptions,
                                  unpaid: !bulkDeleteOptions.unpaid
                                })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="unpaid" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                Equipes com pagamento pendente
                              </label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="rejected"
                                checked={bulkDeleteOptions.rejected}
                                onChange={() => setBulkDeleteOptions({
                                  ...bulkDeleteOptions,
                                  rejected: !bulkDeleteOptions.rejected
                                })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="rejected" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                Equipes reprovadas
                              </label>
                            </div>
                          
                            {/* Option for approved teams */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="approved"
                                checked={bulkDeleteOptions.approved}
                                onChange={() => setBulkDeleteOptions({
                                  ...bulkDeleteOptions,
                                  approved: !bulkDeleteOptions.approved
                                })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="approved" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                Equipes aprovadas e pagas
                              </label>
                            </div>
                          </div>
                          
                          <div className="py-2 px-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 text-sm">
                            {countTeamsToDelete()} equipes serão excluídas com base nos critérios selecionados.
                          </div>
                          
                          {bulkDeleteOptions.approved && (
                            <div className="mt-4 py-2 px-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
                              <strong>Atenção!</strong> Você está prestes a excluir equipes que já foram aprovadas e pagas. Esta ação não pode ser desfeita.
                            </div>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleBulkDelete}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          disabled={countTeamsToDelete() === 0}
                        >
                          Excluir {countTeamsToDelete()} Equipes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="mb-8">
                <StatsCards teams={teams} />
              </div>
              
              {/* Search & Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="w-full md:w-1/2">
                    <SearchBar 
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                  </Button>
                </div>
                
                {showFilters && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <FilterOptions 
                      gameFilter={gameFilter}
                      setGameFilter={setGameFilter}
                      instituteFilter={instituteFilter}
                      setInstituteFilter={setInstituteFilter}
                      paymentFilter={paymentFilter}
                      setPaymentFilter={setPaymentFilter}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                    />
                  </div>
                )}
              </div>
              
              <Tabs defaultValue="teams" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="teams">Equipes</TabsTrigger>
                  <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                  <TabsTrigger value="approval">Aprovações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="teams" className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Equipes Inscritas</h2>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredTeams.length} equipe{filteredTeams.length !== 1 ? 's' : ''} encontrada{filteredTeams.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  {teams.length === 0 ? (
                    <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">Nenhuma equipe inscrita até o momento.</p>
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">Nenhuma equipe encontrada com os filtros atuais.</p>
                    </div>
                  ) : (
                    <div className="overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome da Equipe</TableHead>
                            <TableHead>Modalidade</TableHead>
                            <TableHead>Jogadores</TableHead>
                            <TableHead>Instituto</TableHead>
                            <TableHead>Status Pagamento</TableHead>
                            <TableHead>Status Inscrição</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTeams.map(team => (
                            <TableRow key={team.id}>
                              <TableCell className="font-medium">{team.name}</TableCell>
                              <TableCell>
                                {team.game === 'valorant' 
                                  ? 'Valorant' 
                                  : team.game === 'eafc-dupla' 
                                    ? 'EA FC Dupla' 
                                    : 'EA FC Solo'}
                              </TableCell>
                              <TableCell>
                                <ul className="list-disc pl-5">
                                  {team.players.map(player => (
                                    <li key={player.id}>{player.name}</li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell>{team.institute}</TableCell>
                              <TableCell>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  team.paymentStatus === 'approved' 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                }`}>
                                  {team.paymentStatus === 'approved' ? 'Aprovado' : 'Pendente'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  team.status === 'approved'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : team.status === 'rejected'
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                }`}>
                                  {team.status === 'approved' 
                                    ? 'Aprovada' 
                                    : team.status === 'rejected' 
                                      ? 'Reprovada' 
                                      : 'Pendente'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {team.status !== 'approved' && team.paymentStatus === 'approved' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApproveTeam(team.id)}
                                      className="text-xs bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Aprovar
                                    </Button>
                                  )}
                                  
                                  {team.status !== 'rejected' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRejectTeam(team.id)}
                                      className="text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300"
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Reprovar
                                    </Button>
                                  )}
                                  
                                  {canDeleteTeam(team) && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setTeamToDelete(team)}
                                          className="text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300"
                                        >
                                          <Trash className="h-3 w-3 mr-1" />
                                          Excluir
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Excluir equipe?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. A equipe será removida permanentemente do sistema.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setTeamToDelete(null)}>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction onClick={handleDeleteTeam} className="bg-red-500 hover:bg-red-600 text-white">
                                            Excluir
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="payments" className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Pagamentos Pendentes</h2>
                  
                  {teams.filter(team => team.paymentStatus === 'pending').length === 0 ? (
                    <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">Nenhum pagamento pendente.</p>
                    </div>
                  ) : (
                    <div className="overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Equipe</TableHead>
                            <TableHead>Modalidade</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTeams
                            .filter(team => team.paymentStatus === 'pending')
                            .map(team => (
                              <TableRow key={team.id}>
                                <TableCell className="font-medium">{team.name}</TableCell>
                                <TableCell>
                                  {team.game === 'valorant' 
                                    ? 'Valorant' 
                                    : team.game === 'eafc-dupla' 
                                      ? 'EA FC Dupla' 
                                      : 'EA FC Solo'}
                                </TableCell>
                                <TableCell>
                                  {team.game === 'valorant' 
                                    ? 'R$ 75,00' 
                                    : team.game === 'eafc-dupla' 
                                      ? 'R$ 30,00' 
                                      : 'R$ 15,00'}
                                </TableCell>
                                <TableCell>
                                  <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
                                    Pendente
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApprovePayment(team.id)}
                                      className="text-xs bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Aprovar
                                    </Button>
                                    
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setTeamToDelete(team)}
                                          className="text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300"
                                        >
                                          <Trash className="h-3 w-3 mr-1" />
                                          Excluir
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Excluir equipe?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. A equipe será removida permanentemente do sistema.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setTeamToDelete(null)}>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction onClick={handleDeleteTeam} className="bg-red-500 hover:bg-red-600 text-white">
                                            Excluir
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="approval" className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Aprovação de Equipes</h2>
                  
                  {filteredTeams.filter(team => !team.status || team.status === 'rejected').length === 0 ? (
                    <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">Nenhuma equipe pendente de aprovação.</p>
                    </div>
                  ) : (
                    <div className="overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Equipe</TableHead>
                            <TableHead>Modalidade</TableHead>
                            <TableHead>Instituto</TableHead>
                            <TableHead>Status Pagamento</TableHead>
                            <TableHead>Status Inscrição</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTeams
                            .filter(team => !team.status || team.status === 'rejected')
                            .map(team => (
                              <TableRow key={team.id}>
                                <TableCell className="font-medium">{team.name}</TableCell>
                                <TableCell>
                                  {team.game === 'valorant' 
                                    ? 'Valorant' 
                                    : team.game === 'eafc-dupla' 
                                      ? 'EA FC Dupla' 
                                      : 'EA FC Solo'}
                                </TableCell>
                                <TableCell>{team.institute}</TableCell>
                                <TableCell>
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    team.paymentStatus === 'approved' 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                  }`}>
                                    {team.paymentStatus === 'approved' ? 'Aprovado' : 'Pendente'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    team.status === 'rejected'
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                  }`}>
                                    {team.status === 'rejected' ? 'Reprovada' : 'Pendente'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApproveTeam(team.id)}
                                      className="text-xs bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
                                      disabled={team.paymentStatus !== 'approved'}
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Aprovar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRejectTeam(team.id)}
                                      className="text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300"
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Reprovar
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setTeamToDelete(team)}
                                          className="text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300"
                                        >
                                          <Trash className="h-3 w-3 mr-1" />
                                          Excluir
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Excluir equipe?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. A equipe será removida permanentemente do sistema.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setTeamToDelete(null)}>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction onClick={handleDeleteTeam} className="bg-red-500 hover:bg-red-600 text-white">
                                            Excluir
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} IFTO e-Sports. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Termos de Uso</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Privacidade</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
