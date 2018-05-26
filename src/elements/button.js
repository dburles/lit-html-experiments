import {
  LitElement,
  html,
} from 'https://unpkg.com/@polymer/lit-element@0.5.1/lit-element.js?module';

class Button extends LitElement {
  static get properties() {
    return {
      mood: String,
    };
  }

  _render({ mood = 'papayawhip' }) {
    return html`
      <style>
        button {
          background: ${mood};
          padding: 10px 20px;
          font-size: 16px;
        }
      </style>
      <button on-click=${this.onClick}><slot></slot></button>
    `;
  }
}

customElements.define('b-button', Button);
