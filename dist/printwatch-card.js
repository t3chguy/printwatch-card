import { styles } from './printwatch-card-styles.js';
import { cardTemplate } from './printwatch-card-template.js';

class PrintWatchCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.config = {};
    this._lastCameraUpdate = 0;
    
    // Format utilities
    this.formatters = {
      formatDuration: (minutes) => {
        if (!minutes || minutes <= 0) return 'Complete';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      },

      formatEndTime: (remainingMinutes, hass) => {
        if (!remainingMinutes || remainingMinutes <= 0) return '---';
        const endTime = new Date(Date.now() + remainingMinutes * 60000);
        const timeFormat = hass.locale.hour_24 ? 
          { hour: '2-digit', minute: '2-digit', hour12: false } :
          { hour: 'numeric', minute: '2-digit', hour12: true };
        return new Intl.DateTimeFormat(hass.locale.language, timeFormat)
          .format(endTime)
          .toLowerCase()
          .replace(' ', '');
      }
    };
  }

  set hass(hass) {
    if (!this.config) return;
    this._hass = hass;

    const now = Date.now();
    if (now - this._lastCameraUpdate > this._cameraUpdateInterval) {
      this._lastCameraUpdate = now;
      this._updateCameraFeed(hass);
    }

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

    const coverImg = this.content.querySelector('.preview-image img');
    if (coverImg) {
      const coverEntity = hass.states[this.config.cover_image_entity];
      if (coverEntity?.attributes?.entity_picture) {
        coverImg.src = `${coverEntity.attributes.entity_picture}&t=${timestamp}`;
      }
    }
  }

  _isPrinting(hass) {
    const printStatus = hass.states[this.config.print_status_entity]?.state;
    return ['running', 'pause'].includes(printStatus);
  }

  _updateUI(hass) {
    const entities = {
      name: this.config.printer_name || 'Unnamed Printer',
      status: hass.states[this.config.print_status_entity]?.state || 'idle',
      currentStage: hass.states[this.config.current_stage_entity]?.state || 'unknown',
      taskName: hass.states[this.config.task_name_entity]?.state || 'No active print',
      progress: parseFloat(hass.states[this.config.progress_entity]?.state || '0'),
      currentLayer: parseInt(hass.states[this.config.current_layer_entity]?.state || '0'),
      totalLayers: parseInt(hass.states[this.config.total_layers_entity]?.state || '0'),
      remainingTime: parseInt(hass.states[this.config.remaining_time_entity]?.state || '0'),
      bedTemp: parseFloat(hass.states[this.config.bed_temp_entity]?.state || '0'),
      nozzleTemp: parseFloat(hass.states[this.config.nozzle_temp_entity]?.state || '0'),
      speedProfile: hass.states[this.config.speed_profile_entity]?.attributes?.modifier || 100,
      externalSpoolType: hass.states[this.config.external_spool_entity]?.state || 'Unknown',
      externalSpoolColor: hass.states[this.config.external_spool_entity]?.attributes?.color || '#E0E0E0',
      print_status_entity: this.config.print_status_entity
    };

    // Determine material display (AMS or External Spool)
    let amsSlots = [];
    if (this.config.ams_slot1_entity) {
      // Using AMS
      [
        this.config.ams_slot1_entity,
        this.config.ams_slot2_entity,
        this.config.ams_slot3_entity,
        this.config.ams_slot4_entity
      ].forEach((entity) => {
        if (entity && hass.states[entity]) {
          const state = hass.states[entity];
          amsSlots.push({
            type: state.state || 'Empty',
            color: state.attributes?.color || '#E0E0E0',
            empty: state.attributes?.empty || false
          });
        }
      });
    } else if (this.config.external_spool_entity) {
      // Using external spool
      amsSlots = [{
        type: entities.externalSpoolType,
        color: entities.externalSpoolColor,
        empty: false
      }];
    }

    if (!this.content) {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        ${cardTemplate(entities, hass, amsSlots, this.formatters)}
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

    const printStatus = this.content.querySelector('.print-status');
    const idleStatus = this.content.querySelector('.idle-status');

    if (this._isPrinting(hass)) {
      if (idleStatus) idleStatus.style.display = 'none';
      if (printStatus) {
        printStatus.style.display = 'block';
        this.content.querySelector('.print-details h3').textContent = entities.taskName;
        this.content.querySelector('.print-details div:first-of-type').textContent = 
          `Printed layers: ${entities.currentLayer}/${entities.totalLayers}`;
        
        this.content.querySelector('.remaining').textContent = 
          `Time left: ${this.formatters.formatDuration(entities.remainingTime)}`;
        this.content.querySelector('.completion').textContent = 
          `Done at: ${this.formatters.formatEndTime(entities.remainingTime, hass)}`;
        
        this.content.querySelector('.progress-fill').style.width = `${entities.progress}%`;
        
        const pauseButton = this.content.querySelector('.btn-pause');
        pauseButton.textContent = entities.status === 'pause' ? 'Resume' : 'Pause';
      }
    } else {
      if (printStatus) printStatus.style.display = 'none';
      if (idleStatus) idleStatus.style.display = 'flex';
    }
    
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
    
    if (pauseButton) {
      pauseButton.addEventListener('click', () => {
        const isPaused = hass.states[this.config.print_status_entity]?.state === 'pause';
        if (!isPaused) {
          const pauseDialog = this.shadowRoot.querySelector('#pauseDialog');
          pauseDialog.show();
        } else {
          hass.callService('button', 'press', { entity_id: this.config.resume_button_entity });
        }
      });
    }
    
    if (stopButton) {
      stopButton.addEventListener('click', () => {
        const stopDialog = this.shadowRoot.querySelector('#stopDialog');
        stopDialog.show();
      });
    }
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

  _toggleLight(hass) {
    hass.callService('light', 'toggle', { entity_id: this.config.chamber_light_entity });
  }

  _toggleFan(hass) {
    hass.callService('fan', 'toggle', { entity_id: this.config.aux_fan_entity });
  }

  setConfig(config) {
    if (!config.printer_name) {
      throw new Error('Please define printer_name');
    }
    this.config = config;
    this._cameraUpdateInterval = config.camera_refresh_rate || 1000;
  }

  getCardSize() {
    return 6;
  }

  static getStubConfig() {
    return {
      printer_name: 'My 3D Printer',
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