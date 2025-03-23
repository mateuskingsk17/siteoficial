
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Institute } from '@/types';

interface FilterOptionsProps {
  gameFilter: string;
  setGameFilter: (value: string) => void;
  instituteFilter: string;
  setInstituteFilter: (value: string) => void;
  paymentFilter: string;
  setPaymentFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  gameFilter,
  setGameFilter,
  instituteFilter,
  setInstituteFilter,
  paymentFilter,
  setPaymentFilter,
  statusFilter,
  setStatusFilter
}) => {
  const institutes: Institute[] = [
    'IFTO Campus Araguaína',
    'IFTO Campus Araguatins',
    'IFTO Campus Colinas do Tocantins',
    'IFTO Campus Dianópolis',
    'IFTO Campus Gurupi',
    'IFTO Campus Palmas',
    'IFTO Campus Paraíso do Tocantins',
    'IFTO Campus Porto Nacional',
    'IFTO Campus Avançado Formoso do Araguaia',
    'IFTO Campus Avançado Lagoa da Confusão',
    'IFTO Campus Avançado Pedro Afonso'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs font-medium mb-1">Modalidade</label>
        <Select value={gameFilter} onValueChange={setGameFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as modalidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as modalidades</SelectItem>
            <SelectItem value="valorant">Valorant</SelectItem>
            <SelectItem value="eafc-dupla">EA FC Dupla</SelectItem>
            <SelectItem value="eafc-solo">EA FC Solo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-xs font-medium mb-1">Campus</label>
        <Select value={instituteFilter} onValueChange={setInstituteFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os campus</SelectItem>
            {institutes.map((institute) => (
              <SelectItem key={institute} value={institute}>{institute}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-xs font-medium mb-1">Pagamento</label>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os pagamentos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pagamentos</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-xs font-medium mb-1">Status</label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Reprovados</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterOptions;
