import express from "express";

/**
 * @description This function is used to create a route for data migration and teardown
 * @param {import("mongoose").Model} model
 * @param {string} dataPath - The path to the data file absolute or relative to the root of the project as .json
 * @returns {import("express").Router}
 */
function dataMigrationRouter(model, dataPath) {
  const router = express.Router();

  router.post("/migrate/", async (req, res) => {
    try {
      const data = await import(dataPath, { assert: { type: "json" } });

      await model.bulkWrite(
        data.default.map((item) => {
          if (item._id) {
            return {
              updateOne: {
                filter: { _id: item._id },
                update: { $set: item },
                upsert: true,
              },
            };
          } else {
            return {
              insertOne: {
                document: item,
              },
            };
          }
        })
      );

      res.status(200).json({
        message: "Data migrated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error migrating data",
        error: error.message,
      });
    }
  });

  router.delete("/teardown/", async (req, res) => {
    try {
      await model.deleteMany({});
      res.status(200).json({
        message: "Data teared down successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error tearing down data",
        error: error.message,
      });
    }
  });

  return router;
}

export default dataMigrationRouter;