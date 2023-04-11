import React from "react";

interface ProgressBarProps {
  bgcolor: string;
  completed: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ bgcolor, completed }) => {
  const containerStyles = {
    height: '0.2rem',
    /* width: '100%', */
    width: 'calc(100% - ',
    backgroundColor: "rgba(var(--one_bg3), 1)",
    borderRadius: 1,
    marginTop: '0.4rem',
    marginBottom: '0.4rem',
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right' as 'right',
  }

  const labelStyles = {
    /* padding: 5, */
    color: 'white',
    fontWeight: 'bold' as 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        {/* <span style={labelStyles}>{`${completed}%`}</span> */}
      </div>
    </div>
  );
};

export default ProgressBar;

