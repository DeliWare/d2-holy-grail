import React from 'react';
import ItemProps from './itemProps';
import { isEmpty } from '../../utils/helpers';
import { getPropertyRangeOrValue } from '../../utils/itemHelpers';

function WeaponDetails({ details, lang }) {
  return (
    <>
      {
        !isEmpty(details?.stats?.dmgBase) &&
        <div>One-Hand Damage: <span className='magic'>
          {getPropertyRangeOrValue(details.stats.dmgModified.min)} to {getPropertyRangeOrValue(details.stats.dmgModified.max)}
        </span></div>
      }
      {
        !isEmpty(details?.stats?.dmgTwoHandedBase) &&
        <div>Two-Hand Damage: <span className='magic'>
          {getPropertyRangeOrValue(details.stats.dmgTwoHeadedModified.min)} to {getPropertyRangeOrValue(details.stats.dmgTwoHeadedModified.max)}
        </span></div>
      }
      <div>Durability: {details.durability} of {details.durability}</div>
      {details.stats.requiredDexterity &&
      <div className='requirement'>Required Dexterity: {details.stats.requiredDexterity}</div>}
      {details.stats.requiredStrength &&
      <div className='requirement'>Required Strength: {details.stats.requiredStrength}</div>}
      {details.requiredLevel && <div>Required Level: {details.requiredLevel}</div>}
      <div>[TODO BASE] - [TODO ATTACKSPEED]</div>
      <ItemProps itemProps={details.props} lang={lang} />
    </>
  );
}

export default WeaponDetails;
