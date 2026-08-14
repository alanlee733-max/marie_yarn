/* =========================================================
   marie yarn — 사이트 설정 및 제품 데이터
   ---------------------------------------------------------
   ⚠️ 아래 브랜드/제품/가격/사업자정보는 전부 화면 확인용 샘플이다.
      실제 취급 브랜드와 스펙으로 교체해야 한다.

   구조는 docs/v1-plan.md 5장의 데이터 모델을 그대로 따른다.
   나중에 Next.js로 옮길 때 이 파일이 그대로 JSON이 된다.
   ========================================================= */

const SITE = {
  name: "marie yarn",
  nameKo: "마리얀",
  tagline: "유럽과 남미의 실을 직접 골라 들여옵니다",
  description:
    "marie yarn은 해외 뜨개실을 직접 수입해 국내에 유통합니다. 손으로 만져보고 떠본 실만 들여옵니다.",

  /* 네이버 스마트스토어 --------------------------------------------------
     제품별 URL은 각 제품의 naverProductUrl 에 넣는다.
     비어 있으면 아래 스토어 메인으로 폴백한다. */
  naverStoreUrl: "https://smartstore.naver.com/marieyarn",

  instagram: "https://instagram.com/",
  kakaoChannel: "https://pf.kakao.com/",
  email: "hello@marieyarn.kr",
  phone: "02-0000-0000",
  hours: "평일 10:00 – 17:00 (점심 12:00 – 13:00)",

  /* 전자상거래법 표시 항목 — 실제 값으로 교체 필요 */
  business: {
    company: "마리얀",
    ceo: "OOO",
    regNo: "000-00-00000",
    address: "서울특별시 OO구 OO로 00, 0층",
  },
};

/* ---------- 코드 → 한글 라벨 ---------- */

const WEIGHT_LABELS = {
  lace: "레이스",
  fingering: "핑거링",
  sport: "스포츠",
  dk: "DK",
  worsted: "워스티드",
  bulky: "벌키",
  jumbo: "점보",
};

/* 필터 정렬 순서 (가는 것 → 굵은 것) */
const WEIGHT_ORDER = ["lace", "fingering", "sport", "dk", "worsted", "bulky", "jumbo"];

const FAMILY_LABELS = {
  white: "화이트 · 아이보리",
  beige: "베이지 · 오트밀",
  brown: "브라운 · 카멜",
  gray: "그레이 · 차콜",
  black: "블랙",
  red: "레드 · 와인",
  pink: "핑크",
  orange: "오렌지 · 테라코타",
  yellow: "옐로우 · 머스터드",
  green: "그린 · 올리브",
  blue: "블루 · 네이비",
  purple: "퍼플 · 라벤더",
};

const STOCK_LABELS = {
  in_stock: "판매 중",
  incoming: "입고 예정",
  sold_out: "품절",
  discontinued: "단종",
};

/* ---------- 브랜드 ---------- */

const BRANDS = [
  {
    slug: "nordfil",
    name: "Nordfil",
    nameKo: "노르필",
    country: "노르웨이",
    story:
      "노르웨이 서부 해안의 소규모 방적소에서 시작한 브랜드입니다. 한랭지 양모 특유의 탄력을 살리기 위해 저온에서 천천히 방적하며, 염색은 지금도 소량 배치로만 진행합니다. 오래 입을 겉옷을 뜨는 실입니다.",
  },
  {
    slug: "casa-lana",
    name: "Casa Lana",
    nameKo: "카사 라나",
    country: "이탈리아",
    story:
      "비엘라 지역의 3대째 가족 방적소입니다. 이탈리아 방적 특유의 균일한 실 두께와 부드러운 마무리가 특징이며, 메리노와 캐시미어 블렌드에 강점이 있습니다. 피부에 직접 닿는 옷에 잘 맞습니다.",
  },
  {
    slug: "maison-fil",
    name: "Maison Fil",
    nameKo: "메종 필",
    country: "프랑스",
    story:
      "리옹 기반의 소규모 실 브랜드로, 색 배합을 가장 중요하게 다룹니다. 채도를 한 단계 낮춘 특유의 팔레트 덕분에 여러 색을 함께 떠도 잘 어울립니다. 모헤어와 코튼 라인이 대표적입니다.",
  },
  {
    slug: "alba-wool",
    name: "Alba Wool",
    nameKo: "알바 울",
    country: "페루",
    story:
      "페루 안데스 고산지대의 알파카 목장과 직접 거래하는 브랜드입니다. 사육 단계부터 섬유 굵기를 관리해 알파카 특유의 가려움을 크게 줄였습니다. 가볍고 따뜻한 실을 찾는다면 이 브랜드입니다.",
  },
];

