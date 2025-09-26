import React from 'react';
import { DocumentMagnifyingGlassIcon } from './icons/DocumentMagnifyingGlassIcon';

interface NoDataFoundViewProps {
  onRetry: () => void;
  onCancel: () => void;
}

const NoDataFoundView: React.FC<NoDataFoundViewProps> = ({ onRetry, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-200">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full mb-4 bg-yellow-50 flex items-center justify-center text-yellow-500">
            <DocumentMagnifyingGlassIcon className="w-14 h-14" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Nenhuma Informação Encontrada</h2>
        <p className="text-gray-600 mt-2 max-w-sm">
            Não foi possível extrair dados de contato da imagem. Por favor, tente uma foto com melhor iluminação e foco.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Nenhuma entrada será salva.
        </p>

        <div className="flex items-center gap-4 mt-8 w-full">
          <button
            onClick={onCancel}
            className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
          >
            Voltar para Lista
          </button>
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoDataFoundView;