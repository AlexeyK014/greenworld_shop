// eslint-disable-next-line @typescript-eslint/no-require-imports
const { faker } = require('@faker-js/faker');

const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedsTypes = ['peas', 'radish', 'chickpeas', 'sunflower', 'arugulas'];

const images = [
  '/img/seeds/arugulas.png',
  '/img/seeds/chickpeas.png',
  '/img/seeds/peas.png',
  '/img/seeds/radish.png',
  '/img/seeds/sunflower.png',
];

const nutritionalValue = [
  'стимулирует метаболизм, антиоксидантной действие',
  'антиоксидантной действие, придаёт энергии, улучшает мозговую деятельность',
  'укрепляет сердечную мышцу, снижает холестерин',
  'улучшает состояние кожи, укрепляет иммунитет',
];

module.exports = {
  async up(db) {
    return db.collection('seeds').insertMany(
      [...Array(50)].map(() => {
        const type = getRandomArrayValue(seedsTypes);
        const characteristics = [
          {
            type: 'peas',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            weight: '1 кг',
            durationOfGrowth: '12-14 дней',
          },
          {
            type: 'radish',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            weight: '1 кг',
            durationOfGrowth: '5-7 дней',
          },
          {
            type: 'chickpeas',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            weight: '1 кг',
            durationOfGrowth: '12-14 дней',
          },
          {
            type: 'sunflower',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            weight: '1 кг',
            durationOfGrowth: '10-12 дней',
          },
          {
            type: 'arugulas',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            weight: '100 кг',
            durationOfGrowth: '5-7 дней',
          },
        ];

        return {
          category: 'seeds',
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
    return db.collection('seeds').updateMany([]);
  },
};
