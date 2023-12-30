import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

interface FetchDataProps<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const useFetchData = <T>(url: string): FetchDataProps<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<T> = await axios({
          url,
          withCredentials: true,
          method: 'GET',
        });
        setData(response.data);
      } catch (error) {
        const typedErr = error as Error;
        setError(typedErr);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
