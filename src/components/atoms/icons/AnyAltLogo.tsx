import { Image } from '@chakra-ui/react';
import { type FC } from 'react';

type Props = {
  width?: string;
  height?: string;
};

export const AnyaltLogo: FC<Props> = ({ width = '84px', height = '24px' }) => {
  return (
    <Image
      src={'https://www.anyalt.finance/anyalt-logo.png'}
      alt="Anyalt Logo"
      width={width}
      height={height}
    />
  );
};
