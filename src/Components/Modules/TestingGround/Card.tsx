import { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from './Components/Button';
import { Input } from './Components/Input';
import { X } from "lucide-react";
import { Pencil1Icon } from '@radix-ui/react-icons';
import { labelValueColorMap, labelValueBackgroundColorMap } from './Data';
import { Settings } from './Data';
import "./Card.css"
import { useBoardContext } from './BoardProvider';

/* NOTE: This is a custom CardProps prop & not the actual CardProps */
interface CardProps {
  /* id: string; */
  /* title: string; */
  /* labels?: string[]; */
  cardIndex: number;
  listIndex: number
}

const Card = ({ cardIndex, listIndex }: CardProps) => {
  const {
    boards,
    selectedBoardIndex,
    updateCardTitle,
    /* updateCardDescription, */
  } = useBoardContext();
  const card = boards[selectedBoardIndex].lists[listIndex].cards[cardIndex];


  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Create a ref for the textarea

  useEffect(() => {
    // When isEditing becomes true, focus on the textarea and move the cursor to the end of the content
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(editedTitle.length, editedTitle.length);
    }
  }, [isEditing]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    updateCardTitle(listIndex, cardIndex, editedTitle);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      updateCardTitle(listIndex, cardIndex, editedTitle);
      setIsEditing(false);
    }
    else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(card.title);
    }
  };

  return (
    <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              gap: '0.25rem',
              flexDirection: 'column',
              marginTop: '0.5rem', // use this instead of parent-container gap for better render
              paddingTop: '0.5rem',
              paddingRight: '0.5rem',
              paddingLeft: '0.75rem',
              paddingBottom: '0.25rem',
              borderRadius: '0.75rem',
              backgroundColor: 'hsla(var(--one_bg1))',
              fontSize: '0.875rem',
              fontWeight: '400',
              lineHeight: '1.25rem',
              overflow:'visible'
            }}
            /* onClick={() => { */
            /*   console.log('card'); */
            /* }} */
            className='card-wrapper'
          >
            {card.labels && card.labels.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {card.labels?.map((label) => (
                  <div
                    style={{
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      lineHeight: '0.875rem',
                      paddingLeft: '0.125rem',
                      paddingRight: '0.125rem',
                      backgroundColor: `hsla(var(--${labelValueBackgroundColorMap[label]})`,
                      color: `hsla(var(--${labelValueColorMap[label]})`,
                    }}
                    key={label}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}

            {isEditing ? (
              /* <input*/
              /*   type="text" */
              /*   value={editedTitle} */
              /*   onChange={(e) => setEditedTitle(e.target.value)} */
              /* /> */
              <textarea
                ref={textAreaRef}
                style={{
                  flexGrow:'1',
                  fontSize:'inherit',
                  borderRadius:'0.25rem',
                  padding:'0',
                  borderWidth:'0px',
                  backgroundColor:'hsla(var(--one_bg1))',
                  minHeight:`${Math.ceil(editedTitle.length/35)*1.25+1}rem`
                  /* boxShadow:'0 0 0 2px hsla(var(--black)), 0 0 0 3px hsla(var(--grey))' */
                }}
                /* type="text" */
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyPress}
                autoFocus // Focus on the input field when it appears
              />
            ) : (
                <span
                  style={{
                    wordWrap: 'break-word',
                    display: 'block',
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textDecoration: 'none',
                  }}
                >
                  {card.title}
                </span>
              )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end', // Position the "Edit" button to the top right corner
                alignItems: 'center',
                position: 'absolute', // Add this to make sure it's positioned relative to the card container
                top: '0rem',
                right: '0rem',
              }}
              className={`card-toolbar`}
            >
              <Button
                style={{
                  display:isEditing ? 'none' : ''
                }}
                className='card-edit-button'
                onClick={() => {setIsEditing(true)}}
              >
                <Pencil1Icon/>
              </Button>
            </div>

            {isEditing ? (
              <div
                style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:'0.5rem',
                  /* backgroundColor:'hsla(var(--darker_black))', */
                  position: 'absolute',
                  top: '0rem',
                  left:'calc(100% + 0.5rem)',
                  zIndex:'2',

                  /* display: isEditing ? '' : 'none', // Hide the options when editing */
                }}
                className={`card-extra-options`}
              >
                {/* Add your extra option buttons here */}
                <Button variant="primary">
                  ^
                </Button>
                <Button variant="primary">
                  v
                </Button>
                <Button variant="primary">
                  <X size={18} />
                </Button>
              </div>
            ) : null}

          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;

