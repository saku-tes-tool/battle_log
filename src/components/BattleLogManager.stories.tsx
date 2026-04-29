import type { Meta, StoryObj } from '@storybook/react';
import { sampleData } from '../stories/sampleData';
import { BattleLogManager } from './BattleLogManager';

const meta = {
  title: 'Components/BattleLogManager',
  component: BattleLogManager,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobileStandard',
    },
  },
  args: {
    data: sampleData,
    onEditCharacters: () => undefined,
    onAddAction: () => undefined,
    onEditLog: () => undefined,
    onDeleteLog: () => undefined,
    onClear: () => undefined,
    onExportJson: () => undefined,
    onImportJson: () => undefined,
    onSaveImage: () => undefined,
    onCopyText: () => undefined,
  },
} satisfies Meta<typeof BattleLogManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullView: Story = {};

export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
