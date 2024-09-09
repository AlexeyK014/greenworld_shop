/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker')

const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)]

const equipmentTypes = ['box', 'lamps', 'shelf', 'agrovata']

const images = [
  '/img/equipment/box-equipment.png',
  '/img/equipment/lamps-equipment.png',
  '/img/equipment/shelf-equipment.png',
  '/img/equipment/agrovata-equipment.png',
]

const power = ['10 W', '14 W', '18 W']
const length = ['57.5 cm', '87.5 cm']
const thicknessAgro = ['1 cm', '1.5 cm']
const boxSize = ['11 x 18 x 3', '11 x 18 x 5']
const shelfSize = ['1450 x 750 x 300', '1600 x 1000 x 400']

module.exports = {
  async up(db) {
    return db.collection('equipment').insertMany(
      [...Array(50)].map(() => {
        const type = getRandomArrayValue(equipmentTypes)

        const characteristics = [
          {
            type: 'box',
            boxSize: getRandomArrayValue(boxSize),
          },
          {
            type: 'lamps',
            power: getRandomArrayValue(power),
            length: getRandomArrayValue(length),
          },
          {
            type: 'shelf',
            shelfSize: getRandomArrayValue(shelfSize),
          },
          {
            type: 'agrovata',
            thicknessAgro: getRandomArrayValue(thicknessAgro),
          },
        ]

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
          sizes: {},
        }
      })
    )
  },

  async down(db) {
    return db.collection('equipment').updateMany([])
  },
}
