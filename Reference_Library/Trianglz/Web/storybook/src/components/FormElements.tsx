// ⭐Form Elements - visual replicas of the Figma components. Props use the Figma property and
// variant names exactly (including spaces and case), so a developer reads the same names as in Figma.
import React from 'react';
import { Icon } from '../lib/Icon';
import { Button } from './Navigation';

type State6 = 'Default' | 'Disabled' | 'Hover' | 'Focus' | 'Filled' | 'Error';

function LabelRow(p: { label: string; optional?: boolean; tooltip?: boolean; optionalText?: string }) {
  return (
    <div className="field__label-row">
      <span className="ts-sm-medium">{p.label}</span>
      {p.optional && <span className="field__optional ts-sm-regular">{p.optionalText ?? '(Optional)'}</span>}
      {p.tooltip && <Icon name="Info" size={16} label="More info" />}
    </div>
  );
}

// ---------- OTP / Cell ----------
export type OTPCellProps = { State?: 'Empty' | 'Hover' | 'Focus' | 'Filled' | 'Error' | 'Success' | 'Disabled'; value?: string };
export function OTPCell({ State = 'Empty', value = '2' }: OTPCellProps) {
  return (
    <div className="otp-cell ts-2xl-semi-bold" data-state={State}>
      {State === 'Empty' || State === 'Hover' || State === 'Focus' ? '' : value}
    </div>
  );
}

// ---------- OTP / Field ----------
export type OTPFieldProps = {
  State?: 'Empty' | 'Filled' | 'Disabled' | 'Success' | 'Error';
  'Show hint'?: boolean; 'Show Label'?: boolean; 'Show success message'?: boolean; 'Show error message'?: boolean;
  Label?: string; Hint?: string; Label2?: string; Hint2?: string;
};
export function OTPField(p: OTPFieldProps) {
  const { State = 'Empty', Label = 'Enter code', Hint = 'This is a hint text.', Label2 = 'This is a success message.', Hint2 = 'Error message' } = p;
  const cell = (i: number): OTPCellProps['State'] =>
    State === 'Empty' ? (i === 0 ? 'Focus' : 'Empty') : State === 'Filled' ? 'Filled' : State;
  return (
    <div className="otp-field">
      {p['Show Label'] !== false && <span className="ts-sm-medium">{Label}</span>}
      <div className="otp-field__cells">{[0, 1, 2, 3, 4, 5].map((i) => <OTPCell key={i} State={cell(i)} value={String((i * 3 + 2) % 10)} />)}</div>
      {State === 'Success' && p['Show success message'] !== false ? (
        <span className="field__success ts-xs-regular"><Icon name="Check" size={18} />{Label2}</span>
      ) : State === 'Error' && p['Show error message'] !== false ? (
        <span className="field__error ts-xs-regular"><Icon name="Alert Circle" size={18} />{Hint2}</span>
      ) : (
        p['Show hint'] !== false && <span className="field__hint ts-xs-regular">{Hint}</span>
      )}
    </div>
  );
}

// ---------- Stepper ----------
export function Stepper({ State = 'Default' }: { State?: 'Minimum' | 'Default' }) {
  const [n, setN] = React.useState(State === 'Minimum' ? 1 : 2);
  React.useEffect(() => setN(State === 'Minimum' ? 1 : 2), [State]);
  return (
    <div className="stepper">
      <button className="stepper__btn" aria-label="Decrease" disabled={n <= 1} onClick={() => setN(n - 1)}><Icon name="Minus" size={16} /></button>
      <OTPCell State="Filled" value={String(n)} />
      <button className="stepper__btn" aria-label="Increase" onClick={() => setN(n + 1)}><Icon name="Add" size={16} /></button>
    </div>
  );
}

