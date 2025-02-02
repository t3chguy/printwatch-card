import { html } from 'lit';
import { localize } from '../../utils/localize';
import { formatTemperature } from '../../utils/formatters';

export const temperatureDisplayTemplate = (entities, hass) => {
  // Get temperature units from sensors
  const bedTempUnit = hass.states[entities.bed_temp_entity]?.attributes?.unit_of_measurement || '°C';
  const nozzleTempUnit = hass.states[entities.nozzle_temp_entity]?.attributes?.unit_of_measurement || '°C';

  return html`
    <div class="temperatures">
      <div class="temp-item">
        <div class="temp-value">
          ${formatTemperature(entities.bedTemp, bedTempUnit)}
        </div>
        <div>${localize.t('temperatures.bed')}</div>
      </div>
      <div class="temp-item">
        <div class="temp-value">
          ${formatTemperature(entities.nozzleTemp, nozzleTempUnit)}
        </div>
        <div>${localize.t('temperatures.nozzle')}</div>
      </div>
      <div class="temp-item">
        <div class="temp-value">${entities.speedProfile}%</div>
        <div>${localize.t('temperatures.speed')}</div>
      </div>
    </div>
  `;
};