const CHARS = ['א', 'ב', 'ג', 'ד', 'ה', 'פ', 'ג', 'ח', 'י', 'י', 'ק', 'ל', 'מ', 'נ', 'ו', 'א', 'פ', 'ק', 'ר', 'ס', 'ט', 'ו', 'ו', 'x', 'י', 'ז']; // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const generateLetter = () => {
  return CHARS[Math.round(Math.random() * CHARS.length)];
}

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const generateWord = (max = 50, firstLatterAsCap = false) => {
  const length = 5 + Math.floor(Math.random() * max), result = [];
  while (result.length < length) {
    result.push(generateLetter());
  }
  if (firstLatterAsCap && result.length) {
    result[0] = result[0]?.toUpperCase();
  }
  return `${result.join('')}`;
};

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const generateText = () => {
  const length = 1 + Math.floor(Math.random() * 20), result = [];
  while (result.length < length) {
    result.push(generateWord());
  }
  let firstWord = '';
  for (let i = 0, l = result[0].length; i < l; i++) {
    const letter = result[0].charAt(i);
    firstWord += i === 0 ? letter.toUpperCase() : letter;
  }
  result[0] = firstWord;
  return `${result.join(' ')}.`;
};