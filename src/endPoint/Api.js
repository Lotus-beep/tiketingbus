import axios from "axios";

const BASE_URL = "https://www.tiketingaja.my.id/api/";
const LOGIN_URL = `${BASE_URL}token/`;
const GET_NOTES = `${BASE_URL}notes/`;
const GETDATA_URL = `${BASE_URL}getdata/`
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const GET_TIKET = `${BASE_URL}createTiket/`
const LOGOUT_URL = `${BASE_URL}logout/`;
const BOOKING_URL = `${BASE_URL}addBangku/`;
const ADD_ORDER = `${BASE_URL}addPesanan/`;
const REGISTER_URL = `${BASE_URL}Register/`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { username: username, password: password , status:false},
      { withCredentials: true }
    );
    return response.data; 
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const userRegister = async (username, email ,password) => {
  try {
    console.log(password)
    const response = await axios.post(
      REGISTER_URL,
       { username: username,email:email, Password: password , status:false},
      { withCredentials: true }
    );
    return response.data; 
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const Refresh_token = async () => {
  const response = await axios.get(REFRESH_URL, { withCredentials: true });
  
  return response.data.refreshed
};

export const Logout = async ()=> {
  const response = await axios.get(LOGOUT_URL, {withCredentials:true});
  return response.data.success
}

export const get_notes = async () => {
  const response = await axios.get(GET_NOTES, { withCredentials: true });
  return response;
};

export const get_tiket = async () => {
  const response = await axios.get(GET_TIKET, { withCredentials: true });
  return response.data;
};

export const get_data = async () => {
  const response = await axios.get(GETDATA_URL, { withCredentials: true });
  return response.data;
};

export const call_refresh = async (error, func) => {
  if (error.response && error.response.status === 401) {
    const tokenRefreshed = await Refresh_token();
    if (tokenRefreshed) {
      try {
        const retryResponse = await func(); 
        return retryResponse; 
      } catch (retryError) {
        console.error("Retry error after refresh:", retryError);
        return null;
      }
    }
    return null;
  }

  // Jika bukan error 401, biarkan diproses di luar
  throw error;
};


export const Booking = async (tiketbus,no_bangku,type_tiket)=>{
  try {
    const response = await axios.post(
      BOOKING_URL,
      { tiketbus, no_bangku , type_tiket},
      { withCredentials: true }
    );
    response();
    console.log(response)
    return true; 
  } catch (error) {
    return false;
  }
}

export const AddOrder = async (tiketbus,typetiket,total_pemesanan,user_payment)=>{
  try {
    const response = await axios.post(
      ADD_ORDER,
      { tiketbus, typetiket, total_pemesanan, user_payment },
      { withCredentials: true }
    );
    return response.data; 
  } catch (error) {
    return false;
  }
}


export const GetbyId = async (id)=> {
  const response = await axios.get(`${BASE_URL}getdata/${id}/`, {withCredentials:true});
  return response.data
}
