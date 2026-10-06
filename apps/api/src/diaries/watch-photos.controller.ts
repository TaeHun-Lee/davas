import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { UploadConcurrencyInterceptor } from '../users/upload-concurrency.interceptor';
import { WATCH_PHOTO_UPLOAD_OPTIONS, type UploadedPhotoFile } from './watch-photo-processing';
import { WatchPhotosService, type WatchPhotoVariant } from './watch-photos.service';

const VARIANTS = new Set<WatchPhotoVariant>(['thumb', 'display', 'original']);

@Controller('v1/watch-photos')
export class WatchPhotosController {
  constructor(private readonly photos: WatchPhotosService) {}

  // A full record is 10 photos; this allows a couple of records plus retries per 10 minutes.
  @Post()
  @Throttle({ default: { limit: 40, ttl: 10 * 60_000, blockDuration: 5 * 60_000 } })
  @UseInterceptors(
    UploadConcurrencyInterceptor,
    FileInterceptor('file', WATCH_PHOTO_UPLOAD_OPTIONS),
  )
  async upload(@Req() request: AuthenticatedRequest, @UploadedFile() file?: UploadedPhotoFile) {
    return { photo: await this.photos.stage(request.user.id, file) };
  }

  @Get(':photoId/:variant')
  async file(
    @Req() request: AuthenticatedRequest,
    @Param('photoId', ParseUUIDPipe) photoId: string,
    @Param('variant') variant: string,
    @Res() response: Response,
  ) {
    if (!VARIANTS.has(variant as WatchPhotoVariant)) {
      throw new NotFoundException({
        statusCode: 404,
        code: 'PHOTO_NOT_FOUND',
        message: '사진을 찾을 수 없어요.',
      });
    }
    const file = await this.photos.open(photoId, variant as WatchPhotoVariant, request.user.id);
    // A photo id never changes content, so the browser may keep it; `private` keeps shared
    // caches (and other people on the same proxy) from storing it.
    response.setHeader('Cache-Control', 'private, max-age=31536000, immutable');
    response.removeHeader('Pragma');
    if (file.downloadName) {
      response.setHeader('Content-Disposition', `attachment; filename="${file.downloadName}"`);
    }
    response.type(file.mimeType);
    response.sendFile(file.path, { cacheControl: false }, (error) => {
      if (error && !response.headersSent) {
        // The year-long cache header above must not stick to a "not found".
        response.setHeader('Cache-Control', 'private, no-store');
        response.removeHeader('Content-Disposition');
        response.status(404).json({
          statusCode: 404,
          code: 'PHOTO_NOT_FOUND',
          message: '사진을 찾을 수 없어요.',
        });
      }
    });
  }
}
