import React from 'react';

interface ConfirmBacksideViewProps {
  frontImage: string;
  onConfirm: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

const ConfirmBacksideView: React.FC<ConfirmBacksideViewProps> = ({ frontImage, onConfirm, onSkip, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Frente do Cartão Capturada</h2>
      <p className="text-gray-600 mt-2 text-center">
        O verso do cartão contém informações?
      </p>

      <div className="my-6 w-full max-w-xs">
         <img 
            src={`data:image/jpeg;base64,${frontImage}`} 
            alt="Frente do Cartão de Visita" 
            className="w-full rounded-lg shadow-md" 
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={onConfirm}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Sim, adicionar verso
        </button>
        <button
          onClick={onSkip}
          className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Não, continuar
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 mt-2"
        >
          Cancelar e voltar
        </button>
      </div>
    </div>
  );
};

export default ConfirmBacksideView;