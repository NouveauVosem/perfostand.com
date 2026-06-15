import axios, { AxiosInstance } from 'axios';

// HTTP-клиент к API кристала. Авторизация server-to-server через X-Api-Key
// (any-auth.middleware на кристале, ключ = CRM_API_KEY).
export class CrystalClient {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: process.env.CRYSTAL_API_URL,
      headers: { 'X-Api-Key': process.env.CRYSTAL_API_KEY || '' },
      timeout: 60_000,
    });
  }

  // GET /products/getAll без lang — сырые entities + meta
  async getProducts(params: { search?: string; page?: number | string; limit?: number | string; type?: string }) {
    const res = await this.http.get('/products/getAll', { params });
    return res.data as { data: any[]; meta: { total: number; page: number; limit: number; totalPages: number } };
  }

  // GET /products/export — полное дерево продуктов + спек-справочники
  async exportProducts(ids: string[]) {
    const res = await this.http.get('/products/export', { params: { ids: ids.join(',') } });
    return res.data as {
      products: any[];
      specKeys: any[];
      specValues: any[];
      specEnumRich: any[];
    };
  }

  // GET /files/image?path=... — стрим картинки с WebDAV кристала.
  // Возвращает axios-ответ со stream в .data и заголовками.
  async getImageStream(filePath: string) {
    return this.http.get('/files/image', {
      params: { path: filePath },
      responseType: 'stream',
      validateStatus: (s) => s < 500,
    });
  }
}
