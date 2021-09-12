import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS("https://fonts.googleapis.com/css?family=Gloria+Hallelujah");

class SkodaCard extends LitElement {
  constructor() {
    super();
    this.imageurl = "";
    this.config = {};
  }

  static get styles() {
    return style;
  }

  set hass(hass) {
    this._hass = hass;
    let updated = false;
  }

  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object }
    };
  }

  setConfig(config) {
    if (!config.device) {
      throw new Error('Please define a device (vehicle name)');
    }
    if (!config.entities) {
      throw new Error('Please define a list of entities');
    }
    this.config = config;
    this.imageurl = 'https://ip-modcwp.azureedge.net//modcwp3v5b20200903/0F0F-2ovtqWUlebk-6kVu2o9bdY-17NgmyXQTv.qVlH-yIC8G.6aPQ2EXMUzv-s1BZqeSWgmRyK69.kcuHUNDxO-DiSFcTLXOgdPZlAGIn-1080570studiovbeauty_connectview101281.png';
  }

  render(){
    return html`
      <ha-card>
        ${this.renderContainer()}
      </ha-card>
    `;
  }

  renderContainer() {
    return html `
      <div class="skoda-container">
        ${this.renderBackground()} ${this.renderHeader()} ${this.renderStates()}
      </div>
    `
  }

  renderHeader() {
    return html `
      ${this.config.title == null || this.config.title == true
      ? html`
        <div class="skoda-header">
          <div class="name">
            ${this.header}
          </div>
        </div>`
      : "" }
    `;
  }

  renderBackground() {
    return html `
      <img class="skoda-model" src="${this.imageurl}">
    `
  }

  // stateObj props:
  //   entity-id
  //   state
  //   attributes
  //    model
  //    unit_of_measurement
  //    friendly_name
  //    icon
  //    assumed_state
  //   last_changed
  //   last_updated
  //   context
  renderStates() {
    return html `
      <div class="skoda-footer">
      ${this.config.entities.map(ent => {
        const stateObj = this._hass.states[ent];
        return stateObj
          ? this.renderState(stateObj)
          : html`
              <div class="not-found">Entity ${ent} not found.</div>
            `;
      })}
      </div>
    `
  }

  renderState(entity) {
    return html`
      <div class="skoda-state">
        <div class="skoda-state-icon">
          <ha-icon class="skoda-icon" .icon=${this.getIcon(entity)}></ha-icon>
          <span class="tooltip">${this.entity.attributes.friendly_name}</span>
        </div>
        ${this.config.states == true ? html `<div class="skoda-state-text">${entity.state}</div>` : "" }
      </div>
    `;
  }

  // @TODO: This requires more intelligent logic
  getCardSize() {
    return 3;
  }

  getIcon(entity) {
    return (
      this.config.icon || entity.attributes.icon
    );
  }

  static get styles() {
    return css`
      .skoda-container {
        position: relative;
      }

      .skoda-model {
        display: block;
        max-width: 100%;
        padding-top: 30px;
        padding-bottom: 20px;
      }

      .skoda-header {
        position: absolute;
        top: 0;
        width: 100%;
        padding-top: 10px;
        text-align: center;
        font-size: 24px;
      }

      .skoda-state {
        height: 100%;
        width: 50px;
        margin: 0px 5px;
      }

      .skoda-state-icon {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
        max-width: 100%;
        margin: 0px;
        padding: 5px 0px;
      }
      .skoda-state-icon .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;

        /* Position the tooltip text - see examples below! */
        position: absolute;
        z-index: 1;
      }
      /* Show the tooltip text when you mouse over the tooltip container */
      .skoda-state-icon:hover .tooltiptext {
        visibility: visible;
      }

      p.skoda-state-text {
        margin: 5px 0px;
        padding: 0px;
      }

      .skoda-footer {
        position: absolute;
        bottom: 0px;
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        justify-content: space-evenly;
        width: 100%;
        height: 50px;
        background-color: var(--primary-background-color);
        opacity: 70%;
      }
    `;
  }
}

customElements.define('skoda-card', SkodaCard);
