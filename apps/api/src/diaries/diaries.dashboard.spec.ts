import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { DiariesController } from './diaries.controller';
import { DiariesDashboardService } from './diaries-dashboard.service';

function source(path: string) {
  return readFileSync(join(process.cwd(), 'src/diaries', path), 'utf8');
}

const controllerSource = source('diaries.controller.ts');
const moduleSource = source('diaries.module.ts');

describe('Diaries dashboard API contract', () => {
  it('registers GET /api/diaries/dashboard before dynamic diary detail routes', () => {
    assert.match(controllerSource, /@Get\('dashboard'\)/);
    assert.ok(controllerSource.indexOf("@Get('dashboard')") < controllerSource.indexOf("@Get(':id')"));
    assert.match(controllerSource, /dashboard\(\)/);
    assert.match(controllerSource, /DiariesDashboardService/);
    assert.match(moduleSource, /DiariesDashboardService/);
  });

  it('returns the dashboard view model used by the mobile diary tab', () => {
    const service = new DiariesDashboardService();
    const controller = new DiariesController(service);
    const dashboard = controller.dashboard();

    assert.equal(dashboard.summary.totalCount, dashboard.recentItems.length);
    assert.ok(dashboard.summary.monthlyCount >= 0);
    assert.ok(dashboard.summary.averageRating >= 0);
    assert.equal(dashboard.calendar.year, 2026);
    assert.equal(dashboard.calendar.month, 5);
    assert.ok(dashboard.calendar.markers.length > 0);
    assert.ok(dashboard.genreRatios.some((item) => item.genre === 'SF'));
    assert.ok(dashboard.recentItems.every((item) => item.mediaTitle && item.diaryTitle));
  });
});
