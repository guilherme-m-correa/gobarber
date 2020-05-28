import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../interfaces/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpDir, file),
      path.resolve(uploadConfig.uploadDir, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadDir, file);
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
