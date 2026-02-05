// Color Palette Generator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const baseColorInput = document.getElementById('base-color');
    const schemeSelect = document.getElementById('scheme');
    const generateRandomBtn = document.getElementById('generate-random');
    const exportBtn = document.getElementById('export');
    const paletteDiv = document.getElementById('palette');

    let lockedColors = [false, false, false, false, false]; // Track locked colors

    // Generate palette based on base color and scheme
    function generatePalette(baseColor, scheme) {
        const hsl = hexToHsl(baseColor);
        let colors = [];

        switch (scheme) {
            case 'complementary':
                colors = [
                    hslToHex(hsl),
                    hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
                    hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(0, hsl.l - 0.2) }),
                    hslToHex({ h: hsl.h, s: hsl.s, l: Math.min(1, hsl.l + 0.2) }),
                    hslToHex({ h: (hsl.h + 180) % 360, s: Math.max(0, hsl.s - 0.2), l: hsl.l })
                ];
                break;
            case 'analogous':
                colors = [
                    hslToHex({ h: (hsl.h - 30) % 360, s: hsl.s, l: hsl.l }),
                    hslToHex({ h: (hsl.h - 15) % 360, s: hsl.s, l: hsl.l }),
                    hslToHex(hsl),
                    hslToHex({ h: (hsl.h + 15) % 360, s: hsl.s, l: hsl.l }),
                    hslToHex({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l })
                ];
                break;
            case 'monochromatic':
                colors = [
                    hslToHex({ h: hsl.h, s: hsl.s, l: 0.9 }),
                    hslToHex({ h: hsl.h, s: hsl.s, l: 0.7 }),
                    hslToHex(hsl),
                    hslToHex({ h: hsl.h, s: hsl.s, l: 0.3 }),
                    hslToHex({ h: hsl.h, s: hsl.s, l: 0.1 })
                ];
                break;
        }

        return colors;
    }

    // Update the palette display
    function updatePalette() {
        const baseColor = baseColorInput.value;
        const scheme = schemeSelect.value;
        const colors = generatePalette(baseColor, scheme);

        paletteDiv.innerHTML = '';
        colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'swatch';
            swatch.style.backgroundColor = color;
            swatch.textContent = color.toUpperCase();
            if (lockedColors[index]) {
                swatch.classList.add('locked');
            }
            swatch.addEventListener('click', () => {
                lockedColors[index] = !lockedColors[index];
                swatch.classList.toggle('locked');
            });
            paletteDiv.appendChild(swatch);
        });
    }

    // Generate random palette
    function generateRandomPalette() {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        baseColorInput.value = randomColor;
        updatePalette();
    }

    // Export hex codes
    function exportHexCodes() {
        const colors = Array.from(paletteDiv.children).map(swatch => swatch.textContent);
        const hexCodes = colors.join(', ');
        navigator.clipboard.writeText(hexCodes).then(() => {
            alert('Hex codes copied to clipboard: ' + hexCodes);
        });
    }

    // Utility functions for color conversion
    function hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s, l: l };
    }

    function hslToHex(hsl) {
        const h = hsl.h / 360;
        const s = hsl.s;
        const l = hsl.l;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = c => Math.round(c * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Event listeners
    baseColorInput.addEventListener('input', updatePalette);
    schemeSelect.addEventListener('change', updatePalette);
    generateRandomBtn.addEventListener('click', generateRandomPalette);
    exportBtn.addEventListener('click', exportHexCodes);

    // Initial palette generation
    updatePalette();
});
