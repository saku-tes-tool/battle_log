import html2canvas from 'html2canvas';
import { createTimestamp } from './filename';

/**
 * 画面全体をPNGとして保存する。
 * 画像化中は操作ボタンをCSSで隠し、ログとして共有しやすい見た目にする。
 */
export const saveElementAsImage = async (
  element: HTMLElement,
  filename = `行動ログ_${createTimestamp()}.png`,
) => {
  document.body.classList.add('is-exporting-image');
  await new Promise((resolve) => window.requestAnimationFrame(resolve));

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#111114',
      scale: 2,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } finally {
    document.body.classList.remove('is-exporting-image');
  }
};
