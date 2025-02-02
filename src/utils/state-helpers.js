const PRINTING_STATES = ['printing', 'running', 'pause'];
const NON_PRINTING_STATES = ['idle', 'offline', 'unknown'];
const PRINTING_PROCESS_STATES = [
  'heatbed_preheating',
  'heating_hotend',
  'checking_extruder_temperature',
  'auto_bed_leveling',
  'scanning_bed_surface',
  'inspecting_first_layer',
  'calibrating_extrusion',
  'calibrating_extrusion_flow'
];

export const isPrinting = (hass, config) => {
  const currentStage = hass.states[config.current_stage_entity]?.state;
  const printStatus = hass.states[config.print_status_entity]?.state;
  
  if (PRINTING_STATES.includes(printStatus)) return true;
  if (NON_PRINTING_STATES.includes(currentStage)) return false;
  if (currentStage === 'printing' || currentStage.startsWith('paused_')) return true;
  
  return PRINTING_PROCESS_STATES.includes(currentStage);
};

export const isPaused = (hass, config) => 
  hass.states[config.print_status_entity]?.state === 'pause';

export const getAmsSlots = (hass, config) => {
  const amsSlots = [
    config.ams_slot1_entity,
    config.ams_slot2_entity,
    config.ams_slot3_entity,
    config.ams_slot4_entity,
    config.ams_slot5_entity,
    config.ams_slot6_entity,
    config.ams_slot7_entity,
    config.ams_slot8_entity,
    config.ams_slot9_entity,
    config.ams_slot10_entity,
    config.ams_slot11_entity,
    config.ams_slot12_entity,
    config.ams_slot13_entity,
    config.ams_slot14_entity,
    config.ams_slot15_entity,
    config.ams_slot16_entity
  ];

  // Check for AMS system
  const hasAms = config.ams_slot1_entity && 
                 hass.states[config.ams_slot1_entity]?.attributes?.type;

  if (hasAms) {
    return amsSlots
      .map(entity => {
        const state = hass.states[entity];
        if (!state) return null;
        
        return {
          type: state.state || 'Empty',
          color: state.attributes?.color || '#E0E0E0',
          empty: state.attributes?.empty || false,
          active: state.attributes?.active || false,
          name: state.attributes?.name || 'Unknown'
        };
      })
      .filter(Boolean);
  }

  // Check for external spool
  const externalSpool = hass.states[config.external_spool_entity];
  if (externalSpool?.state !== 'unknown') {
    return [{
      type: externalSpool.state,
      color: externalSpool.attributes?.color || '#E0E0E0',
      empty: false,
      name: externalSpool.attributes?.name || 'External Spool',
      active: null
    }];
  }

  return [];
};

const getLastPrintName = (hass, config) => {
  const printStatus = hass.states[config.print_status_entity]?.state;
  const taskName = hass.states[config.task_name_entity]?.state;
  
  return ['idle', 'finish'].includes(printStatus) && 
         taskName && 
         !['unavailable', 'unknown'].includes(taskName) 
    ? taskName 
    : null;
};

export const getEntityStates = (hass, config) => {
  const getState = (entity, defaultValue = '0') => 
    hass.states[entity]?.state || defaultValue;

  return {
    name: config.printer_name || 'Unnamed Printer',
    status: getState(config.print_status_entity, 'idle'),
    currentStage: getState(config.current_stage_entity, 'unknown'),
    taskName: getState(config.task_name_entity, 'No active print'),
    progress: parseFloat(getState(config.progress_entity)),
    currentLayer: parseInt(getState(config.current_layer_entity)),
    totalLayers: parseInt(getState(config.total_layers_entity)),
    remainingTime: parseInt(getState(config.remaining_time_entity)),
    bedTemp: parseFloat(getState(config.bed_temp_entity)),
    nozzleTemp: parseFloat(getState(config.nozzle_temp_entity)),
    speedProfile: hass.states[config.speed_profile_entity]?.attributes?.modifier || 100,
    externalSpoolType: getState(config.external_spool_entity, 'Unknown'),
    externalSpoolColor: hass.states[config.external_spool_entity]?.attributes?.color || '#E0E0E0',
    isPrinting: isPrinting(hass, config),
    isPaused: isPaused(hass, config),
    lastPrintName: getLastPrintName(hass, config),
    chamber_light_entity: config.chamber_light_entity,
    aux_fan_entity: hass.states[config.aux_fan_entity] ? config.aux_fan_entity : null,
    camera_entity: config.camera_entity,
    cover_image_entity: config.cover_image_entity,
    print_weight_entity: parseInt(getState(config.print_weight_entity)),
    print_length_entity: parseInt(getState(config.print_length_entity))
  };
};