import { atom } from "recoil";

export type IRow = { key: string; value: any, deleted?: boolean }
export type IDocument = IRow[];
export type IDocuments = IDocument[];

export const responseDocumentsState = atom<IDocuments>({
  key: 'responseDocumentsState',
  default: [],
});

export const originDocumentsState = atom<IDocuments>({
  key: 'originDocumentsState',
  default: [],
});

export const chekcedRowListState = atom<any>({
  key: 'chekcedRowListState',
  default: [],
});

export const copyDocumentFormState = atom<any>({
  key: 'copyDocumentState',
  default: undefined,
});

export const deleteDocumentFormState = atom<any>({
  key: 'deleteDocumentState',
  default: undefined,
});

export const refreshDocumentsState = atom<boolean>({
  key: 'refreshDocumentsState',
  default: false,
});

export const queryAppliedState = atom<boolean>({
  key: 'queryAppliedState',
  default: false,
});