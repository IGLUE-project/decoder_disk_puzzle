//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  //Settings that can be specified by the authors
  skin: "RETRO", //skin can be "STANDARD", "RETRO" or "FUTURISTIC" or "BASIC".
  //backgroundImg: "NONE", //background can be "NONE" or a URL.
  actionWhenLoadingIfSolved: true,
  //message: "Custom message",

  //type: can be "LETTERS", "NUMBERS", "SHAPES", "COLORED SHAPES", "COLORS", "CUSTOM".
  //areaColor: can be a color or "RAINBOW" for a rainbow gradient.
  //length: number of slices in the wheel.
  numberOfWheels: 3, //number of wheels in the puzzle.
  wheelsType: [
    {
      type: "COLORS",
      length: 6,
    },
    {
      type: "COLORED SHAPES",
      length: 6,
      areaColor: "RAINBOW",
    },
    {
      type: "CUSTOM",
      length: 6,
      customWheel: [
        { areaColor: "#ff0000", colorIco: "brown", label: "a", img: "", ico: "Circle" },
        { areaColor: "#ffff00", colorIco: "red", label: "b", img: "", ico: "Triangle" },
        { areaColor: "#ff00ff", colorIco: "blue", label: "c", img: "", ico: "Square" },
        { areaColor: "#00ff00", colorIco: "green", label: "d", img: "", ico: "Pentagon" },
        { areaColor: "#00ffff", colorIco: "yellow", label: "e", img: "", ico: "Star" },
        { areaColor: "#ff0000", colorIco: "orange", label: "g", img: "", ico: "" },
      ],
    },
  ],

  //Settings that will be automatically specified by the Escapp server
  solutionLength: 3,
  locale: "es",

  escappClientSettings: {
    endpoint: "https://escapp.etsisi.upm.es/api/escapeRooms/153",
    linkedPuzzleIds: [4],
    rtc: false,
  },
};
