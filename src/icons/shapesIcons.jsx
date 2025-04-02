export const CircleIcon = ({ width = 11, height = 11, color = "rgb(0, 0, 0)" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10,5.5C10,7.9853,7.9853,10,5.5,10S1,7.9853,1,5.5S3.0147,1,5.5,1S10,3.0147,10,5.5z"
        fill={color}
        stroke="black"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export const TriangleIcon = ({ width = 11, height = 11, color = "rgb(0, 0, 0)" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.5174,1.2315 C5.3163,1.2253,5.1276,1.328,5.024,1.5l-4,6.6598C0.8013,8.5293,1.0679,8.9999,1.5,9h8c0.4321-0.0001,0.6987-0.4707,0.476-0.8402 l-4-6.6598C5.8787,1.3386,5.706,1.2375,5.5174,1.2315z"
        fill={color}
        stroke="black"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export const SquareIcon = ({ width = 24, height = 24, color = "rgb(0, 0, 0)" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" fill={color} stroke="black" strokeWidth="0.5" />
    </svg>
  );
};

export const PentagonIcon = ({ width = 24, height = 24, color = "rgb(0, 0, 0)" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 22,9 18,22 6,22 2,9" fill={color} stroke="black" strokeWidth="0.5" />
    </svg>
  );
};

export const StarIcon = ({ width = 32, height = 32, color = "rgb(0, 0, 0)" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21"
        fill={color}
        stroke="black"
        strokeWidth="0.5"
      />
    </svg>
  );
};
export const HexagonIcon = ({ width = 24, height = 24, color = "rgb(0, 0, 0)" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}
    >
      <g id="Icon">
        <path
          d="M7,2.59c-0.268,-0 -0.516,0.143 -0.65,0.375l-5,8.66c-0.133,0.232 -0.133,0.518 0,0.75l5,8.66c0.134,0.232 0.382,0.375 0.65,0.375l10,0c0.268,0 0.516,-0.143 0.65,-0.375l5,-8.66c0.133,-0.232 0.133,-0.518 -0,-0.75l-5,-8.66c-0.134,-0.232 -0.382,-0.375 -0.65,-0.375l-10,-0Z"
          fill={color}
          stroke="black"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
};

export const iconMap = {
  circle: CircleIcon,
  triangle: TriangleIcon,
  square: SquareIcon,
  pentagon: PentagonIcon,
  star: StarIcon,
  hexagon: HexagonIcon,
};
