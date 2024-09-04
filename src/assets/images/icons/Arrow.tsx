import * as React from "react";

function Arrow(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14.34" height="16.036" viewBox="0 0 14.34 16.036" {...props}>
      <g id="Arrow_Up" data-name="Arrow Up" transform="translate(-6.086 -6.5)">
        <path
          id="Path_5279"
          data-name="Path 5279"
          d="M18,21.536V7.5"
          transform="translate(-4.744 0)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          id="Path_5280"
          data-name="Path 5280"
          d="M7.5,13.256,13.256,7.5l5.756,5.756"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export default Arrow;
