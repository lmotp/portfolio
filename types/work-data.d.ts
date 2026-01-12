type configType = {
  id: number;
  title: string;
  desc: string;
  date: string;
  stack: string[];
  src: string;
  link: string;
  content: { img: string; caption: string }[];
};

type nextConfigType = {
  nextTitle: string;
  nextSrc: string;
};

type cardType = configType & {
  isLast: boolean;
};
