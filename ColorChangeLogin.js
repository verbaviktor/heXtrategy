var picker  = document.getElementById("colorpicker");
var button = document.querySelector("#startButton")

function Colorchange(){
    document.getElementById("Hexlogo").style.color = picker.value
    const backgroundColorObjects = document.querySelectorAll('.background')
    for (const object of backgroundColorObjects) {
        const backgroundClassIndex = findClassIndex(object.classList, 'background')
        const brightness = parseFloat(object.classList[backgroundClassIndex + 1]) / 100;
        const rgb = hexToRgb(picker.value)
        let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        hsl.l = brightness
        hsl.s = 0.2
        const modifiedRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
        object.style.backgroundColor = rgbToHex(modifiedRgb.r, modifiedRgb.g, modifiedRgb.b)
    }
    const colorObjects = document.querySelectorAll('.color')
    for (const object of colorObjects) {
        const colorClassIndex = findClassIndex(object.classList, 'color')
        const brightness = parseFloat(object.classList[colorClassIndex + 1]) / 100;
        const rgb = hexToRgb(picker.value)
        let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        hsl.l = brightness
        const modifiedRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
        object.style.color = rgbToHex(modifiedRgb.r, modifiedRgb.g, modifiedRgb.b)
    }
}

function hexToRgb(hex) {
    // Remove the hash sign if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values for red, green, and blue
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function rgbToHex(r, g, b) {
    // Convert individual RGB components to hex and concatenate
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function rgbToHsl(r, g, b) {
    // Normalize values to the range [0, 1]
    const normR = r / 255;
    const normG = g / 255;
    const normB = b / 255;

    // Find the maximum and minimum values
    const max = Math.max(normR, normG, normB);
    const min = Math.min(normR, normG, normB);

    // Calculate lightness
    const lightness = (max + min) / 2;

    // If the color is grayscale, set saturation to 0
    if (max === min) {
        return { h: 0, s: 0, l: lightness };
    }

    // Calculate saturation
    const d = max - min;
    const saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Calculate hue
    let hue;
    switch (max) {
        case normR:
            hue = (normG - normB) / d + (normG < normB ? 6 : 0);
            break;
        case normG:
            hue = (normB - normR) / d + 2;
            break;
        case normB:
            hue = (normR - normG) / d + 4;
            break;
    }

    hue /= 6;

    return { h: hue, s: saturation, l: lightness };
}

function hslToRgb(h, s, l) {
    // Helper function to convert hue to RGB
    function hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    let r, g, b;

    if (s === 0) {
        // Achromatic (gray)
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    // Convert to integer values in the range [0, 255]
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function findClassIndex(classes, searchClass) {
    for (let i = 0; i < classes.length; i++) {
        if (classes[i] == searchClass) {
            return i
        }
        
    }
}