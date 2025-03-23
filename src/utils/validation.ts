
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  
  // Check if email ends with @estudante.ifto.edu.br
  return email.endsWith('@estudante.ifto.edu.br') && 
    // Basic email validation
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateTeamName = (name: string, existingTeams: string[]): boolean => {
  return name.length >= 3 && !existingTeams.includes(name.toLowerCase());
};

export const validatePlayerName = (name: string): boolean => {
  return name.length >= 3;
};
