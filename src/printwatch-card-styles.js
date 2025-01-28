export const styles = `
  .card {
    background: var(--ha-card-background, var(--card-background-color, white));
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 16px;
    font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, sans-serif);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .printer-name {
    font-size: 24px;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .status {
    color: var(--state-active-color, #4CAF50);
    font-size: 16px;
    font-weight: 500;
  }
  .header-controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .icon-button {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  .icon-button:hover {
    background: var(--secondary-background-color);
  }
  .icon-button.active {
    color: var(--state-active-color, #4CAF50);
  }
  .icon-button ha-icon {
    width: 24px;
    height: 24px;
  }
  .camera-feed {
    width: 100%;
    height: 240px;
    background: var(--secondary-background-color);
    border-radius: 12px;
    margin-bottom: 16px;
    position: relative;
  }
  .camera-label {
    position: absolute;
    top: 16px;
    left: 16px;
    color: var(--text-primary-color, white);
    background: var(--ha-card-background, rgba(0,0,0,0.7));
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 16px;
  }
  .print-status {
    background: var(--ha-card-background);
    padding: 16px;
    margin-bottom: 16px;
  }
  .not-printing {
    background: var(--ha-card-background);
    padding: 24px;
    margin-bottom: 16px;
    text-align: center;
    border-radius: 8px;
  }
  .not-printing .message {
    color: var(--secondary-text-color);
    font-size: 16px;
    font-weight: 500;
  }
  .print-preview {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .preview-image {
    width: 80px;
    height: 80px;
    background: var(--secondary-background-color);
    border-radius: 4px;
    overflow: hidden;
  }
  .preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .print-details {
    color: var(--primary-text-color);
  }
  .print-details h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: var(--primary-text-color);
  }
  .time-info {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
    color: var(--secondary-text-color);
    font-size: 14px;
  }
  .time-info .remaining {
    color: var(--primary-text-color);
  }
  .time-info .completion {
    color: var(--secondary-text-color);
  }
  .progress-bar {
    height: 4px;
    background: var(--secondary-background-color);
    border-radius: 2px;
    margin: 8px 0;
  }
  .progress-fill {
    width: 0%;
    height: 100%;
    background: var(--state-active-color, #43a047);
    border-radius: 2px;
    transition: width 0.3s;
  }
  .controls {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  .btn {
    padding: 8px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
  }
  .btn-pause {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }
  .btn-stop {
    background: var(--error-color, #e53935);
    color: var(--text-primary-color, white);
  }
  .temperatures {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 32px;
    padding-bottom: 32px;
    position: relative;
  }
  .temperatures::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background-color: var(--divider-color);
  }
  .temp-item {
    text-align: center;
    color: var(--primary-text-color);
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .temp-value {
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .materials {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 0 16px;
  }
  .material-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 8px;
  }
  .material-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--divider-color);
  }
  .material-type {
    font-size: 12px;
    color: var(--primary-text-color);
    text-align: center;
  }

  /* Dialog styles */
  ha-dialog {
    --mdc-dialog-heading-ink-color: var(--primary-text-color);
    --mdc-dialog-content-ink-color: var(--primary-text-color);
    --justify-action-buttons: space-between;
  }
  
  ha-dialog div {
    color: var(--primary-text-color);
    line-height: 1.5;
  }
`;