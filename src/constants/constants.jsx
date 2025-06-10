export const DEFAULT_APP_SETTINGS = {
  skin: "STANDARD",
  actionAfterSolve: "NONE",
  message: undefined,

  backgroundImg: "",
  wheelImg: "",
  buttonImg: "",
  moveAudio: "sounds/tick.wav",
  buttonAudio: "sounds/button.mp3",
  winAudio: "sounds/win_sound.mp3",
  repeatWheelImg: false,
  wheels: [],
};

export const ESCAPP_CLIENT_SETTINGS = {
  imagesPath: "./images/",
};

export const ALLOWED_ACTIONS = ["NONE", "LOAD_SOLUTION"];

export const CONTROL_PANEL_SCREEN = "control_panel";
export const KEYPAD_SCREEN = "main_screen";

export const THEMES = {
  BASIC: "BASIC",
  FUTURISTIC: "FUTURISTIC",
  STANDARD: "STANDARD",
  RETRO: "RETRO",
};
export const WHEELTYPE = {
  LETTERS: "LETTERS",
  NUMBERS: "NUMBERS",
  SHAPES: "SHAPES",
  COLORED_SHAPES: "COLORED SHAPES",
  COLORS: "COLORS",
  CUSTOM: "CUSTOM",
};
export const AREACOLOR = {
  NONE: "",
  RAINBOW: "RAINBOW",
  CUSTOM: "CUSTOM",
};
export const ICONS = ["circle", "triangle", "square", "pentagon", "star", "hexagon"];

export const THEME_ASSETS = {
  [THEMES.RETRO]: {
    backgroundImg: "/src/assets/images/ancient_background.png",
    wheelImg: "/src/assets/images/ancient_wheel.png",
    buttonImg: "/src/assets/images/ancient_button.png",
    moveAudio: "sounds/ancient_wheel.flac",
    buttonAudio: "sounds/button-stone.wav",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
  [THEMES.BASIC]: {
    backgroundImg: "",
    wheelImg: "",
    buttonImg: "",
    moveAudio: "sounds/tick.wav",
    buttonAudio: "sounds/button.mp3",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
  [THEMES.STANDARD]: {
    backgroundImg: "/src/assets/images/contemporary_background.png",
    wheelImg: "/src/assets/images/contemporary_wheel.png",
    buttonImg: "/src/assets/images/contemporary_button.png",
    moveAudio: "sounds/tick.wav",
    buttonAudio: "sounds/button.mp3",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: true,
  },
  [THEMES.FUTURISTIC]: {
    backgroundImg: "/src/assets/images/futuristic_background.png",
    wheelImg: "/src/assets/images/futuristic_wheel.png",
    buttonImg: "/src/assets/images/futuristic_button.png",
    moveAudio: "sounds/futuristic_wheel.wav",
    buttonAudio: "sounds/futuristic_button.mp3",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
};
