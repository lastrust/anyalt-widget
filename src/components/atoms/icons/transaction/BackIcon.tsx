type Props = {
  color?: string;
};

export const BackIcon = ({ color = 'black' }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="10"
      viewBox="0 0 7 10"
      fill="none"
    >
      <path
        d="M5.5 1L1.5 5L5.5 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
