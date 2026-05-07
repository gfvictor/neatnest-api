import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient<any, any, 'public', any, any>;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') ?? '',
      this.configService.get<string>('SUPABASE_KEY') ?? '',
    );
  }

  private getBaseUrl(): string {
    return `${this.configService.get<string>('SUPABASE_URL')}/storage/v1/object/public/${this.configService.get<string>('SUPABASE_BUCKET')}/`;
  }

  getFileUrl(filePath: string): string {
    return `${this.getBaseUrl()}${filePath}`;
  }

  extractFileFromUrl(url: string): string | null {
    const baseUrl = this.getBaseUrl();
    if (url && url.startsWith(baseUrl)) {
      return url.replace(baseUrl, '');
    }
    return null;
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    folder: string,
    mimeType: string,
    userId: string,
    userRole: string,
  ): Promise<string> {
    if (
      !fileBuffer ||
      !fileName ||
      !folder ||
      !mimeType ||
      !userId ||
      !userRole
    ) {
      throw new BadRequestException('Invalid file data');
    }

    if (!['USER', 'ADMIN'].includes(userRole)) {
      throw new BadRequestException('User role not allowed to upload');
    }

    let processedBuffer = fileBuffer;
    let finalMimeType = mimeType;
    let finalFileName = fileName;

    if (mimeType.startsWith('image/')) {
      try {
        processedBuffer = await sharp(fileBuffer)
          .rotate()
          .resize({ width: 1080, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        finalMimeType = 'image/webp';
        const nameWithoutExt =
          fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        finalFileName = `${nameWithoutExt}.webp`;
      } catch (err) {
        throw new BadRequestException(`Image processing failed: ${err}`);
      }
    }

    const filePath = `${folder}/${Date.now()}-${finalFileName}`;

    const { error } = await this.supabase.storage
      .from(this.configService.get<string>('SUPABASE_BUCKET') ?? '')
      .upload(filePath, processedBuffer, {
        contentType: finalMimeType,
        metadata: { owner: userId, role: userRole },
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    return this.getFileUrl(filePath);
  }

  async deleteFile(filePath: string) {
    const { error } = await this.supabase.storage
      .from(this.configService.get<string>('SUPABASE_BUCKET') ?? '')
      .remove([filePath]);

    if (error) {
      throw new BadRequestException(`Error deleting file: ${error.message}`);
    }

    return { message: 'File successfully deleted' };
  }

  async deleteFileByUrl(url: string | null): Promise<void> {
    if (!url) return;

    const filePath = this.extractFileFromUrl(url);
    if (!filePath) return;

    try {
      await this.deleteFile(filePath);
    } catch (err) {
      console.error(`Failed to delete file by URL: ${err}`);
    }
  }
}
