import React, { useEffect, useState } from 'react';

const Quests: React.FC = () => {
  const [quests, setQuests] = useState<string[]>([]);

  useEffect(() => {
    /* fetch('./quests.txt') */
    /* console.log(process.env.PUBLIC_URL); */
    fetch(`./vault/quests/quests.txt`)
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        // remove empty
        if (lines[lines.length - 1] === '') {
          lines.pop();
        }
        setQuests(lines);
      })
      .catch(error => {
        console.error('Error fetching quests:', error);
      });
  }, []);

  return (
    <div id="quests">
      {quests.map((quest, index) => (
        <p key={index} id="quest">
          {quest}
        </p>
      ))}
    </div>
  );
};

export default Quests;
