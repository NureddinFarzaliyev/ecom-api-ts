module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db) {
    const coll = db.collection("products");

    await coll.createIndex(
      {
        title: "text",
        description: "text",
      },
      {
        name: "products_text_search",
      },
    );
    await coll.createIndex({ category: 1 }, { name: "prod_category" });
    await coll.createIndex({ price: 1 }, { name: "prod_price" });
    await coll.createIndex({ isPublic: 1 }, { name: "prod_ispublic" });
    await coll.createIndex({ createdAt: 1 }, { name: "prod_createdat" });
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db) {
    const coll = db.collection("products");

    await coll.dropIndex("products_text_search");
    await coll.dropIndex("prod_category");
    await coll.dropIndex("prod_price");
    await coll.dropIndex("prod_ispublic");
    await coll.dropIndex("prod_createdat");
  },
};
