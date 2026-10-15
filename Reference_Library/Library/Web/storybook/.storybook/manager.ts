import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({ base: 'light', brandTitle: 'Web Library', brandUrl: 'https://www.figma.com/design/7qsOqckanKwGDbkljD3rb9/Web-Library' }),
  sidebar: { showRoots: true },
});
