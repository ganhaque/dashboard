import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from './Components/Button';
import Column from './Column'; // Import the Column component
import { CardProps, ListProps, BoardProps } from './Data';
/* import { Board } from './Data'; */
import { PlusIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useBoardContext } from './BoardProvider'; // Import the hook
import { Input } from './Components/Input';

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function Board() {
  /* const { board, updateBoard } = props; */
  const {
    boards,
    selectedBoardIndex,
    updateBoard,
    addNewList,
    exportBoardData,
  } = useBoardContext();
  const selectedBoard = boards[selectedBoardIndex];

  const [lists, setLists] = useState<ListProps[]>(selectedBoard.lists);
  const [ordered, setOrdered] = useState<string[]>(selectedBoard.lists.map((list) => list.droppableId));

  useEffect(() => {
    setLists(selectedBoard.lists);
    setOrdered(selectedBoard.lists.map((list) => list.droppableId));

  }, [selectedBoard.lists]);

  const [isAddingNewList, setIsAddingNewList] = useState<boolean>(false);
  const [newListTitle, setNewListTitle] = useState<string>('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListTitle(e.target.value);
  };

  /* const handleTitleBlur = () => { */
  /*   updateListTitle(listIndex, editedTitle); */
  /*   setIsAddingNewList(false); */
  /* }; */

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      /* updateListTitle(listIndex, editedTitle); */
      addNewList(newListTitle);
      setIsAddingNewList(false);
    }
    else if (e.key === "Escape") {
      setIsAddingNewList(false);
      setNewListTitle('');
    }
  };

  // Use the useEffect hook to update 'lists' and 'ordered' when 'board' prop changes
  // Didn't use this because it cause bad render
  /* useEffect(() => { */
  /*   setLists(board.lists); */
  /*   setOrdered(board.lists.map((list) => list.droppableId)); */
  /* }, [board]); */

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    // Check if the dragged item is a list
    if (result.type === "COLUMN") {
      /* const sourceListIndex = ordered.indexOf(sourceDroppableId); */
      /* const destinationListIndex = ordered.indexOf(destinationDroppableId); */
      const sourceListIndex = ordered.indexOf(result.draggableId);
      const destinationListIndex = result.destination.index;

      const reorderedOrder = reorder(ordered, sourceListIndex, destinationListIndex);
      setOrdered(reorderedOrder);

      const updatedBoard = {
        ...selectedBoard,
        lists: reorder(selectedBoard.lists, sourceListIndex, destinationListIndex),
      };
      updateBoard(updatedBoard);
      /* console.log('Updated board:', updatedBoard); // Debug log to check if 'updateBoard' is called correctly */

      return;
    }

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;

    const getCardFromList = (listId: string, index: number) => {
      const list = lists.find((list) => list.droppableId === listId);
      return list?.cards[index];
    };

    if (sourceDroppableId === destinationDroppableId) { // Reorder cards within the same list
      const updatedLists = lists.map((list) => {
        if (list.droppableId === sourceDroppableId) {
          const items = Array.from(list.cards);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination!.index, 0, reorderedItem);
          return {
            ...list,
            cards: items,
          };
        }
        return list;
      });

      setLists(updatedLists);
      const updatedBoard = {
        ...selectedBoard,
        lists: updatedLists,
      };
      updateBoard(updatedBoard);
      /* console.log('Updated board:', updatedBoard); // Debug log to check if 'updateBoard' is called correctly */
    }
    else { // Move card from one list to another
      const movedItem = getCardFromList(sourceDroppableId, result.source.index);

      if (!movedItem) return; // Handle the case when movedItem is undefined

      const updatedLists = lists.map((list) => {
        if (list.droppableId === sourceDroppableId) {
          const sourceItems = Array.from(list.cards);
          sourceItems.splice(result.source.index, 1);
          return {
            ...list,
            cards: sourceItems,
          };
        }
        else if (list.droppableId === destinationDroppableId) {
          const destinationItems = Array.from(list.cards);
          destinationItems.splice(result.destination!.index, 0, movedItem);
          return {
            ...list,
            cards: destinationItems,
          };
        }
        return list;
      });

      setLists(updatedLists);
      const updatedBoard = {
        ...selectedBoard,
        lists: updatedLists,
      };
      updateBoard(updatedBoard);
      /* console.log('Updated board:', updatedBoard); // Debug log to check if 'updateBoard' is called correctly */
    }
  }

  return (
    <div style={{
      display:'flex',
      backgroundColor:'hsla(var(--light_grey), 0.6)',
      padding:'0.75rem',
      height:'100%',
      width:'100%',
    }}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable
          droppableId="board"
          type="COLUMN" // Indicate that it's a droppable column
          direction="horizontal" // Assuming you want horizontal dragging
        >
          {(provided) => (
            <div
              style={{
                display: 'flex',
                overflowX: 'auto', // Enable horizontal scrolling if needed
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {ordered.map((listId, index) => {
                const list = lists.find((list) => list.droppableId === listId);
                if (!list) return null;
                return (
                  <Column
                    key={list.droppableId}
                    /* list={list} */
                    listIndex={index}
                    /* updateListTitle={updateListTitle} */
                  />
                );
              })}
              {provided.placeholder}
              {isAddingNewList ? (
                <div
                  style={{
                    display:'inline-block',
                    marginRight:"1rem",
                    width:'17rem',
                    height:'100%',
                    /* borderWidth: '1px', */
                  }}
                  className='list-wrapper'
                >
                  <div
                    style={{
                      display:'flex',
                      flexDirection:'column',
                      gap:'0.5rem',
                      backgroundColor: 'hsla(var(--darker_black))',
                      /* borderRadius: 'calc(var(--radius) - 2px)', */
                      borderRadius: '0.75rem',
                      padding:'0.5rem 0.75rem',
                      /* paddingLeft: '0.75rem', */
                      /* paddingRight: '0.75rem', */
                      /* paddingTop: '0.5rem', */
                      /* paddingBottom: '0.5rem', */
                    }}
                    className='list-content'
                  >
                    <Input
                      style={{
                        /* flexGrow:'1', */
                        fontSize:'inherit',
                        height:'1.5rem',
                        borderRadius:'0.25rem',
                        /* padding:'0', */
                        borderWidth:'0px',
                        /* boxShadow:'0 0 0 2px hsla(var(--black)), 0 0 0 3px hsla(var(--grey))' */
                      }}
                      type="text"
                      value={newListTitle}
                      onChange={handleTitleChange}
                      /* onBlur={handleTitleBlur} */
                      onKeyDown={handleKeyPress}
                      autoFocus // Focus on the input field when it appears
                      placeholder='Enter list title...'
                    />
                    <div
                      style={{
                        display:'flex',
                        alignItems:'center',
                      }}>
                      <Button
                        style={{
                        }}
                        onClick={() => {
                          setIsAddingNewList(false);
                          addNewList(newListTitle);
                        }}
                        variant='primary'
                      >
                        Add List
                      </Button>
                      <Button
                        style={{
                          marginLeft:'auto',
                        }}
                        variant='ghost'
                        onClick={() => {setIsAddingNewList(false)}}
                      >
                        <Cross2Icon/>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                  <Button
                    style={{
                      /* color:'hsla(var(--muted_foreground))', */
                      /* backgroundColor:'hsla(var(--white), 0.2)', */
                      backgroundColor:'hsla(var(--muted_foreground))',
                      width:'17rem',
                      justifyContent:'start',
                    }}
                    variant=''
                    onClick={() => {setIsAddingNewList(true)}}
                  >
                    <div
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem'
                      }}
                    >
                      <PlusIcon />
                      Add a list
                    </div>
                  </Button>
                )
              }
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
export default Board;

