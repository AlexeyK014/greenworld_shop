/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker')

// получаем случайные значения из массива с тестовыми данными
const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)]

const collections = ['street', 'black', 'casual', 'orange', 'line']
const colors = ['purpure', 'yellow', 'orange', 'black', 'white']
const compositions = ['cotton', 'synthetics', 'polyester']
const microgreenTypes = ['peas', 'radish', 'cabbage', 'sunflower', 'arugulas']

const images = [
  '/img/microgreen/arugulas.png',
  '/img/microgreen/cabbage.png',
  '/img/microgreen/peas.png',
  '/img/microgreen/radish.png',
  '/img/microgreen/sunflower.png',
]
// const lineImages = [
//   '/img/black-t.png',
//   '/img/violet-t.png',
//   '/img/orange-t.png',
// ]

// const fabricTypes = [
//   'natural',
//   'non-natural',
//   'mixed',
//   'non-woven',
//   'stockinette',
// ]
// const features = [
//   'breathable material, knitwear',
//   'contrasting color',
//   'soft fabric',
//   'hood, pockets',
// ]
const collars = [
  'polo',
  'shirt-rack',
  'apache',
  'tangerine',
  'golf',
  'round neck',
]
// const sleeves = ['long', 'short']
const seasons = ['demi-season', 'all season']
// const upperMaterials = [
//   'synthetic material',
//   'quilted jacket fabric',
//   'eco leather',
//   'denim',
// ]
// const liningMaterials = ['taffeta', 'viscose', 'polyester', 'chiffon', 'satin']

module.exports = {
  async up(db) {
    return db.collection('microgreen').insertMany(
      [...Array(50)].map(() => {
        const type =
          microgreenTypes[Math.floor(Math.random() * microgreenTypes.length)]
        const characteristics = [
          {
            type: 'peas',
            color: getRandomArrayValue(colors),
            collar: getRandomArrayValue(collars),
            silhouette: 'straight',
            print: 'chocolate, print, melange',
            decor: faker.datatype.boolean(),
            composition: getRandomArrayValue(compositions),
            season: getRandomArrayValue(seasons),
            collection:
              collections[Math.floor(Math.random() * collections.length)],
          },
          {
            type: 'radish',
            color: getRandomArrayValue(colors),
            collar: getRandomArrayValue(collars),
            silhouette: 'straight',
            print: 'chocolate, print, melange',
            decor: faker.datatype.boolean(),
            composition: getRandomArrayValue(compositions),
            season: getRandomArrayValue(seasons),
            collection:
              collections[Math.floor(Math.random() * collections.length)],
          },
          {
            type: 'cabbage',
            color: getRandomArrayValue(colors),
            collar: getRandomArrayValue(collars),
            silhouette: 'straight',
            print: 'chocolate, print, melange',
            decor: faker.datatype.boolean(),
            composition: getRandomArrayValue(compositions),
            season: getRandomArrayValue(seasons),
            collection:
              collections[Math.floor(Math.random() * collections.length)],
          },
          {
            type: 'arugulas',
            color: getRandomArrayValue(colors),
            collar: getRandomArrayValue(collars),
            silhouette: 'straight',
            print: 'chocolate, print, melange',
            decor: faker.datatype.boolean(),
            composition: getRandomArrayValue(compositions),
            season: getRandomArrayValue(seasons),
            collection:
              collections[Math.floor(Math.random() * collections.length)],
          },
          {
            type: 'sunflower',
            // color: getRandomArrayValue(colors),
            // composition: getRandomArrayValue(compositions),
            // numberOfSpokes: getRandomArrayValue(numbersOfSpokes),
            // spokeMaterial: getRandomArrayValue(spokeMaterials),
            // foldedLength: getRandomArrayValue(foldedLengths),
            // mechanism: getRandomArrayValue(mechanisms),
            color: getRandomArrayValue(colors),
            collar: getRandomArrayValue(collars),
            silhouette: 'straight',
            print: 'chocolate, print, melange',
            decor: faker.datatype.boolean(),
            composition: getRandomArrayValue(compositions),
            season: getRandomArrayValue(seasons),
            collection:
              collections[Math.floor(Math.random() * collections.length)],
          },
        ]
        const currentCharacteristics = characteristics.find(
          (item) => item.type === type
        )

        return {
          category: 'microgreen',
          type,
          price: +faker.string.numeric(4).replace(/.{0,2}$/, 99),
          name: faker.lorem.sentence(2),
          description: faker.lorem.sentences(10),
          characteristics: currentCharacteristics,
          images: images.filter((item) => item.includes(type)),
          // type === 'peas' && currentCharacteristics.collection === 'line'
          //   ? [getRandomArrayValue(lineImages)]
          //   : images.filter((item) => item.includes(type)),
          vendorCode: faker.string.numeric(4),
          inStock: faker.string.numeric(2),
          isBestseller: faker.datatype.boolean(),
          isNew: faker.datatype.boolean(),
          popularity: +faker.string.numeric(3),
          sizes:
            type === 'sunflower'
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
    return db.collection('microgreen').updateMany([])
  },
}
