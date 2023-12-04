/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "xzjn8jofvndycp9",
    "created": "2023-12-04 16:17:23.179Z",
    "updated": "2023-12-04 16:17:23.179Z",
    "name": "check",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vnaabqrg",
        "name": "order",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "mdrq8zxg7bxveov",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "4ig0kpoj",
        "name": "payment_method",
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
  const collection = dao.findCollectionByNameOrId("xzjn8jofvndycp9");

  return dao.deleteCollection(collection);
})
