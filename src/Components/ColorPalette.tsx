export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
}

export const colorPalettes : { [key: string]: ColorPalette }= {
  'red': {
    primary: 'red',
    secondary: 'orange',
    tertiary: 'yellow',
    quaternary: 'catppuccin_green'
  },
  'blue': {
    primary: 'nord_blue',
    secondary: 'cyan',
    tertiary: 'cyan',
    quaternary: 'vibrant_green'
  },
  'pink': {
    primary: 'pink',
    secondary: 'baby_pink',
    tertiary: 'red',
    quaternary: 'orange'
  },
  'green': {
    primary: 'vibrant_green',
    secondary: 'catppuccin_green',
    tertiary: 'green',
    quaternary: "vibrant_green"
  },
  /* 'green-green': { primary: 'catppuccin_green', secondary: 'vibrant_green' }, */
  'lavender': {
    primary: 'purple',
    secondary: 'catppuccin_lavender',
    tertiary: 'blue',
    quaternary: 'cyan'
  },
  'trans': {
    primary: 'purple',
    secondary: 'catppuccin_lavender',
    tertiary: 'blue',
    quaternary: 'cyan'
  },
  // Add more color palettes here as needed
};

export const handleColorChange = (paletteName: string) => {
  const palette = colorPalettes[paletteName] || colorPalettes['green'];
  document.documentElement.style.setProperty('--primary', `var(--${palette.primary})`);
  document.documentElement.style.setProperty('--secondary', `var(--${palette.secondary})`);
  document.documentElement.style.setProperty('--tertiary', `var(--${palette.tertiary})`);
  document.documentElement.style.setProperty('--quaternary', `var(--${palette.quaternary})`);
};
