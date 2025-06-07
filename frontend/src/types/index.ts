export interface ServiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  vat: number;
  total: number;
}

export interface DealData {
  id: string;
  number: string;
  date: string;
  clientName: {
    lastName: string;
    firstName: string;
    middleName: string;
  };
  phone: string;
  car: {
    brand: string;
    model: string;
    vin: string;
    year: string;
  };
  status: string;
  amount: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export interface DocumentData {
  template: DocumentTemplate;
  dealData: DealData;
  services: ServiceItem[];
  totals: {
    subtotal: number;
    discount: number;
    total: number;
  };
}