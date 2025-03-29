export const championCombos = {
  combo1: {
    carry: {
      name: "Veigar",
      key: "Veigar",
      id: "Veigar",
      skillOrder: ["Q", "W", "E"],
      spellImgs: ["VeigarQ.png", "VeigarW.png", "VeigarE.png", "VeigarR.png"],
      startingItem: "1055", // Doran's Ring
      items: ["3020", "3157", "3115", "3040", "3111", "3026"], // Luden's, Lich Bane, Nashor's, Seraph's, Rabadon's, Sorcerer's
      runes: {
        primary: ["8128", "8139", "8143", "8135"], // Dark Harvest, Taste of Blood, Eyeball Collection, Ravenous Hunter
        secondary: ["8229", "8230"], // Nimbus Cloak, Transcendence
      },
    },
    support: {
      name: "Poppy",
      key: "Poppy",
      id: "Poppy",
      skillOrder: ["Q", "E", "W"],
      spellImgs: ["PoppyQ.png", "PoppyW.png", "PoppyE.png", "PoppyR.png"],
      startingItem: "3853", // Relic Shield
      items: ["3109", "3111", "3065", "3068", "3102", "3020"], // Knight's Vow, Rabadon's, Spirit Visage, Warmog's, Banshee's, Luden's
      runes: {
        primary: ["8437", "8446", "8444", "8451"], // Grasp of the Undying, Demolish, Second Wind, Overgrowth
        secondary: ["8242", "8243"], // Font of Life, Conditioning
      },
    },
  },
  combo2: {
    carry: {
      name: "Rengar",
      key: "Rengar",
      id: "Rengar",
      skillOrder: ["Q", "W", "E"],
      spellImgs: ["RengarQ.png", "RengarW.png", "RengarE.png", "RengarR.png"],
      startingItem: "1039", // Hunter's Talisman
      items: ["3074", "3071", "3142", "3036", "3031", "3047"], // Ravenous Hydra, Black Cleaver, Youmuu's, Infinity Edge, Phantom Dancer, Phantom Dancer
      runes: {
        primary: ["8128", "8139", "8143", "8135"], // Dark Harvest, Taste of Blood, Eyeball Collection, Ravenous Hunter
        secondary: ["8214", "8233"], // Celerity, Waterwalking
      },
    },
    support: {
      name: "Jinx",
      key: "Jinx",
      id: "Jinx",
      skillOrder: ["E", "Q", "W"],
      spellImgs: ["JinxQ.png", "JinxW.png", "JinxE.png", "JinxR.png"],
      startingItem: "1055", // Doran's Blade
      items: ["3031", "3074", "3036", "3035", "3046", "3006"], // Phantom Dancer, Ravenous Hydra, Infinity Edge, Phantom Dancer, Phantom Dancer, Berserker's Greaves
      runes: {
        primary: ["8008", "8009", "9104", "8014"], // Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace
        secondary: ["8126", "8138"], // Eyeball Collection, Ravenous Hunter
      },
    },
  },
  combo3: {
    carry: {
      name: "Lucian",
      key: "Lucian",
      id: "Lucian",
      skillOrder: ["E", "W", "Q"],
      spellImgs: ["LucianQ.png", "LucianW.png", "LucianE.png", "LucianR.png"],
      startingItem: "1055", // Doran's Blade
      items: ["3031", "3074", "3036", "3035", "3046", "3006"], // Phantom Dancer, Ravenous Hydra, Infinity Edge, Phantom Dancer, Phantom Dancer, Berserker's Greaves
      runes: {
        primary: ["8008", "8009", "9104", "8014"], // Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace
        secondary: ["8126", "8138"], // Eyeball Collection, Ravenous Hunter
      },
    },
    support: {
      name: "Lux",
      key: "Lux",
      id: "Lux",
      skillOrder: ["E", "Q", "W"],
      spellImgs: ["LuxQ.png", "LuxW.png", "LuxE.png", "LuxR.png"],
      startingItem: "3853", // Relic Shield
      items: ["3109", "3111", "3065", "3068", "3102", "3020"], // Knight's Vow, Rabadon's, Spirit Visage, Warmog's, Banshee's, Luden's
      runes: {
        primary: ["8229", "8224", "8233", "8237"], // Nimbus Cloak, Manaflow Band, Waterwalking, Gathering Storm
        secondary: ["8126", "8138"], // Eyeball Collection, Ravenous Hunter
      },
    },
  },
  combo4: {
    carry: {
      name: "Kog'Maw",
      key: "KogMaw",
      id: "KogMaw",
      skillOrder: ["E", "Q", "W"],
      spellImgs: ["KogMawQ.png", "KogMawW.png", "KogMawE.png", "KogMawR.png"],
      startingItem: "1055", // Doran's Blade
      items: ["3031", "3074", "3036", "3035", "3046", "3006"], // Phantom Dancer, Ravenous Hydra, Infinity Edge, Phantom Dancer, Phantom Dancer, Berserker's Greaves
      runes: {
        primary: ["8008", "8009", "9104", "8014"], // Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace
        secondary: ["8126", "8138"], // Eyeball Collection, Ravenous Hunter
      },
    },
    support: {
      name: "Ziggs",
      key: "Ziggs",
      id: "Ziggs",
      skillOrder: ["E", "Q", "W"],
      spellImgs: ["ZiggsQ.png", "ZiggsW.png", "ZiggsE.png", "ZiggsR.png"],
      startingItem: "3853", // Relic Shield
      items: ["3109", "3111", "3065", "3068", "3102", "3020"], // Knight's Vow, Rabadon's, Spirit Visage, Warmog's, Banshee's, Luden's
      runes: {
        primary: ["8229", "8224", "8233", "8237"], // Nimbus Cloak, Manaflow Band, Waterwalking, Gathering Storm
        secondary: ["8126", "8138"], // Eyeball Collection, Ravenous Hunter
      },
    },
  },
  combo5: {
    carry: {
      name: "Ahri",
      key: "Ahri",
      id: "Ahri",
      skillOrder: ["Q", "W", "E"],
      spellImgs: ["AhriQ.png", "AhriW.png", "AhriE.png", "AhriR.png"],
      startingItem: "1055", // Doran's Ring
      items: ["3020", "3157", "3115", "3040", "3111", "3026"], // Luden's, Lich Bane, Nashor's, Seraph's, Rabadon's, Sorcerer's
      runes: {
        primary: ["8128", "8139", "8143", "8135"], // Dark Harvest, Taste of Blood, Eyeball Collection, Ravenous Hunter
        secondary: ["8229", "8230"], // Nimbus Cloak, Transcendence
      },
    },
    support: {
      name: "Karma",
      key: "Karma",
      id: "Karma",
      skillOrder: ["E", "Q", "W"],
      spellImgs: ["KarmaQ.png", "KarmaW.png", "KarmaE.png", "KarmaR.png"],
      startingItem: "3853", // Relic Shield
      items: ["3109", "3111", "3065", "3068", "3102", "3020"], // Knight's Vow, Rabadon's, Spirit Visage, Warmog's, Banshee's, Luden's
      runes: {
        primary: ["8229", "8224", "8233", "8237"], // Nimbus Cloak, Manaflow Band, Waterwalking, Gathering Storm
        secondary: ["8126", "8138"], // Eyeball Collection, Ravenous Hunter
      },
    },
  },
};
