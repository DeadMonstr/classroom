export default function brightnessColor(color,colorText1 = "white",colorText2 = "black") {

    function hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    const colorrgb = hexToRgb(color);


    const brightness = Math.round(((parseInt(colorrgb.r) * 299) +
        (parseInt(colorrgb.g) * 587) +
        (parseInt(colorrgb.b) * 114)) / 1000);





    return brightness > 125 ? colorText2 : colorText1
}