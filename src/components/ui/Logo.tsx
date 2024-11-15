import React from 'react';
import { getLogoConfig, LogoVariant, fallbackLogoUrl } from '../../assets/logos';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'main',
  className = '',
  width,
  height,
}) => {
  const config = getLogoConfig(variant);
  const [imgSrc, setImgSrc] = React.useState(config.src);
  const [error, setError] = React.useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc(fallbackLogoUrl);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={config.alt}
      width={width || config.width}
      height={height || config.height}
      className={className}
      onError={handleError}
    />
  );
};