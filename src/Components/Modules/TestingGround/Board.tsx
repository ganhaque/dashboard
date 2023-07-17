import React, { useState } from 'react';
import List from './List';

const Board = () => {
  const [lists, setLists] = useState([{ id: 1, title: 'List 1' }, { id: 2, title: 'List 2' }]);

  const addList = () => {
    const newList = { id: Date.now(), title: 'New List' };
    setLists([...lists, newList]);
  };

  return (
    <div className="board">
      <div className="board-header">
        <h2>Trello Clone</h2>
      </div>
      <div className="lists">
        {/* {lists.map((list) => ( */}
        {/*   <List */}
        {/*     key={list.id} */}
        {/*     title={list.title} */}
        {/*   /> */}
        {/* ))} */}
      </div>
      <button onClick={addList}>Add List</button>
    </div>
  );
};

export default Board;
