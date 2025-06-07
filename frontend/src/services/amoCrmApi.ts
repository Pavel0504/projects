export interface AmoCrmDeal {
  id: number;
  name: string;
  price: number;
  status_id: number;
  pipeline_id: number;
  created_at: number;
  updated_at: number;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{
      value: string;
      enum_id?: number;
    }>;
  }>;
  _embedded?: {
    contacts?: Array<{
      id: number;
      is_main: boolean;
    }>;
    companies?: Array<{
      id: number;
    }>;
  };
}

export interface AmoCrmContact {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  custom_fields_values?: Array<{
    field_id: number;
    field_code?: string;
    values: Array<{
      value: string;
      enum_id?: number;
      enum_code?: string;
    }>;
  }>;
}

export interface AmoCrmApiResponse<T> {
  _embedded: {
    [key: string]: T[];
  };
  _page?: number;
  _links?: {
    self: { href: string };
    next?: { href: string };
    prev?: { href: string };
  };
}

export interface AmoCrmConfig {
  subdomain: string;
  accessToken: string;
}

class AmoCrmApiService {
  private config: AmoCrmConfig | null = null;

  setConfig(config: AmoCrmConfig) {
    this.config = config;
  }

  private getBaseUrl(): string {
    if (!this.config) {
      throw new Error('AMO CRM не настроен. Пожалуйста, укажите поддомен и токен доступа.');
    }
    return `/api/amocrm`;
  }

  private getHeaders(): HeadersInit {
    if (!this.config) {
      throw new Error('AMO CRM не настроен. Пожалуйста, укажите поддомен и токен доступа.');
    }
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
    };
  }

  async getDeals(params?: {
    limit?: number;
    page?: number;
    with?: string;
    filter?: Record<string, any>;
  }): Promise<AmoCrmApiResponse<AmoCrmDeal>> {
    const url = new URL(`${this.getBaseUrl()}/leads`);
    
    if (params?.limit) url.searchParams.set('limit', params.limit.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.with) url.searchParams.set('with', params.with);
    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        url.searchParams.set(`filter[${key}]`, value.toString());
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Неверный токен доступа или истек срок действия');
      } else if (response.status === 402) {
        throw new Error('Аккаунт AMO CRM не оплачен');
      } else {
        throw new Error(`Ошибка API AMO CRM: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  }

  async getDeal(id: number, params?: { with?: string }): Promise<AmoCrmDeal> {
    const url = new URL(`${this.getBaseUrl()}/leads/${id}`);
    
    if (params?.with) url.searchParams.set('with', params.with);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 204) {
        throw new Error('Сделка с указанным ID не найдена');
      } else if (response.status === 401) {
        throw new Error('Неверный токен доступа или истек срок действия');
      } else {
        throw new Error(`Ошибка API AMO CRM: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  }

  async getContact(id: number): Promise<AmoCrmContact> {
    const response = await fetch(`${this.getBaseUrl()}/contacts/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Ошибка получения контакта: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getContacts(ids: number[]): Promise<AmoCrmApiResponse<AmoCrmContact>> {
    const url = new URL(`${this.getBaseUrl()}/contacts`);
    url.searchParams.set('filter[id]', ids.join(','));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Ошибка получения контактов: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  isConfigured(): boolean {
    return this.config !== null && this.config.subdomain !== '' && this.config.accessToken !== '';
  }
}

export const amoCrmApi = new AmoCrmApiService();