import { html } from 'lit';
import { localize } from '../../utils/localize';
import { formatTemperature } from '../../utils/formatters';
import { temperatureDialogTemplate } from './temperature-controls';

export const temperatureDisplayTemplate = (entities, hass, dialogConfig = {}, setDialogConfig) => {
  const handleControlClick = (type, currentValue, entityId) => {
    let config = {
      open: true,
      type,
      currentValue,
      entityId,
      onClose: () => setDialogConfig({ open: false })
    };

    switch (type) {
      case 'bed':
        config = {
          ...config,
          title: localize.t('temperatures.bed_target'),
          min: 0,
          max: 120
        };
        break;
      case 'nozzle':
        config = {
          ...config,
          title: localize.t('temperatures.nozzle_target'),
          min: 0,
          max: 320
        };
        break;
      case 'speed':
        config = {
          ...config,
          title: localize.t('temperatures.speed_profile')
        };
        break;
    }

    setDialogConfig(config);
  };

  // Get temperature units from sensors
  const bedTempUnit = hass.states[entities.bed_temp_entity]?.attributes?.unit_of_measurement || '°C';
  const nozzleTempUnit = hass.states[entities.nozzle_temp_entity]?.attributes?.unit_of_measurement || '°C';
  const chamberTempUnit = hass.states[entities.chamber_temp_entity]?.attributes?.unit_of_measurement || '°C';

  let chamberTile;
  if (entities.chamber_temp_entity) {
    chamberTile = html`
      <div
          class="temp-item"
      >
        <div class="temp-value">
          ${formatTemperature(entities.chamberTemp, chamberTempUnit)}
        </div>
        <div>${localize.t('temperatures.chamber')}</div>
      </div>
    `;
  }

  let speedTile;
  if (hass.states[entities.speed_profile_entity]) {
    speedTile = html`
      <div
          class="temp-item"
          @click=${() => handleControlClick('speed', hass.states[entities.speed_profile_entity]?.state || 'standard', entities.speed_profile_entity)}
      >
        <div class="temp-value">
          ${(hass.states[entities.speed_profile_entity]?.state || 'standard').charAt(0).toUpperCase() +
          (hass.states[entities.speed_profile_entity]?.state || 'standard').slice(1)}
        </div>
        <div>${localize.t('temperatures.speed')}</div>
      </div>
    `;
  }

  return html`
    <div class="temperatures">
      <div 
        class="temp-item" 
        @click=${() => handleControlClick('bed', entities.bedTemp, entities.bed_target_temp_entity)}
      >
        <div class="temp-value">
          ${formatTemperature(entities.bedTemp, bedTempUnit)}
        </div>
        <div>${localize.t('temperatures.bed')}</div>
      </div>

      <div 
        class="temp-item"
        @click=${() => handleControlClick('nozzle', entities.nozzleTemp, entities.nozzle_target_temp_entity)}
      >
        <div class="temp-value">
          ${formatTemperature(entities.nozzleTemp, nozzleTempUnit)}
        </div>
        <div>${localize.t('temperatures.nozzle')}</div>
      </div>

      ${chamberTile}
      ${speedTile}
    </div>

    ${temperatureDialogTemplate(dialogConfig, hass)}
  `;
};