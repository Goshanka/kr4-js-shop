const products = [
  {
    id: 1,
    title: "Диван Amelia",
    category: "classic",
    price: 89990,
    isAvailable: true,
    isHit: true,
    images: ["images/sofa-1.jpg"],
    description:
      "Бежево-золотистый диван с бархатной обивкой и каретной стяжкой.",
  },
  {
    id: 2,
    title: "Диван Nordic",
    category: "scandi",
    price: 54990,
    isAvailable: true,
    isHit: false,
    images: ["images/sofa-2.jpg"],
    description: "Компактный диван в стиле ретро с синей бархатной обивкой.",
  },
  {
    id: 3,
    title: "Диван Chesterfield",
    category: "classic",
    price: 72500,
    isAvailable: true,
    isHit: false,
    images: ["images/sofa-3.jpg"],
    description: "Классический диван Честерфилд из фиолетового бархата.",
  },
  {
    id: 4,
    title: "Диван Cozy",
    category: "modern",
    price: 61900,
    isAvailable: true,
    isHit: false,
    images: ["images/sofa-4.jpg"],
    description:
      "Диван серого цвета с мягкими узорными подушками для уютной гостиной.",
  },
  {
    id: 5,
    title: "Диван Scandi",
    category: "scandi",
    price: 47300,
    isAvailable: true,
    isHit: true,
    images: ["images/sofa-5.jpg"],
    description: "Светлый диван в скандинавском стиле с лаконичным дизайном.",
  },
  {
    id: 6,
    title: "Диван Milan",
    category: "scandi",
    price: 39900,
    isAvailable: true,
    isHit: false,
    images: ["images/milan-1.jpg", "images/milan-2.jpg", "images/milan-3.jpg"],
    description:
      "Двухместный диван молочного цвета на металлических ножках, лаконичные линии.",
  },
  {
    id: 7,
    title: "Диван Sunset",
    category: "modern",
    price: 44900,
    isAvailable: true,
    isHit: true,
    images: [
      "images/sunset-1.jpg",
      "images/sunset-2.jpg",
      "images/sunset-3.jpg",
    ],
    description: "Яркий оранжевый диван из экокожи, украсит любую гостиную.",
  },
  {
    id: 8,
    title: "Диван Cognac",
    category: "classic",
    price: 83500,
    isAvailable: true,
    isHit: false,
    images: ["images/cognac-1.jpg", "images/cognac-2.jpg"],
    description:
      "Трёхместный диван из мягкой коричневой кожи с глубокими подушками.",
  },
  {
    id: 9,
    title: "Диван Loft",
    category: "modern",
    price: 66800,
    isAvailable: true,
    isHit: false,
    images: ["images/loft-1.jpg", "images/loft-2.jpg"],
    description:
      "Серый диван с высокой спинкой и съёмными подушками в стиле лофт.",
  },
  {
    id: 10,
    title: "Диван Oxford",
    category: "classic",
    price: 98000,
    isAvailable: true,
    isHit: false,
    images: ["images/oxford-1.jpg"],
    description:
      "Диван Честерфилд из светло-коричневой кожи с каретной стяжкой.",
  },
  {
    id: 11,
    title: "Диван Bordeaux",
    category: "classic",
    price: 104500,
    isAvailable: false,
    isHit: false,
    images: ["images/bordeaux-1.jpg"],
    description:
      "Бордовый кожаный диван с рулонными подлокотниками и каретной стяжкой.",
  },
  {
    id: 12,
    title: "Диван Royal",
    category: "classic",
    price: 119000,
    isAvailable: true,
    isHit: false,
    images: ["images/royal-1.jpg"],
    description:
      "Резной диван в стиле барокко с золотистой обивкой и деревянным каркасом.",
  },
];

const categoryNames = {
  classic: "Классика",
  scandi: "Скандинавский стиль",
  modern: "Современные",
};

const formatPrice = (value) => value.toLocaleString("ru-RU") + " руб.";
