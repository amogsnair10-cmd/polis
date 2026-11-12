/* Themes. Each theme sets CSS tokens (see :root in index.html), fonts and hero art.
   To add a theme: copy one below, change the values, and it appears in the picker.
   Keep "card" light: lesson diagrams are drawn for a light card.
   hero: "polis" uses the built-in bust SVG; "emblem" draws a simple emblem in the theme colours;
   or set heroImage to an image path (e.g. "art/history-hero.png") to use your own art. */
const THEMES = {
  polis: {
    name: "Polis", note: "Lapis, gold and marble",
    fonts: "Cinzel:wght@500;700&family=Spectral:ital,wght@0,400;0,600;1,400",
    vars: {}, // the defaults in index.html
    hero: "polis"
  },
  chronicle: {
    name: "Chronicle", note: "Ink, parchment and vermilion",
    fonts: "Playfair+Display:wght@600;800&family=Lora:ital,wght@0,400;0,600;1,400",
    vars: {
      "--lapis": "#3b2416", "--night": "#24150c", "--glow": "#5a3a22",
      "--gold": "#d9a441", "--accent-rgb": "217,164,65", "--goldd": "#8a4b14",
      "--card": "#f6eedd", "--marble": "#f6eedd", "--ink": "#2a1d14", "--vein": "#6b5a4a",
      "--sub": "#cdb79a", "--motto": "#e8d9c2", "--foot": "#b49c80", "--faint": "#8c7660", "--faint2": "#5b4430",
      "--btn1": "#e3b45a", "--btn2": "#b07a2a", "--btn-ink": "#20140a", "--btn-shadow": "rgba(176,122,42,.45)",
      "--strong": "#3a1f0e", "--quote-ink": "#3a1f0e", "--exam-bg": "#efe6d2", "--opt-line": "#d8c8ae",
      "--font-display": "'Playfair Display',serif", "--font-body": "Manrope,system-ui,sans-serif",
      "--card-img": "none", "--key-img": "linear-gradient(90deg,transparent 0 6px,#d9a441 6px 18px,transparent 18px 24px)"
    },
    hero: "emblem", glyph: "📜"
  },
  terra: {
    name: "Terra", note: "Ocean blue, sand and coral",
    fonts: "DM+Serif+Display",
    vars: {
      "--lapis": "#0f3d4c", "--night": "#082631", "--glow": "#1b6175",
      "--gold": "#f2b66d", "--accent-rgb": "242,182,109", "--goldd": "#9a5a1a",
      "--card": "#f7f3ea", "--marble": "#f7f3ea", "--ink": "#16262c", "--vein": "#56676d",
      "--sub": "#9fc4cf", "--motto": "#cfe3e8", "--foot": "#86aab4", "--faint": "#6f8f98", "--faint2": "#2e5866",
      "--btn1": "#f5c27f", "--btn2": "#d98b3a", "--btn-ink": "#1d1206", "--btn-shadow": "rgba(217,139,58,.45)",
      "--strong": "#0f2a33", "--quote-ink": "#0f2a33", "--exam-bg": "#e3f0f2", "--opt-line": "#cfd9d6",
      "--font-display": "'DM Serif Display',serif", "--font-body": "Manrope,system-ui,sans-serif",
      "--card-img": "none", "--key-img": "radial-gradient(circle at 6px 8px,#f2b66d 2px,transparent 3px)"
    },
    hero: "emblem", glyph: "🧭"
  },
  verdant: {
    name: "Verdant", note: "Forest green and sunlight",
    fonts: "Fraunces:wght@600;800&family=Literata:ital,wght@0,400;0,600;1,400",
    vars: {
      "--lapis": "#1d3b2a", "--night": "#10241a", "--glow": "#2f5d43",
      "--gold": "#e0c35a", "--accent-rgb": "224,195,90", "--goldd": "#6d5a12",
      "--card": "#f4f6ee", "--marble": "#f4f6ee", "--ink": "#1a2a20", "--vein": "#56685c",
      "--sub": "#a9c7b2", "--motto": "#d6e6da", "--foot": "#8fae98", "--faint": "#6f8a77", "--faint2": "#355a43",
      "--btn1": "#e6cf6e", "--btn2": "#b89a2e", "--btn-ink": "#1b1704", "--btn-shadow": "rgba(184,154,46,.45)",
      "--strong": "#123020", "--quote-ink": "#123020", "--exam-bg": "#e4efe6", "--opt-line": "#cdd8cc",
      "--font-display": "Fraunces,serif", "--font-body": "Manrope,system-ui,sans-serif",
      "--card-img": "none", "--key-img": "linear-gradient(135deg,transparent 0 5px,#e0c35a 5px 7px,transparent 7px 12px)"
    },
    hero: "emblem", glyph: "🌿"
  },
  odyssey: {
    name: "Odyssey", note: "Deep space, bronze and starlight",
    fonts: "Cormorant+Garamond:wght@600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400",
    vars: {
      "--lapis": "#1b1440", "--night": "#0b0820", "--glow": "#3d2b7a",
      "--gold": "#e8a65a", "--accent-rgb": "232,166,90", "--goldd": "#8c4f16",
      "--card": "#f5f1ea", "--marble": "#f5f1ea", "--ink": "#1e1a2e", "--vein": "#5e5870",
      "--sub": "#b3a8d6", "--motto": "#ddd6f3", "--foot": "#958bb8", "--faint": "#7a7199", "--faint2": "#3f3466",
      "--btn1": "#f0b871", "--btn2": "#c97a33", "--btn-ink": "#1d1105", "--btn-shadow": "rgba(201,122,51,.45)",
      "--strong": "#22163f", "--quote-ink": "#22163f", "--exam-bg": "#ece7f6", "--opt-line": "#d6cfe0",
      "--font-display": "'Cormorant Garamond',serif", "--font-body": "Manrope,system-ui,sans-serif",
      "--card-img": "none", "--key-img": "radial-gradient(circle at 4px 8px,#e8a65a 1.5px,transparent 2.5px)"
    },
    hero: "emblem", glyph: "🪐"
  },
  manifesto: {
    name: "Manifesto", note: "Poster red, black and newsprint",
    fonts: "Abril+Fatface",
    vars: {
      "--lapis": "#5a0f12", "--night": "#1a0607", "--glow": "#8c1a1f",
      "--gold": "#f2c14e", "--accent-rgb": "242,193,78", "--goldd": "#8a2a12",
      "--card": "#f3efe6", "--marble": "#f3efe6", "--ink": "#1c1a18", "--vein": "#5e5952",
      "--sub": "#e2b3a6", "--motto": "#f3d9cf", "--foot": "#c6958a", "--faint": "#9a6c63", "--faint2": "#6a2a26",
      "--btn1": "#f5cd62", "--btn2": "#d29a28", "--btn-ink": "#1f1203", "--btn-shadow": "rgba(210,154,40,.45)",
      "--strong": "#3a0c0c", "--quote-ink": "#3a0c0c", "--exam-bg": "#efe4dc", "--opt-line": "#d6ccc0",
      "--font-display": "'Abril Fatface',serif", "--font-body": "Manrope,system-ui,sans-serif",
      "--card-img": "none", "--key-img": "linear-gradient(90deg,#f2c14e 0 14px,transparent 14px 20px)"
    },
    hero: "emblem", glyph: "★"
  },
  nebula: { name: "Stellar", note: "From the night sky to the edge of the universe", fonts: "Cormorant+Garamond:wght@600;700",
    vars: { "--lapis": "#120f2e", "--night": "#06051a", "--glow": "#2c2470", "--gold": "#9fd3ff", "--accent-rgb": "159,211,255", "--goldd": "#1f5f8a",
      "--card": "#f5f6f8", "--marble": "#f5f6f8", "--ink": "#18202a", "--vein": "#56606c", "--sub": "#b8c4d4", "--motto": "#dfe6ef", "--foot": "#97a3b3",
      "--faint": "#77839a", "--faint2": "#3b4660", "--btn1": "#9fd3ff", "--btn2": "#1f5f8a", "--btn-ink": "#0b0b10", "--btn-shadow": "rgba(159,211,255,.4)",
      "--strong": "#101826", "--quote-ink": "#101826", "--exam-bg": "#e8edf3", "--opt-line": "#d3d9e1",
      "--font-display": "'Cormorant Garamond',serif", "--font-body": "Manrope,system-ui,sans-serif", "--card-img": "none", "--key-img": "radial-gradient(circle at 5px 8px,#9fd3ff 1.6px,transparent 2.6px)" },
    hero: "emblem", glyph: "🔭" },
  circuit: { name: "Principia", note: "Motion, energy, fields and the laws of nature", fonts: "Playfair+Display:wght@600;800",
    vars: { "--lapis": "#0f2a3a", "--night": "#061822", "--glow": "#1d4d66", "--gold": "#ffb547", "--accent-rgb": "255,181,71", "--goldd": "#8a5310",
      "--card": "#f5f6f8", "--marble": "#f5f6f8", "--ink": "#18202a", "--vein": "#56606c", "--sub": "#b8c4d4", "--motto": "#dfe6ef", "--foot": "#97a3b3",
      "--faint": "#77839a", "--faint2": "#3b4660", "--btn1": "#ffb547", "--btn2": "#8a5310", "--btn-ink": "#0b0b10", "--btn-shadow": "rgba(255,181,71,.4)",
      "--strong": "#101826", "--quote-ink": "#101826", "--exam-bg": "#e8edf3", "--opt-line": "#d3d9e1",
      "--font-display": "'Playfair Display',serif", "--font-body": "Manrope,system-ui,sans-serif", "--card-img": "none", "--key-img": "radial-gradient(circle at 5px 8px,#ffb547 1.6px,transparent 2.6px)" },
    hero: "emblem", glyph: "⚛️" },
  alembic: { name: "Alchemy", note: "Atoms, bonds and reactions", fonts: "Gloock",
    vars: { "--lapis": "#14332e", "--night": "#08201c", "--glow": "#24584f", "--gold": "#7fe0c4", "--accent-rgb": "127,224,196", "--goldd": "#1d6b58",
      "--card": "#f5f6f8", "--marble": "#f5f6f8", "--ink": "#18202a", "--vein": "#56606c", "--sub": "#b8c4d4", "--motto": "#dfe6ef", "--foot": "#97a3b3",
      "--faint": "#77839a", "--faint2": "#3b4660", "--btn1": "#7fe0c4", "--btn2": "#1d6b58", "--btn-ink": "#0b0b10", "--btn-shadow": "rgba(127,224,196,.4)",
      "--strong": "#101826", "--quote-ink": "#101826", "--exam-bg": "#e8edf3", "--opt-line": "#d3d9e1",
      "--font-display": "Gloock,serif", "--font-body": "Manrope,system-ui,sans-serif", "--card-img": "none", "--key-img": "radial-gradient(circle at 5px 8px,#7fe0c4 1.6px,transparent 2.6px)" },
    hero: "emblem", glyph: "⚗️" },
  helix: { name: "Vita", note: "Life from cells to ecosystems", fonts: "Fraunces:wght@600;800",
    vars: { "--lapis": "#173a1f", "--night": "#0a2111", "--glow": "#2a6136", "--gold": "#a6e36b", "--accent-rgb": "166,227,107", "--goldd": "#3f6f12",
      "--card": "#f5f6f8", "--marble": "#f5f6f8", "--ink": "#18202a", "--vein": "#56606c", "--sub": "#b8c4d4", "--motto": "#dfe6ef", "--foot": "#97a3b3",
      "--faint": "#77839a", "--faint2": "#3b4660", "--btn1": "#a6e36b", "--btn2": "#3f6f12", "--btn-ink": "#0b0b10", "--btn-shadow": "rgba(166,227,107,.4)",
      "--strong": "#101826", "--quote-ink": "#101826", "--exam-bg": "#e8edf3", "--opt-line": "#d3d9e1",
      "--font-display": "Fraunces,serif", "--font-body": "Manrope,system-ui,sans-serif", "--card-img": "none", "--key-img": "radial-gradient(circle at 5px 8px,#a6e36b 1.6px,transparent 2.6px)" },
    hero: "emblem", glyph: "🧬" },
  quantum: { name: "Quanta", note: "The strange rules of the very small", fonts: "Instrument+Serif",
    vars: { "--lapis": "#1c1036", "--night": "#0c0620", "--glow": "#3b2470", "--gold": "#c792ff", "--accent-rgb": "199,146,255", "--goldd": "#5b2a9a",
      "--card": "#f5f6f8", "--marble": "#f5f6f8", "--ink": "#18202a", "--vein": "#56606c", "--sub": "#b8c4d4", "--motto": "#dfe6ef", "--foot": "#97a3b3",
      "--faint": "#77839a", "--faint2": "#3b4660", "--btn1": "#c792ff", "--btn2": "#5b2a9a", "--btn-ink": "#0b0b10", "--btn-shadow": "rgba(199,146,255,.4)",
      "--strong": "#101826", "--quote-ink": "#101826", "--exam-bg": "#e8edf3", "--opt-line": "#d3d9e1",
      "--font-display": "'Instrument Serif',serif", "--font-body": "Manrope,system-ui,sans-serif", "--card-img": "none", "--key-img": "radial-gradient(circle at 5px 8px,#c792ff 1.6px,transparent 2.6px)" },
    hero: "emblem", glyph: "🌀" }
};
