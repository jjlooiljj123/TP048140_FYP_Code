// auth
export const LOGIN_EMAIL_CHANGED = 'login_email_changed';
export const LOGIN_PASSWORD_CHANGED = 'login_password_changed';

export const LOGIN_EMAIL_INVALID_CHANGED = 'login_email_inavalid_changed';
export const LOGIN_PASSWORD_INVALID_CHANGED = 'login_password_inavalid_changed';

export const REGISTER_EMAIL_CHANGED = 'register_email_changed';
export const REGISTER_PASSWORD_CHANGED = 'register_password_changed';
export const REGISTER_CONFIRM_PASSWORD_CHANGED =
  'register_confirm_password_changed';
export const REGISTER_NAME_CHANGED = 'register_name_changed';

export const REGISTER_EMAIL_INVALID_CHANGED = 'register_email_invalid_changed';
export const REGISTER_PASSWORD_INVALID_CHANGED =
  'register_passwordinvalid__changed';
export const REGISTER_CONFIRM_PASSWORD_INVALID_CHANGED =
  'register_confirm_password_invalid_changed';
export const REGISTER_NAME_INVALID_CHANGED = 'register_name_invalid_changed';

export const CREATING_USER_REQUEST = 'creating_user_request';
export const CREATING_USER_SUCCESS = 'creating_user_success';
export const CREATING_USER_FAILURE = 'creating_user_failure';

export const FETCHING_USER_REQUEST = 'fetching_user_request';
export const FETCHING_USER_SUCCESS = 'fetching_user_success';
export const FETCHING_USER_FAILURE = 'fetching_user_failure';

export const UPDATE_JWT = 'update_jwt';
export const REMOVE_JWT = 'remove_jwt';
export const UPDATE_USER_ROLE = 'remove_user_role';
export const UPDATE_SHOP_ID = 'remove_shop_id';
export const UPDATE_USER_ID = 'remove_user_id';

export const FETCHING_SHOPID_REQUEST = 'fetching_shopid_request';
export const FETCHING_SHOPID_SUCCESS = 'fetching_shopid_success';
export const FETCHING_SHOPID_FAILURE = 'fetching_shopid_failure';

export const FETCHING_USER_BY_ID_REQUEST = 'fetching_user_by_id_request';
export const FETCHING_USER_BY_ID_SUCCESS = 'fetching_user_by_id_success';
export const FETCHING_USER_BY_ID_FAILURE = 'fetching_user_by_id_failure';

export const ALL_SHOP_ACTIVITIES_CHANGED = 'all_shop_activities_changed';
export const AVAILABLE_SHOP_ACTIVITIES_CHANGED =
  'available_shop_activities_changed';
export const CURRENTLY_SERVING_SHOP_ACTIVITIES_CHANGED =
  'currently_serving_shop_activities_changed';

export const SELECT_START_ACTIVITY_CHANGED = 'select_start_activity_changed';
export const SELECT_STOP_ACTIVITY_CHANGED = 'select_stop_activity_changed';

export const UPDATE_START_STOP_SERVING_REQUEST =
  'update_start_stop_serving_request';
export const UPDATE_START_STOP_SERVING_SUCCESS =
  'update_start_stop_serving_success';
export const UPDATE_START_STOP_SERVING_FAILURE =
  'update_start_stop_serving_failure';

export const SIGN_OUT = 'sign_out';

