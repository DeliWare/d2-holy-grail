import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { PROFILE_KEY, PROFILE_NAME } from '../config/localStorage';
import { useUser } from '../hooks/resources';
import { getLang, getProfile, setLocalStorage } from '../utils/localStorage';
import ChooseProfile from '../components/chooseProfile';

function RequireUser({ children }) {
  const [{ data }, execute] = useUser({ manual: true });
  const [profile, setProfile] = useState(getProfile());
  const lang = getLang();

  const profiles = data?.map((profile) => ({
    id: profile.id,
    name: JSON.parse(profile.data).name
  }));

  const saveProfile = useCallback(
    (profileId: string) => {
      const profileName = profiles.find(({ id }) => id === profileId)?.name;

      if (profileName) {
        setLocalStorage(PROFILE_NAME, profiles.find(({ id }) => id === profileId)?.name);
      }

      setLocalStorage(PROFILE_KEY, profileId);
      setProfile(profileId);
    },
    [profiles]
  );

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
      <main>
        <section>
          <h1>{lang === 'pl' ? 'Wybierz profil:' : 'Choose profile:'}</h1>
          <ChooseProfile profiles={profiles} saveProfile={saveProfile} />
        </section>
      </main>
    )
  ) : null;
}

export default RequireUser;
