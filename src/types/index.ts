export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  bio?: string;
  profileImage?: string;
  isAdmin?: boolean;
}

export interface Team {
  id: string;
  name: string;
  game: Game;
  players: Player[];
  institute: Institute;
  paymentStatus: PaymentStatus;
  status?: 'approved' | 'rejected';
  createdBy: string;
  registrationNumber?: string;
}

export interface Player {
  id: string;
  name: string;
}

export type Game = 'valorant' | 'eafc-solo' | 'eafc-dupla';

export type PaymentStatus = 'pending' | 'approved';

export type Institute = 
  | 'IFTO Campus Araguaína'
  | 'IFTO Campus Araguatins'
  | 'IFTO Campus Colinas do Tocantins'
  | 'IFTO Campus Dianópolis'
  | 'IFTO Campus Gurupi'
  | 'IFTO Campus Palmas'
  | 'IFTO Campus Paraíso do Tocantins'
  | 'IFTO Campus Porto Nacional'
  | 'IFTO Campus Avançado Formoso do Araguaia'
  | 'IFTO Campus Avançado Lagoa da Confusão'
  | 'IFTO Campus Avançado Pedro Afonso';