// ---------- Input / Text, Input / URL, Input / Card Number ----------
export type InputProps = {
  State?: State6;
  'Show optional'?: boolean; 'Show hint'?: boolean; 'Show error message'?: boolean; 'Show icon'?: boolean;
  'Show Payment method icon'?: boolean; Label?: string; Hint?: string; 'Error message'?: string;
  'Show tooltip'?: boolean; 'Show link'?: boolean;
};
function InputBase(p: InputProps & { kind: 'Text' | 'URL' | 'Card Number' }) {
  const { State = 'Default', Label = 'Label', Hint = 'This is a hint text.' } = p;
  const placeholder = p.kind === 'URL' ? 'www.example.com' : p.kind === 'Card Number' ? '0000 0000 0000 0000' : 'Enter Name';
  const filled = State === 'Filled' ? (p.kind === 'URL' ? 'www.trianglz.com' : p.kind === 'Card Number' ? '4242 4242 4242 4242' : 'Abdulrahman') : undefined;
  return (
    <div className="field" data-state={State}>
      <LabelRow label={Label} optional={p['Show optional'] ?? true} tooltip={p['Show tooltip'] ?? true} />
      {p['Show hint'] !== false && State !== 'Error' && <span className="field__hint ts-xs-regular">{Hint}</span>}
      <label className="control ts-sm-regular">
        {p.kind === 'URL' && <span className="control__prefix">http://</span>}
        {(p.kind === 'Card Number' || p['Show Payment method icon']) && <span className="card-brand ts-xs-medium">VISA</span>}
        <input aria-label={Label} placeholder={placeholder} defaultValue={filled} key={State} disabled={State === 'Disabled'} autoFocus={false} />
        {p['Show link'] && <a className="field__link ts-sm-medium" href="#">Link</a>}
        {(p['Show icon'] ?? true) && p.kind === 'Text' && <Icon name="Chevron Down" size={16} />}
      </label>
      {State === 'Error' && p['Show error message'] !== false && <span className="field__error ts-xs-regular">{p['Error message'] ?? 'Error message'}</span>}
    </div>
  );
}
export const InputText = (p: InputProps) => <InputBase {...p} kind="Text" />;
export const InputURL = (p: InputProps) => <InputBase {...p} kind="URL" />;
export const InputCardNumber = (p: Omit<InputProps, 'Show link'>) => <InputBase {...p} kind="Card Number" />;

// ---------- Upload Field ----------
export type UploadFieldProps = {
  State?: 'Default' | 'Disabled' | 'Hover' | 'Uploaded' | 'Error';
  'Show Label'?: boolean; 'Label Text'?: string; 'Hint Text'?: string; 'Show (Optional)'?: boolean; 'Show Help Icon'?: boolean;
};
export function UploadField(p: UploadFieldProps) {
  const { State = 'Default' } = p;
  return (
    <div className="field" data-state={State}>
      {p['Show Label'] !== false && <LabelRow label={p['Label Text'] ?? 'Upload File'} optional={p['Show (Optional)'] ?? true} tooltip={p['Show Help Icon'] ?? true} />}
      <span className="field__hint ts-xs-regular">{p['Hint Text'] ?? 'Accepted Formats: PDF, Word , Excel. Max File Size 5 MB'}</span>
      <label className="control control--upload ts-sm-regular">
        {State === 'Uploaded' ? (
          <>
            <Icon name="File" size={24} />
            <span className="upload__file">File-Name.pdf</span>
            <Icon name="Delete" size={24} label="Remove file" />
          </>
        ) : (
          <>
            <Icon name="Upload" size={24} />
            <span className="upload__cta">Click to upload</span>
            <input type="file" hidden disabled={State === 'Disabled'} />
          </>
        )}
      </label>
      {State === 'Error' && <span className="field__error ts-xs-regular">Error message</span>}
    </div>
  );
}

// ---------- Search ----------
export function Search({ State = 'Default' }: { State?: 'Default' | 'Hover' | 'Filled' | 'Focus' }) {
  const [q, setQ] = React.useState(State === 'Filled' ? 'Lorem Ipsum' : '');
  React.useEffect(() => setQ(State === 'Filled' ? 'Lorem Ipsum' : ''), [State]);
  return (
    <div className="search" data-state={State}>
      <label className="control ts-sm-regular">
        <Icon name="Search" size={20} />
        <input aria-label="Search" placeholder="Search by..." value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button className="alert__close" aria-label="Clear" onClick={() => setQ('')}><Icon name="Close" size={16} /></button>}
      </label>
    </div>
  );
}

// ---------- Menu / Item, Menu, Select / Dropdown ----------
export type MenuItemProps = { State?: 'Default' | 'Hover' | 'Selected' | 'Disabled'; Label?: string; 'Show leading icon'?: boolean; 'Leading icon'?: string; onClick?: () => void };
export function MenuItem({ State = 'Default', Label = 'Menu item', ...p }: MenuItemProps) {
  return (
    <div className={`menu-item ${State === 'Selected' ? 'ts-sm-medium' : 'ts-sm-regular'}`} data-state={State} role="option" aria-selected={State === 'Selected'} aria-disabled={State === 'Disabled'} onClick={p.onClick}>
      {p['Show leading icon'] && <Icon name={p['Leading icon'] ?? 'User'} size={20} />}
      <span className="menu-item__label">{Label}</span>
      {State === 'Selected' && <Icon name="Check" size={20} />}
    </div>
  );
}
export function Menu({ selected = 1, onSelect }: { selected?: number; onSelect?: (i: number) => void }) {
  return (
    <div className="menu" role="listbox">
      {[1, 2, 3, 4, 5].map((i) => (
        <MenuItem key={i} Label={`Menu item ${i}`} State={i === selected ? 'Selected' : 'Default'} onClick={() => onSelect?.(i)} />
      ))}
    </div>
  );
}
export function SelectDropdown({ Open = 'False' }: { Open?: 'False' | 'True' }) {
  const [open, setOpen] = React.useState(Open === 'True');
  const [sel, setSel] = React.useState(2);
  React.useEffect(() => setOpen(Open === 'True'), [Open]);
  return (
    <div className="select">
      <div onClick={() => setOpen(!open)}>
        <InputText State={open ? 'Focus' : 'Default'} Label="Label" Hint={`Selected: Menu item ${sel}`} />
      </div>
      {open && <Menu selected={sel} onSelect={(i) => { setSel(i); setOpen(false); }} />}
    </div>
  );
}

