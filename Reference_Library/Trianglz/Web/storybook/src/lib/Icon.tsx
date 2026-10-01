import React from 'react';

// The 42 icons of the Figma page "➜ Icons" (component names "Icon/<Name>").
// The Figma set is Lucide style, so each one is drawn with its Lucide equivalent (24px grid, 2px stroke).
// Color always comes from currentColor, so icons follow the semantic icon/text token of their parent.
const paths: Record<string, string> = {
  Add: '<path d="M5 12h14m-7-7v14"/>',
  'Chevron Left': '<path d="m15 18l-6-6l6-6"/>',
  'Chevron Right': '<path d="m9 18l6-6l-6-6"/>',
  Edit: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4"/>',
  Upload: '<path d="M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  Download: '<path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10l5 5l5-5"/>',
  'Log Out': '<path d="m16 17l5-5l-5-5m5 5H9m0 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  'Log In': '<path d="m10 17l5-5l-5-5m5 5H3m12-9h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
  Eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  'Eye Off': '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20"/>',
  Delete: '<path d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  Share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98"/>',
  Language: '<path d="m5 8l6 6m-7 0l6-6l2-3M2 5h12M7 2h1m14 20l-5-10l-5 10m2-4h6"/>',
  Close: '<path d="M18 6L6 18M6 6l12 12"/>',
  'Chevron Down': '<path d="m6 9l6 6l6-6"/>',
  Minus: '<path d="M5 12h14"/>',
  Check: '<path d="M20 6L9 17l-5-5"/>',
  'Arrow Left': '<path d="m12 19l-7-7l7-7m7 7H5"/>',
  'Arrow Right': '<path d="M5 12h14m-7-7l7 7l-7 7"/>',
  'Arrow Down': '<path d="M12 5v14m7-7l-7 7l-7-7"/>',
  'Arrow Up': '<path d="m5 12l7-7l7 7m-7 7V5"/>',
  'Arrow Down Left': '<path d="M17 7L7 17m10 0H7V7"/>',
  'Arrow Down Right': '<path d="m7 7l10 10m0-10v10H7"/>',
  'Arrow Up Left': '<path d="M7 17V7h10m0 10L7 7"/>',
  'Arrow Up Right': '<path d="M7 7h10v10M7 17L17 7"/>',
  Phone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384"/>',
  Bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  Mail: '<path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
  Export: '<path d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  'Check Circle': '<circle cx="12" cy="12" r="10"/><path d="m16 9l-5.5 5.5L8 12"/>',
  'Close Circle': '<circle cx="12" cy="12" r="10"/><path d="m15 9l-6 6m0-6l6 6"/>',
  Question: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01"/>',
  'Alert Circle': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>',
  Info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>',
  Cancel: '<circle cx="12" cy="12" r="10"/><path d="M4.929 4.929L19.07 19.071"/>',
  Warning: '<path d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01"/>',
  Clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  Calendar: '<path d="M8 2v3m8-3v3"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/>',
  Search: '<path d="m21 21l-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  File: '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/>',
  User: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
};

export const iconNames = Object.keys(paths);
export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className, label }: { name: string; size?: number; className?: string; label?: string }) {
  const inner = paths[name] ?? paths.Question;
  return (
    <svg
      className={['icon', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-figma={`Icon/${name}`}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
