// White-throated Kingfisher 3x3 Mod for Sandboxels

elements.kingfisher_egg = {
    color: ["#f5f5f0", "#eae8e1"],
    behavior: behaviors.POWDER,
    category: "life",
    state: "solid",
    density: 1100,
    tempHigh: 70,
    stateHigh: "cooked_meat",
    breakInto: "yolk",
    tick: function(pixel) {
        if (!pixel.hatchTimer) pixel.hatchTimer = 0;
        if (pixel.temp >= 20 && pixel.temp <= 42) {
            pixel.hatchTimer++;
        }
        if (pixel.hatchTimer > 300 && Math.random() < 0.05) {
            if (isEmpty(pixel.x, pixel.y - 1) && isEmpty(pixel.x, pixel.y - 2) && isEmpty(pixel.x - 1, pixel.y - 1) && isEmpty(pixel.x + 1, pixel.y - 1)) {
                changePixel(pixel, "white_throated_kingfisher");
            }
        }
    }
};

elements.kingfisher_part = {
    color: ["#00a8cc", "#8b3a2b", "#ffffff", "#d9381e"],
    behavior: behaviors.WALL,
    category: "life",
    state: "solid",
    hidden: true,
    noMix: true,
    tempHigh: 120,
    stateHigh: "cooked_meat",
    breakInto: ["meat", "feather"],
    tick: function(pixel) {
        if (!pixel.core || pixel.core.del || pixel.core.element !== "white_throated_kingfisher") {
            deletePixel(pixel.x, pixel.y);
        }
    }
};

function buildKingfisherBody(pixel) {
    if (pixel.parts) {
        for (let i = 0; i < pixel.parts.length; i++) {
            let p = pixel.parts[i];
            if (p && !p.del && p.element === "kingfisher_part") {
                deletePixel(p.x, p.y);
            }
        }
    }
    pixel.parts = [];

    const d = pixel.dir || 1;
    const structure = [
        { dx: 0,  dy: -1, color: "#8b3a2b" },
        { dx: d,  dy: -1, color: "#d9381e" },
        { dx: -d, dy: -1, color: "#0099cc" },
        { dx: -d, dy: 0,  color: "#00bfff" },
        { dx: d,  dy: 0,  color: "#ffffff" },
        { dx: -d, dy: 1,  color: "#007799" },
        { dx: 0,  dy: 1,  color: "#7a3022" },
        { dx: d,  dy: 1,  color: "#5c2418" }
    ];

    for (let i = 0; i < structure.length; i++) {
        let s = structure[i];
        let nx = pixel.x + s.dx;
        let ny = pixel.y + s.dy;
        if (!outOfBounds(nx, ny)) {
            let target = pixelMap[nx][ny];
            if (!target || target.element === "water" || target.element === "salt_water") {
                if (target) deletePixel(nx, ny);
                createPixel("kingfisher_part", nx, ny);
                let partPixel = pixelMap[nx][ny];
                if (partPixel) {
                    partPixel.color = s.color;
                    partPixel.core = pixel;
                    pixel.parts.push(partPixel);
                }
            }
        }
    }
}

function canKingfisherMoveTo(pixel, nx, ny, allowWater) {
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            let cx = nx + dx;
            let cy = ny + dy;
            if (outOfBounds(cx, cy)) return false;
            let p = pixelMap[cx][cy];
            if (p) {
                if (p === pixel || p.element === "kingfisher_part" || p.element === "white_throated_kingfisher") continue;
                if (p.element === "fish" || p.element === "tadpole") continue;
                if (allowWater && (p.element === "water" || p.element === "salt_water")) continue;
                return false;
            }
        }
    }
    return true;
}

function scanKingfisherFish(pixel) {
    for (let scanY = pixel.y + 2; scanY < pixel.y + 35; scanY++) {
        for (let scanX = pixel.x - 8; scanX <= pixel.x + 8; scanX++) {
            if (!outOfBounds(scanX, scanY) && pixelMap[scanX][scanY]) {
                let target = pixelMap[scanX][scanY].element;
                if (target === "fish" || target === "tadpole") {
                    return { x: scanX, y: scanY };
                }
            }
        }
    }
    return null;
}

