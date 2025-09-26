export interface BusinessCard {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  telefone: string;
  email: string;
  website: string;
  endereco: string;
  imagemBase64: string;
  imagemVersoBase64?: string;
  fotoPessoaBase64?: string;
}

export type AppView = 'list' | 'capture' | 'edit' | 'confirmDelete' | 'noDataFound' | 'confirmBackside';