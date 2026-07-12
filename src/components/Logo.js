import React from 'react';

export default function Logo({ size = 40, className = '' }) {
  return (
    <img
      src="/images/giraffe-logo.svg.png"
      alt="Confi'Sit"
      width={size}
      height={size}
      className={className}
    />
  );
}
