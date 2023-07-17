import React from 'react';
import './Button.css';

type ButtonProps = {
  variant: string;
  onPress: () => void;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ variant, onPress, children }) => {
  /* const getButtonStyle = (): string => { */
  /*   switch (variant) { */
  /*     case 'primary': */
  /*       return 'btn-primary'; */
  /*     case 'secondary': */
  /*       return 'btn-secondary'; */
  /*     case 'danger': */
  /*       return 'btn-danger'; */
  /*     default: */
  /*       return ''; */
  /*   } */
  /* }; */

  return (
    <button className={`button-ui ${variant}`} onClick={onPress}>
      {children}
    </button>
  );
};

export default Button;

