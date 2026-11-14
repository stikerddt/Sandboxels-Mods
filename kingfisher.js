elements.kingfisher = {
    color: ["#1e90ff", "#00bfff", "#ff8c00"],
    behavior: [
        "XX|M1|XX",
        "M1|FX%5|M1",
        "XX|M1|XX",
    ],
    reactions: {
        "fish": { elem2: null, chance: 0.4, func: behaviors.FEEDPIXEL },
        "tadpole": { elem2: null, chance: 0.4, func: behaviors.FEEDPIXEL },
        "worm": { elem2: null, chance: 0.3, func: behaviors.FEEDPIXEL },
        "fly": { elem2: null, chance: 0.3, func: behaviors.FEEDPIXEL }
    },
    foodNeed: 10,
    baby: "bird",
    category: "life",
    state: "solid",
    density: 500,
    tempHigh: 120,
    stateHigh: "cooked_meat",
    breakInto: "feather"
};
