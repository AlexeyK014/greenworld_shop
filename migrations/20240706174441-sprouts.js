/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker')

// получаем случайные значения из массива с тестовыми данными
const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)]

const collections = ['street', 'black', 'casual', 'orange', 'line']
const colors = ['purpure', 'yellow', 'orange', 'black', 'white']
const compositions = ['cotton', 'synthetics', 'polyester']
// const sproutsTypes = ['buckwheat']
const sproutsTypes = ['peas', 'buckwheat', 'chickpeas', 'wheat']

const images = [
  '/img/sprouts/buckwheat.png',
  '/img/sprouts/chickpeas.png',
  '/img/sprouts/peas.png',
  '/img/sprouts/wheat.png',
]

const wearingMethod = ['in hand', 'on shoulder', 'over shoulder']
const textures = ['nubuck', 'nappa', 'suede', 'naplak']
const styles = ['bucket bag', 'retro style', 'sports', 'travel']
const seasons = ['demi-season', 'all season']
const numbersOfSpokes = [9, 8, 10, 12, 7]
const spokeMaterials = ['metal', 'plastic', 'fiberglass']
const foldedLengths = [30, 40, 50, 60]
const mechanisms = ['manual', 'automatic']

module.exports = {
  async up(db) {
    return db.collection('sprouts').insertMany(
      [...Array(50)].map(() => {
        const type =
          sproutsTypes[Math.floor(Math.random() * sproutsTypes.length)]

        const characteristics = [
          {
            type: 'peas',
            color: getRandomArrayValue(colors),
            composition: getRandomArrayValue(compositions),
            collection: getRandomArrayValue(collections),
            wearingMethod: getRandomArrayValue(wearingMethod),
            texture: getRandomArrayValue(textures),
            style: getRandomArrayValue(styles),
          },
          {
            type: 'buckwheat',
            color: getRandomArrayValue(colors),
            composition: getRandomArrayValue(compositions),
            season: getRandomArrayValue(seasons),
          },
          {
            type: 'chickpeas',
            color: getRandomArrayValue(colors),
            composition: getRandomArrayValue(compositions),
            numberOfSpokes: getRandomArrayValue(numbersOfSpokes),
            spokeMaterial: getRandomArrayValue(spokeMaterials),
            foldedLength: getRandomArrayValue(foldedLengths),
            mechanism: getRandomArrayValue(mechanisms),
          },
          {
            type: 'wheat',
            color: getRandomArrayValue(colors),
            composition: getRandomArrayValue(compositions),
            numberOfSpokes: getRandomArrayValue(numbersOfSpokes),
            spokeMaterial: getRandomArrayValue(spokeMaterials),
            foldedLength: getRandomArrayValue(foldedLengths),
            mechanism: getRandomArrayValue(mechanisms),
          },
        ]

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
          sizes:
            type === 'chickpeas'
              ? {}
              : {
                  s: faker.datatype.boolean(),
                  l: faker.datatype.boolean(),
                  m: faker.datatype.boolean(),
                  xl: faker.datatype.boolean(),
                  xxl: faker.datatype.boolean(),
                },
          // {
          //   s: faker.datatype.boolean(),
          //   l: faker.datatype.boolean(),
          //   m: faker.datatype.boolean(),
          //   xl: faker.datatype.boolean(),
          //   xxl: faker.datatype.boolean(),
          // },
        }
      })
    )
  },

  async down(db) {
    return db.collection('sprouts').updateMany([])
  },
}
