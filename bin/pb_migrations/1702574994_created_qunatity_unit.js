/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2hz4qjzlspu34a8",
    "created": "2023-12-14 17:29:54.367Z",
    "updated": "2023-12-14 17:29:54.367Z",
    "name": "qunatity_unit",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bbhssk2r",
        "name": "name",
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
        "id": "pz7bjmug",
        "name": "slug",
        "type": "text",
        "required": false,
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
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("2hz4qjzlspu34a8");

  return dao.deleteCollection(collection);
})
