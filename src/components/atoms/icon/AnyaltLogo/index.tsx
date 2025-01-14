import { type FC } from 'react';
import { Image } from '@chakra-ui/react';
import AnyaltLogoSvg from '../../../../assets/imgs/AnyAltLogo.svg';

type Props = {
  width?: string;
  height?: string;
};

export const AnyaltLogo: FC<Props> = ({ width = '84px', height = '24px' }) => {
  return (
    <Image
      src={AnyaltLogoSvg}
      alt="Anyalt Logo"
      width={width}
      height={height}
    />
  );
};
