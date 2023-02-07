/**
 * Takes array of AWS actions and finds common prefixes and suffixes among them
 * => [ formatted prefixes and suffixes ]
 */

export const findRepeatedWords = (arr, repetitionsNeeded = 3) => {
  const splitOnUppercase = (string) => string.match(/[A-Z][a-z]+/g);

  let prefixes = {};
  let suffixes = {};

  arr.forEach((str) => {
    const words = splitOnUppercase(str);
    const firstWord = words[0];
    const lastWord = words[words.length - 1];

    firstWord in prefixes ? prefixes[firstWord]++ : (prefixes[firstWord] = 1);
    lastWord in suffixes ? suffixes[lastWord]++ : (suffixes[lastWord] = 1);
  });

  const getRepetitions = (obj) => {
    let repeatedStrings = [];

    for (let key in obj) {
      if (obj[key] >= repetitionsNeeded) repeatedStrings.push(key);
    }

    return repeatedStrings;
  };

  const repeatedPrefixes = getRepetitions(prefixes);
  const repeatedSuffixes = getRepetitions(suffixes);

  const formattedPrefixes = repeatedPrefixes.map((string) => string + "*");
  const formattedSuffixes = repeatedSuffixes.map((string) => "*" + string);

  return [...formattedPrefixes, ...formattedSuffixes];
};
