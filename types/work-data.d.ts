type configType = {
  id: number;
  title: string;
  desc: string;
  date: string;
  stack: string[];
  src: string;
  type: string;
};

type nextConfigType = {
  nextTitle: string;
  nextSrc: string;
  nextType: string;
};

type cardType = configType & {
  isLast: boolean;
};
