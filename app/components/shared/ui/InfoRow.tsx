import React from "react";

const InfoRow = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div className="flex justify-between">
      <label className="text-surf-blues500 text-sm font-semibold">
        {label}
      </label>
      <p className="font-normal">{value}</p>
    </div>
  );
};

export default InfoRow;
