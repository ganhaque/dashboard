import React from 'react';

export interface CardProps {
  id: number; // id = TaskDatabase.tasks[TaskDatabase.length - 1].id + 1;
  title: string;
  description: string;

  // In Progress / 
  // Backlog / Waiting
  // Todo / Pending
  // Canceled / Deleted
  // Completed / Done
  status: string;

  // Documentation, Bug, Feature, etc.
  labels?: string[];
  children?: CardProps[];


  priority?: string;
  /* urgency: number; */

  due?: string;

  // Is this necessary?
  /* entry: string; */
  /* modified: string; */
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  status,
  labels,
  children,
  priority,
  due
}) => {
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
      className="card"
    >
      <p>id: {id}</p>
      <p>title: {title}</p>
      <p>Description: {description}</p>
      <p>status: {status}</p>
    </div>
  );
};

export default Card;
