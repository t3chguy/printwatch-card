/**
 * Default configuration for the PrintWatch card
 */
export const DEFAULT_CONFIG = {
  printer_name: 'My 3D Printer',
  print_status_entity: 'sensor.p1s_print_status',
  current_stage_entity: 'sensor.p1s_current_stage',
  task_name_entity: 'sensor.p1s_task_name',
  progress_entity: 'sensor.p1s_print_progress',
  current_layer_entity: 'sensor.p1s_current_layer',
  total_layers_entity: 'sensor.p1s_total_layer_count',
  remaining_time_entity: 'sensor.p1s_remaining_time',
  bed_temp_entity: 'sensor.p1s_bed_temperature',
  nozzle_temp_entity: 'sensor.p1s_nozzle_temperature',
  speed_profile_entity: 'sensor.p1s_speed_profile',
  ams_slot1_entity: 'sensor.p1s_ams_tray_1',
  ams_slot2_entity: 'sensor.p1s_ams_tray_2',
  ams_slot3_entity: 'sensor.p1s_ams_tray_3',
  ams_slot4_entity: 'sensor.p1s_ams_tray_4',
  camera_entity: 'image.p1s_camera',
  cover_image_entity: 'image.p1s_cover_image',
  pause_button_entity: 'button.p1s_pause_printing',
  resume_button_entity: 'button.p1s_resume_printing',
  stop_button_entity: 'button.p1s_stop_printing',
  chamber_light_entity: 'light.p1s_chamber_light',
  aux_fan_entity: 'fan.p1s_aux_fan'
};

/**
 * Default camera update interval in milliseconds
 */
export const DEFAULT_CAMERA_REFRESH_RATE = 1000;