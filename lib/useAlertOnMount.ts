import { useEffect } from 'react';

// debugging tool
const useAlertOnMount = (message: any) => {
  useEffect(() => {
    alert(message);
  }, [message]);
};

export default useAlertOnMount;
