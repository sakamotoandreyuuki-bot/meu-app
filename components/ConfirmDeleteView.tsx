import React from 'react';
import { BusinessCard } from '../types';
import { UserIcon } from './icons/UserIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface ConfirmDeleteViewProps {
  card: BusinessCard;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteView: React.FC<ConfirmDeleteViewProps> = ({ card, onConfirm, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full mb-4 bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
            {card.fotoPessoaBase64 ? (
                <img src={`data:image/jpeg;base64,${card.fotoPessoaBase64}`} alt={card.nome} className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-14 h-14 text-gray-400" />
            )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Excluir Contato</h2>
        <p className="text-gray-600 mt-2">
          Tem certeza que deseja excluir permanentemente o contato de <strong className="font-semibold">{card.nome}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex items-center gap-4 mt-8 w-full">
          <button
            onClick={onCancel}
            className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors font-semibold"
          >
            <DeleteIcon className="w-5 h-5" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteView;
