import { BusinessCard } from '../types';

export const createVCard = (card: BusinessCard): string => {
  let vCard = `BEGIN:VCARD\n`;
  vCard += `VERSION:3.0\n`;

  // Name
  if (card.nome) {
    // N field is structured: Family Name;Given Name;Additional Names;Prefixes;Suffixes
    const nameParts = card.nome.trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop() || '' : '';
    const firstName = nameParts.join(' ');
    vCard += `N:${lastName};${firstName};;;\n`;
    vCard += `FN:${card.nome}\n`;
  }

  // Organization and Title
  if (card.empresa) {
    vCard += `ORG:${card.empresa}\n`;
  }
  if (card.cargo) {
    vCard += `TITLE:${card.cargo}\n`;
  }

  // Phone
  if (card.telefone) {
    vCard += `TEL;TYPE=WORK,VOICE:${card.telefone}\n`;
  }

  // Email
  if (card.email) {
    vCard += `EMAIL:${card.email}\n`;
  }
  
  // Website
  if (card.website) {
    vCard += `URL:${card.website}\n`;
  }
  
  // Address
  if (card.endereco) {
    // ADR field is structured: PO Box;Extended Address;Street;Locality;Region;Postal Code;Country
    vCard += `ADR;TYPE=WORK:;;${card.endereco.replace(/\n/g, '\\n')};;;;\n`;
  }

  // Photo
  if (card.fotoPessoaBase64) {
    vCard += `PHOTO;ENCODING=b;TYPE=JPEG:${card.fotoPessoaBase64}\n`;
  }

  vCard += `END:VCARD\n`;
  return vCard;
};

export const downloadVCard = (vCardString: string, filename: string) => {
  const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
