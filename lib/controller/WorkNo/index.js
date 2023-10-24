const db = require("../../../models");
const { create, bulk_create, destroy, update } = require("../../repositories");
const { defaultValue } = require("../../../services/defaultValue");
const service = require("undefined-service-api");
const moment = require("moment");

const fetchwork = async (req, res) => {
  try {
    const workNoTable = await db.tbWorkNo.findAll();
    console.log(workNoTable);
    res.json(defaultValue(true, workNoTable, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving workNo data"));
  }
};

//--------------------------------------------------------------------

const createWorkNo = async (req, res) => {
  let t;
  try {
    t = await db.sequelize.transaction();

    const valuesToCreate = req.body.map((item) => ({
      startDate: item.startDate,
      endDate: item.endDate,
      detail: item.detail,
      workName: item.workName,
      note: item.note,
      sendTo: item.sendTo,
      createdBy: req.user.userId,
    }));

    const createdRecords = await db.tbWorkNo.bulkCreate(valuesToCreate, {
      transaction: t,
    });
    console.log(createdRecords);
    await t.commit();
    res.json(defaultValue(true, createdRecords, ""));
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    console.error(error);
    res.json(defaultValue(false, null, error.message));
  }
};

const updateWorkNo = async (req, res) => {
  let t;
  try {
    t = await db.sequelize.transaction();
    const valuesToUpdate = req.body.map((item) => ({
      worknoId: item.worknoId, // Assuming worknoId is the primary key
      startDate: item.startDate,
      endDate: item.endDate,
      detail: item.detail,
      workName: item.workName,
      note: item.note,
      sendTo: item.sendTo,
      createdBy: item.createdBy,
    }));

    const updatedRecords = await Promise.all(
      valuesToUpdate.map((item) =>
        db.tbWorkNo.update(item, {
          where: { worknoId: item.worknoId },
          transaction: t,
        })
      )
    );

    await t.commit();
    res.json(defaultValue(true, updatedRecords, req.body)); // Return the updated records
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    console.error(error);
    res.json(defaultValue(false, null, error.message));
  }
};
const updateSendTo = async (req, res) => {
  let t;
  try {
    t = await db.sequelize.transaction();
    // console.log(req.body)
    const updateValues = req.body.map((item) => ({
      worknoId: item.worknoId, // Assuming worknoId is the primary key
      sendTo: item.sendTo,
    }));
    console.log(updateValues)

    const updateRec = await Promise.all(
      updateValues.map((item) =>
        db.tbWorkNo.update(item, {
          where: { worknoId: item.worknoId },
          transaction: t,
        })
      )
    );

    await t.commit();
    res.json(defaultValue(true, updateRec, req.body)); // Return the updated records
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    console.error(error);
    res.json(defaultValue(false, null, error.message));
  }
};

const deleteWorkNo = async (req, res) => {
  let t = await db.sequelize.transaction();
  try {
    if (req.body.worknoId) {
      await db.tbWorkNo.destroy({
        where: { worknoId: req.body.worknoId },
        transaction: t,
      });
      await t.commit();
      res.json(defaultValue(true, null, ""));
    } else {
      res.json(defaultValue(false, "Invalid worknoId", ""));
    }
  } catch (error) {
    await t.rollback();
    res.json(defaultValue(false, error.message, ""));
  }
};

module.exports = {
  fetchwork,
  createWorkNo,
  updateWorkNo,
  deleteWorkNo,
  updateSendTo,
  
};
