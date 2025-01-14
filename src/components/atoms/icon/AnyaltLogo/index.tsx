import { type FC } from 'react';
import { Image } from '@chakra-ui/react';
import AnyaltLogoPng from '../../../../assets/imgs/anyalt-logo.png';

type Props = {
  width?: string;
  height?: string;
};

export const AnyaltLogo: FC<Props> = ({ width = '84px', height = '24px' }) => {
  return (
    <Image
      src={AnyaltLogoPng}
      alt="Anyalt Logo"
      width={width}
      height={height}
    />
  );
};
