import { html } from 'lit';

/**
 * Generate dialog template
 */
const dialogTemplate = (id, heading, message, confirmText, confirmStyle = '') => html`
  <ha-dialog 
    id="${id}"
    heading="${heading}"
  >
    <div>
      ${message}
    </div>
    <mwc-button 
      slot="primaryAction" 
      dialogAction="confirm"
      style="${confirmStyle}"
    >
      ${confirmText}
    </mwc-button>
    <mwc-button 
      slot="secondaryAction" 
      dialogAction="cancel"
    >
      Cancel
    </mwc-button>
  </ha-dialog>
`;

/**
 * Generate the main card template
 */
export const cardTemplate = (context) => {
  const { entities, hass, amsSlots, formatters } = context;
  
  return html`
    ${dialogTemplate(
      'pauseDialog',
      'Confirm Pause',
      'Are you sure you want to pause the current print? This may affect print quality.',
      'Confirm'
    )}

    ${dialogTemplate(
      'stopDialog',
      'Confirm Stop',
      'Are you sure you want to stop the current print? This action cannot be undone.',
      'Stop Print',
      'color: rgb(229, 57, 53);'
    )}

    <div class="card">
      <div class="header">
        <div>
          <div class="printer-name">${entities.name}</div>
          <div class="status">${entities.status}</div>
        </div>
        <div class="header-controls">
          <button 
            class="icon-button ${hass.states[entities.chamber_light_entity]?.state === 'on' ? 'active' : ''}" 
            @click=${context._toggleLight}
          >
            <ha-icon icon="mdi:lightbulb"></ha-icon>
          </button>
          <button 
            class="icon-button ${hass.states[entities.aux_fan_entity]?.state === 'on' ? 'active' : ''}"
            @click=${context._toggleFan}
          >
            <ha-icon icon="mdi:fan"></ha-icon>
          </button>
        </div>
      </div>
      
      <div class="camera-feed">
        <div class="camera-label">${entities.currentStage}</div>
        <img 
          src="${hass.states[entities.camera_entity]?.attributes?.entity_picture || ''}" 
          style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
          alt="Camera Feed" 
        />
      </div>
      
      ${entities.isPrinting ? html`
        <div class="print-status">
          <div class="print-preview">
            <div class="print-details">
              <h3>${entities.taskName}</h3>
              <div>Printed layers: ${entities.currentLayer}/${entities.totalLayers}</div>
              <div class="time-info">
                <span class="remaining">
                  Time left: ${formatters.formatDuration(entities.remainingTime)}
                </span>
                <span class="completion">
                  Done at: ${formatters.formatEndTime(entities.remainingTime, hass)}
                </span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${entities.progress}%"></div>
              </div>
              <div class="controls">
                <button 
                  class="btn btn-pause" 
                  data-action="${entities.isPaused ? 'resume' : 'pause'}"
                >
                  ${entities.isPaused ? 'Resume' : 'Pause'}
                </button>
                <button class="btn btn-stop">Stop</button>
              </div>
            </div>
          </div>
        </div>
      ` : html`
        <div class="not-printing">
          <div class="message">Not currently printing</div>
        </div>
      `}
      
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
        ${amsSlots.map(slot => html`
          <div class="material-slot">
            <div 
              class="material-circle" 
              style="background-color: ${slot?.color || '#E0E0E0'}"
            ></div>
            <div class="material-type">${slot?.type || 'Empty'}</div>
          </div>
        `)}
      </div>
    </div>
  `;
};