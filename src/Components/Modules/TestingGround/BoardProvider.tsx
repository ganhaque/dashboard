import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useLocalStorage } from './Components/LocalStorageHook';
/* import { BoardProps } from './Data'; */
import { BoardProps, exampleBoards, ListProps, CardProps } from './Data';

// Define the context type
interface BoardContextType {
  boards: BoardProps[];
  selectedBoardIndex: number;
  updateBoard: (updatedBoard: BoardProps) => void;
  updateListTitle: (listIndex: number, newTitle: string) => void;
  updateCardTitle: (
    listIndex: number,
    cardIndex: number,
    newTitle: string
  ) => void;
  updateCardDescription: (
    listIndex: number,
    cardIndex: number,
    newDescription: string
  ) => void;
  addNewCard: (
    listIndex: number,
    newCardTitle: string
  ) => void;
  addNewList: (
    newListTitle: string
  ) => void;
  removeList: (
    listIndex: number
  ) => void;
  exportBoardData: () => void;
  importBoardData: (file: File) => void;
  // Add more functions for other board-related updates
}

// Create the context
const BoardContext = createContext<BoardContextType | null>(null);

// Create a provider to wrap the components that need access to the board context
export const BoardProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [boards, setBoards] = useLocalStorage<BoardProps[]>('boards', exampleBoards);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState<number>(0);

  if (!boards || boards.length === 0) {
    console.log(boards);
    /* console.log(exampleBoards); */
    return <div>Loading or no boards available.</div>;
  }

  const updateBoard = (updatedBoard: BoardProps) => {
    const updatedBoards = [...boards]; // Create a copy of the boards array
    updatedBoards[selectedBoardIndex] = updatedBoard; // Update the selected board
    setBoards(updatedBoards);
  };

  const updateListTitle = (listIndex: number, newTitle: string) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards]; // Create a copy of the boards array
      const selectedBoard = updatedBoards[selectedBoardIndex]; // Get the selected board
      /* if (selectedBoard) { */
      const updatedLists = [...selectedBoard.lists]; // Create a copy of the lists array within the selected board
      updatedLists[listIndex] = {
        ...updatedLists[listIndex],
        title: newTitle,
      };
      selectedBoard.lists = updatedLists;
      updatedBoards[selectedBoardIndex] = selectedBoard;
      /* } */
      return updatedBoards;
    });
  };

  const updateCardData = (
    listIndex: number,
    cardIndex: number,
    updateFunction: (card: CardProps) => CardProps
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board, i) => {
        if (i === selectedBoardIndex) {
          const updatedLists = board.lists.map((list, j) => {
            if (j === listIndex) {
              return {
                ...list,
                ...(cardIndex !== null
                  ? {
                    cards: list.cards.map((card, k) =>
                      k === cardIndex ? updateFunction(card) : card
                    ),
                  }
                  : {}),
              };
            }
            return list;
          });
          return {
            ...board,
            lists: updatedLists,
          };
        }
        return board;
      })
    );
  };

  const updateCardTitle = (
    listIndex: number,
    cardIndex: number,
    newTitle: string
  ) => {
    updateCardData(listIndex, cardIndex, (card) => ({
      ...card,
      title: newTitle,
    }));
  };

  const updateCardDescription = (
    listIndex: number,
    cardIndex: number,
    newDescription: string
  ) => {
    updateCardData(listIndex, cardIndex, (card) => ({
      ...card,
      description: newDescription,
    }));
  };

  const addNewCard = (
    listIndex: number,
    newCardTitle: string
  ) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const selectedBoard = updatedBoards[selectedBoardIndex];

      if (selectedBoard && selectedBoard.lists[listIndex]) {
        const timestamp = new Date().getTime();
        const newCardId = `${timestamp}`;
        const updatedLists = [...selectedBoard.lists];
        const newCard: CardProps = {
          id: newCardId,
          title: newCardTitle,
          /* description: '', */
        };
        updatedLists[listIndex].cards.push(newCard);
        selectedBoard.lists = updatedLists;
        updatedBoards[selectedBoardIndex] = selectedBoard;
      }

      return updatedBoards;
    });

  }
  /* IDEA: have a trashcan visible when dragging card */

  const addNewList = (
    newListTitle: string
  ) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards]; // Create a copy of the boards array
      const selectedBoard = updatedBoards[selectedBoardIndex]; // Get the selected board
      if (selectedBoard) {
        const updatedLists = [...selectedBoard.lists]; // Create a copy of the lists array within the selected board
        // Generate a unique droppableId based on the current timestamp
        const timestamp = new Date().getTime();
        const newDroppableId = `${timestamp}`;

        const newList: ListProps = {
          droppableId: newDroppableId,
          title: newListTitle,
          cards: [],
        };
        updatedLists.push(newList); // Add the new list to the end of the lists array
        selectedBoard.lists = updatedLists; // Update the lists array within the selected board
        updatedBoards[selectedBoardIndex] = selectedBoard; // Update the selected board within the boards array
      }
      return updatedBoards;
    });
  }

  const removeList = (listIndex: number) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards]; // Create a copy of the boards array
      const selectedBoard = updatedBoards[selectedBoardIndex]; // Get the selected board
      if (selectedBoard) {
        const updatedLists = [...selectedBoard.lists]; // Create a copy of the lists array within the selected board
        updatedLists.splice(listIndex, 1); // Remove the list at the specified index
        selectedBoard.lists = updatedLists; // Update the lists array within the selected board
        updatedBoards[selectedBoardIndex] = selectedBoard; // Update the selected board within the boards array
      }
      return updatedBoards;
    });
  };

  const exportBoardData = () => {
    const dataToExport = boards[selectedBoardIndex]; // Get the selected board data
    const jsonData = JSON.stringify(dataToExport, null, 2); // Convert to JSON string with indentation
    const blob = new Blob([jsonData], { type: 'application/json' }); // Create a Blob from the JSON data
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement('a'); // Create a link element
    a.href = url;
    a.download = 'board-data.json'; // Specify the file name
    a.click(); // Trigger a click event on the link
    URL.revokeObjectURL(url); // Revoke the URL to release resources
  };

  // Inside BoardProvider component
  const importBoardData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const importedData = JSON.parse(jsonData);

        if (importedData && importedData.lists) {
          // Update the lists and cards in the selected board
          const updatedBoards = [...boards];
          const selectedBoard = updatedBoards[selectedBoardIndex];

          // Ensure importedData.lists is an array
          if (Array.isArray(importedData.lists)) {
            selectedBoard.lists = importedData.lists;
          }

          // Optionally, update other properties if needed

          // Update the boards array
          updatedBoards[selectedBoardIndex] = selectedBoard;
          setBoards(updatedBoards);

          // Reset selected board index or perform other necessary updates
          /* setSelectedBoardIndex(0); */
        }
      } catch (error) {
        console.error('Error importing data:', error);
        // Display an error message to the user
      }
    };
    reader.readAsText(file);
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        selectedBoardIndex,
        updateBoard,
        updateListTitle,
        updateCardTitle,
        updateCardDescription,
        addNewCard,
        addNewList,
        removeList,
        exportBoardData,
        importBoardData,
        // Add more functions for other board-related updates
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

// A custom hook to use the board context in components
export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};
