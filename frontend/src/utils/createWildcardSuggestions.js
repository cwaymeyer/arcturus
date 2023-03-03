/**
 * Takes array of AWS actions and finds common prefixes and suffixes among them
 * => [ { name: <prefix/suffix>, count: <occurances> } ]
 */

export const createWildcardSuggestions = (
  arr,
  accessLevel,
  servicePrefix,
  repetitionsNeeded = 3
) => {
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

  const getRepetitions = (obj, type) => {
    let repeatedStrings = [];

    for (let key in obj) {
      if (obj[key] >= repetitionsNeeded)
        repeatedStrings.push({
          name: key,
          count: obj[key],
          accessLevel: accessLevel,
          type: type,
          servicePrefix: servicePrefix,
        });
    }

    return repeatedStrings;
  };

  const repeatedPrefixes = getRepetitions(prefixes, "prefix");
  const repeatedSuffixes = getRepetitions(suffixes, "suffix");

  const formattedPrefixes = repeatedPrefixes.map((prefix) => {
    return { ...prefix, name: prefix.name + "*" };
  });
  const formattedSuffixes = repeatedSuffixes.map((suffix) => {
    return { ...suffix, name: "*" + suffix.name };
  });

  const allWildcards = [...formattedPrefixes, ...formattedSuffixes];

  return allWildcards;
};
