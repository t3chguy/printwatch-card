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
    };
  }

  static get styles() {
    return cardStyles;
  }

  constructor() {
    super();
    this._lastCameraUpdate = 0;
    this._cameraUpdateInterval = DEFAULT_CAMERA_REFRESH_RATE;
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

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('hass')) {
      this._updateCameraFeed();
    }
  }

  _updateCameraFeed() {
    const now = Date.now();
    if (now - this._lastCameraUpdate > this._cameraUpdateInterval) {
      this._lastCameraUpdate = now;
      
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
  }

  _handlePauseDialog(e) {
    if (e.detail.action === "confirm") {
      this.hass.callService('button', 'press', {
        entity_id: this.config.pause_button_entity
      });
    }
  }

  _handleStopDialog(e) {
    if (e.detail.action === "confirm") {
      this.hass.callService('button', 'press', {
        entity_id: this.config.stop_button_entity
      });
    }
  }

  _toggleLight() {
    this.hass.callService('light', 'toggle', {
      entity_id: this.config.chamber_light_entity
    });
  }

  _toggleFan() {
    this.hass.callService('fan', 'toggle', {
      entity_id: this.config.aux_fan_entity
    });
  }

  firstUpdated() {
    // Setup dialog event listeners
    const pauseDialog = this.shadowRoot?.querySelector('#pauseDialog');
    const stopDialog = this.shadowRoot?.querySelector('#stopDialog');
    
    if (pauseDialog) {
      pauseDialog.addEventListener('closed', (e) => this._handlePauseDialog(e));
    }
    
    if (stopDialog) {
      stopDialog.addEventListener('closed', (e) => this._handleStopDialog(e));
    }

    // Setup button click handlers
    const pauseButton = this.shadowRoot?.querySelector('.btn-pause');
    const stopButton = this.shadowRoot?.querySelector('.btn-stop');

    if (pauseButton) {
      pauseButton.addEventListener('click', () => {
        if (isPaused(this.hass, this.config)) {
          // Resume immediately if paused
          this.hass.callService('button', 'press', {
            entity_id: this.config.resume_button_entity
          });
        } else {
          // Show confirmation for pause
          pauseDialog?.show();
        }
      });
    }
    
    if (stopButton) {
      stopButton.addEventListener('click', () => {
        stopDialog?.show();
      });
    }
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const entities = getEntityStates(this.hass, this.config);
    const amsSlots = getAmsSlots(this.hass, this.config);

    return cardTemplate({
      entities,
      hass: this.hass,
      amsSlots,
      formatters: this.formatters,
      _toggleLight: () => this._toggleLight(),
      _toggleFan: () => this._toggleFan()
    });
  }

  // This is used by Home Assistant for card size calculation
  getCardSize() {
    return 6;
  }

  // This is used by the Home Assistant card picker
  static getStubConfig() {
    return DEFAULT_CONFIG;
  }
}

export default PrintWatchCard;