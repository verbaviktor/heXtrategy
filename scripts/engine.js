export function hexToRgb(hex) {
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

export function darkenColor(hex, factor) {
    const { r, g, b } = hexToRgb(hex);
    
    // Multiply each component by the factor
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    
    // Convert back to hex
    return rgbToHex(newR, newG, newB);
}

export function lerpNumber(a, b, t) {
    return a + (b - a) * t
}

export function lerpVector(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}