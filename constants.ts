import { MovieResource } from './types';

export const GENRE_OPTIONS = [
  '剧情', '科幻', '动作', '喜剧', '家庭', '恐怖', 
  '纪录', '动画', '综艺', '学习', '悬疑', '犯罪', 
  '奇幻', '冒险', '爱情', '惊悚'
];

export const COUNTRY_OPTIONS = [
  '美国', '英国', '法国', '中国', '挪威', 
  '日本', '韩国', '德国', '意大利', '西班牙', 
  '印度', '加拿大', '澳大利亚', '俄罗斯', '其他'
];

export const INITIAL_RESOURCES: MovieResource[] = [
  {
    id: 'M001',
    title: 'Blade Runner 2049',
    year: 2017,
    director: 'Denis Villeneuve',
    genre: ['科幻', '新黑色电影'],
    synopsis: '一名年轻的银翼杀手发现了埋藏已久的秘密，这使他开始寻找失踪三十年的前银翼杀手瑞克·戴克。',
    posterUrl: 'https://picsum.photos/400/600?random=1',
    styleKeywords: ['氛围感', '赛博朋克', '存在主义'],
    systemNotes: '受试者表现出极度解离。环境毒性极高。',
    link: 'https://drive.google.com/drive'
  },
  {
    id: 'M002',
    title: 'Arrival',
    year: 2016,
    director: 'Denis Villeneuve',
    genre: ['科幻', '剧情'],
    synopsis: '十二艘神秘的宇宙飞船降临地球，一名语言学家与军方合作，试图与外星生命进行沟通。',
    posterUrl: 'https://picsum.photos/400/600?random=2',
    styleKeywords: ['极简主义', '烧脑', '低饱和度'],
    systemNotes: '检测到语言异常。时间扭曲已确认。',
    link: 'https://drive.google.com/drive'
  },
  {
    id: 'M003',
    title: 'Ex Machina',
    year: 2014,
    director: 'Alex Garland',
    genre: ['科幻', '惊悚'],
    synopsis: '一名年轻的程序员被选中参加一项突破性的实验，通过评估一个高度先进的人形AI的人性特质来进行图灵测试。',
    posterUrl: 'https://picsum.photos/400/600?random=3',
    styleKeywords: ['无菌感', '幽闭恐惧', '几何美学'],
    systemNotes: '图灵测试进行中。收容失效概率极高。',
    link: 'https://drive.google.com/drive'
  },
  {
    id: 'M004',
    title: 'The Matrix',
    year: 1999,
    director: 'The Wachowskis',
    genre: ['动作', '科幻'],
    synopsis: '一名黑客从神秘的反抗军那里得知了他所处现实的真相，以及他在对抗控制者战争中的角色。',
    posterUrl: 'https://picsum.photos/400/600?random=4',
    styleKeywords: ['绿色调', '工业风', '数字雨'],
    systemNotes: '现实模拟失败。识别到异常个体：尼奥。',
    link: 'https://drive.google.com/drive'
  },
  {
    id: 'M005',
    title: 'Her',
    year: 2013,
    director: 'Spike Jonze',
    genre: ['爱情', '科幻'],
    synopsis: '在不久的将来，一位孤独的作家与一个旨在满足他所有需求的操作系统建立了一段不同寻常的关系。',
    posterUrl: 'https://picsum.photos/400/600?random=5',
    styleKeywords: ['暖色调', '柔焦', '忧郁'],
    systemNotes: '观察到对合成智能的情感依赖。威胁等级低。',
    link: 'https://drive.google.com/drive'
  },
  {
    id: 'M006',
    title: 'Dark City',
    year: 1998,
    director: 'Alex Proyas',
    genre: ['科幻', '悬疑'],
    synopsis: '在一个没有阳光的噩梦般的世界里，一个男人努力拼凑过去的记忆，包括他无法记起的妻子。',
    posterUrl: 'https://picsum.photos/400/600?random=6',
    styleKeywords: ['黑色电影', '表现主义', '哥特'],
    systemNotes: '昼夜节律中断。检测到记忆伪造。',
    link: 'https://drive.google.com/drive'
  },
  {
    id: 'M007',
    title: 'Stalker',
    year: 1979,
    director: 'Andrei Tarkovsky',
    genre: ['科幻', '剧情'],
    synopsis: '一名向导带领两个男人穿越被称为“区”的地带，寻找一个能实现愿望的房间。',
    posterUrl: 'https://picsum.photos/400/600?random=7',
    styleKeywords: ['琥珀色', '衰败', '哲学'],
    systemNotes: '未经授权进入禁区。心理创伤迫在眉睫。',
    link: 'https://drive.google.com/drive'
  },
  {
    id: 'M008',
    title: 'Solaris',
    year: 1972,
    director: 'Andrei Tarkovsky',
    genre: ['科幻', '悬疑'],
    synopsis: '一名心理学家被派往一个围绕遥远星球运行的空间站，以查明导致船员发疯的原因。',
    posterUrl: 'https://picsum.photos/400/600?random=8',
    styleKeywords: ['致幻', '缓慢', '内省'],
    systemNotes: '检测到海洋智能生物。船员精神状态受损。',
    link: 'https://drive.google.com/drive'
  }
];