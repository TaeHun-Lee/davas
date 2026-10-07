import type { SpaceMemories } from '@davas/shared';
import { recapLines } from './memories-model';

const WIDTH = 1080;
const HEIGHT = 1350;
const SIDE = 96;
const INNER = WIDTH - SIDE * 2;
const FONT = "'Pretendard Variable', Pretendard, 'Noto Sans KR', system-ui, sans-serif";
const ACCENT = '#216bd8';
const ACCENT_DEEP = '#144286';
const ACCENT_INK = '#1c5ab5';

/** Shortens `text` with "…" until it fits `width` in the context's current font. */
function fit(context: CanvasRenderingContext2D, text: string, width: number) {
  if (context.measureText(text).width <= width) return text;
  let cut = text;
  while (cut.length > 1 && context.measureText(`${cut}…`).width > width) cut = cut.slice(0, -1);
  return `${cut}…`;
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number[],
) {
  context.beginPath();
  if (context.roundRect) context.roundRect(x, y, width, height, radii);
  else context.rect(x, y, width, height);
  context.fill();
}

/**
 * The year-end card as a 1080×1350 PNG (a phone-friendly 4:5), laid out as on the C안 card
 * image board and drawn with text and shapes only: photos and posters come from other
 * origins and would block exporting the canvas.
 */
export async function drawRecapImage(data: SpaceMemories, spaceName: string) {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas unavailable');
  await document.fonts?.ready;
  context.textBaseline = 'top';

  // linear-gradient(160deg, accent, deep) over the whole card.
  const angle = (160 * Math.PI) / 180;
  const half = (Math.abs(WIDTH * Math.sin(angle)) + Math.abs(HEIGHT * Math.cos(angle))) / 2;
  const [dx, dy] = [Math.sin(angle) * half, -Math.cos(angle) * half];
  const background = context.createLinearGradient(
    WIDTH / 2 - dx,
    HEIGHT / 2 - dy,
    WIDTH / 2 + dx,
    HEIGHT / 2 + dy,
  );
  background.addColorStop(0, ACCENT);
  background.addColorStop(1, ACCENT_DEEP);
  context.fillStyle = background;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  /** Writes one line whose box starts at `top` and is `lineHeight` tall. */
  const line = (
    value: string,
    x: number,
    top: number,
    size: number,
    weight: number,
    lineHeight: number,
    width = INNER,
    align: CanvasTextAlign = 'left',
  ) => {
    context.font = `${weight} ${size}px ${FONT}`;
    context.fillStyle = '#ffffff';
    context.textAlign = align;
    context.fillText(fit(context, value, width), x, top + (lineHeight - size) / 2);
    context.textAlign = 'left';
  };

  // Header: the space on the left, the Davas mark on the right.
  context.font = `900 38px ${FONT}`;
  const wordmarkWidth = context.measureText('Davas').width;
  const markX = WIDTH - SIDE - wordmarkWidth - 14 - 50;
  line(spaceName, SIDE, 96, 36, 800, 50, markX - SIDE - 24);
  context.fillStyle = '#ffffff';
  roundRect(context, markX, 96, 50, 50, [16]);
  context.font = `900 28px ${FONT}`;
  context.fillStyle = ACCENT_INK;
  context.textAlign = 'center';
  context.fillText('D', markX + 25, 96 + 11);
  context.textAlign = 'left';
  line('Davas', WIDTH - SIDE, 96, 38, 900, 50, wordmarkWidth + 1, 'right');

  line(`${data.year}년 우리 결산`, SIDE, 186, 56, 900, 70);
  // One line for the total, made smaller only if a long count would not fit.
  const total = `${data.totals.records}편을 함께 봤어요`;
  let totalSize = 104;
  context.font = `900 ${totalSize}px ${FONT}`;
  while (totalSize > 64 && context.measureText(total).width > INNER) {
    totalSize -= 4;
    context.font = `900 ${totalSize}px ${FONT}`;
  }
  line(total, SIDE, 280, totalSize, 900, 115);
  line(
    `영화 ${data.totals.movies}편 · 드라마 ${data.totals.series}편 · 사진 ${data.totals.photos}장`,
    SIDE,
    415,
    36,
    700,
    45,
  );

  // Records per month, January to December; the busiest month in solid white.
  const top = Math.max(1, ...data.recap.monthly);
  const gap = 18;
  const barWidth = (INNER - gap * 11) / 12;
  const labelTop = 826;
  const barBottom = labelTop - 12;
  data.recap.monthly.forEach((value, index) => {
    const x = SIDE + index * (barWidth + gap);
    const height = value ? Math.max(10, Math.round((value / top) * 290)) : 10;
    context.fillStyle =
      data.recap.busiestMonth?.month === index + 1
        ? '#ffffff'
        : value
          ? 'rgba(255,255,255,0.6)'
          : 'rgba(255,255,255,0.26)';
    roundRect(context, x, barBottom - height, barWidth, height, [14, 14, 6, 6]);
    line(`${index + 1}월`, x + barWidth / 2, labelTop, 26, 800, 30, barWidth + gap, 'center');
  });

  // Up to six highlights, two to a row under a thin rule.
  const columnGap = 56;
  const columnWidth = (INNER - columnGap) / 2;
  recapLines(data)
    .slice(0, 6)
    .forEach((highlight, index) => {
      const x = SIDE + (index % 2) * (columnWidth + columnGap);
      const rowTop = 912 + Math.floor(index / 2) * 110;
      context.fillStyle = 'rgba(255,255,255,0.28)';
      context.fillRect(x, rowTop, columnWidth, 2);
      line(highlight.label, x, rowTop + 18, 26, 700, 32, columnWidth);
      line(highlight.value, x, rowTop + 56, 38, 900, 48, columnWidth);
    });

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('export failed'))),
      'image/png',
    ),
  );
}