// shop
export const SHOP_SHOP_NAME_CHANGED = 'shop_shop_name_changed';
export const SHOP_SHOP_BRANCH_CHANGED = 'shop_shop_branch_changed';
export const SHOP_SHOP_ADDRESS1_CHANGED = 'shop_shop_address1_changed';
export const SHOP_SHOP_ADDRESS2_CHANGED = 'shop_shop_address2_changed';
export const SHOP_SHOP_ADDRESS3_CHANGED = 'shop_shop_address3_changed';
export const SHOP_SHOP_CITY_CHANGED = 'shop_shop_city_changed';
export const SHOP_SHOP_POSTAL_CODE_CHANGED = 'shop_shop_post_code_changed';
export const SHOP_SHOP_STATE_CHANGED = 'shop_shop_state_changed';
export const SHOP_SHOP_COUNTRY_CHANGED = 'shop_shop_country_changed';
export const SHOP_SHOP_DIRECTORY_CHANGED = 'shop_shop_directory_changed';
export const SHOP_SHOP_OPENING_HOUR_CHANGED = 'shop_shop_opening_hour_changed';
export const SHOP_SHOP_CLOSING_HOUR_CHANGED = 'shop_shop_closing_hour_changed';

export const SHOP_SHOP_NAME_INVALID_CHANGED = 'shop_shop_name_invalid_changed';
export const SHOP_SHOP_BRANCH_INVALID_CHANGED =
  'shop_shop_branch_invalid_changed';
export const SHOP_SHOP_ADDRESS1_INVALID_CHANGED =
  'shop_shop_address1_invalid_changed';
export const SHOP_SHOP_ADDRESS2_INVALID_CHANGED =
  'shop_shop_address2_invalid_changed';
export const SHOP_SHOP_ADDRESS3_INVALID_CHANGED =
  'shop_shop_address3_invalid_changed';
export const SHOP_SHOP_CITY_INVALID_CHANGED = 'shop_shop_city_invalid_changed';
export const SHOP_SHOP_POSTAL_CODE_INVALID_CHANGED =
  'shop_shop_post_code_invalid_changed';
export const SHOP_SHOP_STATE_INVALID_CHANGED =
  'shop_shop_state_invalid_changed';
export const SHOP_SHOP_COUNTRY_INVALID_CHANGED =
  'shop_shop_country_invalid_changed';
export const SHOP_SHOP_DIRECTORY_INVALID_CHANGED =
  'shop_shop_directory_invalid_changed';
export const SHOP_SHOP_OPENING_HOUR_INVALID_CHANGED =
  'shop_shop_opening_hour_invalid_changed';
export const SHOP_SHOP_CLOSING_HOUR_INVALID_CHANGED =
  'shop_shop_closing_hour_invalid_changed';

export const CREATING_SHOP_REQUEST = 'creating_shop_request';
export const CREATING_SHOP_SUCCESS = 'creating_shop_success';
export const CREATING_SHOP_FAILURE = 'creating_shop_failure';

export const FETCHING_SHOP_REQUEST = 'fetching_shop_request';
export const FETCHING_SHOP_SUCCESS = 'fetching_shop_success';
export const FETCHING_SHOP_FAILURE = 'fetching_shop_failure';

export const EDITING_SHOP_REQUEST = 'editing_shop_request';
export const EDITING_SHOP_SUCCESS = 'editing_shop_success';
export const EDITING_SHOP_FAILURE = 'editing_shop_failure';

export const SELECT_IMAGE_FILE_CHANGED = 'select_image_file_changed';
export const IMAGE_URI_CHANGED = 'image_uri_changed';

// queue Struture
export const QUEUE_DISCIPLINE_CHANGED = 'queue_discipline_changed';
export const TIME_LIMIT_CHANGED = 'time_limit_changed';
export const MAX_LENGTH_CHANGED = 'max_length_changed';
export const STAGE_NUMBER_CHANGED = 'Stage_number_changed';
export const STAGE_NAME_CHANGED = 'Stage_name_changed';
export const STAGE_DESCRIPTION_CHANGED = 'stage_description_changed';
export const ACTIVITY_NAME_CHANGED = 'activity_name_changed';
export const ACTIVITY_DESCRIPTION_CHANGED = 'activity_description_changed';
export const ACTIVITY_PRIORITY_CHANGED = 'activity_priority_changed';
export const WAITING_TIME_CHANGED = 'waiting_time_changed';

