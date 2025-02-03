import { html } from 'lit';
import { headerTemplate } from './components/header';
import { cameraFeedTemplate } from './components/camera-feed';
import { printStatusTemplate } from './components/print-status';
import { temperatureDisplayTemplate } from './components/temperature-display';
import { materialSlotsTemplate } from './components/material-slots';
import { dialogTemplate } from './components/dialog';

export const cardTemplate = (context) => {
  const { 
    entities, 
    hass, 
    amsSlots, 
    _toggleLight, 
    _toggleFan, 
    _cameraError, 
    isOnline,
    formatters,
    dialogConfig,
    setDialogConfig 
  } = context;

  const controls = {
    lightState: hass.states[entities.chamber_light_entity]?.state,
    fanState: hass.states[entities.aux_fan_entity]?.state,
    hasFan: !!entities.aux_fan_entity,
    onLightToggle: _toggleLight,
    onFanToggle: _toggleFan,
    hass
  };

  const cameraProps = {
    isOnline,
    hasError: _cameraError,
    currentStage: entities.currentStage,
    entityPicture: hass.states[entities.camera_entity]?.attributes?.entity_picture,
    onError: context.handleImageError,
    onLoad: context.handleImageLoad
  };

  return html`
    ${dialogTemplate('pauseDialog', 'pause')}
    ${dialogTemplate('stopDialog', 'stop')}

    <div class="card">
      ${headerTemplate(entities, controls)}
      ${cameraFeedTemplate(cameraProps)}
      ${printStatusTemplate(entities, {
        hass,
        onPause: () => context.handlePauseDialog(),
        onStop: () => context.handleStopDialog(),
        onImageError: context.handleImageError
      })}
      ${temperatureDisplayTemplate(entities, hass, dialogConfig, setDialogConfig)}
      ${materialSlotsTemplate(amsSlots)}
    </div>
  `;
};