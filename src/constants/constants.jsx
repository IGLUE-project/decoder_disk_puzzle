export const DEFAULT_APP_SETTINGS = {
  skin: "STANDARD",
  actionWhenLoadingIfSolved: true,
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
export const ICONS = ["Circle", "Triangle", "Square", "Pentagon", "Star", "Hexagon"];
export const COLORS = ["Red", "Green", "Blue", "Yellow", "Orange", "Pink", "Cyan", "Purple", "Brown", "Black", "Gray", "White"];

export const THEME_ASSETS = {
  [THEMES.RETRO]: {
    backgroundImg: "images/ancient_background.png",
    wheelImg: "images/ancient_wheel.png",
    buttonImg: "images/ancient_button.png",
    moveAudio: "sounds/ancient_wheel.flac",
    buttonAudio: "sounds/button-stone.wav",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
  [THEMES.STANDARD]: {
    backgroundImg: "",
    wheelImg: "",
    buttonImg: "",
    moveAudio: "sounds/tick.wav",
    buttonAudio: "sounds/button.mp3",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
  [THEMES.BASIC]: {
    backgroundImg: "images/contemporary_background.png",
    wheelImg: "images/contemporary_wheel.png",
    buttonImg: "images/contemporary_button.png",
    moveAudio: "sounds/tick.wav",
    buttonAudio: "sounds/button.mp3",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: true,
  },
  [THEMES.FUTURISTIC]: {
    backgroundImg: "images/futuristic_background.png",
    wheelImg: "images/futuristic_wheel.png",
    buttonImg: "images/futuristic_button.png",
    moveAudio: "sounds/futuristic_wheel.wav",
    buttonAudio: "sounds/futuristic_button.mp3",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
};
