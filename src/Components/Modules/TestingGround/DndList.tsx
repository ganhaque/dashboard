import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from './Components/Button';

interface CardProps {
  id: string;
  title: string;
  status: string;
}

const List: CardProps[] = [
  {
    id: '1689445701923',
    title: "You can't compress the program without quantifying the open-source SSD pixel!",
    status: "in progress",
  },
  {
    id: '1689445706629',
    title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: 'backlog'
  },
  {
    id: '1689445713142',
    title: "We need to bypass the neural TCP card!",
    status: 'todo'
  },
  {
    id: '1689445718722',
    title: "Use the digital TLS panel, then you can transmit the haptic system!",
    status: 'done'
  },
  {
    id: '1689445728973',
    title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
    status: 'canceled'
  }
];

function Example() {
  const [cards, updateList] = useState<CardProps[]>(List);

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateList(items);
  }

  return (
    <div className="">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <div
              style={{
                borderWidth:"1px",
                marginTop:"0.5rem",
                borderRadius:"calc(var(--radius) - 2px)",
                paddingLeft:"0.75rem",
                paddingRight:"0.75rem",
                paddingTop:"0.5rem",
                paddingBottom:"0.5rem",
                backgroundColor:"hsla(var(--black))"
              }}
              className="flex-column"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h1>Final Space Characters</h1>
              {cards.map(({ id, title, status }, index) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div
                          style={{
                            display:"flex",
                            marginTop:"0.5rem",
                            borderRadius:"calc(var(--radius) - 2px)",
                            paddingLeft:"0.75rem",
                            paddingRight:"0.75rem",
                            paddingTop:"0.5rem",
                            paddingBottom:"0.5rem",
                            backgroundColor:"hsla(var(--darker_black))",
                          }}
                        >
                          <p>{title}</p>
                          <div
                            className="flex gap-2 left-margin-auto"
                          >
                            <Button
                              variant='outline'
                            >
                              Edit
                            </Button>
                            <Button
                              style={{
                                /* marginLeft:"auto" */
                              }}
                              variant='outline'
                            >
                              X
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Example;

