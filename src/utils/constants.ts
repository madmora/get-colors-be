const apolloErrors = {
  AUTHENTICATION_ERROR: 'Unauthenticated error, it is required to be logged in',
  FORBIDDEN_ERROR: 'Unauthorized to do the action',
}

const errorCodes = {
  ERROR_ATTEMPTS_EXCEEDED: 'ERROR_ATTEMPTS_EXCEEDED',
  ERROR_BLOCKED_PASSWORD: 'ERROR_BLOCKED_PASSWORD',
  ERROR_CURRENT_PASSWORD_DO_NOT_MATCH: 'ERROR_CURRENT_PASSWORD_DO_NOT_MATCH',
  ERROR_EMAIL_DOES_NOT_MATCH: 'ERROR_EMAIL_DOES_NOT_MATCH',
  ERROR_EMAIL_USED: 'ERROR_EMAIL_USED',
  ERROR_EXPIRED_PASSWORD: 'ERROR_EXPIRED_PASSWORD',
  ERROR_EXPIRED_RESET_PASSWORD_TOKEN: 'ERROR_EXPIRED_RESET_PASSWORD_TOKEN',
  ERROR_ID_USED: 'ERROR_ID_USED',
  ERROR_INACTIVE_ACCOUNT: 'ERROR_INACTIVE_ACCOUNT',
  ERROR_NEW_PASSWORD_IS_NOT_AVAILABLE: 'ERROR_NEW_PASSWORD_IS_NOT_AVAILABLE',
  ERROR_SIGNUP_DOES_NOT_MATCH: 'ERROR_SIGNUP_DOES_NOT_MATCH',
}

const constantsPolicies = {
  ACCESS_POLICY_ADMIN: ['Administrador'],
  ACCESS_POLICY_USER: ['Usuario'],
  ACCESS_POLICY_ADMIN_USER: ['Administrador', 'Usuario'],
}

export const AppConstants = {
  ...constantsPolicies,
  ...apolloErrors,
  ...errorCodes,
}
