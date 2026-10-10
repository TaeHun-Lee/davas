// Replays a taste snapshot through the recommendation models and prints how well each one would
// have predicted what was watched next (see apps/api/src/recommendations/taste-backtest.ts).
//
//   npm run recommendation:backtest -- <snapshot.json> [events per person, default 40]
//
// The snapshot holds people's watch history. Keep it outside the repository; docs/operations.md
// has the read-only query that exports one from production with people replaced by labels.
import { readFileSync } from 'node:fs';
import {
  runBacktest,
  type BacktestDataset,
} from '../apps/api/src/recommendations/taste-backtest.ts';

const [path, perPerson] = process.argv.slice(2);
if (!path) {
  console.error('usage: npm run recommendation:backtest -- <snapshot.json> [events per person]');
  process.exit(2);
}
const dataset = JSON.parse(readFileSync(path, 'utf8')) as BacktestDataset;
const eventsPerPerson = Number(perPerson ?? 40);

for (const group of [false, true]) {
  console.log(group ? '\nGroup (titles everyone watched the same day)' : 'Each person');
  console.table(runBacktest(dataset, { eventsPerPerson, group }));
}
