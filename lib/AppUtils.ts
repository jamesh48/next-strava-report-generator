import axios, { AxiosResponse } from 'axios';

export const authorizeApp = async () => {
  const response: AxiosResponse = await axios('/api/authLink');
  location = response.data;
};

export const getUserActivities = async () => {
  try {
    const { data: userEntries }: AxiosResponse = await axios(`/api/allEntries`);
    return userEntries;
  } catch (err) {
    console.log(err);
  }
};

export const getIndividualEntry = async (entryId: number) => {
  try {
    const { data: individualEntryResponse }: AxiosResponse = await axios(
      '/api/individualEntry',
      {
        params: { entryid: entryId },
      }
    );
    console.log(individualEntryResponse);
    return individualEntryResponse;
  } catch (err: any) {
    console.log(err.message);
  }
};
