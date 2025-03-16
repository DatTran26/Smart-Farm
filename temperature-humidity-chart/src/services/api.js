import axios from 'axios';

const fetch = async (url, options) => {
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};