export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);
}

export function hyphenToCamelCase(inputString: string): string {
  return inputString
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

export function hyphenToCapital(inputString: string): string {
  return inputString
    .split('-')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}
export function hyphenToSnakeCase(inputString: string): string {
  return inputString.replace(/-/g, '_');
}
