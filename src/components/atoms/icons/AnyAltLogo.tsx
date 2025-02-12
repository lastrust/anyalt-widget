import { Image, useTheme } from '@chakra-ui/react';
import { type FC } from 'react';

type Props = {
  width?: string;
  height?: string;
};

export const AnyaltLogo: FC<Props> = ({ width = '84px', height = '24px' }) => {
  const theme = useTheme();
  const logoUrl = theme.images.logo;

  return (
    <Image src={logoUrl} alt="Anyalt Logo" width={width} height={height} />
  );
};
