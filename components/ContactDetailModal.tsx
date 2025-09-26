import React from 'react';
import { BusinessCard } from '../types';
import { createVCard, downloadVCard } from '../utils/vcard';
import { UserIcon } from './icons/UserIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { EmailIcon } from './icons/EmailIcon';
import { WebsiteIcon } from './icons/WebsiteIcon';
import { LocationIcon } from './icons/LocationIcon';
import { CloseIcon } from './icons/CloseIcon';
import { PencilIcon } from './icons/PencilIcon';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: BusinessCard | null;
  onEdit: (card: BusinessCard) => void;
}

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string | undefined; href?: string }> = ({ icon, label, value, href }) => {
  if (!value) return null;
  
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">{value}</a>
  ) : (
    <span className="break-words">{value}</span>
  );

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-6 h-6 text-gray-500 mt-1">{icon}</div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="text-base text-gray-800">{content}</p>
      </div>
    </div>
  );
};

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ isOpen, onClose, card, onEdit }) => {
  if (!isOpen || !card) return null;

  const handleEdit = () => {
    onEdit(card);
  };

  const handleDownloadVCard = () => {
    const vCardString = createVCard(card);
    const filename = `${card.nome.replace(/\s+/g, '_') || 'contact'}.vcf`;
    downloadVCard(vCardString, filename);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Detalhes do Contato</h2>
          <button onClick={onClose} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left sm:space-x-6">
            <div className="flex-shrink-0 w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
              {card.fotoPessoaBase64 ? (
                <img src={`data:image/jpeg;base64,${card.fotoPessoaBase64}`} alt={card.nome} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex-grow min-w-0">
              <h3 className="text-2xl font-extrabold text-gray-900 truncate">{card.nome}</h3>
              {card.cargo && <p className="text-lg text-gray-600 truncate">{card.cargo}</p>}
              {card.empresa && (
                <div className="flex items-center justify-center sm:justify-start text-gray-600 mt-2">
                  <BuildingIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                  <span className="font-semibold truncate">{card.empresa}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 pt-4">
            <DetailRow icon={<PhoneIcon />} label="Telefone" value={card.telefone} href={`tel:${card.telefone}`} />
            <DetailRow icon={<EmailIcon />} label="Email" value={card.email} href={`mailto:${card.email}`} />
            <DetailRow icon={<WebsiteIcon />} label="Website" value={card.website} href={card.website && !card.website.startsWith('http') ? `http://${card.website}` : card.website} />
            <DetailRow icon={<LocationIcon />} label="Endereço" value={card.endereco} />
          </div>

          {(card.imagemBase64 || card.imagemVersoBase64) && (
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-semibold text-gray-500">IMAGENS DO CARTÃO</h4>
              {card.imagemBase64 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">FRENTE</p>
                  <img src={`data:image/jpeg;base64,${card.imagemBase64}`} alt="Frente do Cartão de Visita" className="w-full rounded-lg shadow-md" />
                </div>
              )}
              {card.imagemVersoBase64 && (
                <div>
                   <p className="text-xs text-gray-400 mb-1">VERSO</p>
                  <img src={`data:image/jpeg;base64,${card.imagemVersoBase64}`} alt="Verso do Cartão de Visita" className="w-full rounded-lg shadow-md" />
                </div>
              )}
            </div>
          )}
        </main>
        
        <footer className="flex flex-col sm:flex-row items-center justify-end p-4 bg-gray-50 border-t border-gray-200 gap-3 flex-shrink-0">
           <button
            onClick={handleDownloadVCard}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Salvar Contato (.vcf)
          </button>
          <button
            onClick={handleEdit}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
            Editar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ContactDetailModal;
