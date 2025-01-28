class PrintWatchCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    this._config = { ...config };
    this.generateForm();
  }

  generateForm() {
    const entityFields = [
      { id: 'printer_name_entity', label: 'Printer Name Entity', placeholder: 'sensor.p1s_printer_name' },
      { id: 'print_status_entity', label: 'Print Status Entity', placeholder: 'sensor.p1s_print_status' },
      { id: 'current_stage_entity', label: 'Current Stage Entity', placeholder: 'sensor.p1s_current_stage' },
      { id: 'task_name_entity', label: 'Task Name Entity', placeholder: 'sensor.p1s_task_name' },
      { id: 'progress_entity', label: 'Progress Entity', placeholder: 'sensor.p1s_print_progress' },
      { id: 'current_layer_entity', label: 'Current Layer Entity', placeholder: 'sensor.p1s_current_layer' },
      { id: 'total_layers_entity', label: 'Total Layers Entity', placeholder: 'sensor.p1s_total_layer_count' },
      { id: 'remaining_time_entity', label: 'Remaining Time Entity', placeholder: 'sensor.p1s_remaining_time' },
      { id: 'bed_temp_entity', label: 'Bed Temperature Entity', placeholder: 'sensor.p1s_bed_temperature' },
      { id: 'nozzle_temp_entity', label: 'Nozzle Temperature Entity', placeholder: 'sensor.p1s_nozzle_temperature' },
      { id: 'speed_profile_entity', label: 'Speed Profile Entity', placeholder: 'sensor.p1s_speed_profile' },
      { id: 'ams_slot1_entity', label: 'AMS Slot 1 Entity', placeholder: 'sensor.p1s_ams_tray_1' },
      { id: 'ams_slot2_entity', label: 'AMS Slot 2 Entity', placeholder: 'sensor.p1s_ams_tray_2' },
      { id: 'ams_slot3_entity', label: 'AMS Slot 3 Entity', placeholder: 'sensor.p1s_ams_tray_3' },
      { id: 'ams_slot4_entity', label: 'AMS Slot 4 Entity', placeholder: 'sensor.p1s_ams_tray_4' },
      { id: 'camera_entity', label: 'Camera Entity', placeholder: 'image.p1s_camera' },
      { id: 'chamber_light_entity', label: 'Chamber Light Entity', placeholder: 'light.p1s_chamber_light' },
      { id: 'aux_fan_entity', label: 'Auxiliary Fan Entity', placeholder: 'fan.p1s_aux_fan' },
      { id: 'cover_image_entity', label: 'Cover Image Entity', placeholder: 'image.p1s_cover_image' },
      { id: 'pause_button_entity', label: 'Pause Button Entity', placeholder: 'button.p1s_pause_printing' },
      { id: 'resume_button_entity', label: 'Resume Button Entity', placeholder: 'button.p1s_resume_printing' },
      { id: 'stop_button_entity', label: 'Stop Button Entity', placeholder: 'button.p1s_stop_printing' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .input-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        ha-textfield {
          width: 100%;
        }
      </style>
      <div class="form-container">
        ${entityFields.map(field => `
          <div class="input-group">
            <ha-textfield
              label="${field.label}"
              .value="${this._config[field.id] || ''}"
              .placeholder="${field.placeholder}"
              .configValue="${field.id}"
              @input="${this._valueChanged}"
            ></ha-textfield>
          </div>
        `).join('')}
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this.shadowRoot) return;

    const target = ev.target;
    const value = target.value;
    const configValue = target.configValue;

    if (this._config[configValue] === value) return;

    this._config = {
      ...this._config,
      [configValue]: value
    };

    const eventDetails = { detail: { config: this._config } };
    const event = new CustomEvent('config-changed', eventDetails);
    this.dispatchEvent(event);
  }

  static get styles() {
    return css``;
  }
}

customElements.define('printwatch-card-editor', PrintWatchCardEditor);