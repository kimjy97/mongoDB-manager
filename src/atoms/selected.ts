import { atom } from "recoil";

export const currentCollectionState = atom<any>({
  key: 'currentCollectionState',
  default: undefined,
});
