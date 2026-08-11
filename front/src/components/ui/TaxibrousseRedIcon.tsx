import * as React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const TaxibrousseRedIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon {...props} viewBox="0 0 30 30.75">
    <g clipPath="url(#taxibrousseRedClip)">
      <path
        fill={props.color ?? '#ff3131'}
        d="M 16.523438 1.894531 L 3.953125 1.894531 C 2.847656 1.894531 2.238281 3.175781 2.9375 4.03125 L 11.398438 14.421875 C 11.789062 14.902344 11.789062 15.59375 11.398438 16.078125 L 2.9375 26.46875 C 2.238281 27.324219 2.847656 28.605469 3.953125 28.605469 L 16.523438 28.605469 C 16.917969 28.605469 17.292969 28.429688 17.539062 28.125 L 27.351562 16.078125 C 27.742188 15.59375 27.742188 14.902344 27.351562 14.421875 L 17.539062 2.375 C 17.292969 2.070312 16.917969 1.894531 16.523438 1.894531 "
      />
    </g>
    <defs>
      <clipPath id="taxibrousseRedClip">
        <path d="M 2.242188 1.871094 L 27.539062 1.871094 L 27.539062 28.652344 L 2.242188 28.652344 Z M 2.242188 1.871094 " />
      </clipPath>
    </defs>
  </SvgIcon>
);

export default TaxibrousseRedIcon;
