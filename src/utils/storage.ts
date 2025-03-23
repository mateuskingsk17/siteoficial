import { User, Team } from '@/types';

// User storage
export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const updateUser = (userId: string, userData: Partial<User>): void => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    // Keep the password, don't update it
    const password = users[userIndex].password;
    users[userIndex] = { ...users[userIndex], ...userData, password };
    localStorage.setItem('users', JSON.stringify(users));
    
    // If current user is being updated, also update currentUser in localStorage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const { password, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    }
  }
};

export const setCurrentUser = (user: User): void => {
  const { password, ...userWithoutPassword } = user;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
};

export const getCurrentUser = (): Omit<User, 'password'> | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};

// Password reset functionality
export const generatePasswordResetToken = (email: string): string | null => {
  const user = getUserByEmail(email);
  if (!user) return null;
  
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 3600000; // 1 hour from now
  
  // Store token in localStorage
  const passwordResetTokens = getPasswordResetTokens();
  passwordResetTokens[email] = { token, expiresAt };
  localStorage.setItem('passwordResetTokens', JSON.stringify(passwordResetTokens));
  
  return token;
};

export const getPasswordResetTokens = (): Record<string, { token: string, expiresAt: number }> => {
  const tokens = localStorage.getItem('passwordResetTokens');
  return tokens ? JSON.parse(tokens) : {};
};

export const savePasswordResetToken = (email: string, token: string): void => {
  const passwordResetTokens = getPasswordResetTokens();
  const expiresAt = Date.now() + 3600000; // 1 hour from now
  
  passwordResetTokens[email] = { token, expiresAt };
  localStorage.setItem('passwordResetTokens', JSON.stringify(passwordResetTokens));
};

export const verifyPasswordResetToken = (email: string, token: string): boolean => {
  const passwordResetTokens = getPasswordResetTokens();
  const tokenData = passwordResetTokens[email];
  
  if (!tokenData) return false;
  if (tokenData.token !== token) return false;
  if (tokenData.expiresAt < Date.now()) return false;
  
  return true;
};

export const resetPassword = (email: string, newPassword: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.email === email);
  
  if (userIndex === -1) return false;
  
  users[userIndex].password = newPassword;
  localStorage.setItem('users', JSON.stringify(users));
  
  return true;
};

export const clearPasswordResetToken = (email: string): void => {
  const passwordResetTokens = getPasswordResetTokens();
  delete passwordResetTokens[email];
  localStorage.setItem('passwordResetTokens', JSON.stringify(passwordResetTokens));
};

// Admin user setup
export const setupAdminUser = (): void => {
  const users = getUsers();
  const adminExists = users.some(user => user.isAdmin);
  
  if (!adminExists) {
    saveUser({
      id: 'admin-' + Date.now(),
      email: 'admin@ifto.edu.br',
      password: 'admin123',
      name: 'Administrador',
      isAdmin: true
    });
  }
};

// Team storage
export const saveTeam = (team: Team): void => {
  const teams = getTeams();
  // Check if team with this ID already exists
  const existingTeamIndex = teams.findIndex(t => t.id === team.id);
  
  if (existingTeamIndex !== -1) {
    // Update existing team
    teams[existingTeamIndex] = team;
  } else {
    // Add new team
    teams.push(team);
  }
  
  localStorage.setItem('teams', JSON.stringify(teams));
  console.log('Teams after save:', teams); // Debug log
};

export const getTeams = (): Team[] => {
  try {
    const teams = localStorage.getItem('teams');
    const parsedTeams = teams ? JSON.parse(teams) : [];
    console.log('Retrieved teams:', parsedTeams); // Debug log
    return parsedTeams;
  } catch (error) {
    console.error('Error retrieving teams:', error);
    return [];
  }
};

export const getTeamsByUser = (userId: string): Team[] => {
  const teams = getTeams();
  return teams.filter(team => team.createdBy === userId);
};

export const getTeamNames = (): string[] => {
  return getTeams().map(team => team.name.toLowerCase());
};

export const updateTeamPaymentStatus = (teamId: string, status: 'pending' | 'approved'): void => {
  const teams = getTeams();
  const teamIndex = teams.findIndex(team => team.id === teamId);
  
  if (teamIndex !== -1) {
    teams[teamIndex].paymentStatus = status;
    
    // Generate a registration number if payment is approved
    if (status === 'approved' && !teams[teamIndex].registrationNumber) {
      teams[teamIndex].registrationNumber = generateRegistrationNumber();
    }
    
    localStorage.setItem('teams', JSON.stringify(teams));
    console.log(`Team ${teamId} payment status updated to ${status}`);
  }
};

// Generate a random registration number
const generateRegistrationNumber = (): string => {
  return '#' + Math.floor(1000 + Math.random() * 9000).toString();
};

export const updateTeamStatus = (teamId: string, status: 'approved' | 'rejected'): void => {
  const teams = getTeams();
  const teamIndex = teams.findIndex(team => team.id === teamId);
  
  if (teamIndex !== -1) {
    teams[teamIndex].status = status;
    localStorage.setItem('teams', JSON.stringify(teams));
    console.log(`Team ${teamId} status updated to ${status}`);
  }
};

export const getTeamById = (teamId: string): Team | undefined => {
  const teams = getTeams();
  return teams.find(team => team.id === teamId);
};

export const deleteTeam = (teamId: string): void => {
  let teams = getTeams();
  teams = teams.filter(team => team.id !== teamId);
  localStorage.setItem('teams', JSON.stringify(teams));
};

// Get user teams with status
export const getUserTeams = (userId: string): Team[] => {
  const teams = getTeams();
  return teams.filter(team => team.createdBy === userId);
};

// Modified function to allow deletion of any team, including approved ones
export const deleteTeamsByCriteria = (criteria: {
  unpaid?: boolean;
  rejected?: boolean;
  approved?: boolean;
}): number => {
  const teams = getTeams();
  let initialCount = teams.length;
  
  // Filter out teams to keep based on criteria
  let filteredTeams = teams.filter(team => {
    // Check approved criteria
    if (criteria.approved && team.status === 'approved' && team.paymentStatus === 'approved') {
      return false; // Delete this team if approved criteria is selected
    }
    
    // Check unpaid criteria
    if (criteria.unpaid && team.paymentStatus === 'pending') {
      return false; // Delete this team
    }
    
    // Check rejected criteria
    if (criteria.rejected && team.status === 'rejected') {
      return false; // Delete this team
    }
    
    // Keep all other teams
    return true;
  });
  
  const deletedCount = initialCount - filteredTeams.length;
  
  if (deletedCount > 0) {
    localStorage.setItem('teams', JSON.stringify(filteredTeams));
    console.log(`Deleted ${deletedCount} teams based on criteria`);
  }
  
  return deletedCount;
};
