import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveOriginalFile(
    workspaceId: string,
    filename: string,
    buffer: Buffer,
  ): Promise<string> {
    const wsDir = path.join(this.uploadDir, workspaceId, 'originals');
    if (!fs.existsSync(wsDir)) {
      fs.mkdirSync(wsDir, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(wsDir, uniqueFilename);
    await fs.promises.writeFile(filePath, buffer);

    return `/uploads/${workspaceId}/originals/${uniqueFilename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (fileUrl.startsWith('/uploads/')) {
      const relativePath = fileUrl.replace('/uploads/', '');
      const fullPath = path.join(this.uploadDir, relativePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    }
  }
}
