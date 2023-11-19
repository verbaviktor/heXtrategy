// Function to generate controlled Perlin noise
export function generateControlledNoise(seed, size) {
    Math.seedrandom(seed);
    var matrix = []
    for (let y = 0; y < size; y++) {
        var row = []
        for (let x = 0; x < size; x++) {
            const value = Math.random();
            row.push(value)   
        }
        matrix.push(row)
    }
    return matrix
}

// DJB2 Hash Function
function stringToSeed(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure the result is a non-negative integer
}