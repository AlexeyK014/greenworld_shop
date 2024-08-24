/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker')

const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedsTypes = ['peas', 'radish', 'chickpeas', 'sunflower', 'arugulas']

const images = [
  '/img/seeds/arugulas.png',
  '/img/seeds/chickpeas.png',
  '/img/seeds/peas.png',
  '/img/seeds/radish.png',
  '/img/seeds/sunflower.png',
]

const culture = ['legumes', 'vegetables', 'salads', 'flowers']
const lifeCycle = ['annual', 'multi-year']
const features = ['unpeeled', 'peeled']
const doesNotContain = [
  'GMO',
  'gluten',
  'flavors',
  'artificial colors',
  'preservatives',
]

module.exports = {
  async up(db) {
    return db.collection('seeds').insertMany(
      [...Array(50)].map(() => {
        const type = getRandomArrayValue(seedsTypes)
        const characteristics = [
          {
            type: 'peas',
            culture: getRandomArrayValue(culture),
            lifeCycle: getRandomArrayValue(lifeCycle),
            features: getRandomArrayValue(features),
            doesNotContain: getRandomArrayValue(doesNotContain),
          },
          {
            type: 'radish',
            culture: getRandomArrayValue(culture),
            lifeCycle: getRandomArrayValue(lifeCycle),
            features: getRandomArrayValue(features),
            doesNotContain: getRandomArrayValue(doesNotContain),
          },
          {
            type: 'chickpeas',
            culture: getRandomArrayValue(culture),
            lifeCycle: getRandomArrayValue(lifeCycle),
            features: getRandomArrayValue(features),
            doesNotContain: getRandomArrayValue(doesNotContain),
          },
          {
            type: 'sunflower',
            culture: getRandomArrayValue(culture),
            lifeCycle: getRandomArrayValue(lifeCycle),
            features: getRandomArrayValue(features),
            doesNotContain: getRandomArrayValue(doesNotContain),
          },
          {
            type: 'arugulas',
            culture: getRandomArrayValue(culture),
            lifeCycle: getRandomArrayValue(lifeCycle),
            features: getRandomArrayValue(features),
            doesNotContain: getRandomArrayValue(doesNotContain),
          },
        ]

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
        }
      })
    )
  },

  async down(db) {
    return db.collection('seeds').updateMany([])
  },
}
