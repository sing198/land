const ROLES = {
  USER: 0,
  LEGAL_OFFICER: 1,
  LAND_REFORM_OFFICER: 2,
  ADMIN: 3
};

const ROLE_NAMES = {
  [ROLES.USER]: 'User',
  [ROLES.LEGAL_OFFICER]: 'Legal Officer',
  [ROLES.LAND_REFORM_OFFICER]: 'Land Reform Officer',
  [ROLES.ADMIN]: 'Admin'
};

module.exports = {
  ROLES,
  ROLE_NAMES
};
