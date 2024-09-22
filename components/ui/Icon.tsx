import React from "react";

interface IconProps {
  icon: string;
  width: number;

  height: number;
}

const Icon: React.FC<IconProps> = ({ icon, width, height }) => {
  return <div>Icon</div>;
};

export default Icon;
