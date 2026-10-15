import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-designs', '@storybook/addon-mcp'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: false },
  core: { disableTelemetry: true },
};
export default config;
