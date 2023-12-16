/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t0nuvnfyr7ep5vk")

  // remove
  collection.schema.removeField("zs2nenpi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bhi5izyk",
    "name": "count",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t0nuvnfyr7ep5vk")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("bhi5izyk")

  return dao.saveCollection(collection)
})
