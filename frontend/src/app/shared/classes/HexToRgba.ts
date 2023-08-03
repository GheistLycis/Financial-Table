export default class HexToRgba {
    static convert(hex: string, opacity?: number): string {
        const hashlessHex = hex[0] == '#' ? hex.slice(1) : hex
        const hexObject = parseHex(hashlessHex)
        const decimalObject = hexesToDecimals(hexObject)

        return formatRgb(decimalObject, opacity)
    }
}

type hexObj<T = string | number> = {
    r: T
    g: T
    b: T
    a: T
}

function parseHex(nakedHex: string): hexObj<string> {
    const isShort = nakedHex.length == 3 || nakedHex.length == 4
    const twoDigitHexR = isShort ? ''.concat(nakedHex.slice(0, 1)).concat(nakedHex.slice(0, 1)) : nakedHex.slice(0, 2)
    const twoDigitHexG = isShort ? ''.concat(nakedHex.slice(1, 2)).concat(nakedHex.slice(1, 2)) : nakedHex.slice(2, 4)
    const twoDigitHexB = isShort ? ''.concat(nakedHex.slice(2, 3)).concat(nakedHex.slice(2, 3)) : nakedHex.slice(4, 6)
    const twoDigitHexA = (isShort ? ''.concat(nakedHex.slice(3, 4)).concat(nakedHex.slice(3, 4)) : nakedHex.slice(6, 8)) || 'ff'

    return {
        r: twoDigitHexR,
        g: twoDigitHexG,
        b: twoDigitHexB,
        a: twoDigitHexA
    }
}

function hexesToDecimals(hex: hexObj<string>): hexObj<number> {
    const { r, g, b, a } = hex

    return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16),
        a: +(parseInt(a, 16) / 255).toFixed(2)
    }
}

function formatRgb(decimalObject: hexObj<number>, alpha?: any): string {
    let { r, g, b, a } = decimalObject

    if(!isNaN(parseFloat(alpha)) && isFinite(alpha)) a = alpha

    return `rgba(${r}, ${g}, ${b}, ${a})`
}