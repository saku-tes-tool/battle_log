import type { Meta, StoryObj } from '@storybook/react';
import { ActionModal } from './ActionModal';
import { sampleCharacters, sampleLog } from '../stories/sampleData';

const meta = {
  title: 'Components/ActionModal',
  component: ActionModal,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobileStandard',
    },
  },
  args: {
    characters: sampleCharacters,
    onClose: () => undefined,
    onSave: () => undefined,
    onDelete: () => undefined,
  },
} satisfies Meta<typeof ActionModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    log: sampleLog,
  },
};