// ---------- Textarea ----------
export type TextareaProps = { State?: State6; 'Show Optional'?: boolean; 'Show Tooltip'?: boolean; 'Show Hint'?: boolean; Label?: string; Hint?: string; 'Error message'?: string };
export function Textarea(p: TextareaProps) {
  const { State = 'Default', Label = 'Description' } = p;
  return (
    <div className="field" data-state={State} style={{ width: 560 }}>
      <LabelRow label={Label} optional={p['Show Optional'] ?? true} tooltip={p['Show Tooltip'] ?? true} />
      {p['Show Hint'] !== false && <span className="field__hint ts-xs-regular">{p.Hint ?? 'This is a hint text.'}</span>}
      <label className="control control--area ts-sm-regular">
        <textarea aria-label={Label} placeholder="Enter description" key={State} defaultValue={State === 'Filled' ? 'A short description of the project.' : undefined} disabled={State === 'Disabled'} />
      </label>
      {State === 'Error' && <span className="field__error ts-sm-regular">{p['Error message'] ?? 'This field is required.'}</span>}
    </div>
  );
}

// ---------- Checkbox, Radio, Toggle ----------
const flags = (s: string) => ({
  on: /^(Checked|On)|Checked$|^Indeterminate/.test(s) && !/^Unchecked/.test(s),
  hover: /Hover/.test(s), focus: /Focus/.test(s), disabled: /Disabled/.test(s),
});

export type CheckboxState = 'Unchecked' | 'Indeterminate' | 'Disabled' | 'Checked' | 'Disabled Checked' | 'Hover' | 'Focus' | 'Checked Hover' | 'Checked Focus';
export function Checkbox({ State = 'Unchecked', Text = 'Checkbox', 'Show text': showText = true }: { State?: CheckboxState; Text?: string; 'Show text'?: boolean }) {
  const f = flags(State);
  const [on, setOn] = React.useState(f.on);
  React.useEffect(() => setOn(f.on), [State]);
  return (
    <label className="choice ts-sm-regular" data-disabled={f.disabled}>
      <input type="checkbox" hidden checked={on} disabled={f.disabled} onChange={() => setOn(!on)} />
      <span className="checkbox__box" data-on={on} data-hover={f.hover} data-focus={f.focus} data-dim={f.disabled && on}>
        {on && <Icon name={State === 'Indeterminate' ? 'Minus' : 'Check'} size={14} />}
      </span>
      {showText && Text}
    </label>
  );
}

export type RadioState = 'Unchecked' | 'Checked' | 'Checked Disabled' | 'Disabled' | 'Hover' | 'Focus' | 'Checked Hover' | 'Checked Focus';
export function Radio({ State = 'Unchecked', Text = 'Radio Buttons' }: { State?: RadioState; Text?: string }) {
  const f = flags(State);
  return (
    <label className="choice ts-sm-regular" data-disabled={f.disabled}>
      <input type="radio" hidden defaultChecked={f.on} disabled={f.disabled} />
      <span className="radio__ring" data-on={f.on} data-hover={f.hover} data-focus={f.focus} data-dim={f.disabled}>{f.on && <span className="radio__dot" />}</span>
      {Text}
    </label>
  );
}

export type ToggleState = 'On' | 'On Disabled' | 'Off' | 'Off Disabled' | 'On Hover' | 'On Focus' | 'Off Hover' | 'Off Focus';
export function Toggle({ State = 'On', 'Show text': showText = true, Label = 'Text', Label2 }: { State?: ToggleState; 'Show text'?: boolean; Label?: string; Label2?: string }) {
  const f = { on: State.startsWith('On'), hover: /Hover/.test(State), focus: /Focus/.test(State), disabled: /Disabled/.test(State) };
  const [on, setOn] = React.useState(f.on);
  React.useEffect(() => setOn(f.on), [State]);
  return (
    <label className="choice ts-sm-regular" data-disabled={f.disabled}>
      <input type="checkbox" role="switch" hidden checked={on} disabled={f.disabled} onChange={() => setOn(!on)} />
      <span className="toggle__track" data-on={on} data-hover={f.hover} data-focus={f.focus} data-disabled={f.disabled} data-dim={f.disabled}><span className="toggle__thumb" /></span>
      {showText && <span>{Label}{Label2 ? <span className="field__hint"> {Label2}</span> : null}</span>}
    </label>
  );
}

export { Button };
