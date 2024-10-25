import { atom } from "recoil";

export const apiKeyState = atom<string | undefined>({
  key: 'apiKeyState',
  default: undefined,
});