import { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from './Components/Button';
import { X } from "lucide-react"
import { Pencil1Icon, PlusIcon, DotsHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Badge } from './Components/Badge';
import { Input } from './Components/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from './Components/Popover';
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
  const {
    boards,
    selectedBoardIndex,
    updateListTitle,
    removeList,
    addNewCard,
  } = useBoardContext();
  const list = boards[selectedBoardIndex].lists[listIndex];

  const [isEditingListTitle, setIsEditingListTitle] = useState(false);
  const [editedListTitle, setEditedListTitle] = useState(list ? list.title : '');
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  if (!list) {
    return (
      <div>
        no list
      </div>
    )
  }

  const handleNewCardTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCardTitle(e.target.value);
  };
  const handleListTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedListTitle(e.target.value);
  };

  const handleListTitleBlur = () => {
    updateListTitle(listIndex, editedListTitle);
    setIsEditingListTitle(false);
  };
  const handleNewCardTitleBlur = () => {
    addNewCard(listIndex, newCardTitle)
    setIsAddingNewCard(false);
  };

  const handleListTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateListTitle(listIndex, editedListTitle);
      setIsEditingListTitle(false);
    }
    else if (e.key === "Escape") {
      setIsEditingListTitle(false);
      setEditedListTitle(list.title);
    }
  };

  const handleNewCardTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      /* updateListTitle(listIndex, editedListTitle); */
      addNewCard(listIndex, newCardTitle)
      setIsAddingNewCard(false);
    }
    else if (e.key === "Escape") {
      setIsAddingNewCard(false);
      setNewCardTitle('');
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
                    {isEditingListTitle ? (
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
                        value={editedListTitle}
                        onChange={handleListTitleChange}
                        onBlur={handleListTitleBlur}
                        onKeyDown={handleListTitleKeyPress}
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
                          onClick={() => {setIsEditingListTitle(true)}}
                        >
                          {list.title}
                        </h2>
                      )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          style={{
                            /* marginLeft: 'auto' */
                          }}
                          variant='ghost'
                          onClick={() => {console.log('more edit options')}}
                        >
                          <DotsHorizontalIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start" side='right'>

                        <div
                          style={{
                            marginLeft:'0.5rem',
                            display:'flex',
                            flexDirection:'column',
                            gap:'0.5rem',
                            /* backgroundColor:'hsla(var(--darker_black))', */
                            /* position: 'absolute', */
                            /* top: '0rem', */
                            /* left:'calc(100% + 0.5rem)', */
                            /* zIndex:'2', */

                            /* display: isEditing ? '' : 'none', // Hide the options when editing */
                          }}
                          className={`card-extra-options`}
                        >
                          {/* Add your extra option buttons here */}
                          <Button variant="primary">
                            {/* <X size={18} /> */}
                            Delete List
                          </Button>
                          <Button variant="primary">
                            <X size={18} />
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
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

              {isAddingNewCard ? (
                <div
                  style={{
                    /* backgroundColor:'hsla(var(--one_bg1))', */
                    display:'inline-block',
                    marginRight:"1rem",
                    width:'100%',
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
                      backgroundColor: 'hsla(var(--one_bg1))',
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
                    {/* TODO: make this a textbox instead? */}
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
                      value={newCardTitle}
                      onChange={handleNewCardTitleChange}
                      /* onBlur={handleTitleBlur} */
                      onKeyDown={handleNewCardTitleKeyPress}
                      autoFocus // Focus on the input field when it appears
                      placeholder='Enter list title...'
                    />
                  </div>
                  <div
                    style={{
                      display:'flex',
                      alignItems:'center',
                    }}>
                    <Button
                      style={{
                      }}
                      onClick={() => {
                        addNewCard(listIndex, newCardTitle);
                        setIsAddingNewCard(false);
                      }}
                      variant='primary'
                    >
                      Add Card
                    </Button>
                    <Button
                      style={{
                        marginLeft:'auto',
                      }}
                      variant='ghost'
                      onClick={() => {setIsAddingNewCard(false)}}
                    >
                      <Cross2Icon/>
                    </Button>
                  </div>
                </div>
              ) : (
                  <Button
                    style={{
                      /* color:'hsla(var(--muted_foreground))', */
                      /* backgroundColor:'hsla(var(--white), 0.2)', */
                      color:'hsla(var(--muted_foreground))',
                      width:'100%',
                      justifyContent:'start',
                      borderRadius:'0.5rem',
                    }}
                    variant='ghost'
                    onClick={() => {setIsAddingNewCard(true)}}
                  >
                    <div
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem'
                      }}
                    >
                      <PlusIcon />
                      Add a card
                    </div>
                  </Button>
                )
              }
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Column;

