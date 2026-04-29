import type { Meta, StoryObj } from '@storybook/react';
import { FloatingActionButton } from './FloatingActionButton';

const meta = {
  title: 'Components/FloatingActionButton',
  component: FloatingActionButton,
  args: {
    onClick: () => undefined,
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
