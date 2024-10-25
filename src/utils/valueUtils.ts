export const getValueType = (value: any): string => {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[\+\-]\d{2}:\d{2})$/;

  if (value === null) return 'null';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (iso8601Regex.test(value)) return 'date';
  if (typeof value === 'object') return 'object';
  return 'string';
};

export const parseValue = (value: string, type: string): any => {
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value.toLowerCase() === 'true';
    case 'null':
      return null;
    case 'array':
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    case 'object':
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    case 'date':
      return value;
    default:
      return value;
  }
};

export const convertValue = (value: any, fromType: string, toType: string): any => {
  if (fromType === toType) return value;

  if (toType === 'date') {
    return new Date(value).toISOString();
  }

  if (fromType === 'date') {
    if (toType === 'string') return String(value);
    if (toType === 'number') return new Date(value).getTime();
  }

  if (toType === 'array') {
    return [value];
  }

  if (toType === 'object') {
    if (fromType === 'array') {
      return Object.fromEntries(value.map((v: any, i: number) => [i, v]));
    }
    return { value };
  }

  if (fromType === 'array' && value.length > 0) {
    return parseValue(String(value[0]), toType);
  }

  if (fromType === 'object') {
    const firstValue = Object.values(value)[0];
    return parseValue(String(firstValue), toType);
  }

  return parseValue(String(value), toType);
};

export const formatEditValue = (value: any, type: string): string => {
  if (type === 'array' || type === 'object') {
    return JSON.stringify(value, null, 2);
  }
  if (type === 'date') {
    return value;
  }
  return String(value);
};

export const formatValue = (value: any, type: string): string => {
  switch (type) {
    case 'string':
      return `"${value}"`;
    case 'null':
      return 'null';
    case 'array':
      return JSON.stringify(value, null, 2);
    case 'object':
      return JSON.stringify(value, null, 2);
    case 'date':
      return value;
    default:
      return String(value);
  }
};