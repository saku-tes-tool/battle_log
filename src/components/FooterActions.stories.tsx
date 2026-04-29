import type { Meta, StoryObj } from '@storybook/react';
import { FooterActions } from './FooterActions';

const meta = {
  title: 'Components/FooterActions',
  component: FooterActions,
  args: {
    hasLogs: true,
    onClear: () => undefined,
    onExportJson: () => undefined,
    onImportJson: () => undefined,
    onSaveImage: () => undefined,
    onCopyText: () => undefined,
  },
} satisfies Meta<typeof FooterActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
