import { html } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';

export const stars = ({ onRate, rating }) => {
  const star = value =>
    html`<span class="star" on-click=${onRate(value)}>${
      rating >= value ? '★' : '☆'
    }</span>`;

  return html`
    ${star(1)}
    ${star(2)}
    ${star(3)}
    ${star(4)}
    ${star(5)}
  `;
};
