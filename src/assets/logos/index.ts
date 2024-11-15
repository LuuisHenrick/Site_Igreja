import mainLogo from './main-logo.png';
import footerLogo from './footer-logo.png';
import iconLogo from './icon-logo.png';

export type LogoVariant = 'main' | 'footer' | 'icon';

interface LogoConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const logos: Record<LogoVariant, LogoConfig> = {
  main: {
    src: mainLogo,
    alt: 'Comunidade Vida',
    width: 128,
    height: 128,
  },
  footer: {
    src: footerLogo,
    alt: 'Comunidade Vida Footer',
    width: 64,
    height: 64,
  },
  icon: {
    src: iconLogo,
    alt: 'Comunidade Vida Icon',
    width: 32,
    height: 32,
  },
};

export const getLogoConfig = (variant: LogoVariant): LogoConfig => {
  return logos[variant];
};

// Fallback URL in case the logo file is missing
export const fallbackLogoUrl = 'https://raw.githubusercontent.com/Comunidade-Vida/assets/main/logo.png';