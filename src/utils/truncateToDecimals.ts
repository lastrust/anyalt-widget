export const truncateToDecimals = (value: string, decimals?: number) => {
  if (!value) return '';

  if (!decimals) decimals = 6;

  const [integerPart, decimalPart] = value.toString().split('.');
  if (!decimalPart) return integerPart;
  return `${integerPart}.${decimalPart.slice(0, decimals)}`;
};
