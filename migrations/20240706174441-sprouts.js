// eslint-disable-next-line @typescript-eslint/no-require-imports
const { faker } = require('@faker-js/faker');

// получаем случайные значения из массива с тестовыми данными
const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sproutsTypes = ['peas', 'buckwheat', 'chickpeas', 'wheat'];

const images = [
  '/img/sprouts/buckwheat.png',
  '/img/sprouts/chickpeas.png',
  '/img/sprouts/peas.png',
  '/img/sprouts/wheat.png',
];

const nutritionalValue = [
  'стимулирует метаболизм, антиоксидантной действие',
  'антиоксидантной действие, придаёт энергии, улучшает мозговую деятельность',
  'укрепляет сердечную мышцу, снижает холестерин',
  'улучшает состояние кожи, укрепляет иммунитет',
];

module.exports = {
  async up(db) {
    return db.collection('sprouts').insertMany(
      [...Array(50)].map(() => {
        const type = sproutsTypes[Math.floor(Math.random() * sproutsTypes.length)];

        const characteristics = [
          {
            type: 'peas',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '7 дней',
            volume: '150 гр',
          },
          {
            type: 'buckwheat',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '5 дней',
            volume: '100 гр',
          },
          {
            type: 'chickpeas',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '7 дней',
            volume: '150 гр',
          },
          {
            type: 'wheat',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '5 дней',
            volume: '100 гр',
          },
        ];

        return {
          category: 'sprouts',
          type,
          price: +faker.string.numeric(4).replace(/.{0,2}$/, 99),
          name: faker.lorem.sentence(2),
          description: faker.lorem.sentences(10),
          characteristics: characteristics.find((item) => item.type === type),
          images: images.filter((item) => item.includes(type)),
          vendorCode: faker.string.numeric(4),
          inStock: faker.string.numeric(2),
          isBestseller: faker.datatype.boolean(),
          isNew: faker.datatype.boolean(),
          popularity: +faker.string.numeric(3),
          sizes: {},
        };
      }),
    );
  },

  async down(db) {
    return db.collection('sprouts').updateMany([]);
  },
};
