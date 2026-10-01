// ⭐Data display - components that show information. Figma names kept exactly.
import React from 'react';
import { Icon } from '../lib/Icon';
import { Button } from './Navigation';

// ---------- Avatar ----------
export type AvatarProps = { Type?: 'Icon' | 'Photo' | 'Initials'; Size?: 'Large' | 'Medium' | 'Small' | 'XSmall' };
const initialsStyle: Record<string, string> = { Large: 'ts-2xl-semi-bold', Medium: 'ts-lg-semi-bold', Small: 'ts-sm-medium', XSmall: 'ts-xs-medium' };
const avatarIcon: Record<string, number> = { Large: 60, Medium: 38, Small: 24, XSmall: 18 };
export function Avatar({ Type = 'Initials', Size = 'Large', error }: AvatarProps & { error?: boolean }) {
  return (
    <span className="avatar" data-type={Type} data-size={Size} data-error={error} role="img" aria-label={Type === 'Initials' ? 'AK' : 'User avatar'}>
      {Type === 'Initials' && <span className={initialsStyle[Size]}>AK</span>}
      {Type === 'Icon' && <Icon name="User" size={avatarIcon[Size]} />}
    </span>
  );
}

// ---------- Avatar Upload ----------
export function AvatarUpload({ State = 'Default' }: { State?: 'Default' | 'Uploaded' | 'Error' }) {
  return (
    <div className="avatar-upload">
      <Avatar Type={State === 'Uploaded' ? 'Photo' : 'Icon'} Size="Large" error={State === 'Error'} />
      <button className="avatar-upload__edit" aria-label="Change photo"><Icon name="Edit" size={16} /></button>
    </div>
  );
}

// ---------- Tooltip ----------
export type TooltipProps = { Arrow?: 'Down' | 'Left' | 'Right' | 'Up'; Size?: 'Small' | 'Large'; Text?: string; 'Text (large)'?: string };
export function Tooltip({ Arrow = 'Down', Size = 'Small', Text = 'Tooltips', 'Text (large)': large = 'A message which appears when a cursor is positioned over an icon, image, hyperlink, or other element in a graphical user interface.' }: TooltipProps) {
  return (
    <div className="tooltip" data-arrow={Arrow} data-size={Size} role="tooltip">
      <div className="tooltip__content ts-xs-regular">{Size === 'Small' ? Text : large}</div>
      <div className="tooltip__arrow" />
    </div>
  );
}

// ---------- Alert ----------
const alertCopy = {
  Info: ['Information', 'This is an informational alert providing helpful context to the user.', 'Info'],
  Warning: ['Warning', 'Please review the details before you continue.', 'Warning'],
  Error: ['Error', 'Something went wrong. Please try again or contact support.', 'Alert Circle'],
  Success: ['Success', 'Your changes have been saved successfully.', 'Check Circle'],
} as const;
export function Alert({ Status = 'Info', 'Show close': showClose = true }: { Status?: 'Info' | 'Warning' | 'Error' | 'Success'; 'Show close'?: boolean }) {
  const [title, message, icon] = alertCopy[Status];
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => setOpen(true), [Status, showClose]);
  if (!open) return <Button Type="Link" Size="sm" onClick={() => setOpen(true)} />;
  return (
    <div className="alert" data-status={Status} role={Status === 'Error' ? 'alert' : 'status'}>
      <Icon name={icon} size={32} />
      <div className="alert__body">
        <span className="alert__title ts-base-medium">{title}</span>
        <span className="alert__message ts-sm-regular">{message}</span>
      </div>
      {showClose && <button className="alert__close" aria-label="Close" onClick={() => setOpen(false)}><Icon name="Close" size={24} /></button>}
    </div>
  );
}

// ---------- Badge ----------
export function Badge({ Status = 'Info' }: { Status?: 'Warning' | 'Error' | 'Success' | 'Info' }) {
  return (
    <span className="badge ts-xs-regular" data-status={Status}>
      {Status === 'Info' ? 'Badge' : Status}
      <Icon name="Info" size={16} />
    </span>
  );
}

// ---------- Toast ----------
const toastIcon = { Info: 'Info', Success: 'Check Circle', Warning: 'Warning', Error: 'Alert Circle' } as const;
export function Toast({ Status = 'Info', Title = 'Changes saved', Message = 'Your profile has been updated.', 'Show close': showClose = true }: { Status?: 'Info' | 'Success' | 'Warning' | 'Error'; Title?: string; Message?: string; 'Show close'?: boolean }) {
  return (
    <div className="toast" data-status={Status} role="status">
      <Icon name={toastIcon[Status]} size={24} />
      <div className="toast__content">
        <span className="toast__title ts-sm-medium">{Title}</span>
        <span className="toast__message ts-sm-regular">{Message}</span>
      </div>
      {showClose && <button className="alert__close" aria-label="Close" style={{ padding: 'var(--space-2) var(--space-3)' }}><Icon name="Close" size={16} /></button>}
    </div>
  );
}

// ---------- Confirmation Popup ----------
const popupIcon = { Success: 'Check Circle', Info: 'Info', Warning: 'Warning', Danger: 'Delete' } as const;
export function ConfirmationPopup({ Status = 'Success', Title = 'Main Text', Body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 'Show close': showClose = true }: { Status?: 'Success' | 'Info' | 'Warning' | 'Danger'; Title?: string; Body?: string; 'Show close'?: boolean }) {
  return (
    <div className="popup" data-status={Status} role="dialog" aria-modal="true" aria-labelledby="popup-title">
      {showClose && <button className="popup__close" aria-label="Close"><Icon name="Close" size={24} /></button>}
      <div className="sb-col" style={{ gap: 'var(--space-4)' }}>
        <div className="popup__icon"><Icon name={popupIcon[Status]} size={32} /></div>
        <div className="popup__text">
          <span id="popup-title" className="popup__title ts-lg-medium">{Title}</span>
          <span className="popup__body ts-sm-regular">{Body}</span>
        </div>
      </div>
      <div className="popup__actions">
        <Button Type="Outline" Size="xs" />
        <Button Type={Status === 'Danger' ? 'Danger' : 'Filled'} Size="xs" />
      </div>
    </div>
  );
}
