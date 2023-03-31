const nav_links = document.querySelectorAll('a');
nav_links.forEach(anchor => anchor.addEventListener('click', (event) => {
  // event.preventDefault(); // dont follow the link as its a dummy
  nav_links.forEach(anchor => anchor.className = '');
  anchor.className = 'active';
}));
