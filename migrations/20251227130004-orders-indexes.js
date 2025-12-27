const TEXT_SEARCH = "orders_text_search";

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db) {
    const coll = db.collection("orders");
    await coll.createIndex(
      {
        code: "text",
        "guest.name": "text",
        "guest.surname": "text",
      },
      { name: TEXT_SEARCH },
    );
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db) {
    const coll = db.collection("orders");
    await coll.dropIndex(TEXT_SEARCH);
  },
};
