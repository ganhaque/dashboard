import React, { useState, useRef, useEffect } from 'react';

type PopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitHandler: (inputText: string) => void;
}

export function TextPrompt({ isOpen, onClose, onSubmitHandler }: PopUpProps) {
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
      onSubmitHandler(text);
      onClose();
      setText('');
    } else if (event.key === 'Escape') {
      onClose();
      setText('');
    }
  }

  return (
    <div className="popup-input-div" style={{
      display: isOpen ? 'flex' : 'none',
    }}>
      <p className="popup-input-text">
        new task:
      </p>
      <input
        className="popup-input-box"
        type="text"
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    </div>
  );
}

export default TextPrompt;


function ConfirmationPrompt({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);


  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'y') {
      console.log("yes");
      onClose();
    }
    else {
      console.log("no");
      onClose();
    }
  }

  return (
    <div className="popup-input-div" style={{
      display: isOpen ? 'flex' : 'none',
    }}>
      <p className="popup-input-text">
        Are you sure? (y/n)
      </p>
      <input
        className="popup-input-box"
        type="text"
        onKeyDown={handleKeyDown}
        ref={inputRef} />
    </div>
  );
}
