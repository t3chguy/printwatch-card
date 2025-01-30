/**
 * Check if the printer is currently printing
 * @param {object} hass - Home Assistant instance
 * @param {object} config - Card configuration
 * @returns {boolean} True if printer is printing
 */
export const isPrinting = (hass, config) => {
  const currentStage = hass.states[config.current_stage_entity]?.state;
  const printStatus = hass.states[config.print_status_entity]?.state;
  
  // If print_status indicates we're printing or paused, that takes precedence
  if (['printing', 'running', 'pause'].includes(printStatus)) {
    return true;
  }

  // States that indicate no printing activity
  const nonPrintingStates = [
    'idle',
    'offline',
    'unknown'
  ];

  // If it's in a non-printing state, return false
  if (nonPrintingStates.includes(currentStage)) {
    return false;
  }

  // If it's actively printing or in any paused state, it's printing
  if (currentStage === 'printing' || currentStage.startsWith('paused_')) {
    return true;
  }

  // States that are part of the printing process
  const printingProcessStates = [
    'heatbed_preheating',
    'heating_hotend',
    'checking_extruder_temperature',
    'auto_bed_leveling',
    'scanning_bed_surface',
    'inspecting_first_layer',
    'calibrating_extrusion',
    'calibrating_extrusion_flow'
  ];

  return printingProcessStates.includes(currentStage);
};

/**
 * Check if the printer is currently paused
 * @param {object} hass - Home Assistant instance
 * @param {object} config - Card configuration
 * @returns {boolean} True if printer is paused
 */
export const isPaused = (hass, config) => {
  const printStatus = hass.states[config.print_status_entity]?.state;
  return printStatus === 'pause';
};

/**
 * Get AMS slot information
 * @param {object} hass - Home Assistant instance
 * @param {object} config - Card configuration
 * @returns {Array} Array of AMS slot information
 */
export const getAmsSlots = (hass, config) => {
  let slots = [];
  
  // Check if using AMS by looking for AMS entities
  const hasAms = config.ams_slot1_entity && 
                 hass.states[config.ams_slot1_entity] &&
                 hass.states[config.ams_slot1_entity].attributes?.type;
  
  if (hasAms) {
    // Using AMS system
    [
      config.ams_slot1_entity,
      config.ams_slot2_entity,
      config.ams_slot3_entity,
      config.ams_slot4_entity
    ].forEach((entity) => {
      if (entity && hass.states[entity]) {
        const state = hass.states[entity];
        slots.push({
          type: state.state || 'Empty',
          color: state.attributes?.color || '#E0E0E0',
          empty: state.attributes?.empty || false,
          active: state.attributes?.active || false,
          name: state.attributes?.name || 'Unknown'
        });
      }
    });
  } else if (config.external_spool_entity && hass.states[config.external_spool_entity]) {
    // Using external spool
    const externalSpool = hass.states[config.external_spool_entity];
    if (externalSpool.state !== 'unknown') {
      slots = [{
        type: externalSpool.state,
        color: externalSpool.attributes?.color || '#E0E0E0',
        empty: false,
        name: externalSpool.attributes?.name || 'External Spool',
        active: null  // null indicates external spool - we don't show active state for these
      }];
    }
  }

  return slots;
};

/**
 * Get all relevant entity states
 * @param {object} hass - Home Assistant instance
 * @param {object} config - Card configuration
 * @returns {object} Entity states
 */
export const getEntityStates = (hass, config) => ({
  name: config.printer_name || 'Unnamed Printer',
  status: hass.states[config.print_status_entity]?.state || 'idle',
  currentStage: hass.states[config.current_stage_entity]?.state || 'unknown',
  taskName: hass.states[config.task_name_entity]?.state || 'No active print',
  progress: parseFloat(hass.states[config.progress_entity]?.state || '0'),
  currentLayer: parseInt(hass.states[config.current_layer_entity]?.state || '0'),
  totalLayers: parseInt(hass.states[config.total_layers_entity]?.state || '0'),
  remainingTime: parseInt(hass.states[config.remaining_time_entity]?.state || '0'),
  bedTemp: parseFloat(hass.states[config.bed_temp_entity]?.state || '0'),
  nozzleTemp: parseFloat(hass.states[config.nozzle_temp_entity]?.state || '0'),
  speedProfile: hass.states[config.speed_profile_entity]?.attributes?.modifier || 100,
  externalSpoolType: hass.states[config.external_spool_entity]?.state || 'Unknown',
  externalSpoolColor: hass.states[config.external_spool_entity]?.attributes?.color || '#E0E0E0',
  isPrinting: isPrinting(hass, config),
  isPaused: isPaused(hass, config),
  chamber_light_entity: config.chamber_light_entity,
  aux_fan_entity: config.aux_fan_entity && hass.states[config.aux_fan_entity] ? config.aux_fan_entity : null,
  camera_entity: config.camera_entity
});