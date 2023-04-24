import React, { useState, useRef, useEffect } from 'react';

interface PromptHandlerMap {
  [prompt: string]: (inputText: string) => void;
}

type PromptProps = {
  isOpen: boolean;
  onClose: () => void;
  /* promptType: string; */
  /* handlers: PromptHandlerMap; */
  promptType: PromptHandler;
};

interface PromptHandler {
  prompt: string,
  handler: (userInput: string) => void
}

function Prompt({ isOpen, onClose, promptType}: PromptProps) {
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
      promptType.handler(text);
      onClose();
      setText('');
    }
    else if (event.key === 'y' && promptType.prompt.includes('(y/n)')) {
      // it should be handler() since text is always ''
      // but it doesn't matter anyway
      promptType.handler(text);
      onClose();
      setText('');
    }
    else if (
      event.key === 'Escape' || promptType.prompt.includes('(y/n)')
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
        {promptType.prompt}
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
