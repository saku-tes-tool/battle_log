import type { Meta, StoryObj } from '@storybook/react';
import { ActionCard } from './ActionCard';
import { sampleCharacters, sampleLog } from '../stories/sampleData';

const meta = {
  title: 'Components/ActionCard',
  component: ActionCard,
  decorators: [
    (Story) => (
      <div className="story-card-frame">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobileStandard',
    },
  },
  args: {
    log: sampleLog,
    characters: sampleCharacters,
    onEdit: () => undefined,
    onDelete: () => undefined,
  },
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
