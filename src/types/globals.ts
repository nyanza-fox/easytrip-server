export type Location = {
  address?: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: number[];
};

export type Contact = {
  email?: string;
  phoneNumber?: string;
};
