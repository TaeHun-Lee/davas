import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { NestExpressApplication } from '@nestjs/platform-express';

/** The only folders of the uploads volume that are served as public static files. */
export const PUBLIC_UPLOAD_FOLDERS = ['profile-images'] as const;

/**
 * Serves each public folder from its own root instead of the whole uploads volume. Record
 * photos share the volume but must only leave through the access-checked /api/v1/watch-photos
 * route; blocking their path in front of a volume-wide static server can be sidestepped by
 * spelling the URL differently (`watch%2Dphotos`, dot segments), so nothing outside these
 * folders is reachable at all.
 */
export function servePublicUploads(app: NestExpressApplication, uploadsDir: string) {
  for (const folder of PUBLIC_UPLOAD_FOLDERS) {
    const root = join(uploadsDir, folder);
    mkdirSync(root, { recursive: true });
    app.useStaticAssets(root, { prefix: `/uploads/${folder}/`, index: false, dotfiles: 'deny' });
  }
}
