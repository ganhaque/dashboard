import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useLocalStorage } from './Components/LocalStorageHook';
/* import { BoardProps } from './Data'; */
import { BoardProps, exampleBoards, CardProps } from './Data';

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
  // Add more functions for other board-related updates
}

// Create the context
const BoardContext = createContext<BoardContextType | null>(null);

// Create a provider to wrap the components that need access to the board context
export const BoardProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  /* const [boards, setBoards] = useState<BoardProps[]>([]); // Replace this with your actual board state */
  const [boards, setBoards] = useLocalStorage<BoardProps[]>('boards', exampleBoards);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState<number>(0);

  if (!boards || boards.length === 0) {
    console.log(boards);
    /* console.log(exampleBoards); */
    return <div>Loading or no boards available.</div>;
  }

  /* const updateBoard = (updatedBoard: BoardProps) => { */
  /*   // Update the board with the specified boardIndex */
  /*   const updatedBoards = boards.map((board, index) => */
  /*     index === selectedBoardIndex ? updatedBoard : board */
  /*   ); */
  /*   setBoards(updatedBoards); */
  /* }; */

  const updateBoard = (updatedBoard: BoardProps) => {
    const updatedBoards = [...boards]; // Create a copy of the boards array
    updatedBoards[selectedBoardIndex] = updatedBoard; // Update the selected board
    setBoards(updatedBoards);
  };

  /* const updateListTitle = (listIndex: number, newTitle: string) => { */
  /*   // Update the title of the list with the specified boardIndex and listIndex */
  /*   const updatedBoards = boards.map((board, i) => { */
  /*     if (i === selectedBoardIndex) { */
  /*       const updatedLists = board.lists.map((list, j) => { */
  /*         if (j === listIndex) { */
  /*           return { */
  /*             ...list, */
  /*             title: newTitle, */
  /*           }; */
  /*         } */
  /*         return list; */
  /*       }); */
  /*       return { */
  /*         ...board, */
  /*         lists: updatedLists, */
  /*       }; */
  /*     } */
  /*     return board; */
  /*   }); */
  /*   setBoards(updatedBoards); */
  /* }; */

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

  }

  // Add more functions for other board-related updates

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
