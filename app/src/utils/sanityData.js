export const userQuery = (userId) => `*[_type == 'user' && _id == '${userId}']`;
