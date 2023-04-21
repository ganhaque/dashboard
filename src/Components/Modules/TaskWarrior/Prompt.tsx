import React, { useState, useRef, useEffect } from 'react';

interface PromptHandlerMap {
  [prompt: string]: (inputText: string) => void;
}

type PromptProps = {
  isOpen: boolean;
  onClose: () => void;
  promptType: string;
  handlers: PromptHandlerMap;
};

function Prompt({ isOpen, onClose, promptType, handlers }: PromptProps) {
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
      const handler = handlers[promptType];
      if (handler) {
        handler(text);
      }
      onClose();
      setText('');
    }
    else if (event.key === 'y' && promptType.includes('(y/n)')) {
      const handler = handlers[promptType];
      if (handler) {
        // it should be handler() since text is always ''
        // but it doesn't matter anyway
        handler(text);
      }
      onClose();
      setText('');
    }
    else if (
      event.key === 'Escape' || promptType.includes('(y/n)')
    ) {
      onClose();
      setText('');
    }
  }

  return (
    <div className="popup-input-div" style={{
      display: isOpen ? 'flex' : 'none',
    }}>
      <p className="popup-input-text">
        {promptType}
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

export default Prompt;
