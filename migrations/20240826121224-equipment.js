// eslint-disable-next-line @typescript-eslint/no-require-imports
const { faker } = require('@faker-js/faker');

const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

const equipmentTypes = ['box', 'lamps', 'shelf', 'agrovata'];

const images = [
  '/img/equipment/box-equipment.png',
  '/img/equipment/lamps-equipment.png',
  '/img/equipment/shelf-equipment.png',
  '/img/equipment/agrovata-equipment.png',
];

// lamps
const powerLamps = ['10', '14', '18'];
const lengthLamps = ['1200 mm', '573 mm', '873 mm'];
const colorTemperature = ['6000 K', '4500 K', '4000 K'];
const spectrum = ['white', 'red-blue'];

// box
const sizeBox = [
    '190 mm X 114 mm X 35 mm',
    '190 mm X 114 mm X 55 mm',
    '190 mm X 114 mm X 70 mm'
]
const lengthBox = ['190 mm'];
const widthBox = ['114 mm'];
const heightBox = ['35 mm', '55 mm'];

//agrovata
const heightAgro = ['10 mm', '15 mm', '20 mm'];
const lengthArgo = ['160 mm'];
const widthArgo = ['110 mm'];

//shelf
const heightShelf = ['2000 mm', '1800 mm'];
const lengthShelf = ['1000 mm', '1220 mm'];
const widthShelf = ['500 mm', '600 mm', '630 mm'];

module.exports = {
  async up(db) {
    return db.collection('equipment').insertMany(
      [...Array(50)].map(() => {
        const type = getRandomArrayValue(equipmentTypes);

        const characteristics = [
          {
            type: 'box',
            boxSize: getRandomArrayValue(sizeBox),
            // widthBox: getRandomArrayValue(widthBox),
            // heightBox: getRandomArrayValue(heightBox),
          },
          {
            type: 'lamps',
            power: getRandomArrayValue(powerLamps),
            length: getRandomArrayValue(lengthLamps),
            colorTemperature: getRandomArrayValue(colorTemperature),
            spectrum: getRandomArrayValue(spectrum),
          },
          {
            type: 'shelf',
            heightShelf: getRandomArrayValue(heightShelf),
            lengthShelf: getRandomArrayValue(lengthShelf),
            widthShelf: getRandomArrayValue(widthShelf),
          },
          {
            type: 'agrovata',
            heightAgro: getRandomArrayValue(heightAgro),
            lengthArgo: getRandomArrayValue(lengthArgo),
            widthArgo: getRandomArrayValue(widthArgo),
          },
        ];

        return {
          category: 'equipment',
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
        };
      }),
    );
  },

  async down(db) {
    return db.collection('equipment').updateMany([]);
  },
};
