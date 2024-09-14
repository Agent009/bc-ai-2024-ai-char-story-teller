import React from "react";
import Tooltip from "@mui/material/Tooltip"; // Add this import
import { cn } from "@lib/index";
import InfoIcon from "@mui/icons-material/Info"; // Add this import

interface RangeInputProps {
  containerCls?: string | null;
  heading: string;
  headingCls?: string | null;
  tooltip?: string | null;
  min: number;
  max: number;
  step: number;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  paragraphText: string;
  emojiStart: string; // Emoji for the start
  emojiEnd: string; // Emoji for the end
  disabled?: boolean | undefined;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  containerCls,
  heading,
  headingCls,
  tooltip,
  min,
  max,
  step,
  value,
  onChange,
  name,
  paragraphText,
  emojiStart,
  emojiEnd,
  disabled = false,
}) => {
  return (
    <div className={cn("space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6", containerCls)}>
      <h3 className={cn("font-bold text-center text-white mb-4", headingCls)}>
        {heading}
        {tooltip && (
          <Tooltip title={tooltip} arrow>
            <InfoIcon className="cursor-pointer text-white ml-1 text-sm inline" fontSize="small" />
          </Tooltip>
        )}
      </h3>
      <div className="flex items-center justify-center space-x-4">
        <span role="img" aria-label="Start" className="text-3xl">
          {emojiStart}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          name={name}
          className="w-64 h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
          disabled={disabled}
        />
        <span role="img" aria-label="End" className="text-3xl">
          {emojiEnd}
        </span>
      </div>
      <p className="text-center mt-2 text-white" dangerouslySetInnerHTML={{ __html: paragraphText }} />
    </div>
  );
};
