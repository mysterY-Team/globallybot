function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return { r, g, b }
}

function rgbToHex(rgb) {
    const { r, g, b } = rgb
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

function interpolateColors(color1, color2, factor) {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    const result = {
        r: Math.round(rgb1.r + factor * (rgb2.r - rgb1.r)),
        g: Math.round(rgb1.g + factor * (rgb2.g - rgb1.g)),
        b: Math.round(rgb1.b + factor * (rgb2.b - rgb1.b)),
    }
    return rgbToHex(result)
}

export function generateGradientText(colors, text) {
    const gradient = []
    const colorCount = colors.length
    const textLength = text.length
    for (let i = 0; i < textLength; i++) {
        const char = text.charAt(i)
        const colorIndex = Math.floor((i / (textLength - 1)) * (colorCount - 1))
        const color1 = colors[colorIndex]
        const color2 = colors[colorIndex + 1] || color1
        const factor = (i / (textLength - 1)) * (colorCount - 1) - colorIndex
        const color = interpolateColors(color1, color2, factor)
        gradient.push({ text: char, color: color })
    }
    return gradient
}