import axios from 'axios';

export const sendServerEditDetails = async (serverId, serverEditData) => {
  const url = `http://localhost:5000/api/servers/${serverId}/requestUpdateRolesRating`;
  console.log(url);
  const postRequest = axios.post(url, serverEditData);
  console.log(postRequest);
  const response = await postRequest;
  console.log(response.status);
  return await postRequest;
};

sendServerEditDetails('415506140840067076', {});
