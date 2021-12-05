import { useCallback, useEffect, useState } from 'react';
import { PROFILE_KEY } from '../config/localStorage';
import { useUser } from '../hooks/resources';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import ChooseProfile from '../components/chooseProfile';

function RequireUser({ children }) {
  const [{ data }, execute] = useUser({ manual: true });
  const [profile, setProfile] = useState(getLocalStorage(PROFILE_KEY) || '');

  const profiles = data?.map((profile) => ({
    id: profile.id,
    name: JSON.parse(profile.data).name,
  }));

  const saveProfile = useCallback((profile: string) => {
    setLocalStorage(PROFILE_KEY, profile);
    setProfile(profile);
  }, []);

  useEffect(() => {
    if (!data) {
      execute();
    } else {
      if (data.length === 1) {
        saveProfile(data[0].id);
      }
    }
  }, [data, execute, saveProfile]);

  return data ? (
    profile ? (
      children
    ) : (
      <ChooseProfile
        profiles={[{ id: '', name: 'Select profile' }, ...profiles]}
        saveProfile={saveProfile}
      />
    )
  ) : null;
}

export default RequireUser;
