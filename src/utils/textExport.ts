import { OTHER_CHARACTER_ID } from '../constants';
import type { AppData } from '../types';
import { sortLogsByTimeDesc } from './sort';

/**
 * テキスト出力用のキャラ名を取得する。
 * その他IDだけは編成に存在しないため固定名で返す。
 */
const getCharacterName = (characterId: string, data: AppData) => {
  if (characterId === OTHER_CHARACTER_ID) return 'その他';
  return data.characters.find((character) => character.id === characterId)?.name || '未設定';
};

/**
 * 共有用のプレーンテキストを生成する。
 * Discordなどへそのまま貼れるよう、コードブロック内に編成と行動をまとめる。
 */
export const formatBattleLogText = (data: AppData) => {
  const activeCharacters = data.characters.filter((character) => character.name.trim());
  const lines: string[] = ['```text'];
  const title = data.title?.trim();

  if (title) {
    lines.push(title, '');
  }

  lines.push('【編成】');

  if (activeCharacters.length > 0) {
    activeCharacters.forEach((character) => {
      const equipments = [character.equipment1, character.equipment2].filter(
        (equipment) => equipment && equipment !== '未選択',
      );
      lines.push(`${character.name} - ${equipments.join(' / ') || '魔道具未選択'}`);
      const note = character.note?.trim();
      if (note) {
        const noteText = note
          .split(/\r?\n/)
          .filter((line) => line.trim())
          .map((line) => line.trim())
          .join(' / ');
        if (noteText) {
          lines[lines.length - 1] = `${lines[lines.length - 1]} ※ ${noteText}`;
        }
      }
    });
  } else {
    lines.push('未登録');
  }

  lines.push('', '【行動】');

  const logs = sortLogsByTimeDesc(data.logs);
  if (logs.length > 0) {
    logs.forEach((log) => {
      lines.push(`- ${log.time}秒`);

      log.actions
        .filter((item) => item.characterId && (item.action.trim() || item.note.trim()))
        .forEach((item) => {
          const characterName = getCharacterName(item.characterId, data);
          const actionLines = item.action
            .trim()
            .split(/\r?\n/)
            .filter((line) => line.trim())
            .map((line) => line.trim());

          if (actionLines.length > 0) {
            lines.push(`  - ${characterName}：${actionLines[0]}`);
            actionLines.slice(1).forEach((line) => lines.push(`    ${line}`));
          } else {
            lines.push(`  - ${characterName}`);
          }

          if (item.note.trim()) {
            item.note
              .trim()
              .split(/\r?\n/)
              .filter((line) => line.trim())
              .forEach((line) => lines.push(`    ※ ${line.trim()}`));
          }
        });
    });
  } else {
    lines.push('未登録');
  }

  lines.push('```');
  return lines.join('\n');
};
