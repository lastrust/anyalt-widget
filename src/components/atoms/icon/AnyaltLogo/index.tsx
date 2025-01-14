import { type FC } from 'react';

import { Image } from '@chakra-ui/react';
import logoImage from '../../../../assets/imgs/anyalt-logo.png';

type Props = {
  width?: string;
  height?: string;
};

export const AnyaltLogo: FC<Props> = ({ width = '84px', height = '24px' }) => {
  return <Image src={logoImage} alt={'Info'} width={width} height={height} />;
};
