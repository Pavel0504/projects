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
    // все запросы идут через Netlify Function-прокси
    return `/api/amocrm`;
  }

  private getHeaders(): HeadersInit {
    if (!this.config) {
      throw new Error('AMO CRM не настроен. Пожалуйста, укажите поддомен и токен доступа.');
    }
    return {
      Authorization: `Bearer ${this.config.accessToken}`,
    };
  }

  /** Собирает относительный URL + query-параметры */
  private buildUrl(path: string, params?: Record<string, any>): string {
    const base = this.getBaseUrl();
    const separator = path.startsWith('/') ? '' : '/';
    let url = `${base}${separator}${path}`;
    if (params) {
      const qp = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        qp.set(key, String(value));
      });
      const query = qp.toString();
      if (query) {
        url += `?${query}`;
      }
    }
    return url;
  }

  async getDeals(options?: {
    limit?: number;
    page?: number;
    with?: string;
    filter?: Record<string, any>;
  }): Promise<AmoCrmApiResponse<AmoCrmDeal>> {
    const params: Record<string, any> = {};
    if (options?.limit)  params.limit = options.limit;
    if (options?.page)   params.page = options.page;
    if (options?.with)   params.with = options.with;
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        params[`filter[${key}]`] = value;
      });
    }

    const url = this.buildUrl('leads', params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Неверный токен доступа или истек срок действия');
      if (response.status === 402) throw new Error('Аккаунт AMO CRM не оплачен');
      throw new Error(`Ошибка API AMO CRM: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getDeal(id: number, options?: { with?: string }): Promise<AmoCrmDeal> {
    const params: Record<string, any> = {};
    if (options?.with) params.with = options.with;

    const url = this.buildUrl(`leads/${id}`, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 204) throw new Error('Сделка с указанным ID не найдена');
      if (response.status === 401) throw new Error('Неверный токен доступа или истек срок действия');
      throw new Error(`Ошибка API AMO CRM: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getContact(id: number): Promise<AmoCrmContact> {
    const url = this.buildUrl(`contacts/${id}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Ошибка получения контакта: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getContacts(ids: number[]): Promise<AmoCrmApiResponse<AmoCrmContact>> {
    const params = { 'filter[id]': ids.join(',') };
    const url = this.buildUrl('contacts', params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Ошибка получения контактов: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  isConfigured(): boolean {
    return !!this.config?.subdomain && !!this.config?.accessToken;
  }
}

export const amoCrmApi = new AmoCrmApiService();
