import type { SpaceMemories } from '@davas/shared';
import { recapLines } from './memories-model';

const WIDTH = 1080;
const HEIGHT = 1350;
const MARGIN = 72;
const FONT = "'Pretendard Variable', Pretendard, 'Noto Sans KR', system-ui, sans-serif";

/** Shortens `text` with "…" until it fits `width` in the context's current font. */
function fit(context: CanvasRenderingContext2D, text: string, width: number) {
  if (context.measureText(text).width <= width) return text;
  let cut = text;
  while (cut.length > 1 && context.measureText(`${cut}…`).width > width) cut = cut.slice(0, -1);
  return `${cut}…`;
}

/**
 * The year-end card as a 1080×1350 PNG (a phone-friendly 4:5), drawn with text and shapes
 * only. Photos and posters come from other origins and would block exporting the canvas.
 */
export async function drawRecapImage(data: SpaceMemories, spaceName: string) {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas unavailable');
  await document.fonts?.ready;

  const background = context.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, '#16478f');
  background.addColorStop(1, '#2f7eea');
  context.fillStyle = background;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = 'rgba(255,255,255,0.07)';
  context.beginPath();
  context.arc(WIDTH - 120, 160, 260, 0, Math.PI * 2);
  context.fill();

  const text = (value: string, x: number, y: number, size: number, weight = 800, alpha = 1) => {
    context.font = `${weight} ${size}px ${FONT}`;
    context.fillStyle = `rgba(255,255,255,${alpha})`;
    context.fillText(fit(context, value, WIDTH - MARGIN - x), x, y);
  };

  text(spaceName, MARGIN, 150, 38, 700, 0.8);
  text(`${data.year}년 우리 결산`, MARGIN, 230, 66, 900);
  context.font = `900 190px ${FONT}`;
  context.fillStyle = '#ffffff';
  const count = String(data.totals.records);
  context.fillText(count, MARGIN, 440);
  const countWidth = context.measureText(count).width;
  text('편을 함께 봤어요', MARGIN + countWidth + 24, 440, 46, 800, 0.95);
  text(
    `영화 ${data.totals.movies}편 · 드라마 ${data.totals.series}편 · 사진 ${data.totals.photos}장`,
    MARGIN,
    510,
    34,
    700,
    0.85,
  );

  // Records per month as bars, January to December.
  const top = Math.max(1, ...data.recap.monthly);
  const barWidth = 54;
  const gap = (WIDTH - MARGIN * 2 - barWidth * 12) / 11;
  data.recap.monthly.forEach((value, index) => {
    const x = MARGIN + index * (barWidth + gap);
    const height = Math.max(8, (value / top) * 170);
    context.fillStyle = value ? '#ffffff' : 'rgba(255,255,255,0.25)';
    context.beginPath();
    if (context.roundRect) context.roundRect(x, 760 - height, barWidth, height, 12);
    else context.rect(x, 760 - height, barWidth, height);
    context.fill();
    context.font = `700 24px ${FONT}`;
    context.fillStyle = 'rgba(255,255,255,0.75)';
    context.textAlign = 'center';
    context.fillText(`${index + 1}월`, x + barWidth / 2, 800);
    context.textAlign = 'left';
  });

  recapLines(data)
    .slice(0, 5)
    .forEach((line, index) => {
      const y = 880 + index * 82;
      text(line.label, MARGIN, y, 26, 700, 0.7);
      text(line.value, MARGIN, y + 40, 36, 800);
    });

  text('Davas · 우리 기록 모아보기', MARGIN, HEIGHT - 60, 26, 700, 0.6);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('export failed'))),
      'image/png',
    ),
  );
}
