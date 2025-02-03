import { LitElement, html } from 'lit';
import { cardTemplate } from '../templates/card-template';
import { cardStyles } from '../styles/card-styles';
import { formatDuration, formatEndTime } from '../utils/formatters';
import { isPrinting, isPaused, getAmsSlots, getEntityStates } from '../utils/state-helpers';
import { DEFAULT_CONFIG, DEFAULT_CAMERA_REFRESH_RATE } from '../constants/config';

class PrintWatchCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _lastCameraUpdate: { type: Number },
      _cameraUpdateInterval: { type: Number },
      _cameraError: { type: Boolean },
      _dialogConfig: { state: true }
    };
  }

  static get styles() {
    return cardStyles;
  }

  constructor() {
    super();
    this._lastCameraUpdate = 0;
    this._cameraUpdateInterval = DEFAULT_CAMERA_REFRESH_RATE;
    this._cameraError = false;
    this._dialogConfig = { open: false };
    this.formatters = {
      formatDuration,
      formatEndTime
    };
  }

  setConfig(config) {
    if (!config.printer_name) {
      throw new Error('Please define printer_name');
    }
    this.config = { ...DEFAULT_CONFIG, ...config };
    this._cameraUpdateInterval = config.camera_refresh_rate || DEFAULT_CAMERA_REFRESH_RATE;
  }

  isOnline() {
    const onlineEntity = this.hass.states[this.config.online_entity];
    return onlineEntity?.state === 'on';
  }

  shouldUpdateCamera() {
    if (!this.isOnline()) {
      return false;
    }

    const now = Date.now();
    return now - this._lastCameraUpdate > this._cameraUpdateInterval;
  }

  handleImageError() {
    this._cameraError = true;
    this.requestUpdate();
  }

  handleImageLoad() {
    this._cameraError = false;
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('hass')) {
      if (this.shouldUpdateCamera()) {
        this._updateCameraFeed();
      }
    }
  }

  _updateCameraFeed() {
    if (!this.isOnline()) {
      return;
    }

    this._lastCameraUpdate = Date.now();
    
    const timestamp = new Date().getTime();
    const cameraImg = this.shadowRoot?.querySelector('.camera-feed img');
    if (cameraImg) {
      const cameraEntity = this.hass.states[this.config.camera_entity];
      if (cameraEntity?.attributes?.entity_picture) {
        cameraImg.src = `${cameraEntity.attributes.entity_picture}&t=${timestamp}`;
      }
    }

    const coverImg = this.shadowRoot?.querySelector('.preview-image img');
    if (coverImg) {
      const coverEntity = this.hass.states[this.config.cover_image_entity];
      if (coverEntity?.attributes?.entity_picture) {
        coverImg.src = `${coverEntity.attributes.entity_picture}&t=${timestamp}`;
      }
    }
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const entities = getEntityStates(this.hass, this.config);
    const amsSlots = getAmsSlots(this.hass, this.config);
    
    const setDialogConfig = (config) => {
      this._dialogConfig = config;
      this.requestUpdate();
    };

    return cardTemplate({
      entities,
      hass: this.hass,
      amsSlots,
      formatters: this.formatters,
      _toggleLight: () => this._toggleLight(),
      _toggleFan: () => this._toggleFan(),
      _cameraError: this._cameraError,
      isOnline: this.isOnline(),
      handleImageError: () => this.handleImageError(),
      handleImageLoad: () => this.handleImageLoad(),
      dialogConfig: this._dialogConfig,
      setDialogConfig
    });
  }

  // This is used by Home Assistant for card size calculation
  getCardSize() {
    return 6;
  }
}

customElements.define('printwatch-card', PrintWatchCard);

export default PrintWatchCard;