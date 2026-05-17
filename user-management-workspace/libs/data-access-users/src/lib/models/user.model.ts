export type PhoneType = 'celular' | 'residencial' | 'comercial';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: PhoneType;
}
