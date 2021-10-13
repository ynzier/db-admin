import http from '../http-common';
const user = JSON.parse(localStorage.getItem('user'));

const getAllCustomer = () => {
  return http.get('/getAllCustomer', {
    headers: {
      'Content-type': 'application/json',
      'x-access-token': user.accessToken,
    },
  });
};
const removeCustomer = id => {
  return http.get(`/deleteCustomer/${id}`, {
    headers: {
      'Content-type': 'application/json',
      'x-access-token': user.accessToken,
    },
  });
};
// eslint-disable-next-line
export default { getAllCustomer, removeCustomer };
