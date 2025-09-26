import React, { useState, useEffect, useCallback } from 'react';
import { BusinessCard, AppView } from './types';
import * as storageService from './services/storageService';
import * as geminiService from './services/geminiService';
import ContactList from './components/ContactList';
import CameraView from './components/CameraView';
import EditCardForm from './components/EditCardForm';
import Spinner from './components/Spinner';
import { CameraIcon } from './components/icons/CameraIcon';
import ContactDetailModal from './components/ContactDetailModal';
import ConfirmDeleteView from './components/ConfirmDeleteView';
import NoDataFoundView from './components/NoDataFoundView';
import ConfirmBacksideView from './components/ConfirmBacksideView';

const App: React.FC = () => {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [newCardData, setNewCardData] = useState<Partial<BusinessCard> | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [viewingCardId, setViewingCardId] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frontImageBase64, setFrontImageBase64] = useState<string | null>(null);
  const [capturePrompt, setCapturePrompt] = useState('Posicione o cartão de visita');

  useEffect(() => {
    setCards(storageService.getCards());
  }, []);

  const processImages = useCallback(async (frontB64: string, backB64: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await geminiService.extractCardData(frontB64, backB64);
      
      if (!data.nome && !data.empresa && !data.email) {
        setCurrentView('noDataFound');
      } else {
        setNewCardData({
          ...data,
          id: `card_${new Date().getTime()}`,
          imagemBase64: frontB64,
          ...(backB64 && { imagemVersoBase64: backB64 }),
        });
        setCurrentView('edit');
      }
    } catch (err) {
      setError('Falha ao extrair dados do cartão. Por favor, tente novamente.');
      console.error(err);
      setCurrentView('capture');
    } finally {
      setIsLoading(false);
      setFrontImageBase64(null); 
    }
  }, []);

  const handleImageCapture = useCallback(async (imageBase64: string) => {
    if (frontImageBase64) {
      await processImages(frontImageBase64, imageBase64);
    } else {
      setFrontImageBase64(imageBase64);
      setCurrentView('confirmBackside');
    }
  }, [frontImageBase64, processImages]);

  const handleAddBackside = () => {
    setCapturePrompt('Posicione o VERSO do cartão');
    setCurrentView('capture');
  };

  const handleSkipBackside = useCallback(async () => {
    if (frontImageBase64) {
      await processImages(frontImageBase64, null);
    }
  }, [frontImageBase64, processImages]);
  
  const handleStartEdit = (card: BusinessCard) => {
    setViewingCardId(null);
    setEditingCardId(card.id);
    setCurrentView('edit');
  };

  const handleSaveCard = (card: BusinessCard) => {
    const newCards = storageService.saveCard(card);
    setCards(newCards);
    resetFlow();
  };
  
  const handleStartDelete = (id: string) => {
    setDeletingCardId(id);
    setCurrentView('confirmDelete');
  };

  const handleConfirmDelete = () => {
    if (deletingCardId) {
      const updatedCards = storageService.deleteCard(deletingCardId);
      setCards(updatedCards);
    }
    resetFlow();
  };

  const resetFlow = () => {
    setCurrentView('list');
    setNewCardData(null);
    setEditingCardId(null);
    setViewingCardId(null);
    setDeletingCardId(null);
    setError(null);
    setFrontImageBase64(null);
    setCapturePrompt('Posicione o cartão de visita');
  };

  const cardToView = viewingCardId ? cards.find(c => c.id === viewingCardId) : null;
  const cardToDelete = deletingCardId ? cards.find(c => c.id === deletingCardId) : null;
  const cardToEdit = editingCardId 
      ? cards.find(c => c.id === editingCardId) 
      : newCardData;
  const isEditingExistingCard = !!editingCardId;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-20">
          <Spinner />
          <p className="mt-4 text-lg text-gray-600 font-semibold animate-pulse">
            Analisando cartão com IA...
          </p>
        </div>
      );
    }

    switch (currentView) {
      case 'capture':
        return <CameraView onCapture={handleImageCapture} onCancel={resetFlow} prompt={capturePrompt} />;
      case 'confirmBackside':
        if (frontImageBase64) {
          return (
            <ConfirmBacksideView
              frontImage={frontImageBase64}
              onConfirm={handleAddBackside}
              onSkip={handleSkipBackside}
              onCancel={resetFlow}
            />
          );
        }
        return null;
      case 'edit':
        if (cardToEdit) {
          return (
            <EditCardForm
              initialData={cardToEdit}
              onSave={handleSaveCard}
              onCancel={resetFlow}
              onStartDelete={handleStartDelete}
              isEditingExistingCard={isEditingExistingCard}
            />
          );
        }
        return null;
      case 'confirmDelete':
        if(cardToDelete) {
            return (
                <ConfirmDeleteView 
                    card={cardToDelete}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setCurrentView('edit')}
                />
            )
        }
        return null;
      case 'noDataFound':
        return (
            <NoDataFoundView
                onRetry={() => {
                  setCapturePrompt('Posicione a FRENTE do cartão');
                  setCurrentView('capture');
                }}
                onCancel={resetFlow}
            />
        );
      case 'list':
      default:
        return <ContactList cards={cards} onViewDetails={setViewingCardId} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-gray-800">
      <main className="max-w-2xl mx-auto p-4 pb-28">
        <header className="flex items-center justify-between mb-6">
           <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
            Contatos
          </h1>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {renderContent()}
      </main>

      {currentView === 'list' && (
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={() => {
              setCapturePrompt('Posicione a FRENTE do cartão');
              setCurrentView('capture');
            }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Adicionar novo cartão"
          >
            <CameraIcon className="w-8 h-8" />
          </button>
        </div>
      )}

      <ContactDetailModal
        isOpen={!!cardToView}
        onClose={() => setViewingCardId(null)}
        card={cardToView}
        onEdit={handleStartEdit}
      />
    </div>
  );
};

export default App;