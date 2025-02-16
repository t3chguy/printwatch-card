import { html } from 'lit';
import { localize } from '../../utils/localize';

export const cameraFeedTemplate = ({ hass, cameraEntity, cameraEntityName, isOnline, hasError, currentStage, onError, onLoad }) => {
  if (!isOnline || hasError) {
    return html`
      <div class="offline-message">
        <ha-icon icon="mdi:printer-off"></ha-icon>
        <span>
          ${isOnline ? localize.t('camera_unavailable') : localize.t('printer_offline')}
        </span>
      </div>
    `;
  }

  const config = {
    camera_view: 'live',
    camera_image: cameraEntityName,
  }

  // <ha-camera-stream .hass=${hass} .stateObj=${cameraEntity}></ha-camera-stream>
  return html`
    <div class="camera-feed">
      <div class="camera-label">${currentStage}</div>
      <hui-image
          .config=${config}
          .hass=${hass}
          .cameraImage=${config.camera_image}
          .cameraView=${config.camera_view}
          @error=${onError}
          @load=${onLoad}
        ></hui-image>
    </div>
  `;
};