export const ADD_STAGE = 'add_stage';
export const ADD_ACTIVITY = 'add_activity';
export const ADD_ANOTHER_STAGE = 'add_another_stage';
export const REMOVE_LAST_STAGE = 'remove_last_stage';
// export const UPDATE_STAGE_STATE = 'update_stage_state'
// export const UPDATE_ACTIVITY_STATE = 'update_activity_state'

export const CREATING_QUEUE_PLAN_REQUEST = 'creating_queue_plan_request';
export const CREATING_QUEUE_PLAN_SUCCESS = 'creating_queue_plan_success';
export const CREATING_QUEUE_PLAN_FAILURE = 'creating_queue_plan_failure';

// quque
export const FETCHING_CURRENTLY_SERVING_QUEUE_REQUEST =
  'fetching_currently_serving_queue_request';
export const FETCHING_CURRENTLY_SERVING_QUEUE_SUCCESS =
  'fetching_currently_serving_queue_success';
export const FETCHING_CURRENTLY_SERVING_QUEUE_FAILURE =
  'fetching_currently_serving_queue_failure';

export const FETCHING_QUEUING_QUEUE_REQUEST = 'fetching_queuing_queue_request';
export const FETCHING_QUEUING_QUEUE_SUCCESS = 'fetching_queuing_queue_success';
export const FETCHING_QUEUING_QUEUE_FAILURE = 'fetching_queuing_queue_failure';

export const FETCHING_STAGE_ONE_QUEUE_REQUEST =
  'fetching_stage_one_queue_request';
export const FETCHING_STAGE_ONE_QUEUE_SUCCESS =
  'fetching_stage_one_queue_success';
export const FETCHING_STAGE_ONE_QUEUE_FAILURE =
  'fetching_stage_one_queue_failure';

export const FETCHING_SPECIFIC_QUEUE_REQUEST =
  'fetching_specific_queue_request';
export const FETCHING_SPECIFIC_QUEUE_SUCCESS =
  'fetching_specific_queue_success';
export const FETCHING_SPECIFIC_QUEUE_FAILURE =
  'fetching_specific_queue_failure';

export const FETCHING_SHOP_ACTIVITY_REQUEST = 'fetching_shop_activity_request';
export const FETCHING_SHOP_ACTIVITY_SUCCESS = 'fetching_shop_activity_success';
export const FETCHING_SHOP_ACTIVITY_FAILURE = 'fetching_shop_activity_failure';

export const SELECTED_ACTIVITY_CHANGED = 'selected_activity_changed';

export const UPDATE_QUEUE_REQUEST = 'update_queue_request';
export const UPDATE_QUEUE_SUCCESS = 'update_queue_success';
export const UPDATE_QUEUE_FAILURE = 'update_queue_failure';

export const UPDATE_IS_ABLE_TO_SERVE_ACTIVITY =
  'update_is_able_to_serve_activity';

// shop status
export const FETCHING_SHOP_STATUS_REQUEST = 'fetching_shop_status_request';
export const FETCHING_SHOP_STATUS_SUCCESS = 'fetching_shop_status_success';
export const FETCHING_SHOP_STATUS_FAILURE = 'fetching_shop_status_failure';

export const TIME_TO_CLEAR_QUEUE_CHANGED = 'time_to_clear_queue_changed';

export const UPDATE_SERVER_REQURIED_IO = 'update_server_requried_io';

export const UPDATE_CLEAR_QUEUE_TIME_REQUEST =
  'update_clear_queue_time_request';
export const UPDATE_CLEAR_QUEUE_TIME_SUCCESS =
  'update_clear_queue_time_success';
export const UPDATE_CLEAR_QUEUE_TIME_FAILURE =
  'update_clear_queue_time_failure';

// performance
export const DATE_ANALYSIS_CHANGED = 'date_analysis_changed';

export const FETCH_SHOP_ANALYSIS_REQUEST = 'fetch_shop_analysis_request';
export const FETCH_SHOP_ANALYSIS_SUCCESS = 'fetch_shop_analysis_success';
export const FETCH_SHOP_ANALYSIS_FAILURE = 'fetch_shop_analysis_failure';
