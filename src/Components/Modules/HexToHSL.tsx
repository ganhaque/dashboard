import React, { useState } from 'react';

const HexToHSL: React.FC = () => {
  const [hexValue, setHexValue] = useState('');
  const [hslValues, setHSLValues] = useState<{ [key: string]: string }>({});

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHexValue(event.target.value);
  };

  const convertHexToHSL = () => {
    /* const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/; */

    const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;

    const isValidHex = hexRegex.test(hexValue);
    if (!isValidHex) {
      alert('Invalid hex value');
      return;
    }

    const hexToRGB = (hex: string) => {
      let r, g, b;

      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      }

      return { r, g, b };
    };

    const rgbToHSL = (r: number, g: number, b: number) => {
      r /= 255;
      g /= 255;
      b /= 255;
      console.log(r);
      console.log(g);
      console.log(b);

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
          default:
            break;
        }

        h /= 6;
        if (h < 0) {
          h += 1;
        }
      }

      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    const property = hexValue.split(':')[0].trim();
    const hexCode = hex.match(hexRegex)![1];

    const { r, g, b } = hexToRGB(hexCode);
    const { h, s, l } = rgbToHSL(r, g, b);

    setHSLValues({ ...hslValues, [property]: `${h}, ${s}%, ${l}%` });
    setHexValue('');
  };

  return (
    <div>
      <input type="text" value={hexValue} onChange={handleHexChange} placeholder="Enter hex value" />
      <button onClick={convertHexToHSL}>Convert</button>

      <div>
        {Object.entries(hslValues).map(([property, hsl], index) => (
          <div key={index}>
            {`${property}: ${hsl}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HexToHSL;
