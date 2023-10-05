import React from 'react';

const Divider = ({ styles }) => {
  const style = styles
    ? `bg-[#E1B890] w-full h-0.5 ${styles}`
    : 'bg-[#E1B890] w-full h-0.5';
  return <div className={style}></div>;
};

export default Divider;
