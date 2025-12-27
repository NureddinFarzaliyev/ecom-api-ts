const NAME_SURNAME_TEXT_SEARCH = "name_surname_text_search";

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db) {
    const coll = db.collection("users");
    await coll.createIndex(
      {
        name: "text",
        surname: "text",
      },
      { name: NAME_SURNAME_TEXT_SEARCH },
    );
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db) {
    const coll = db.collection("users");
    await coll.dropIndex(NAME_SURNAME_TEXT_SEARCH);
  },
};
