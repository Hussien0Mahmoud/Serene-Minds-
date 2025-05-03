import axios from "axios";

const baseURL = "http://localhost:8000/api/users";

const getAllUsers = () => axios.get(baseURL);
const getUserById = (userId) => axios.get(`${baseURL}/${userId}`);
const addNewUser = (user) => axios.post("http://localhost:8000/auth/users/", user);
const editUser = (userId, user) => axios.put(`${baseURL}/${userId}`, user);
const deleteUser = (userId) => axios.delete(`${baseURL}/${userId}`);
const loginUser = async (credentials) => {
  const res = await axios.post("http://localhost:8000/auth/jwt/create", credentials);
  const resUser = await axios.get("http://localhost:8000/auth/users/me", { headers: { Authorization: `Bearer ${res.data.access}` } });
  return resUser;
}
const checkEmailExists = (email) => axios.get(`${baseURL}?email=${email}`);


export {
  getAllUsers,
  getUserById,
  addNewUser,
  editUser,
  deleteUser,
  loginUser,
  checkEmailExists
};