import type { Preview, Decorator } from '@storybook/react-vite';
import React from 'react';
import '../src/tokens/tokens.css';
import '../src/styles/text-styles.css';
import '../src/styles/effects.css';
import '../src/styles/components.css';

// Toolbars use the exact Figma mode names of each variable collection.
const withModes: Decorator = (Story, ctx) => {
  const { Semantic = 'Light', Breakpoint = 'Desktop' } = ctx.globals as Record<string, string>;
  const attrs = { 'data-semantic': Semantic, 'data-typography': Breakpoint, 'data-spacing': Breakpoint };
  React.useEffect(() => {
    Object.entries(attrs).forEach(([k, v]) => document.documentElement.setAttribute(k, v));
  }, [Semantic, Breakpoint]);
  return (
    <div {...attrs} className="sb-canvas">
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withModes],
  globalTypes: {
    Semantic: {
      description: 'Figma collection "Semantic" mode',
      toolbar: { title: 'Semantic', icon: 'mirror', items: ['Light', 'Dark'], dynamicTitle: true },
    },
    Breakpoint: {
      description: 'Figma collections "Typography" and "Spacing" mode',
      toolbar: { title: 'Mode', icon: 'browser', items: ['Desktop', 'iPad', 'Mobile'], dynamicTitle: true },
    },
  },
  initialGlobals: { Semantic: 'Light', Breakpoint: 'Desktop' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'none' },
    backgrounds: { disable: true },
    options: {
      storySort: { order: ['Introduction', 'Foundations', ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadows', 'Icons'], 'Form Elements', 'Navigation', 'Data display'] },
    },
    a11y: { test: 'todo' },
  },
  tags: ['autodocs'],
};
export default preview;
