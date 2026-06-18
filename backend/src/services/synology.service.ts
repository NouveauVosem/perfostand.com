import { createClient, WebDAVClient } from 'webdav';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Readable } from 'stream';

export class WebdavService {
  private client: WebDAVClient;
  private rootPath: string;

  constructor() {
    const url = process.env.WEBDAV_URL || '';
    const username = process.env.WEBDAV_USERNAME || '';
    const password = process.env.WEBDAV_PASSWORD || '';
    // Корень на Synology, внутри которого складываем все файлы перфостенда.
    this.rootPath = (process.env.WEBDAV_ROOT || '/crystal-data/perfostand').replace(/\/+$/, '');
    this.client = createClient(url, { username, password });
  }

  getAbsolutePath(relativePath: string): string {
    const clean = relativePath.replace(/^\/+/, '');
    return `${this.rootPath}/${clean}`;
  }

  async ensureDirectory(dirPath: string) {
    if ((await this.client.exists(dirPath)) === false) {
      await this.client.createDirectory(dirPath, { recursive: true });
    }
  }

  async uploadFile(buffer: Buffer, originalFilename: string, folderPath: string): Promise<string> {
    try {
      const ext = path.extname(originalFilename);
      const name = path.basename(originalFilename, ext);

      const sanitizedName = this.sanitizeFilename(name);
      const filename = `${sanitizedName}_${uuidv4().slice(0, 8)}${ext}`;

      const cleanFolder = folderPath.replace(/^\/+/, '');
      const fullDir = `${this.rootPath}/${cleanFolder}`;

      await this.ensureDirectory(fullDir);

      const remotePath = `${fullDir}/${filename}`;
      await this.client.putFileContents(remotePath, buffer);

      console.log(`✅ WebDAV Upload: ${remotePath}`);
      return remotePath;
    } catch (error) {
      console.error('WebDAV Upload Error:', error);
      throw new Error('Не удалось загрузить файл на хранилище');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (await this.client.exists(filePath)) {
        await this.client.deleteFile(filePath);
        console.log(`🗑️  WebDAV Delete: ${filePath}`);
      }
    } catch (error) {
      console.warn(`WebDAV Delete failed: ${filePath}`, error);
    }
  }

  async deleteDirectory(dirPath: string): Promise<void> {
    try {
      if (await this.client.exists(dirPath)) {
        await this.client.deleteFile(dirPath);
        console.log(`🗑️  WebDAV Delete Dir: ${dirPath}`);
      }
    } catch (error) {
      console.warn(`WebDAV DeleteDirectory failed: ${dirPath}`, error);
    }
  }

  async getFileStream(filePath: string): Promise<Readable> {
    const exists = await this.client.exists(filePath);
    if (exists === false) {
      throw new Error('File not found on WebDAV');
    }

    const stream = this.client.createReadStream(filePath);
    return stream as Readable;
  }

  async getFileBuffer(filePath: string): Promise<Buffer> {
    const stream = await this.getFileStream(filePath);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as any));
    }
    return Buffer.concat(chunks);
  }

  private sanitizeFilename(name: string): string {
    const cyrillicMap: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
      'э': 'e', 'ю': 'yu', 'я': 'ya',
      'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
      'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
      'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
      'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
      'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
      'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
      'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
      'І': 'I', 'Ї': 'Yi', 'Є': 'Ye', 'Ґ': 'G',
    };

    return (
      name
        .split('')
        .map((char) => cyrillicMap[char] ?? char)
        .join('')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '') || 'file'
    );
  }
}
