import { nodeInstance, phpInstance } from "./Api";

const fetchUserList = async (username: string) => {
  try {
    if (!username || username?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`/admin/v1/putaway/searchassociate?name=${username}`);
    // console.log("backend user fetch", Promise.resolve(response?.data?.data || []));
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchIATPicker = async (username: string) => {
  try {
    if (!username || username?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`/admin/v1/iat/searchassociate?name=${username}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchNodeUserList = async (username: string) => {
  try {
    if (!username || username?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await nodeInstance.get(
      `/api/v1/employees/employees?filters=name:like:${username}&page=1&limit=15`
    );
    console.log("asdfd", response?.data?.results);
    const formattedData = response?.data?.results?.map(
      (user: { employee_id: number; name: string }) => {
        return {
          id: user.employee_id,
          name: user.name
        };
      }
    );

    return Promise.resolve(formattedData || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export default fetchUserList;
