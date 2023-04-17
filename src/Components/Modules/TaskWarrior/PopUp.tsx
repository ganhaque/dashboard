import { useState, useEffect, useRef } from 'react';

export function PopUp({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      console.log('User input:', text);
      onClose();
    }
    else if (event.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div style={{
      display: isOpen ? 'block' : 'none',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
    }}>
      <input type="text" value={text} onChange={handleInputChange} onKeyDown={handleKeyDown} ref={inputRef} />
      {/* <button onClick={onClose}>Close</button> */}
    </div>
  );
}
