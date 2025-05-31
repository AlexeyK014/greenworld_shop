module.exports = {
  async up(db) {
    db.createCollection('images');
  },

  async down(db) {
    db.createCollection('images').drop();
  },
};
