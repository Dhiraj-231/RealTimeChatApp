export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/v1/auth";
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/updateProfile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOG_OUT_ROUTE = `${AUTH_ROUTES}/logout`;


export const CONTACT_ROUTES = "api/v1/contact";
export const SEARCH_ROUTES = `${CONTACT_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES = `${CONTACT_ROUTES}/get-contacts-for-dm`

export const MESSAGE_ROUTES = "api/v1/message";
export const GET_MESSAGES = `${MESSAGE_ROUTES}/getAllMessages`;
export const UPOLAD_FILE_ROUTE = `${MESSAGE_ROUTES}/upload-file`;