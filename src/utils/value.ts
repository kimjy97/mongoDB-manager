export const validateInput = (value: string, type: string): boolean => {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[\+\-]\d{2}:\d{2})$/;

  switch (type) {
    case 'number':
      return !isNaN(Number(value));
    case 'boolean':
      return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
    case 'null':
      return value.toLowerCase() === 'null';
    case 'array':
    case 'object':
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    case 'date':
      return iso8601Regex.test(value);
    default:
      return true;
  }
};

export const getChangedKeyObject = (newKey: string, oldKey: string, value: any) => {
  const current = { ...value };
  const newObject = Object.keys(current).reduce((acc: any, k: any) => {
    if (k === oldKey) {
      acc[newKey] = current[k];
    } else {
      acc[k] = current[k];
    }
    return acc;
  }, {});

  return newObject;
}