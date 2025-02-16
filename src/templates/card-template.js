// src/templates/card-template.js
import { html } from 'lit';
import { headerTemplate } from './components/header';
import { cameraFeedTemplate } from './components/camera-feed';
import { printStatusTemplate } from './components/print-status';
import { temperatureDisplayTemplate } from './components/temperature-display';
import { materialSlotsTemplate } from './components/material-slots';
import { temperatureDialogTemplate } from './components/temperature-controls';
import { confirmDialogTemplate } from './components/confirm-dialog';

export const cardTemplate = (context) => {
  const { 
    entities, 
    hass, 
    amsSlots, 
    _toggleLight,
    _toggleAuxLight,
    _toggleFan, 
    _cameraError, 
    isOnline,
    formatters,
    dialogConfig,
    confirmDialog,
    setDialogConfig,
    handlePauseDialog,
    handleStopDialog
  } = context;

  if (!entities || !hass) return html``;

  const controls = {
    lightState: hass.states[entities.chamber_light_entity]?.state,
    auxLightState: hass.states[entities.aux_light_entity]?.state,
    fanState: hass.states[entities.aux_fan_entity]?.state,
    hasFan: !!entities.aux_fan_entity,
    onLightToggle: _toggleLight,
    onAuxLightToggle: _toggleAuxLight,
    onFanToggle: _toggleFan,
    hass
  };

  const cameraEntity = hass.states[entities.camera_entity];

  const cameraProps = {
    hass,
    cameraEntity,
    cameraEntityName: entities.camera_entity,
    isOnline,
    hasError: _cameraError,
    currentStage: entities.currentStage,
    onError: context.handleImageError,
    onLoad: context.handleImageLoad
  };

  return html`
    <div class="card">
      ${headerTemplate(entities, controls)}
      ${cameraFeedTemplate(cameraProps)}
      ${printStatusTemplate(entities, {
        hass,
        onPause: handlePauseDialog,
        onStop: handleStopDialog,
        onImageError: context.handleImageError
      })}
      ${temperatureDisplayTemplate(entities, hass, dialogConfig, setDialogConfig)}
      ${amsSlots.length ? materialSlotsTemplate(amsSlots) : ""}
      ${temperatureDialogTemplate(dialogConfig, hass)}
      ${confirmDialogTemplate(confirmDialog)}
    </div>
  `;
};