// 1. สร้างธาตุนกกระเต็น (Kingfisher)
elements.kingfisher = {
    color: ["#1e90ff", "#00bfff", "#ff8c00"],
    behavior: [
        "XX|M1|XX",
        "M1|FX%5|M1",
        "XX|M1 AND SW:water,salt_water,dirty_water,pool_water|XX",
    ],
    reactions: {
        "fish": { elem2: null, chance: 0.5, func: behaviors.FEEDPIXEL },
        "tadpole": { elem2: null, chance: 0.5, func: behaviors.FEEDPIXEL },
        "slug": { elem2: null, chance: 0.3, func: behaviors.FEEDPIXEL },
        "worm": { elem2: null, chance: 0.4, func: behaviors.FEEDPIXEL },
        "fly": { elem2: null, chance: 0.4, func: behaviors.FEEDPIXEL },
        "water": { elem2: "foam", chance: 0.05 }
    },
    foodNeed: 10,
    baby: "kingfisher_egg",
    category: "life",
    state: "solid",
    density: 1100,
    tempHigh: 120,
    stateHigh: "cooked_meat",
    breakInto: "feather"
};

// 2. สร้างธาตุไข่นกกระเต็น (Kingfisher Egg)
elements.kingfisher_egg = {
    color: ["#f0f8ff", "#e0ffff", "#ffffff"],
    behavior: behaviors.STURDYPOWDER,
    tick: function(pixel) {
        if (Math.random() < 0.005) {
            changePixel(pixel, "kingfisher");
        }
    },
    category: "life",
    state: "solid",
    density: 1050,
    tempHigh: 70,
    stateHigh: "cooked_meat",
    breakInto: "yolk",
    hidden: true
};
