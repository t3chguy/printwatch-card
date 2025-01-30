import { css } from 'lit';

export const cardStyles = css`
  .card {
    background: var(--ha-card-background, var(--card-background-color));
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 16px;
    font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, sans-serif);
    position: relative;
    overflow: hidden;
  }



  /* Header styles */
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
    color: var(--state-active-color);
    font-size: 16px;
    font-weight: 500;
    text-transform: capitalize; 
  }

  /* Control buttons */
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
    color: var(--state-active-color);
  }

  .icon-button ha-icon {
    width: 24px;
    height: 24px;
  }

  /* Camera feed */
    .camera-feed {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    margin-bottom: 16px;
    position: relative;
    background: var(--secondary-background-color);
    overflow: hidden;
  }

  .offline-message {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    margin-bottom: 16px;
    background: var(--secondary-background-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    gap: 8px;
  }

  .offline-message ha-icon {
    --mdc-icon-size: 48px;
    opacity: 0.5;
  }

  .camera-label {
    position: absolute;
    top: 4px;
    left: 4px;
    color: var(--secondary-text-color);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 16px;
    background-color: color-mix(in srgb, var(--card-background-color) 80%, transparent);
    text-transform: capitalize; 
  }

  /* Print status section */
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

  /* Print preview */
  .print-preview {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .print-details {
    color: var(--primary-text-color);
    width: 100%
  }

  .print-details h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: var(--primary-text-color);
    overflow: new-line;
  }

  /* Time information */
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

  /* Progress bar */
  .progress-bar {
    height: 4px;
    background: var(--secondary-background-color);
    border-radius: 2px;
    margin: 8px 0;
  }

  .progress-fill {
    width: 0%;
    height: 100%;
    background: var(--state-active-color);
    border-radius: 2px;
    transition: width 0.3s;
  }

  /* Control buttons */
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
    background: var(--error-color);
    color: var(--text-primary-color);
  }

  /* Temperature section */
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

  /* Materials section */
  .materials {
    display: flex;
    justify-content: center;
    width: calc(100% - 48px);
    margin: 0 24px;
    gap: 32px;
    position: relative;
  }

  .material-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    gap: 8px;
    text-align: center;
    position: relative;
  }

  .material-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--divider-color);
    position: relative;
    transition: transform 0.3s ease;
  }

  .material-circle.active {
    transform: scale(1.1);
    box-shadow: 0 0 0 2px var(--primary-background-color),
                0 0 0 4px var(--primary-color);
  }

  .material-type {
    font-size: 12px;
    color: var(--primary-text-color);
    text-align: center;
  }
`;