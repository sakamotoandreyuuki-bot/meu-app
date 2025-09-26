import React from 'react';
import { BusinessCard } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BuildingIcon } from './icons/BuildingIcon';

interface ContactCardProps {
  card: BusinessCard;
  onViewDetails: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ card, onViewDetails }) => {
  return (
    <div
      onClick={() => onViewDetails(card.id)}
      className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out border border-gray-200 flex items-center space-x-4"
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
           {card.fotoPessoaBase64 ? (
              <img src={`data:image/jpeg;base64,${card.fotoPessoaBase64}`} alt={card.nome} className="w-full h-full object-cover" />
          ) : (
              <UserIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>
      </div>
      
      <div className="flex-grow min-w-0">
          <h3 className="text-xl font-bold text-gray-800 truncate">{card.nome}</h3>
          <p className="text-sm text-gray-500 truncate">{card.cargo}</p>
          <div className="flex items-center text-gray-600 mt-1">
           <BuildingIcon className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
           <span className="truncate text-sm">{card.empresa}</span>
         </div>
      </div>
    </div>
  );
};

export default ContactCard;