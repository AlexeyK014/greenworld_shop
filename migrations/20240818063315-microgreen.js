/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker');

// получаем случайные значения из массива с тестовыми данными
const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

const nutritionalValue = [
  'калий, магний, кальций',
  'натрий, медь, фосфор, марганец',
  'кальций, натрий, медь',
];
const microgreenTypes = ['peas', 'radish', 'cabbage', 'sunflower', 'arugulas'];

const images = [
  '/img/microgreen/arugulas.png',
  '/img/microgreen/cabbage.png',
  '/img/microgreen/peas.png',
  '/img/microgreen/radish.png',
  '/img/microgreen/sunflower.png',
];

// const images = [
//   '/img/microgreen/arugulas.png',
//   '/img/microgreen/arugulas-1.png',
//   '/img/microgreen/arugulas-2.png',
//   '/img/microgreen/cabbage.png',
//   '/img/microgreen/cabbage-1.png',
//   '/img/microgreen/cabbage-2.png',
//   '/img/microgreen/peas.png',
//   '/img/microgreen/peas-1.png',
//   '/img/microgreen/peas-2.png',
//   '/img/microgreen/radish.png',
//   '/img/microgreen/radish-1.png',
//   '/img/microgreen/radish-2.png',
//   '/img/microgreen/sunflower.png',
//   '/img/microgreen/sunflower-1.png',
//   '/img/microgreen/sunflower-2.png',
// ]

module.exports = {
  async up(db) {
    return db.collection('microgreen').insertMany(
      [...Array(50)].map(() => {
        const type = microgreenTypes[Math.floor(Math.random() * microgreenTypes.length)];
        const characteristics = [
          {
            type: 'peas',
            taste: 'молодой горох, сладкий',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '7 дней',
          },
          {
            type: 'radish',
            taste: 'острый',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '5 дней',
          },
          {
            type: 'cabbage',
            taste: 'сладкий',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '3-4 дня',
          },
          {
            type: 'arugulas',
            taste: 'молодой горох, сладкий',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '7 дней',
          },
          {
            type: 'sunflower',
            taste: 'молодая семечка, сладкий',
            nutritionalValue: getRandomArrayValue(nutritionalValue),
            shelfLife: '7 дней',
          },
        ];
        const currentCharacteristics = characteristics.find((item) => item.type === type);

        return {
          category: 'microgreen',
          type,
          price: +faker.string.numeric(4).replace(/.{0,2}$/, 99),
          name: faker.lorem.sentence(2),
          description: faker.lorem.sentences(10),
          characteristics: currentCharacteristics,
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
    return db.collection('microgreen').updateMany([]);
  },
};
