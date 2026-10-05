// Template preview for every design system Storybook (copy to <storybook>/.storybook/preview.tsx; add the component order
// inside each group). Toolbars come from src/docs/Modes.tsx, generated from the Figma collections.
import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';
import '../src/styles/text-styles.css';
import '../src/styles/effects.css';
import '../src/styles/components.css';
import { modeGlobalTypes, modeInitialGlobals, withModes, ModesDocsContainer } from '../src/docs/Modes';

// Toolbars are generated from the Figma variable collections with more than one mode, with the exact Figma names:
// Platform (OS: iOS / Android), Color (Light / Dark), Language (EN / AR). Stories and docs pages follow them.
const preview: Preview = {
  decorators: [withModes as any],
  globalTypes: modeGlobalTypes,
  initialGlobals: modeInitialGlobals,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'none' },
    backgrounds: { disable: true },
    docs: { container: ModesDocsContainer },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Foundations', ['Colors', 'Typography', 'Sizing', 'Effects', 'Icons', 'Code'],
          'Form Elements',
          'Navigation',
          'Data Display',
          'Patterns',
        ],
      },
    },
    a11y: { test: 'todo' },
  },
};
export default preview;
