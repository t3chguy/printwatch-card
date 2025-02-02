import { html } from 'lit';
import { localize } from '../../utils/localize';

export const cameraFeedTemplate = ({ isOnline, hasError, currentStage, entityPicture, onError, onLoad }) => {
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

  return html`
    <div class="camera-feed">
      <div class="camera-label">${currentStage}</div>
      <img 
        src="${entityPicture}"
        style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
        alt="Camera Feed"
        @error=${onError}
        @load=${onLoad}
      />
    </div>
  `;
};