type configType = {
  id: number;
  title: string;
  desc: string;
  date: string;
  stack: string[];
  src: string;
};

type nextConfigType = {
  nextTitle: string;
  nextSrc: string;
};

type cardType = configType & {
  isLast: boolean;
};
