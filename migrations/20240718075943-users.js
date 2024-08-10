module.exports = {
  async up(db) {
    db.createCollection('users')
  },

  async down(db) {
    db.createCollection('users').drop()
  },
}
