import { useState, useEffect } from 'react';

type ErrorProps = {
  errorMessage: string;
  duration: number;
};

function Error({ errorMessage, duration }: ErrorProps) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
      const timeoutId = setTimeout(() => setShowError(false), duration);
      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage]);

  return (
    <div
      style={{
        display: errorMessage != '' ? 'block' : 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        padding: '1rem',
      }}
      className="popup-error"
    >
      {errorMessage}
    </div>
  );
}

export default Error;

