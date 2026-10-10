import { join } from 'node:path';

/** Where uploaded files live: UPLOADS_DIR, or ./uploads beside the process. Read on each call. */
export function uploadsRoot() {
  return process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');
}
