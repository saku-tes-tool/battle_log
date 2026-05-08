import type { Meta, StoryObj } from '@storybook/react';
import { sampleCharacters, sampleData } from '../stories/sampleData';
import { LogListView } from './LogListView';

const meta = {
  title: 'Components/LogListView',
  component: LogListView,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobileStandard',
    },
  },
  args: {
    logs: [
      {
        id: 'entry-1',
        title: sampleData.title,
        characters: sampleCharacters,
        logs: sampleData.logs,
        createdAt: '2026-05-09T00:00:00.000Z',
        updatedAt: '2026-05-09T00:30:00.000Z',
      },
      {
        id: 'entry-2',
        title: '別ルート確認',
        characters: sampleCharacters.map((character, index) =>
          index === 2 ? { ...character, name: '' } : character,
        ),
        logs: [],
        createdAt: '2026-05-08T00:00:00.000Z',
        updatedAt: '2026-05-08T21:15:00.000Z',
      },
    ],
    onCreate: () => undefined,
    onOpen: () => undefined,
    onDuplicate: () => undefined,
    onDelete: () => undefined,
    onExportAll: () => undefined,
    onImportJson: () => undefined,
    onClearAll: () => undefined,
  },
} satisfies Meta<typeof LogListView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    logs: [],
  },
};
