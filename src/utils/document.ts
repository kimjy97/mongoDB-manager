import { IDocument, IRow } from "@/atoms/document";

export const getFormattingDocument = (doc: IDocument) => {
  const newArr = doc.map((i: IRow) => { return { [i.key]: i.value } })
  const combinedObject = newArr.reduce((acc: any, obj: any) => {
    return { ...acc, ...obj };
  }, {});

  return combinedObject;
}

export const convertDates = (obj: any): any => {
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      if (obj[key] instanceof Date) {
        continue;
      } else if (obj[key].$date) {
        obj[key] = new Date(obj[key].$date);
      } else if (typeof obj[key].toDate === 'function') {
        obj[key] = obj[key].toDate();
      } else {
        convertDates(obj[key]);
      }
    } else if (typeof obj[key] === 'string') {
      const date = new Date(obj[key]);
      if (!isNaN(date.getTime())) {
        obj[key] = date;
      }
    }
  }
  return obj;
}

export const objectToArray = (obj: { [key: string]: any }): { key: string; value: any }[] => {
  return reorderArray(Object.entries(obj).map(([key, value]) => ({ key, value })));
}

export const reorderArray = (arr: any) => {
  const startsWithUnderscore = arr.filter((item: any) => item['key'][0] === '_');
  const others = arr.filter((item: any) => !(item['key'][0] === '_'));

  return [...others, ...startsWithUnderscore];
}

export const preprocessQuery = (input: string) => {
  let processed = input.replace(/'/g, '"');

  processed = processed.replace(/(\w+):/g, '"$1":');

  if (!processed.trim().startsWith('{')) {
    processed = `{${processed}}`;
  }
  if (!processed.trim().endsWith('}')) {
    processed = `${processed}}`;
  }

  return processed;
};