import { OTHER_CHARACTER_ID } from '../constants';
import type { AppData } from '../types';
import { sortLogsByTimeDesc } from './sort';

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
  const lines: string[] = ['```text', '【編成】'];

  if (activeCharacters.length > 0) {
    activeCharacters.forEach((character) => {
      const equipments = [character.equipment1, character.equipment2].filter(
        (equipment) => equipment && equipment !== '未選択',
      );
      lines.push(`${character.name} - ${equipments.join(' / ') || '装備未選択'}`);
    });
  } else {
    lines.push('未登録');
  }

  lines.push('', '【行動】');

  const logs = sortLogsByTimeDesc(data.logs);
  if (logs.length > 0) {
    logs.forEach((log) => {
      lines.push(`- ${log.time}`);

      log.actions
        .filter((item) => item.characterId && (item.action.trim() || item.note.trim()))
        .forEach((item) => {
          lines.push(`  ${getCharacterName(item.characterId, data)}`);
          // 行動と備考は複数行入力を想定し、各行を箇条書きとして出力する。
          item.action
            .trim()
            .split(/\r?\n/)
            .filter((line) => line.trim())
            .forEach((line) => lines.push(`    - ${line.trim()}`));

          if (item.note.trim()) {
            item.note
              .trim()
              .split(/\r?\n/)
              .filter((line) => line.trim())
              .forEach((line) => lines.push(`    - ${line.trim()}`));
          }
        });
    });
  } else {
    lines.push('未登録');
  }

  lines.push('```');
  return lines.join('\n');
};
