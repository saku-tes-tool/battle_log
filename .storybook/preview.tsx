import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'app',
      values: [{ name: 'app', value: '#111114' }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    viewport: {
      viewports: {
        mobileSmall: {
          name: 'Mobile Small',
          styles: {
            width: '360px',
            height: '740px',
          },
        },
        mobileStandard: {
          name: 'Mobile Standard',
          styles: {
            width: '390px',
            height: '844px',
          },
        },
        mobileLarge: {
          name: 'Mobile Large',
          styles: {
            width: '430px',
            height: '932px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '900px',
          },
        },
      },
      defaultViewport: 'mobileStandard',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
