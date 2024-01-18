const CustomError = require('./error');

const authFailed = new CustomError(
  'Authorization Failed!',
  `Uh oh! i can't tell you anymore #BruteForcers! alert`,
  401
);
const dataInvalid = new CustomError(
  'Data Invalid!',
  `Uh oh! The data you've sent is not as expected`,
  417
);
const userNotFound = new CustomError(
  'User Not Found!',
  `Uh oh! i can't tell you anymore #BruteForcers! alert`,
  404
);
const AdminNotFound = new CustomError(
  'Admin Not Found!',
  `You are not a registered realX Admin`,
  404
);
const userBanned = new CustomError(
  'Account Suspended',
  `Your account is suspended `,
  420
);
const notDevAdmin = new CustomError(
  'Not a developer admin',
  `Uh Oh! You are not a developer admin or a realx admin`,
  420
);
const userUnderReview = new CustomError(
  'Account Under Review',
  `Your account is currently is not verified`,
  421
);

const adminExists = new CustomError(
  'Admin Exists!',
  `Uh oh! The phone number entered is already registered with an admin`,
  409
);
const userExists = new CustomError(
  'User Exists!',
  `Uh oh! the phone number entered is already registered`,
  409
);
const duplicateRequest = new CustomError(
  'Already Done!',
  `Umm! The stuff you are trying to do is been done already!`,
  409
);
const serverDown = new CustomError(
  'umm! Some Servers are down!',
  `we swear! that it's not us, we pay our server bills on time`,
  404
);
const badRequest = new CustomError(
  'Bad Request!',
  `Umm! The stuff you are trying to do is unexpected!`,
  400
);
const dataNotFound = new CustomError(
  'Data Not Found!',
  `Data your are searching is not present`,
  404
);
const incorrectUserNamePass = new CustomError(
  'Data Not Found!',
  `Username or Password is incorrect!!!`,
  404
);
const noAccess = new CustomError(
  'Data Not Found!',
  `You do not have access to view this`,
  404
);


module.exports = {
  authFailed,
  AdminNotFound,
  dataInvalid,
  userNotFound,
  adminExists,
  userExists,
  userBanned,
  userUnderReview,
  duplicateRequest,
  serverDown,
  badRequest,
  dataNotFound,
  noAccess,
  incorrectUserNamePass,
  notDevAdmin
};
