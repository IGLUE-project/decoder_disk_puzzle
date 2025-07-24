export const DEFAULT_APP_SETTINGS = {
  skin: "STANDARD",
  actionWhenLoadingIfSolved: true,
  message: undefined,
  disableButton: false,
  backgroundImg: "",
  wheelImg: "",
  buttonImg: "",
  moveAudio: "sounds/tick.wav",
  buttonAudio: "sounds/button.mp3",
  winAudio: "sounds/win_sound.mp3",
  repeatWheelImg: false,
  wheels: [],
};

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
  COLORED_SHAPES: "COLORED_SHAPES",
  COLORS: "COLORS",
  CUSTOM: "CUSTOM",
};

export const AREACOLOR = {
  NONE: "",
  RAINBOW: "RAINBOW",
  CUSTOM: "CUSTOM",
};

export const ICONS = [
  "Triangle",
  "Square",
  "Circle",
  "Rhombus",
  "Spades",
  "Hearts",
  "Clubs",
  "Diamonds",
  "Star",
  "Moon",
  "Sun",
  "Puzzle",
  "Pentagon",
  "Hexagon"
];

export const COLORS = [
  "Red",
  "Green",
  "Blue",
  "Yellow",
  "Orange",
  "Pink",
  "Cyan",
  "Purple",
  "#8B4513", //brown
  "Black",
  "Gray",
  "White",
  "Turquoise",
  "Lime",
];

export const THEME_ASSETS = {
  [THEMES.RETRO]: {
    backgroundImg: "images/retro_background.png",
    wheelImg: "images/retro_wheel.png",
    buttonImg: "images/retro_button.png",
    moveAudio: "sounds/retro_wheel.mp3",
    buttonAudio: "sounds/retro_button.wav",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
  [THEMES.STANDARD]: {
    moveAudio: "sounds/tick.wav",
    buttonAudio: "sounds/button.mp3",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
  [THEMES.BASIC]: {
    backgroundImg: "images/basic_background.png",
    wheelImg: "images/basic_wheel.png",
    buttonImg: "images/basic_button.png",
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
    buttonAudio: "sounds/futuristic_button.wav",
    winAudio: "sounds/win_sound.mp3",
    repeatWheelImg: false,
  },
};

export const ESCAPP_CLIENT_SETTINGS = {
  imagesPath: "./images/",
};

export const MAIN_SCREEN = "MAIN_SCREEN";