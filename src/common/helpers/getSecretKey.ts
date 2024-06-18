export const getSecretKey = (description: string) => {
  const regex = /CUSTOMER\s+(\S+)/;
  const match = description.match(regex);

  // Extract the key if it matches the pattern
  if (match && match[1]) {
    const key = match[1];
    return key.slice(3);
  }
  return '';
};
