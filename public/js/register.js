import axios from 'axios';
import { showAlert } from './alerts';

export const register = async (formData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/users/register',
      data: formData
    });

    if (res.data.status) {
      showAlert('success', 'User Registered Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
