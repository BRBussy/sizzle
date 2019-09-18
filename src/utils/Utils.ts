export function HexToRGBA(hex: string, opacity: string) {
  let val = hex;
  if (val.startsWith('#')) {
    val = val.substring(1);
  }
  if (val.length > 6) {
    return 'rgba(255, 255, 255, 1)';
  } else if (val.length < 6) {
    const zero = [];
    for (let i = 0; i < 6 - val.length; i++) {
      zero.push('0');
    }
    val = val.concat(val, ...zero);
  }

  const red = parseInt(val.substr(0, 2), 16);
  const green = parseInt(val.substr(2, 2), 16);
  const blue = parseInt(val.substr(4, 2), 16);
  return 'rgba(' + red + ',' + green + ',' + blue + ',' + opacity + ')';
}
