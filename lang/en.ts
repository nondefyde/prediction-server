export default {
  error: {
    bad_request: 'Bad request / Validation error',
    server: 'Error in setup interaction',
    internal_server: 'Internal server error',
    resource_not_found: 'Resource not found!',
    resource_already_exist: 'Duplicate record is not allowed',
    inputs: 'There are problems with your input',
    un_authorized: 'Not authorized',
    cannot_perform_operation: 'Cannot perform operations',
    not_auth_token: 'No authorization token provided',
    not_found: 'Data not found',
    no_update_input: 'Nothing to update',
    forbidden: 'User is not authorized to perform operation',
  },
  auth: {
    bvnExist: 'Bvn already exist and verified on system',
    dataVerified: 'data already verified',
    verify: 'Verify your email',
    invalidCode: 'Invalid verification code',
    expiredCode: 'Verification code has expired',
    dataInvalid: 'Incorrect date of birth or gender',
    userExist: 'User with credential already exist!',
    invalidUser: 'email or password incorrect',
    resetPassword: 'Reset Your Account',
    bvnDoesNotExist: 'Bvn does not exist',
    invalid_token: 'Invalid token',
    email_verified: 'Invalid token',
    token_expired: 'Token expired',
    verify_request_sent: 'Verify request send to email',
  },
  staff: {
    dataVerified: 'data already verified',
    verify: 'Verify your email',
    invalidCode: 'Invalid verification code',
    expiredCode: 'Verification code has expired',
    dataInvalid: 'Incorrect date of birth or gender',
    userExist: 'User with credential already exist!',
    invalidUser: 'email or password incorrect',
    resetPassword: 'Reset Your Account',
    bvnDoesNotExist: 'Bvn does not exist',
    invalid_token: 'Invalid token',
    email_verified: 'Invalid token',
    token_expired: 'Token expired',
    verify_request_sent: 'Verify request send to email',
  },
  customer: {
    social_error: 'Sorry we cannot verify your social account at the moment',
    not_found: 'Customer not found',
  },
  user: {
    not_found: 'User not found',
  },
  role: {
    not_found: 'Role not found',
  },
  userRole: {
    not_found: 'User role not found',
    forbidden: 'Role is owner, user role cannot be deleted',
  },
  request: {
    expired: 'Request expired',
    verified: 'Request link already verified',
    invalid: 'Request is currently invalid',
    still_valid: 'Request account is still valid',
  },
  loan: {
    already_liquidated: 'Loan already liquidated',
  },
  menu: {
    exist: 'Menu already exists',
    categoryNotFound: 'Menu category not found',
    forbidden: {
      create: 'Role is not owner, cannot create menu category',
      delete: 'Role is not owner, menu category cannot be deleted',
    },
  },
  menuCategory: {
    exist: 'Menu category already exists',
    forbidden: 'Cannot perform operation',
    categoryExist: 'Menu category already exists',
    categoryNotFound: 'Menu category not found',
  },

  menuExtra: {
    exist: 'Menu extra already exists',
    forbidden: 'Cannot perform operation',
    extraExist: 'Menu extra already exists',
    extraNotFound: 'Menu extra not found',
    inconsistent: 'Menu item inconsistent',
  },
  menuItem: {
    exist: 'Menu item already exists',
    forbidden: 'Cannot perform operation',
    itemExist: 'Menu item already exists',
    itemNotFound: 'Menu item not found',
    inconsistent: 'Menu item inconsistent',
  },
  order: {
    exist: 'Order already exists',
    forbidden: 'Cannot perform operation',
    itemExist: 'Order item already exists',
    itemNotFound: 'Order not found',
    inconsistent: 'Order total amount inconsistent',
    hasUpdatedIsComplimentary: 'Order complimentary status has previously been updated',
  },
  vendor: {
    not_found: 'Vendor not found',
    exist: 'Vendor already exists',
    forbidden: 'Cannot perform operation',
  },
  transaction: {
    not_found: 'Transaction not found',
    exist: 'Transaction already exists',
    forbidden: 'Cannot perform operation',
  },

  feedback: {
    not_found: 'Feedback not found',
    exist: 'Feedback already exists',
    forbidden: 'Cannot perform operation',
  },

  review: {
    not_found: 'Review not found',
    exist: 'Deal already exists',
    forbidden: 'Cannot perform operation',
  },

  plan: {
    not_found: 'Plan not found',
  },
  newPlan: {
    not_found: 'New plan not found',
  },
  vendorPlan: {
    exist: 'Active plan already exist for this vendor',
    planActive:
      'Sorry, you cannot subscribe to this plan. This plan is already active',
  },
  payment: {
    confirmed: 'Payment already confirmed',
  },
  dealItem: {
    not_found: 'some items do not exist',
  },

  inventoryItem: {
    not_found: 'Inventory item not found',
    items_not_found: 'Inventory item(s) not found',
    exist: 'Inventory item already exists',
    forbidden: 'Cannot perform operation',
    unconfirmed_exist: 'You must confirm all record',
  },
  inventoryRecord: {
    forbidden: 'Cannot perform operation, please confirm existing records',
    not_found: 'Record not found',
    exist: 'Record already exists',
  },
};
