import { html } from 'lit';
import { localize } from '../../utils/localize';

export const temperatureDialogTemplate = (dialogConfig, hass) => {
  if (!dialogConfig?.open) return html``;

  const handleSubmit = (e) => {
    // Get the dialog element from the event path
    const dialog = e.target.closest('ha-dialog');
    if (!dialog) return;

    let value;
    if (dialogConfig.type === 'speed') {
      const select = dialog.querySelector('ha-select');
      value = select?.value;
    } else {
      const input = dialog.querySelector('ha-textfield');
      value = input ? parseFloat(input.value) : null;
    }

    if (value === null || value === undefined) return;

    if (dialogConfig.type === 'speed') {
      hass.callService('select', 'select_option', {
        entity_id: dialogConfig.entityId,
        option: value
      });
    } else {
      hass.callService('number', 'set_value', {
        entity_id: dialogConfig.entityId,
        value: value
      });
    }
    
    dialogConfig.onClose();
  };

  const renderContent = () => {
    if (dialogConfig.type === 'speed') {
      return html`
        <ha-select
          label=${localize.t('temperatures.speed_profile')}
          .value=${dialogConfig.currentValue}
          @selected=${(e) => e.target.value = e.detail.value}
          class="speed-select"
          fixedMenuPosition
          naturalMenuWidth
        >
          ${['silent', 'standard', 'sport', 'ludicrous'].map(profile => html`
            <mwc-list-item .value=${profile}>
              ${profile.charAt(0).toUpperCase() + profile.slice(1)}
            </mwc-list-item>
          `)}
        </ha-select>
      `;
    }

    return html`
      <ha-textfield
        label=${localize.t(`temperatures.${dialogConfig.type}_target`)}
        .value=${dialogConfig.currentValue}
        type="number"
        min=${dialogConfig.min}
        max=${dialogConfig.max}
        class="temp-input"
        suffix="°C"
        autoValidate
        required
      ></ha-textfield>
      <div class="range-limits">
        ${localize.t('temperatures.range', { min: dialogConfig.min, max: dialogConfig.max })}
      </div>
    `;
  };

  return html`
    <ha-dialog
      open
      @closed=${dialogConfig.onClose}
      .heading=${dialogConfig.title}
    >
      <div class="dialog-content">
        ${renderContent()}
      </div>
      <mwc-button
        slot="secondaryAction"
        dialogAction="close"
        class="cancel-button"
      >
        ${localize.t('controls.cancel')}
      </mwc-button>
      <mwc-button
        slot="primaryAction"
        @click=${handleSubmit}
        class="save-button"
      >
        ${localize.t('controls.save')}
      </mwc-button>
    </ha-dialog>
  `;
};