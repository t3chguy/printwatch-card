import { styles } from './printwatch-card-styles.js';

class PrintWatchCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.config = {};
    this._lastCameraUpdate = 0;
    this._cameraUpdateInterval = 1000; // Update camera every 1 second
    
    this._formatDuration = (minutes) => {
      if (!minutes || minutes <= 0) return 'Complete';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    this._formatEndTime = (remainingMinutes, hass) => {
      if (!remainingMinutes || remainingMinutes <= 0) return '---';
      const endTime = new Date(Date.now() + remainingMinutes * 60000);
      const timeFormat = hass.locale.hour_24 ? 
        { hour: '2-digit', minute: '2-digit', hour12: false } :
        { hour: 'numeric', minute: '2-digit', hour12: true };
      return new Intl.DateTimeFormat(hass.locale.language, timeFormat)
        .format(endTime)
        .toLowerCase()
        .replace(' ', '');
    };
  }

  set hass(hass) {
    if (!this.config) return;
    this._hass = hass;

    // Update camera feed periodically
    const now = Date.now();
    if (now - this._lastCameraUpdate > this._cameraUpdateInterval) {
      this._lastCameraUpdate = now;
      this._updateCameraFeed(hass);
    }

    // Get all entity states and update the UI
    this._updateUI(hass);
  }

  _updateCameraFeed(hass) {
    if (!this.content) return;
    
    const timestamp = new Date().getTime();
    const cameraImg = this.content.querySelector('.camera-feed img');
    if (cameraImg) {
      const cameraEntity = hass.states[this.config.camera_entity];
      if (cameraEntity?.attributes?.entity_picture) {
        cameraImg.src = `${cameraEntity.attributes.entity_picture}&t=${timestamp}`;
      }
    }

    // Also update the cover image
    const coverImg = this.content.querySelector('.preview-image img');
    if (coverImg) {
      const coverEntity = hass.states[this.config.cover_image_entity];
      if (coverEntity?.attributes?.entity_picture) {
        coverImg.src = `${coverEntity.attributes.entity_picture}&t=${timestamp}`;
      }
    }
  }

  _updateUI(hass) {
    const entities = {
      name: hass.states[this.config.printer_name_entity]?.state || '3DP-00M-219',
      status: hass.states[this.config.print_status_entity]?.state || 'idle',
      currentStage: hass.states[this.config.current_stage_entity]?.state || 'unknown',
      taskName: hass.states[this.config.task_name_entity]?.state || 'No active print',
      progress: parseFloat(hass.states[this.config.progress_entity]?.state || '0'),
      currentLayer: parseInt(hass.states[this.config.current_layer_entity]?.state || '0'),
      totalLayers: parseInt(hass.states[this.config.total_layers_entity]?.state || '0'),
      remainingTime: parseInt(hass.states[this.config.remaining_time_entity]?.state || '0'),
      bedTemp: parseFloat(hass.states[this.config.bed_temp_entity]?.state || '0'),
      nozzleTemp: parseFloat(hass.states[this.config.nozzle_temp_entity]?.state || '0'),
      speedProfile: hass.states[this.config.speed_profile_entity]?.attributes?.modifier || 100
    };

    const amsSlots = [
      this.config.ams_slot1_entity,
      this.config.ams_slot2_entity,
      this.config.ams_slot3_entity,
      this.config.ams_slot4_entity
    ].map(entity => {
      const state = hass.states[entity];
      return {
        type: state?.attributes?.type || 'Empty',
        color: state?.attributes?.color || '#E0E0E0',
        empty: state?.attributes?.empty || true
      };
    });

    if (!this.content) {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <ha-dialog 
          id="pauseDialog"
          heading="Confirm Pause"
          @closed="${(e) => this._handlePauseDialog(e, hass)}"
        >
          <div>
            Are you sure you want to pause the current print?
            This may affect print quality.
          </div>
          <mwc-button slot="primaryAction" dialogAction="confirm">
            Confirm
          </mwc-button>
          <mwc-button slot="secondaryAction" dialogAction="cancel">
            Cancel
          </mwc-button>
        </ha-dialog>

        <ha-dialog
          id="stopDialog"
          heading="Confirm Stop"
          @closed="${(e) => this._handleStopDialog(e, hass)}"
        >
          <div>
            Are you sure you want to stop the current print?
            This action cannot be undone.
          </div>
          <mwc-button slot="primaryAction" dialogAction="confirm" style="color: rgb(229, 57, 53);">
            Stop Print
          </mwc-button>
          <mwc-button slot="secondaryAction" dialogAction="cancel">
            Cancel
          </mwc-button>
        </ha-dialog>

        <div class="card">
          <div class="header">
            <div>
              <div class="printer-name">${entities.name}</div>
              <div class="status">${entities.status}</div>
            </div>
            <div class="header-controls">
              <button class="icon-button ${hass.states[this.config.chamber_light_entity]?.state === 'on' ? 'active' : ''}" 
                      @click="${() => this._toggleLight(hass)}">
                <ha-icon icon="mdi:lightbulb"></ha-icon>
              </button>
              <button class="icon-button ${hass.states[this.config.aux_fan_entity]?.state === 'on' ? 'active' : ''}"
                      @click="${() => this._toggleFan(hass)}">
                <ha-icon icon="mdi:fan"></ha-icon>
              </button>
            </div>
          </div>
          
          <div class="camera-feed">
            <div class="camera-label">${entities.currentStage}</div>
            <img src="${hass.states[this.config.camera_entity]?.attributes?.entity_picture || ''}" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
                 alt="Camera Feed" />
          </div>
          
          <div class="print-status">
            <div class="print-preview">
              <div class="preview-image">
                <img src="${hass.states[this.config.cover_image_entity]?.attributes?.entity_picture || ''}" 
                     alt="Print Preview" />
              </div>
              <div class="print-details">
                <h3>${entities.taskName}</h3>
                <div>Printed layers: ${entities.currentLayer}/${entities.totalLayers}</div>
                <div class="time-info">
                  <span class="remaining">Time left: ${this._formatDuration(entities.remainingTime)}</span>
                  <span class="completion">Done at: ${this._formatEndTime(entities.remainingTime, hass)}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${entities.progress}%"></div>
                </div>
                <div class="controls">
                  <button class="btn btn-pause">
                    ${entities.status === 'pause' ? 'Resume' : 'Pause'}
                  </button>
                  <button class="btn btn-stop">Stop</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="temperatures">
            <div class="temp-item">
              <div class="temp-value">${entities.bedTemp}°</div>
              <div>Bed</div>
            </div>
            <div class="temp-item">
              <div class="temp-value">${entities.nozzleTemp}°</div>
              <div>Nozzle</div>
            </div>
            <div class="temp-item">
              <div class="temp-value">${entities.speedProfile}%</div>
              <div>Speed</div>
            </div>
          </div>
          
          <div class="materials">
            ${amsSlots.map((slot, index) => `
              <div class="material-slot">
                <div class="material-circle" style="background-color: ${slot.color}"></div>
                <div class="material-type">${slot.type}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.content = this.shadowRoot.querySelector('.card');
      this._setupEventListeners(hass);
    } else {
      this._updateDynamicElements(entities, amsSlots, hass);
    }
  }

  _updateDynamicElements(entities, amsSlots, hass) {
    this.content.querySelector('.printer-name').textContent = entities.name;
    this.content.querySelector('.status').textContent = entities.status;
    this.content.querySelector('.camera-label').textContent = entities.currentStage;
    this.content.querySelector('.print-details h3').textContent = entities.taskName;
    this.content.querySelector('.print-details div:first-of-type').textContent = 
      `Printed layers: ${entities.currentLayer}/${entities.totalLayers}`;
    
    this.content.querySelector('.remaining').textContent = 
      `Time left: ${this._formatDuration(entities.remainingTime)}`;
    this.content.querySelector('.completion').textContent = 
      `Done at: ${this._formatEndTime(entities.remainingTime, hass)}`;
    
    this.content.querySelector('.progress-fill').style.width = `${entities.progress}%`;
    
    const temps = this.content.querySelectorAll('.temp-value');
    temps[0].textContent = `${entities.bedTemp}°`;
    temps[1].textContent = `${entities.nozzleTemp}°`;
    temps[2].textContent = `${entities.speedProfile}%`;
    
    const materialSlots = this.content.querySelectorAll('.material-slot');
    amsSlots.forEach((slot, index) => {
      const circle = materialSlots[index].querySelector('.material-circle');
      const type = materialSlots[index].querySelector('.material-type');
      circle.style.backgroundColor = slot.color;
      type.textContent = slot.type;
    });

    const pauseButton = this.content.querySelector('.btn-pause');
    pauseButton.textContent = entities.status === 'pause' ? 'Resume' : 'Pause';
    
    const lightButton = this.content.querySelector('.icon-button:first-of-type');
    const fanButton = this.content.querySelector('.icon-button:last-of-type');
    
    lightButton.classList.toggle('active', 
      hass.states[this.config.chamber_light_entity]?.state === 'on');
    fanButton.classList.toggle('active',
      hass.states[this.config.aux_fan_entity]?.state === 'on');
  }

  _setupEventListeners(hass) {
    const pauseButton = this.content.querySelector('.btn-pause');
    const stopButton = this.content.querySelector('.btn-stop');
    const lightButton = this.content.querySelector('.icon-button:first-of-type');
    const fanButton = this.content.querySelector('.icon-button:last-of-type');
    
    pauseButton.addEventListener('click', () => {
      const isPaused = hass.states[this.config.print_status_entity]?.state === 'pause';
      if (!isPaused) {
        // Only show confirmation for pausing, not resuming
        const pauseDialog = this.shadowRoot.querySelector('#pauseDialog');
        pauseDialog.show();
      } else {
        // Resume doesn't need confirmation
        hass.callService('button', 'press', { entity_id: this.config.resume_button_entity });
      }
    });
    
    stopButton.addEventListener('click', () => {
      const stopDialog = this.shadowRoot.querySelector('#stopDialog');
      stopDialog.show();
    });
    
    lightButton.addEventListener('click', () => {
      hass.callService('light', 'toggle', { entity_id: this.config.chamber_light_entity });
    });
    
    fanButton.addEventListener('click', () => {
      hass.callService('fan', 'toggle', { entity_id: this.config.aux_fan_entity });
    });
  }

  _handlePauseDialog(e, hass) {
    if (e.detail.action === "confirm") {
      hass.callService('button', 'press', { entity_id: this.config.pause_button_entity });
    }
  }

  _handleStopDialog(e, hass) {
    if (e.detail.action === "confirm") {
      hass.callService('button', 'press', { entity_id: this.config.stop_button_entity });
    }
  }

  setConfig(config) {
    if (!config.printer_name_entity) {
      throw new Error('Please define printer_name_entity');
    }
    this.config = config;
  }

  getCardSize() {
    return 6;
  }

  static getStubConfig() {
    return {
      printer_name_entity: 'sensor.p1s_printer_name',
      print_status_entity: 'sensor.p1s_print_status',
      current_stage_entity: 'sensor.p1s_current_stage',
      task_name_entity: 'sensor.p1s_task_name',
      progress_entity: 'sensor.p1s_print_progress',
      current_layer_entity: 'sensor.p1s_current_layer',
      total_layers_entity: 'sensor.p1s_total_layer_count',
      remaining_time_entity: 'sensor.p1s_remaining_time',
      bed_temp_entity: 'sensor.p1s_bed_temperature',
      nozzle_temp_entity: 'sensor.p1s_nozzle_temperature',
      speed_profile_entity: 'sensor.p1s_speed_profile',
      ams_slot1_entity: 'sensor.p1s_ams_tray_1',
      ams_slot2_entity: 'sensor.p1s_ams_tray_2',
      ams_slot3_entity: 'sensor.p1s_ams_tray_3',
      ams_slot4_entity: 'sensor.p1s_ams_tray_4',
      camera_entity: 'image.p1s_camera',
      cover_image_entity: 'image.p1s_cover_image',
      pause_button_entity: 'button.p1s_pause_printing',
      resume_button_entity: 'button.p1s_resume_printing',
      stop_button_entity: 'button.p1s_stop_printing',
      chamber_light_entity: 'light.p1s_chamber_light',
      aux_fan_entity: 'fan.p1s_aux_fan'
    };
  }
}

customElements.define('printwatch-card', PrintWatchCard);