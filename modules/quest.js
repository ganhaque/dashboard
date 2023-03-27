fetch('./vault/quests/quests.txt')
  .then(response => response.text())
  .then(text => {
    const questsDiv = document.getElementById('quests');
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const p = document.createElement('p');
      p.setAttribute('id', 'quest');
      p.textContent = lines[i];
      questsDiv.appendChild(p);
    }
  });

