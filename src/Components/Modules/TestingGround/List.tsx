// List.tsx
import React, { useState } from 'react';
import Card from './Card';
import { CardProps } from './Card';

interface ListProps {
  /* [title: string]: CardProps[]; */
  title: string;
  /* cards: CardProps[]; */
}

/* const List: React.FC<ListProps> = ({ title, cards }) => { */
const List: React.FC<ListProps> = ({ title }) => {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "Card 1 title",
      description: 'Card 1 description',
      status: "todo"
    },
    {
      id: 2,
      title: "Card 2 title",
      description: 'Card 2 description',
      status: "todo"
    }
  ]);

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      title: 'New card title',
      description: 'New Created Card',
      status:  "todo"
    };
    setCards([...cards, newCard]);
  };

  return (
    <div
      style={{
        borderWidth:"1px",
        borderRadius:"calc(var(--radius) - 2px)",
        paddingLeft:"0.75rem",
        paddingRight:"0.75rem",
        paddingTop:"0.5rem",
        paddingBottom:"0.5rem",
      }}
      className="flex-column gap-2 list"
    >
      <h2>{title}</h2>
      <div
        style={{

        }}
        className="flex-column gap-2 cards"
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            status="todo"
          />
        ))}
      </div>
      <button onClick={addCard}>++ Card ++</button>
    </div>
  );
};

export default List;
