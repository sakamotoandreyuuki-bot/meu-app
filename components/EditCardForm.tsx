import React, { useState, ChangeEvent, useRef } from 'react';
import { BusinessCard } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { UserIcon } from './icons/UserIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import * as geminiService from '../services/geminiService';
import { PlusIcon } from './icons/PlusIcon';


interface EditCardFormProps {
  initialData: Partial<BusinessCard>;
  onSave: (card: BusinessCard) => void;
  onCancel: () => void;
  onStartDelete: (id: string) => void;
  isEditingExistingCard: boolean;
}

const InputField: React.FC<{ label: string; name: keyof BusinessCard; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />
    </div>
);

const EditCardForm: React.FC<EditCardFormProps> = ({ initialData, onSave, onCancel, onStartDelete, isEditingExistingCard }) => {
  const [formData, setFormData] = useState<BusinessCard>({
    id: '',
    nome: '',
    empresa: '',
    cargo: '',
    telefone: '',
    email: '',
    website: '',
    endereco: '',
    imagemBase64: '',
    imagemVersoBase64: '',
    fotoPessoaBase64: '',
    ...initialData,
  });
  const [isScanningBack, setIsScanningBack] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64Data = dataUrl.split(',')[1];
        setFormData(prev => ({ ...prev, fotoPessoaBase64: base64Data }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerFileBackInput = () => {
    fileInputBackRef.current?.click();
  };

  const handleBackImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const base64Data = dataUrl.split(',')[1];
        setFormData(prev => ({...prev, imagemVersoBase64: base64Data}));
        
        setIsScanningBack(true);
        try {
          // FIX: The function call was missing the second argument. Now passing both front and back images to provide full context to the Gemini model for data extraction.
          const backData = await geminiService.extractCardData(formData.imagemBase64, base64Data);
          setFormData(prev => {
            const updatedData = { ...prev };
            (Object.keys(backData) as Array<keyof typeof backData>).forEach(key => {
              if (!updatedData[key] && backData[key]) {
                updatedData[key] = backData[key] as string;
              }
            });
            return updatedData;
          });
        } catch (error) {
            console.error("Failed to process back image", error);
        } finally {
            setIsScanningBack(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleDelete = () => {
    onStartDelete(formData.id);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditingExistingCard ? 'Editar Contato' : 'Revisar e Salvar Contato'}
        </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex flex-col items-center space-y-3 pt-2 pb-4">
            <div className="relative w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed flex items-center justify-center overflow-hidden">
            {formData.fotoPessoaBase64 ? (
                <img src={`data:image/jpeg;base64,${formData.fotoPessoaBase64}`} alt="Foto do Contato" className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
            )}
            </div>
            <button
            type="button"
            onClick={triggerFileInput}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
            <ArrowUpTrayIcon className="w-5 h-5" />
            {formData.fotoPessoaBase64 ? 'Alterar Foto' : 'Adicionar Foto'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
        </div>
        
        <InputField label="Nome" name="nome" value={formData.nome} onChange={handleChange} />
        <InputField label="Empresa" name="empresa" value={formData.empresa} onChange={handleChange} />
        <InputField label="Cargo" name="cargo" value={formData.cargo} onChange={handleChange} />
        <InputField label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
        <InputField label="Website" name="website" value={formData.website} onChange={handleChange} />
        <InputField label="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} />

        <div className="pt-4 space-y-4">
            <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2">FRENTE DO CARTÃO</h4>
                <img 
                    src={`data:image/jpeg;base64,${formData.imagemBase64}`} 
                    alt="Frente do Cartão de Visita" 
                    className="w-full rounded-lg shadow-md" 
                />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2">VERSO DO CARTÃO</h4>
                {formData.imagemVersoBase64 ? (
                    <div className="relative">
                        <img 
                            src={`data:image/jpeg;base64,${formData.imagemVersoBase64}`} 
                            alt="Verso do Cartão de Visita" 
                            className="w-full rounded-lg shadow-md" 
                        />
                         {isScanningBack && <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg"><p className="font-semibold animate-pulse">Analisando...</p></div>}
                    </div>
                ) : (
                    <button type="button" onClick={triggerFileBackInput} disabled={isScanningBack} className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                        {isScanningBack ? <p className="animate-pulse">Analisando...</p> : <><PlusIcon className="w-8 h-8 mb-1" /><span>Adicionar Verso</span></>}
                    </button>
                )}
                 <input type="file" ref={fileInputBackRef} onChange={handleBackImageChange} className="hidden" accept="image/*" />
            </div>
        </div>

        <div className={`flex flex-wrap items-center pt-4 gap-4 ${isEditingExistingCard ? 'justify-between' : 'justify-end'}`}>
          {isEditingExistingCard && (
            <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
              <DeleteIcon className="w-5 h-5" />
              Excluir
            </button>
          )}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <CheckIcon className="w-5 h-5" />
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCardForm;