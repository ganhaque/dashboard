import { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from './Components/Button';
import { X } from "lucide-react"
import { Pencil1Icon, PlusIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Badge } from './Components/Badge';
import { Input } from './Components/Input';
import {
  /* CardProps, */
  ListProps
} from './Data';
import { labelValueColorMap, labelValueBackgroundColorMap } from './Data';
import { Settings } from './Data';
import Card from './Card';
import { useBoardContext } from './BoardProvider';

interface ColumnProps {
  /* list: ListProps; */
  listIndex: number;
  /* updateListTitle: (index: number, newTitle: string) => void; */
}

const Column = ({listIndex}: ColumnProps) => {
  const { boards, selectedBoardIndex, updateListTitle } = useBoardContext();
  const list = boards[selectedBoardIndex].lists[listIndex];

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    updateListTitle(listIndex, editedTitle);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateListTitle(listIndex, editedTitle);
      setIsEditing(false);
    }
    else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(list.title);
    }
  };

  return (
    <Draggable key={list.droppableId} draggableId={list.droppableId} index={listIndex}>
      {(provided) => (
        <div
          ref={provided.innerRef} {...provided.draggableProps}
        >
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
              {/* Drag handle */}
              <div {...provided.dragHandleProps} style={{ cursor: 'grab' }}>
                <div
                  style={{
                    /* backgroundColor: snapshot.isDragging ? 'hsla(var(--grey))' : '', */
                    /* borderBottomWidth:"1px", */
                    margin:"0",
                    /* overflow:"hidden", */
                  }}
                >
                  <div style={{display:'flex', alignItems:'center'}}>
                    {isEditing ? (
                      <Input
                        style={{
                          flexGrow:'1',
                          fontSize:'inherit',
                          borderRadius:'0.25rem',
                          padding:'0',
                          borderWidth:'0px',
                          /* boxShadow:'0 0 0 2px hsla(var(--black)), 0 0 0 3px hsla(var(--grey))' */
                        }}
                        type="text"
                        value={editedTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleKeyPress}
                        autoFocus // Focus on the input field when it appears
                      />
                    ) : (
                        <h2
                          style={{
                            /* fontSize:"1.5rem", */
                            display:'flex',
                            flexGrow:'1',
                            alignItems:'center',
                          }}
                          onClick={() => {setIsEditing(true)}}
                        >
                          {list.title}
                        </h2>
                      )}
                    <Button
                      style={{
                        /* marginLeft: 'auto' */
                      }}
                      variant='ghost'
                      onClick={() => {console.log('more edit options')}}
                    >
                      <DotsHorizontalIcon />
                    </Button>
                  </div>
                  {/* // NOTE: Should be a hover element */}
                  {/* {list.description && list.description !== '' && ( */}
                  {/*   <p className='text-muted-foreground'> */}
                  {/*     {list.description} */}
                  {/*   </p> */}
                  {/* )} */}
                </div>
              </div>

              <Droppable key={list.droppableId} droppableId={list.droppableId}>
                {(provided) => (
                  <div
                    style={{
                      display:'flex',
                      flexDirection:'column',
                      /* backgroundColor: snapshot.isDraggingOver ? 'hsla(var(--one_bg3))' : '', */
                      paddingBottom: '0.5rem',
                      /* minHeight: '12rem', */
                      /* overflow: 'auto', */
                      /* overflow: 'hidden' */
                    }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {list.cards.map(({ id }, index) => (
                      <Card key={id} listIndex={listIndex} cardIndex={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Button
                style={{
                  color:'hsla(var(--muted_foreground))',
                  width:'100%',
                  justifyContent:'start',
                  borderRadius:'0.5rem',
                  /* paddingTop:'0.25rem', */
                  /* paddingBottom:'0.25rem', */
                  /* paddingRight:'0.5rem', */
                  /* paddingLeft:'0.5rem', */
                }}
                variant='ghost'
                onClick={() => {
                  console.log('add a card');
                }}
              >
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                  <PlusIcon />
                  Add a card
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Column;

