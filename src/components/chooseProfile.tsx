import React from 'react';

function ChooseProfile({ profiles, saveProfile }) {
  const onChange = ({ target: { value } }) => {
    saveProfile(value);
  };

  return (
    <select onChange={onChange}>
      {profiles.map((profile) => (
        <option key={profile.id} value={profile.id}>
          {profile.name}
        </option>
      ))}
    </select>
  );
}

export default ChooseProfile;
