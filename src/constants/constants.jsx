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
  BLACK: "black",
  RAINBOW: "rainbow",
  CUSTOM: "custom",
};
export const ICONS = ["circle", "triangle", "square", "pentagon", "star", "hexagon"];

export const THEME_IMAGES = {
  [THEMES.ANCIENT]: { backgroundImg: "", wheelImg: "/src/assets/images/ancient_wheel.png" },
  [THEMES.CONTEMPORARY]: { backgroundImg: "", wheelImg: "" },
  [THEMES.FUTURISTIC]: { backgroundImg: "", wheelImg: "/src/assets/images/futuristic_wheel.png" },
};
