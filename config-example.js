//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  //Settings that can be specified by the authors
  skin: "STANDARD", //skin can be "STANDARD", "RETRO" or "FUTURISTIC" or "BASIC".
  //backgroundImg: "NONE", //background can be "NONE" or a URL.
  actionWhenLoadingIfSolved: true,
  numberOfWheels: 3, //number of wheels of the disk
  wheelsType: [
    {
      type: "NUMBERS", //type: can be "LETTERS", "NUMBERS", "SHAPES", "COLORED_SHAPES", "COLORS", "CUSTOM".
      length: 6, //length: number of slices in the wheel.
      //disabled: "TRUE", //disable interaction with this wheel
    },
    {
      type: "COLORS",
      length: 6,
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
    endpoint: "https://escapp.es/api/escapeRooms/id",
    linkedPuzzleIds: [1],
    rtc: false,
  },
};