/* ---------- 제품 ----------
   colorways 를 배열로 두는 것이 핵심이다.
   v2에서 장바구니를 붙일 때 이 배열이 그대로 SKU가 된다. */

const PRODUCTS = [
  {
    slug: "fjord-merino",
    name: "Fjord Merino",
    brandSlug: "nordfil",
    description:
      "노르필의 기본이 되는 메리노 100% 실입니다. 탄력이 좋아 조직이 또렷하게 살아나며, 케이블이나 아란 무늬를 뜰 때 특히 잘 어울립니다. 처음 노르필을 써본다면 이 실부터 권합니다.",
    fiber: [{ material: "메리노울", percent: 100 }],
    weightGram: 50,
    lengthMeter: 175,
    yarnWeight: "dk",
    gauge: "10 × 10cm = 22코 30단",
    needleSize: "4.0 – 4.5mm",
    hookSize: "4.0mm",
    careInstructions: "손세탁 · 30℃ 이하 · 뉘어서 건조 · 표백 금지",
    origin: "노르웨이",
    retailPrice: 9800,
    stock: "in_stock",
    releasedAt: "2026-03-02",
    featured: true,
    naverProductUrl: "",
    colorways: [
      { code: "FM-01", name: "스노우", hex: "#f2ede4", colorFamily: "white", stock: "in_stock" },
      { code: "FM-04", name: "오트밀", hex: "#ddceb6", colorFamily: "beige", stock: "in_stock" },
      { code: "FM-09", name: "포그 그레이", hex: "#a8a49d", colorFamily: "gray", stock: "in_stock" },
      { code: "FM-12", name: "딥 차콜", hex: "#4a4844", colorFamily: "gray", stock: "in_stock" },
      { code: "FM-21", name: "모스 그린", hex: "#7d8560", colorFamily: "green", stock: "in_stock" },
      { code: "FM-27", name: "피오르 블루", hex: "#5c7183", colorFamily: "blue", stock: "sold_out" },
      { code: "FM-33", name: "러스트", hex: "#a8613f", colorFamily: "orange", stock: "in_stock" },
      { code: "FM-38", name: "와인", hex: "#7a3a42", colorFamily: "red", stock: "in_stock" },
    ],
  },
  {
    slug: "frost-alpaca-silk",
    name: "Frost Alpaca Silk",
    brandSlug: "nordfil",
    description:
      "알파카에 실크를 섞어 광택을 더한 레이스 굵기 실입니다. 한 겹으로 뜨면 비치는 숄이, 다른 실과 합사하면 은은한 광택이 더해진 니트가 나옵니다. 합사용으로 특히 많이 찾습니다.",
    fiber: [
      { material: "베이비 알파카", percent: 70 },
      { material: "머시리즈드 실크", percent: 30 },
    ],
    weightGram: 25,
    lengthMeter: 210,
    yarnWeight: "lace",
    gauge: "10 × 10cm = 28코 36단 (3.0mm 기준)",
    needleSize: "2.5 – 3.5mm",
    hookSize: "2.5mm",
    careInstructions: "손세탁 · 찬물 · 비틀지 말고 눌러 물기 제거 · 뉘어서 건조",
    origin: "노르웨이",
    retailPrice: 13500,
    stock: "in_stock",
    releasedAt: "2026-04-18",
    featured: false,
    naverProductUrl: "",
    colorways: [
      { code: "FA-02", name: "아이보리", hex: "#efe7d9", colorFamily: "white", stock: "in_stock" },
      { code: "FA-07", name: "샌드", hex: "#cfbca2", colorFamily: "beige", stock: "in_stock" },
      { code: "FA-15", name: "실버 미스트", hex: "#b6b3ae", colorFamily: "gray", stock: "in_stock" },
      { code: "FA-23", name: "더스티 로즈", hex: "#c4948e", colorFamily: "pink", stock: "in_stock" },
      { code: "FA-31", name: "세이지", hex: "#9aa88d", colorFamily: "green", stock: "in_stock" },
      { code: "FA-44", name: "미드나잇", hex: "#3c4353", colorFamily: "blue", stock: "in_stock" },
    ],
  },
  {
    slug: "toscana-worsted",
    name: "Toscana Worsted",
    brandSlug: "casa-lana",
    description:
      "메리노에 캐시미어를 20% 섞어 부드러움을 끌어올린 워스티드 실입니다. 겉뜨기만으로도 표면이 고르게 나오기 때문에 무늬 없이 뜨는 스웨터에 잘 맞습니다. 목에 직접 닿아도 자극이 적습니다.",
    fiber: [
      { material: "엑스트라 파인 메리노", percent: 80 },
      { material: "캐시미어", percent: 20 },
    ],
    weightGram: 50,
    lengthMeter: 120,
    yarnWeight: "worsted",
    gauge: "10 × 10cm = 18코 24단",
    needleSize: "4.5 – 5.5mm",
    hookSize: "5.0mm",
    careInstructions: "드라이클리닝 권장 · 손세탁 시 찬물 · 뉘어서 건조",
    origin: "이탈리아",
    retailPrice: 16800,
    stock: "in_stock",
    releasedAt: "2026-02-10",
    featured: true,
    naverProductUrl: "",
    colorways: [
      { code: "TW-100", name: "밀크", hex: "#f0e9de", colorFamily: "white", stock: "in_stock" },
      { code: "TW-140", name: "카멜", hex: "#b98f5f", colorFamily: "brown", stock: "in_stock" },
      { code: "TW-160", name: "에스프레소", hex: "#5b463a", colorFamily: "brown", stock: "in_stock" },
      { code: "TW-220", name: "페일 그레이", hex: "#c2beb7", colorFamily: "gray", stock: "sold_out" },
      { code: "TW-310", name: "올리브", hex: "#77784f", colorFamily: "green", stock: "in_stock" },
      { code: "TW-420", name: "인디고", hex: "#44546b", colorFamily: "blue", stock: "in_stock" },
      { code: "TW-510", name: "브릭", hex: "#9e5340", colorFamily: "orange", stock: "in_stock" },
    ],
  },
  {
    slug: "lino-fresco",
    name: "Lino Fresco",
    brandSlug: "casa-lana",
    description:
      "린넨 100% 실로, 처음에는 약간 뻣뻣하지만 세탁을 거듭할수록 부드러워집니다. 여름 상의나 가방, 소품에 적합하며 물빠짐이 적어 색이 오래갑니다.",
    fiber: [{ material: "린넨", percent: 100 }],
    weightGram: 50,
    lengthMeter: 135,
    yarnWeight: "sport",
    gauge: "10 × 10cm = 24코 30단",
    needleSize: "3.0 – 3.5mm",
    hookSize: "3.0mm",
    careInstructions: "세탁기 사용 가능 (울코스 · 30℃) · 건조기 사용 금지",
    origin: "이탈리아",
    retailPrice: 8900,
    stock: "incoming",
    releasedAt: "2026-05-20",
    featured: false,
    naverProductUrl: "",
    colorways: [
      { code: "LF-01", name: "내추럴", hex: "#e2d9c6", colorFamily: "beige", stock: "incoming" },
      { code: "LF-06", name: "테라코타", hex: "#bf7554", colorFamily: "orange", stock: "incoming" },
      { code: "LF-11", name: "머스터드", hex: "#c9a247", colorFamily: "yellow", stock: "incoming" },
      { code: "LF-18", name: "라군", hex: "#6f95a0", colorFamily: "blue", stock: "incoming" },
      { code: "LF-24", name: "포레스트", hex: "#4f6b53", colorFamily: "green", stock: "incoming" },
      { code: "LF-30", name: "잉크", hex: "#3a3d47", colorFamily: "gray", stock: "incoming" },
    ],
  },
  {
    slug: "brume-mohair",
    name: "Brume Mohair",
    brandSlug: "maison-fil",
    description:
      "키드모헤어에 실크를 섞은 얇은 실입니다. 단독으로 뜨면 구름처럼 가벼운 옷이, 다른 실과 합사하면 부드러운 잔털이 더해집니다. 메종 필의 낮은 채도 팔레트가 가장 잘 드러나는 라인입니다.",
    fiber: [
      { material: "키드모헤어", percent: 72 },
      { material: "실크", percent: 28 },
    ],
    weightGram: 25,
    lengthMeter: 230,
    yarnWeight: "lace",
    gauge: "10 × 10cm = 24코 32단 (3.5mm 기준)",
    needleSize: "3.0 – 4.0mm",
    hookSize: "3.0mm",
    careInstructions: "손세탁 · 찬물 · 뉘어서 건조 · 다림질 금지",
    origin: "프랑스",
    retailPrice: 14200,
    stock: "in_stock",
    releasedAt: "2026-04-02",
    featured: true,
    naverProductUrl: "",
    colorways: [
      { code: "BM-01", name: "브륌", hex: "#e8e2d8", colorFamily: "white", stock: "in_stock" },
      { code: "BM-05", name: "누드", hex: "#d9c0ae", colorFamily: "beige", stock: "in_stock" },
      { code: "BM-12", name: "푸드르", hex: "#d3a7a5", colorFamily: "pink", stock: "in_stock" },
      { code: "BM-19", name: "라벤더", hex: "#a297ac", colorFamily: "purple", stock: "in_stock" },
      { code: "BM-26", name: "셀라돈", hex: "#a3b5a3", colorFamily: "green", stock: "in_stock" },
      { code: "BM-33", name: "아르두아즈", hex: "#7c848c", colorFamily: "gray", stock: "in_stock" },
      { code: "BM-41", name: "뷔르고뉴", hex: "#7c4348", colorFamily: "red", stock: "sold_out" },
      { code: "BM-48", name: "누아", hex: "#2f2d2c", colorFamily: "black", stock: "in_stock" },
    ],
  },
  {
    slug: "coton-doux",
    name: "Coton Doux",
    brandSlug: "maison-fil",
    description:
      "꼬임을 약하게 준 코튼 100% 실입니다. 일반적인 면사보다 부드럽고 무게감이 덜해 여름 옷에 부담이 없습니다. 아기 옷이나 피부가 예민한 분께 자주 권합니다.",
    fiber: [{ material: "이집션 코튼", percent: 100 }],
    weightGram: 50,
    lengthMeter: 105,
    yarnWeight: "dk",
    gauge: "10 × 10cm = 21코 28단",
    needleSize: "4.0 – 4.5mm",
    hookSize: "4.0mm",
    careInstructions: "세탁기 사용 가능 (울코스 · 30℃) · 뉘어서 건조",
    origin: "프랑스",
    retailPrice: 7600,
    stock: "in_stock",
    releasedAt: "2026-01-15",
    featured: false,
    naverProductUrl: "",
    colorways: [
      { code: "CD-01", name: "블랑", hex: "#f4f1ea", colorFamily: "white", stock: "in_stock" },
      { code: "CD-08", name: "사블", hex: "#dbc9ad", colorFamily: "beige", stock: "in_stock" },
      { code: "CD-14", name: "아프리코", hex: "#dda57e", colorFamily: "orange", stock: "in_stock" },
      { code: "CD-22", name: "시엘", hex: "#9db6c6", colorFamily: "blue", stock: "in_stock" },
      { code: "CD-29", name: "망트", hex: "#96bba6", colorFamily: "green", stock: "in_stock" },
      { code: "CD-36", name: "그리", hex: "#9b9791", colorFamily: "gray", stock: "in_stock" },
    ],
  },
  {
    slug: "andes-bulky",
    name: "Andes Bulky",
    brandSlug: "alba-wool",
    description:
      "알파카와 울을 반씩 섞은 굵은 실입니다. 굵기에 비해 가벼워 큰 옷을 떠도 어깨가 무겁지 않습니다. 대바늘 8mm 기준으로 하루 이틀이면 목도리 하나가 완성됩니다.",
    fiber: [
      { material: "알파카", percent: 50 },
      { material: "메리노울", percent: 50 },
    ],
    weightGram: 100,
    lengthMeter: 90,
    yarnWeight: "bulky",
    gauge: "10 × 10cm = 12코 16단",
    needleSize: "7.0 – 9.0mm",
    hookSize: "8.0mm",
    careInstructions: "손세탁 · 찬물 · 뉘어서 건조 · 물에서 들어올릴 때 받쳐서",
    origin: "페루",
    retailPrice: 15400,
    stock: "in_stock",
    releasedAt: "2026-05-06",
    featured: false,
    naverProductUrl: "",
    colorways: [
      { code: "AB-02", name: "라마 화이트", hex: "#ece5da", colorFamily: "white", stock: "in_stock" },
      { code: "AB-10", name: "비쿠냐", hex: "#c39c78", colorFamily: "brown", stock: "in_stock" },
      { code: "AB-16", name: "코코아", hex: "#6b5145", colorFamily: "brown", stock: "in_stock" },
      { code: "AB-25", name: "스톤", hex: "#a5a099", colorFamily: "gray", stock: "in_stock" },
      { code: "AB-34", name: "안데스 그린", hex: "#5f7261", colorFamily: "green", stock: "in_stock" },
      { code: "AB-47", name: "클레이", hex: "#b06a51", colorFamily: "orange", stock: "sold_out" },
    ],
  },
  {
    slug: "puna-fingering",
    name: "Puna Fingering",
    brandSlug: "alba-wool",
    description:
      "알파카에 나일론을 섞어 마찰에 강하게 만든 얇은 실입니다. 양말이나 장갑처럼 오래 신고 쓰는 물건에 적합하며, 400m 한 볼로 양말 한 켤레가 나옵니다.",
    fiber: [
      { material: "베이비 알파카", percent: 80 },
      { material: "나일론", percent: 20 },
    ],
    weightGram: 50,
    lengthMeter: 400,
    yarnWeight: "fingering",
    gauge: "10 × 10cm = 30코 40단",
    needleSize: "2.25 – 2.75mm",
    hookSize: "2.5mm",
    careInstructions: "세탁기 사용 가능 (울코스 · 30℃) · 뉘어서 건조",
    origin: "페루",
    retailPrice: 12900,
    stock: "in_stock",
    releasedAt: "2026-06-01",
    featured: true,
    naverProductUrl: "",
    colorways: [
      { code: "PF-03", name: "내추럴 화이트", hex: "#eee8dd", colorFamily: "white", stock: "in_stock" },
      { code: "PF-09", name: "토프", hex: "#b7a48d", colorFamily: "beige", stock: "in_stock" },
      { code: "PF-17", name: "차콜", hex: "#4d4b49", colorFamily: "gray", stock: "in_stock" },
      { code: "PF-24", name: "머스터드", hex: "#c39c3e", colorFamily: "yellow", stock: "in_stock" },
      { code: "PF-31", name: "포레스트", hex: "#47604e", colorFamily: "green", stock: "in_stock" },
      { code: "PF-38", name: "네이비", hex: "#39455c", colorFamily: "blue", stock: "in_stock" },
      { code: "PF-45", name: "플럼", hex: "#6d4a5e", colorFamily: "purple", stock: "in_stock" },
    ],
  },
];
