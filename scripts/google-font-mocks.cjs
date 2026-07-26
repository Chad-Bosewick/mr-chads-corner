const sansFace = `/* latin */
@font-face {
  font-family: 'Plus Jakarta Sans';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(/System/Library/Fonts/Supplemental/Arial.ttf) format('truetype');
}`;

const serifFace = `/* latin */
@font-face {
  font-family: 'Lora';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url(/System/Library/Fonts/Supplemental/Georgia Italic.ttf) format('truetype');
}`;

module.exports = new Proxy(
  {},
  {
    get(_target, key) {
      const url = String(key);
      if (url.includes("Lora")) return serifFace;
      if (url.includes("Plus+Jakarta+Sans")) return sansFace;
      return sansFace;
    },
  },
);