elements.white_throated_kingfisher = {
    color: "#ffffff",
    behavior: behaviors.WALL,
    category: "life",
    state: "solid",
    density: 900,
    tempHigh: 120,
    stateHigh: "cooked_meat",
    breakInto: ["meat", "feather"],
    egg: "kingfisher_egg",
    
    tick: function(pixel) {
        if (!pixel.initialized) {
            pixel.initialized = true;
            pixel.dir = Math.random() < 0.5 ? 1 : -1;
            pixel.stateMode = "fly";
            pixel.hunger = 0;
            pixel.eggCooldown = 0;
            pixel.parts = [];
            buildKingfisherBody(pixel);
            return;
        }

        pixel.hunger++;
        if (pixel.eggCooldown > 0) pixel.eggCooldown--;

        let targetX = pixel.x;
        let targetY = pixel.y;
        let allowWater = false;

        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                let cx = pixel.x + dx;
                let cy = pixel.y + dy;
                if (!outOfBounds(cx, cy) && pixelMap[cx][cy]) {
                    let el = pixelMap[cx][cy].element;
                    if (el === "fish" || el === "tadpole") {
                        deletePixel(cx, cy);
                        pixel.hunger = 0;
                        pixel.stateMode = "return";
                        if (pixel.eggCooldown === 0 && Math.random() < 0.35) {
                            pixel.eggCooldown = 400;
                            if (!outOfBounds(pixel.x, pixel.y + 2) && isEmpty(pixel.x, pixel.y + 2)) {
                                createPixel("kingfisher_egg", pixel.x, pixel.y + 2);
                            }
                        }
                    }
                }
            }
        }

        let inWater = false;
        if (!outOfBounds(pixel.x, pixel.y - 1) && pixelMap[pixel.x][pixel.y - 1] && (pixelMap[pixel.x][pixel.y - 1].element === "water" || pixelMap[pixel.x][pixel.y - 1].element === "salt_water")) {
            inWater = true;
        }

        if (pixel.stateMode === "fly") {
            if (pixel.hunger > 80) {
                let fishPos = scanKingfisherFish(pixel);
                if (fishPos) {
                    pixel.stateMode = "dive";
                    pixel.targetFish = fishPos;
                }
            }

            if (Math.random() < 0.05) pixel.dir *= -1;
            targetX += pixel.dir;
            if (Math.random() < 0.4) {
                targetY += (Math.random() < 0.5 ? -1 : 1);
            }
        } 
        else if (pixel.stateMode === "dive") {
            allowWater = true;
            if (pixel.targetFish) {
                if (pixel.x < pixel.targetFish.x) { targetX += 1; pixel.dir = 1; }
                else if (pixel.x > pixel.targetFish.x) { targetX -= 1; pixel.dir = -1; }
                targetY += 2;

                if (pixel.y >= pixel.targetFish.y + 2 || pixel.y >= height - 4) {
                    pixel.stateMode = "return";
                }
            } else {
                pixel.stateMode = "return";
            }
        } 
        else if (pixel.stateMode === "return") {
            allowWater = true;
            targetY -= 2;
            targetX += pixel.dir;
            if (!inWater && isEmpty(pixel.x, pixel.y - 2)) {
                pixel.stateMode = "fly";
                pixel.targetFish = null;
            }
        }

        if (targetX !== pixel.x || targetY !== pixel.y) {
            if (canKingfisherMoveTo(pixel, targetX, targetY, allowWater)) {
                if (pixel.parts) {
                    for (let i = 0; i < pixel.parts.length; i++) {
                        let p = pixel.parts[i];
                        if (p && !p.del && p.element === "kingfisher_part") deletePixel(p.x, p.y);
                    }
                }
                if (!isEmpty(targetX, targetY) && (pixelMap[targetX][targetY].element === "water" || pixelMap[targetX][targetY].element === "salt_water")) {
                    deletePixel(targetX, targetY);
                }
                movePixel(pixel, targetX, targetY);
            } else {
                pixel.dir *= -1;
                if (pixel.stateMode === "dive") pixel.stateMode = "return";
            }
        }

        buildKingfisherBody(pixel);
    }
};
