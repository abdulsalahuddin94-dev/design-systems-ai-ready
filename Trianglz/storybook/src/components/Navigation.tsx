// ⭐Navigation - actions and anything that moves between places. Figma names kept exactly.
import React from 'react';
import { Icon } from '../lib/Icon';

// ---------- Button ----------
export type ButtonProps = {
  Type?: 'Filled' | 'Outline' | 'Pill' | 'Link' | 'Danger';
  Size?: 'base' | 'lg' | 'sm' | 'xl' | 'xs';
  Icon?: 'None' | 'Left' | 'Right' | 'Only';
  State?: 'Default' | 'Focus' | 'Hover' | 'Disabled';
  onClick?: () => void;
};
const textStyle: Record<string, string> = { xs: 'ts-xs-medium', sm: 'ts-sm-medium', base: 'ts-sm-medium', lg: 'ts-base-medium', xl: 'ts-base-medium' };
const iconSize: Record<string, number> = { xs: 16, sm: 16, base: 18, lg: 20, xl: 20 };
export function Button({ Type = 'Filled', Size = 'base', Icon: icon = 'None', State = 'Default', onClick }: ButtonProps) {
  const ic = iconSize[Size];
  return (
    <button
      className={`btn ${textStyle[Size]}`}
      data-type={Type}
      data-size={Size}
      data-icon={icon}
      data-state={State}
      disabled={State === 'Disabled'}
      aria-label={icon === 'Only' ? 'Upload' : undefined}
      onClick={onClick}
    >
      {icon === 'Left' && <Icon name="Add" size={ic} />}
      {icon === 'Only' ? <Icon name="Upload" size={ic} /> : 'Button text'}
      {icon === 'Right' && <Icon name="Arrow Right" size={ic} />}
    </button>
  );
}

// ---------- Pagination / Item ----------
export type PaginationItemProps = { Type?: 'Number' | 'Ellipsis' | 'Prev' | 'Next'; State?: 'Default' | 'Hover' | 'Active' | 'Disabled'; page?: number; onClick?: () => void };
export function PaginationItem({ Type = 'Number', State = 'Default', page = 1, onClick }: PaginationItemProps) {
  return (
    <button className={`page-item ${Type === 'Ellipsis' ? 'ts-sm-regular' : 'ts-sm-medium'}`} data-type={Type} data-state={State} disabled={State === 'Disabled'} aria-current={State === 'Active' ? 'page' : undefined} onClick={onClick}>
      {Type === 'Prev' && <><Icon name="Arrow Left" size={16} />Previous</>}
      {Type === 'Next' && <>Next<Icon name="Arrow Right" size={16} /></>}
      {Type === 'Number' && page}
      {Type === 'Ellipsis' && '...'}
    </button>
  );
}
export function Pagination() {
  const [p, setP] = React.useState(2);
  const pages = [1, 2, 3];
  return (
    <nav className="sb-row" aria-label="Pagination" style={{ gap: 'var(--space-2)' }}>
      <PaginationItem Type="Prev" State={p === 1 ? 'Disabled' : 'Default'} onClick={() => setP(p - 1)} />
      {pages.map((n) => <PaginationItem key={n} page={n} State={n === p ? 'Active' : 'Default'} onClick={() => setP(n)} />)}
      <PaginationItem Type="Ellipsis" />
      <PaginationItem page={10} State={p === 10 ? 'Active' : 'Default'} onClick={() => setP(10)} />
      <PaginationItem Type="Next" State={p === 10 ? 'Disabled' : 'Default'} onClick={() => setP(p === 3 ? 10 : Math.min(p + 1, 10))} />
    </nav>
  );
}

// ---------- Tabs / Item — Underline, Tabs / Item — Pill ----------
export type TabState = 'Default' | 'Hover' | 'Active' | 'Disabled';
export function TabUnderline({ Style = 'Underline', State = 'Default', label = 'Tab label', onClick }: { Style?: 'Underline'; State?: TabState; label?: string; onClick?: () => void }) {
  return <button role="tab" aria-selected={State === 'Active'} className="tab ts-sm-medium" data-style={Style} data-state={State} disabled={State === 'Disabled'} onClick={onClick}>{label}</button>;
}
export function TabPill({ Style = 'Pill', State = 'Default', label = 'Tab label', onClick }: { Style?: 'Pill'; State?: TabState; label?: string; onClick?: () => void }) {
  return <button role="tab" aria-selected={State === 'Active'} className="tab ts-sm-medium" data-style={Style} data-state={State} disabled={State === 'Disabled'} onClick={onClick}>{label}</button>;
}
export function Tabs({ Style }: { Style: 'Underline' | 'Pill' }) {
  const [a, setA] = React.useState(0);
  const T = Style === 'Underline' ? TabUnderline : TabPill;
  return (
    <div role="tablist" className={`tabs ${Style === 'Underline' ? 'tabs--underline' : ''}`}>
      {['Overview', 'Members', 'Settings', 'Billing'].map((l, i) => (
        <T key={l} label={l} State={i === 3 ? 'Disabled' : i === a ? 'Active' : 'Default'} onClick={() => setA(i)} />
      ))}
    </div>
  );
}

// ---------- Breadcrumb / Item, Breadcrumb ----------
export function BreadcrumbItem({ State = 'Default', Label = 'Page' }: { State?: 'Default' | 'Hover' | 'Current'; Label?: string }) {
  return (
    <a className={`crumb ${State === 'Current' ? 'ts-sm-medium' : 'ts-sm-regular'}`} data-state={State} href={State === 'Current' ? undefined : '#'} aria-current={State === 'Current' ? 'page' : undefined}>
      {Label}
    </a>
  );
}
export function Breadcrumb() {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <BreadcrumbItem Label="Home" />
      <Icon name="Chevron Right" size={16} />
      <BreadcrumbItem Label="Projects" />
      <Icon name="Chevron Right" size={16} />
      <BreadcrumbItem Label="Project settings" State="Current" />
    </nav>
  );
}
