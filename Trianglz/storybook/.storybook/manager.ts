import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({ base: 'light', brandTitle: 'Trianglz - Web Design System', brandUrl: 'https://www.figma.com/design/7qsOqckanKwGDbkljD3rb9/Trianglz---Web-Design-System' }),
  sidebar: { showRoots: true },
});
