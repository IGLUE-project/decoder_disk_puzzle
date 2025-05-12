export const PAINTING_SCREEN = "painting";
export const SAFE_CLOSED_SCREEN = "safe_closed";
export const SAFE_OPEN_SCREEN = "safe_open";
export const CONTROL_PANEL_SCREEN = "control_panel";
export const KEYPAD_SCREEN = "keypad";

export const THEMES = {
  BASIC: "basic",
  FUTURISTIC: "futuristic",
  CONTEMPORARY: "contemporary",
  ANCIENT: "ancient",
};
export const WHEELTYPE = {
  LETTERS: "letters",
  NUMBERS: "numbers",
  SHAPES: "shapes",
  COLORED_SHAPES: "colored shapes",
  COLORS: "colors",
  CUSTOM: "custom",
};
export const AREACOLOR = {
  NONE: "",
  RAINBOW: "rainbow",
  CUSTOM: "custom",
};
export const ICONS = ["circle", "triangle", "square", "pentagon", "star", "hexagon"];

export const THEME_ASSETS = {
  [THEMES.ANCIENT]: {
    backgroundImg: "/src/assets/images/ancient_background.png",
    wheelImg: "/src/assets/images/ancient_wheel.png",
    buttonImg: "/src/assets/images/ancient_button.png",
    moveAudio: "sounds/ancient_wheel.wav",
    buttonAudio: "sounds/button-stone.wav",
    repeatWheelImg: false,
  },
  [THEMES.BASIC]: {
    backgroundImg: "",
    wheelImg: "",
    buttonImg: "",
    moveAudio: "sounds/tick.wav",
    buttonAudio: "sounds/button.wav",
    repeatWheelImg: false,
  },
  [THEMES.CONTEMPORARY]: {
    backgroundImg: "/src/assets/images/contemporary_background.png",
    wheelImg: "/src/assets/images/contemporary_wheel.png",
    buttonImg: "/src/assets/images/contemporary_button.png",
    moveAudio: "sounds/tick.wav",
    buttonAudio: "sounds/button.wav",
    repeatWheelImg: true,
  },
  [THEMES.FUTURISTIC]: {
    backgroundImg: "/src/assets/images/futuristic_background.png",
    wheelImg: "/src/assets/images/futuristic_wheel.png",
    buttonImg: "/src/assets/images/futuristic_button.png",
    moveAudio: "sounds/futuristic_wheel.wav",
    buttonAudio: "sounds/futuristic_button.mp3",
    repeatWheelImg: false,
  },
};
