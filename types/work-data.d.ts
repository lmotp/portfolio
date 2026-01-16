type configType = {
  id: number;
  title: string;
  src: string;
  stack: string[];
  data: {
    desc: string;
    date: string;
    link: string;
    content: { img: string; caption: string }[];
  }[];
};

type nextConfigType = {
  nextTitle: string;
  nextSrc: string;
};

type cardType = configType & {
  isLast: boolean;
};
