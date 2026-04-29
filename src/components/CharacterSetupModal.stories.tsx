import type { Meta, StoryObj } from '@storybook/react';
import { CharacterSetupModal } from './CharacterSetupModal';
import { sampleCharacters } from '../stories/sampleData';

const meta = {
  title: 'Components/CharacterSetupModal',
  component: CharacterSetupModal,
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
  },
} satisfies Meta<typeof CharacterSetupModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
