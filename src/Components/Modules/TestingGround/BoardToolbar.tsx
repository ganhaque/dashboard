import { useState, useRef } from 'react';
import { useBoardContext } from './BoardProvider'; // Import the hook
import { Button } from './Components/Button';

function BoardToolbar() {
  /* const { board, updateBoard } = props; */
  const {
    /* boards, */
    /* selectedBoardIndex, */
    /* updateBoard, */
    /* addNewList, */
    exportBoardData,
    importBoardData
  } = useBoardContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      importBoardData(selectedFile);
      event.target.value = ''; // Reset file input
    }
  };
  /* const handleImportClick = () => { */
  /*   if (selectedFile) { */
  /*     importBoardData(selectedFile); */
  /*     setSelectedFile(null); // Reset selected file after importing */
  /*   } */
  /* }; */
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click event
    }
  };


  return (
    <div style={{
      display:'flex',
      backgroundColor:'hsla(var(--one_bg1), 0.6)',
      padding:'0.75rem',
      height:'100%',
      width:'100%',
    }}>
      <Button
        variant='outline'
        onClick={() => {
          exportBoardData()
        }}
      >
        Export Board JSON
      </Button>
      <Button
        variant='outline'
        /* as="span" */
        onClick={handleImportClick}
      >
        Import Board JSON
      </Button>
      <input
        /* id="fileInput" */
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default BoardToolbar;

