import { html } from 'lit';
import { localize } from '../utils/localize';
import { formatDuration, formatEndTime } from '../utils/formatters';

/**
 * Generate dialog template
 */
const dialogTemplate = (id, type) => html`
  <ha-dialog 
    id="${id}"
    heading="${localize.t(`dialogs.${type}.title`)}"
  >
    <div>
      ${localize.t(`dialogs.${type}.message`)}
    </div>
    <mwc-button 
      slot="primaryAction" 
      dialogAction="confirm"
      style="${type === 'stop' ? 'color: rgb(229, 57, 53);' : ''}"
    >
      ${localize.t(`dialogs.${type}.confirm`)}
    </mwc-button>
    <mwc-button 
      slot="secondaryAction" 
      dialogAction="cancel"
    >
      ${localize.t('controls.cancel')}
    </mwc-button>
  </ha-dialog>
`;

/**
 * Generate the main card template
 */
export const cardTemplate = (context) => {
  const { entities, hass, amsSlots } = context;
  
  // Check if cover image is available
  const hasCoverImage = entities.cover_image_entity && 
    hass.states[entities.cover_image_entity]?.attributes?.entity_picture;
  
  // Get temperature units from sensors
  const bedTempUnit = hass.states['sensor.p1s_01p00a382500072_bed_temperature']?.attributes?.unit_of_measurement || '';
  const nozzleTempUnit = hass.states['sensor.p1s_01p00a382500072_nozzle_temperature']?.attributes?.unit_of_measurement || '';
  
  return html`
    ${dialogTemplate('pauseDialog', 'pause')}
    ${dialogTemplate('stopDialog', 'stop')}

    <div class="card">
      <div class="header">
        <div>
          <div class="printer-name">${entities.name}</div>
          <div class="status">
            ${localize.localize(`entity.sensor.state.${entities.status}`)}
            ${entities.isPrinting ? html`
              <span class="progress-text">
                ${Math.round(entities.progress)}% | 
                ${localize.t('print.layer')}: ${entities.currentLayer}/${entities.totalLayers}
              </span>
            ` : ''}
          </div>
          ${entities.isPrinting ? html`
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${entities.progress}%"></div>
            </div>
            <div class="layer-info">
              ${localize.t('time.left')}: ${formatDuration(entities.remainingTime)}, 
              ${formatEndTime(entities.remainingTime, hass)}
            </div>
          ` : ''}
        </div>
        <div class="header-controls">
          <button 
            class="icon-button ${hass.states[entities.chamber_light_entity]?.state === 'on' ? 'active' : ''}" 
            @click=${context._toggleLight}
          >
            <ha-icon icon="mdi:lightbulb"></ha-icon>
          </button>
          ${entities.aux_fan_entity ? html`
            <button 
              class="icon-button ${hass.states[entities.aux_fan_entity]?.state === 'on' ? 'active' : ''}"
              @click=${context._toggleFan}
            >
              <ha-icon icon="mdi:fan"></ha-icon>
            </button>
          ` : ''}
        </div>
      </div>
      
      ${context.isOnline && !context._cameraError ? html`
        <div class="camera-feed">
          <div class="camera-label">${entities.currentStage}</div>
          <img 
            src="${hass.states[entities.camera_entity]?.attributes?.entity_picture || ''}" 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
            alt="Camera Feed"
            @error=${context.handleImageError}
            @load=${context.handleImageLoad}
          />
        </div>
      ` : html`
        <div class="offline-message">
          <ha-icon icon="mdi:printer-off"></ha-icon>
          <span>
            ${context.isOnline ? 
              localize.t('camera_unavailable') : 
              localize.t('printer_offline')}
          </span>
        </div>
      `}
      
      ${entities.isPrinting ? html`
        <div class="print-status">
          <div class="print-preview">
            ${hasCoverImage ? html`
              <div class="preview-image">
                <img 
                  src="${hass.states[entities.cover_image_entity].attributes.entity_picture}" 
                  alt="Print Preview"
                  @error=${context.handleImageError}
                />
              </div>
            ` : ''}
            <div class="print-details">
              <h3>${entities.taskName}</h3>
              <div class="print-stats">
                ${localize.t('print.length')}: ${hass.states['sensor.p1s_print_length']?.state || '0'} 
                ${hass.states['sensor.p1s_print_length']?.attributes?.unit_of_measurement || ''} | 
                ${localize.t('print.weight')}: ${hass.states['sensor.p1s_print_weight']?.state || '0'} 
                ${hass.states['sensor.p1s_print_weight']?.attributes?.unit_of_measurement || ''}
              </div>

              <div class="controls">
                <button 
                  class="btn btn-pause" 
                  data-action="${entities.isPaused ? 'resume' : 'pause'}"
                >
                  ${entities.isPaused ? 
                    localize.t('controls.resume') : 
                    localize.t('controls.pause')}
                </button>
                <button class="btn btn-stop">
                  ${localize.t('controls.stop')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ` : html`
        <div class="not-printing">
          <div class="message">${localize.t('not_printing')}</div>
          ${entities.lastPrintName ? html`
            <div class="last-print">
              ${localize.t('last_print', { name: entities.lastPrintName })}
            </div>
          ` : ''}
        </div>
      `}
      
      <div class="temperatures">
        <div class="temp-item">
          <div class="temp-value">${entities.bedTemp}${bedTempUnit}</div>
          <div>${localize.t('temperatures.bed')}</div>
        </div>
        <div class="temp-item">
          <div class="temp-value">${entities.nozzleTemp}${nozzleTempUnit}</div>
          <div>${localize.t('temperatures.nozzle')}</div>
        </div>
        <div class="temp-item">
          <div class="temp-value">${entities.speedProfile}%</div>
          <div>${localize.t('temperatures.speed')}</div>
        </div>
      </div>
      
      <div class="materials">
        ${amsSlots.map(slot => html`
          <div class="material-slot">
            <div 
              class="material-circle ${slot.active === true ? 'active' : ''}"
              style="background-color: ${slot.color || '#E0E0E0'}"
            ></div>
            <div class="material-type">
              ${slot.type || localize.t('materials.empty')}
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
};