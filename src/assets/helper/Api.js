import axios from 'axios';

const url = "http://localhost:4941/api/v1/";
//http://localhost:4941/api/v1/ //http://csse-s365docker1.canterbury.ac.nz:4001/api/v1/
const instance = axios.create({
    baseURL: url,
    timeout: 2000
});

export default {


    register: (user) => instance.post('users/register', user),
    login: (user) => instance.post('users/login', user),
    logout: (token) => instance.post('users/logout', null, {headers: {'X-Authorization': token}}),
    getUser: (userId, token) => instance.get(`users/${userId}`, {headers: {'X-Authorization': token}}),
    editUser: (userId, userInfo, token) => instance.patch(`users/${userId}`, userInfo, {headers: {'X-Authorization': token}}),

    getUserImage: (userId) => {
        return `${url}users/${userId}/image`;
    },

    putUserImage: (userId, userImage, token) => instance.put(`users/${userId}/image`, userImage.imgBaseData, {
        headers: {
            'X-Authorization': token,
            'Content-Type': userImage.imgBaseData.type
        }
    }),
}
