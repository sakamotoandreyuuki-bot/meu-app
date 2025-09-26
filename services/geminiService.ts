import { GoogleGenAI, Type } from "@google/genai";
import { BusinessCard } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    nome: { type: Type.STRING, description: 'Nome completo da pessoa.' },
    empresa: { type: Type.STRING, description: 'Nome da empresa.' },
    cargo: { type: Type.STRING, description: 'Cargo ou título da pessoa.' },
    telefone: { type: Type.STRING, description: 'Número de telefone principal.' },
    email: { type: Type.STRING, description: 'Endereço de e-mail.' },
    website: { type: Type.STRING, description: 'Website da empresa ou pessoal.' },
    endereco: { type: Type.STRING, description: 'Endereço físico completo.' },
  },
  required: ["nome", "empresa", "cargo", "telefone", "email", "website", "endereco"],
};

export const extractCardData = async (frontImageBase64: string, backImageBase64: string | null): Promise<Partial<BusinessCard>> => {
  
  const parts: any[] = [
    { inlineData: { mimeType: 'image/jpeg', data: frontImageBase64 } },
  ];

  let promptText = "Extraia as informações deste cartão de visita. Se algum campo não for encontrado, retorne uma string vazia para ele. Siga estritamente o schema fornecido.";

  if (backImageBase64) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: backImageBase64 } });
    promptText = "Extraia as informações deste cartão de visita, considerando a frente (primeira imagem) e o verso (segunda imagem). Se algum campo não for encontrado, retorne uma string vazia para ele. Siga estritamente o schema fornecido.";
  }
  
  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Ensure all fields exist, even if empty
    const result: Partial<BusinessCard> = {
        nome: parsedData.nome || '',
        empresa: parsedData.empresa || '',
        cargo: parsedData.cargo || '',
        telefone: parsedData.telefone || '',
        email: parsedData.email || '',
        website: parsedData.website || '',
        endereco: parsedData.endereco || '',
    };
    
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to extract data from business card.");
  }
};