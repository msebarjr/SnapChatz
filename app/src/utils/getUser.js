export const getUserInfo = () => {
  return localStorage.getItem('user') !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : localStorage.clear();
};
