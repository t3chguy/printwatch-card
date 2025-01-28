export const cardTemplate = (entities, hass, amsSlots, formatters) => `
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
        <button class="icon-button ${hass.states[entities.chamber_light_entity]?.state === 'on' ? 'active' : ''}" 
                @click="${() => this._toggleLight(hass)}">
          <ha-icon icon="mdi:lightbulb"></ha-icon>
        </button>
        <button class="icon-button ${hass.states[entities.aux_fan_entity]?.state === 'on' ? 'active' : ''}"
                @click="${() => this._toggleFan(hass)}">
          <ha-icon icon="mdi:fan"></ha-icon>
        </button>
      </div>
    </div>
    
    <div class="camera-feed">
      <div class="camera-label">${entities.currentStage}</div>
      <img src="${hass.states[entities.camera_entity]?.attributes?.entity_picture || ''}" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
           alt="Camera Feed" />
    </div>
    
    <div class="print-status">
      <div class="print-preview">
        <div class="preview-image">
          <img src="${hass.states[entities.cover_image_entity]?.attributes?.entity_picture || ''}" 
               alt="Print Preview" />
        </div>
        <div class="print-details">
          <h3>${entities.taskName}</h3>
          <div>Printed layers: ${entities.currentLayer}/${entities.totalLayers}</div>
          <div class="time-info">
            <span class="remaining">Time left: ${formatters.formatDuration(entities.remainingTime)}</span>
            <span class="completion">Done at: ${formatters.formatEndTime(entities.remainingTime, hass)}</span>
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
  ${Array.isArray(amsSlots) && amsSlots.length > 0 ? 
    amsSlots.map((slot, index) => `
      <div class="material-slot">
        <div class="material-circle" style="background-color: ${slot?.color || '#E0E0E0'}"></div>
        <div class="material-type">${slot?.type || 'Empty'}</div>
      </div>
    `).join('') : `
      <div class="material-slot">
        <div class="material-circle" style="background-color: #E0E0E0"></div>
        <div class="material-type">No Material</div>
      </div>
    `
  }
</div>
  </div>
`;