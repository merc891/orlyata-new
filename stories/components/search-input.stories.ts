import type { Meta, StoryObj } from '@storybook/html-vite';

const renderSearchInput = (value = ''): HTMLDivElement => {
  const root = document.createElement('div');
  root.className = 'orlyata-search-input';
  const label = document.createElement('label');
  label.className = 'screen-reader-text';
  label.htmlFor = 'storybook-search';
  label.textContent = 'Поиск по названию, автору';
  const field = document.createElement('input');
  field.className = 'orlyata-search-input__field';
  field.id = 'storybook-search';
  field.name = 'q';
  field.type = 'search';
  field.placeholder = 'Поиск по названию, автору';
  field.value = value;
  const clear = document.createElement('button');
  clear.className = 'orlyata-search-input__clear';
  clear.type = 'button';
  clear.setAttribute('aria-label', 'Очистить поиск');
  clear.hidden = value === '';
  clear.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  root.append(label, field, clear);
  return root;
};

const meta = {
  title: 'Components/SearchInput',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => renderSearchInput() };
export const Typing: Story = { render: () => renderSearchInput('Debussy') };

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = document.createElement('div');
    root.append(renderSearchInput(), renderSearchInput('Debussy'));
    return root;
  },
};
