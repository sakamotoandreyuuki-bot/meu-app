import React, { useState, useMemo } from 'react';
import { BusinessCard } from '../types';
import ContactCard from './ContactCard';

interface ContactListProps {
  cards: BusinessCard[];
  onViewDetails: (id: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ cards, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards;
    return cards.filter(card =>
      card.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar por nome ou empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white text-gray-900"
        />
      </div>

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCards.map(card => (
            <ContactCard 
              key={card.id} 
              card={card} 
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <p className="text-gray-500 text-lg">Nenhum cartão encontrado.</p>
          <p className="text-gray-400 mt-2">Clique no botão da câmera para adicionar seu primeiro contato.</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;