import localFont from "next/font/local";

export const AvantGarde = localFont({
  src: [{
    path: "./AvantGarde/AvantGarde_bk.woff2",
    weight: '500',
    style: 'normal',
  },
  {
    path: "./AvantGarde/AvantGarde_md.woff2",
    weight: '700',
    style: 'normal',
  },
  {
    path: "./AvantGarde/AvantGarde_demi.woff2",
    weight: '800',
    style: 'normal',
  },
  {
    path: "./AvantGarde/AvantGarde_bold.woff2",
    weight: '900',
    style: 'normal',
  },
  ]
});

export const Myriad = localFont({
  src: [{
    path: "./Myriad/MyriadPro-Light.otf",
    weight: '300',
    style: 'normal',
  },
  {
    path: "./Myriad/MyriadPro-Regular.otf",
    weight: '500',
    style: 'normal',
  },
  {
    path: "./Myriad/MyriadPro-Bold.otf",
    weight: '700',
    style: 'normal',
  },
  {
    path: "./Myriad/MyriadPro-Black.otf",
    weight: '900',
    style: 'normal',
  },
  ]
});

export const Pretendard = localFont({ src: './Pretendard/PretendardVariable.woff2', display: 'swap', weight: "45 920" })
