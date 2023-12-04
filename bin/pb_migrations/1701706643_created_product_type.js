/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "5ioc2dl10svrbgb",
    "created": "2023-12-04 16:17:23.179Z",
    "updated": "2023-12-04 16:17:23.179Z",
    "name": "product_type",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j2nfqp9o",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("5ioc2dl10svrbgb");

  return dao.deleteCollection(collection);
})
