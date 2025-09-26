
import { BusinessCard } from '../types';

const CARDS_STORAGE_KEY = 'business_cards_app_data';

export const getCards = (): BusinessCard[] => {
  try {
    const cardsJson = localStorage.getItem(CARDS_STORAGE_KEY);
    return cardsJson ? JSON.parse(cardsJson) : [];
  } catch (error) {
    console.error("Failed to parse cards from localStorage", error);
    return [];
  }
};

export const saveCard = (card: BusinessCard): BusinessCard[] => {
  const cards = getCards();
  const existingIndex = cards.findIndex(c => c.id === card.id);

  if (existingIndex > -1) {
    cards[existingIndex] = card;
  } else {
    cards.unshift(card);
  }

  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error("Failed to save cards to localStorage", error);
    // Optionally, alert the user that storage failed
  }
  return cards;
};


export const deleteCard = (id: string): BusinessCard[] => {
  let cards = getCards();
  cards = cards.filter(card => card.id !== id);
  
  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error("Failed to save updated card list to localStorage", error);
  }
  return cards;
}
