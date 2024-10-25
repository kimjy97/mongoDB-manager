import { atom } from "recoil";

export const isCopyModalOpenState = atom<boolean>({
  key: 'isCopyModalOpenState',
  default: false,
});

export const isDeleteConfirmModalOpenState = atom<boolean>({
  key: 'isDeleteConfirmModalOpenState',
  default: false,
});

export const isAddDocumentModalOpenState = atom<boolean>({
  key: 'isAddDocumentModalOpenState',
  default: false,
});

export const isDeleteCollectionModalOpenState = atom<boolean>({
  key: 'isDeleteCollectionModalOpenState',
  default: false,
});

export const isCreateCollectionModalOpenState = atom<boolean>({
  key: 'isCreacteCollectionModalOpenState',
  default: false,
});
