import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient<any, any, 'public', any, any>;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') ?? '',
      this.configService.get<string>('SUPABASE_KEY') ?? '',
    );
  }

  getFileUrl(filePath: string): string {
    return `${this.configService.get<string>('SUPABASE_URL')}/storage/v1/object/public/${this.configService.get<string>('SUPABASE_BUCKET')}/${filePath}`;
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

    const filePath = `${folder}/${Date.now()}-${fileName}`;

    const { error } = await this.supabase.storage
      .from(this.configService.get<string>('SUPABASE_BUCKET') ?? '')
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
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
}
