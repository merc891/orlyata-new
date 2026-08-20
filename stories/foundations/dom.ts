export interface TokenSpecimen {
  className: string;
  name: string;
  value: string;
}

export function createFoundationPage(title: string, description: string): HTMLElement {
  const main = document.createElement('main');
  const header = document.createElement('header');
  const heading = document.createElement('h1');
  const note = document.createElement('p');

  main.className = 'foundation-page';
  header.className = 'foundation-header';
  heading.className = 'type-heading-1';
  heading.textContent = title;
  note.className = 'foundation-note type-body';
  note.textContent = description;

  header.append(heading, note);
  main.append(header);

  return main;
}

export function createTokenList(specimens: TokenSpecimen[], specimenType: string): HTMLUListElement {
  const list = document.createElement('ul');
  list.className = 'foundation-list';

  for (const specimen of specimens) {
    const item = document.createElement('li');
    const visual = document.createElement('span');
    const name = document.createElement('p');
    const value = document.createElement('code');

    item.className = 'foundation-specimen';
    visual.className = `${specimenType} ${specimen.className}`;
    visual.setAttribute('aria-hidden', 'true');
    name.className = 'foundation-token-name type-body';
    name.textContent = specimen.name;
    value.className = 'foundation-token-value';
    value.textContent = specimen.value;

    item.append(visual, name, value);
    list.append(item);
  }

  return list;
}
