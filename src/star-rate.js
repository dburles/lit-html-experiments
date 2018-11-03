import { html } from 'https://unpkg.com/lit-html?module';

export const stars = ({ onRate, rating }) => {
  const star = value =>
    html`<span class="star" @click=${onRate(value)}>${
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
