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
  active_tray_index_entity: 'sensor.p1s_active_tray_index',
  ams_slot1_entity: 'sensor.p1s_ams_tray_1',
  ams_slot2_entity: 'sensor.p1s_ams_tray_2',
  ams_slot3_entity: 'sensor.p1s_ams_tray_3',
  ams_slot4_entity: 'sensor.p1s_ams_tray_4',
  ams_slot5_entity: 'sensor.p1s_ams_tray_5',
  ams_slot6_entity: 'sensor.p1s_ams_tray_6',
  ams_slot7_entity: 'sensor.p1s_ams_tray_7',
  ams_slot8_entity: 'sensor.p1s_ams_tray_8',
  ams_slot9_entity: 'sensor.p1s_ams_tray_9',
  ams_slot10_entity: 'sensor.p1s_ams_tray_10',
  ams_slot11_entity: 'sensor.p1s_ams_tray_11',
  ams_slot12_entity: 'sensor.p1s_ams_tray_12',
  ams_slot13_entity: 'sensor.p1s_ams_tray_13',
  ams_slot14_entity: 'sensor.p1s_ams_tray_14',
  ams_slot15_entity: 'sensor.p1s_ams_tray_15',
  ams_slot16_entity: 'sensor.p1s_ams_tray_16',
  camera_entity: 'image.p1s_camera',
  cover_image_entity: 'image.p1s_cover_image',
  pause_button_entity: 'button.p1s_pause_printing',
  resume_button_entity: 'button.p1s_resume_printing',
  stop_button_entity: 'button.p1s_stop_printing',
  chamber_light_entity: 'light.p1s_chamber_light',
  aux_fan_entity: 'fan.p1s_aux_fan',
  online_entity: 'binary_sensor.p1s_online',
  print_weight_entity: 'sensor.p1s_print_weight',
  print_length_entity: 'sensor.p1s_print_length'
};

/**
 * Default camera update interval in milliseconds
 */
export const DEFAULT_CAMERA_REFRESH_RATE = 1000;