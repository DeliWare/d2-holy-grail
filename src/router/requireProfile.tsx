import { useEffect } from 'react';
import { useProfile } from '../hooks/resources';

function RequireProfile({ children }) {
  const [{ data }, execute] = useProfile({ manual: true });

  useEffect(() => {
    if (!data) {
      execute();
    }
  }, [data, execute]);

  return data ? children : null;
}

export default RequireProfile;
