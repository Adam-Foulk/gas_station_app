/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "t0nuvnfyr7ep5vk",
    "created": "2023-12-04 16:17:23.179Z",
    "updated": "2023-12-04 16:17:23.179Z",
    "name": "product_remainder",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zs2nenpi",
        "name": "count",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "2mzplihy",
        "name": "product",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "78lfiurxfdig4d8",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("t0nuvnfyr7ep5vk");

  return dao.deleteCollection(collection);
})
