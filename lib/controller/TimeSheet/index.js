const db = require("../../../models");
const { create, bulk_create, destroy, update } = require("../../repositories");
const { defaultValue } = require("../../../services/defaultValue");
const service = require("undefined-service-api");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const moment = require("moment");

const createTimeSheet = async (req, res) => {
  console.log("new data values", req.body);
  let t = await db.sequelize.transaction();
  if (req.body.timeSheetHd) {
    let timeSheetHd = {
      timesheet_date: moment(req.body.timeSheetHd.timesheet_date).format(
        "YYYY/MM/DD"
      ),
      user_id: req.user.user_id,
      created_by: req.user.user_id,
      update_by: req.user.user_id,
    };
    const createsHd = await create(db.TimeSheetHDs, timeSheetHd, t);
    console.log("TimeSheetHDs", createsHd);
    let timeSheetDt = [];
    req.body.timeSheetDt.map((e, i) => {
      let Value = {
        start_time: e.timeStart,
        end_time: e.timeEnd,
        detail: e.detail,
        work_code: e.work_code,
        work_name: e.work_name,
        project_name: e.project_name,
        work_type: e.work_type,
        update_by: e.updateBy,
        created_by: req.user.user_id,
        timesheethd_id: createsHd.dataValues.timesheethd_id,
        is_deleted: false,
        total: e.total,
      };

      timeSheetDt.push(Value);
    });
    const createsDt = await bulk_create(db.TimeSheetDTs, timeSheetDt, t);
    console.log("CreatesDt in timesheet", createsDt);
    // console.log(t)
    t.commit();
    res.json(defaultValue(true, createsHd, ""));
  } else {
    res.json(defaultValue(false, null, "Error to save"));
  }
};

const deleteTimeSheet = async (req, res) => {
  console.log("oHHHH NOoooo", req.body);
  let t = await db.sequelize.transaction();
  if (req.body.timesheetdt_id) {
    const deleteUpdate = await update(
      db.TimeSheetDTs,
      { is_deleted: true },
      { timesheetdt_id: req.body.timesheetdt_id }, // Update the property name here
      t
    );
  }
  const dataTimeSheet = await db.TimeSheetHDs.findAll({
    where: {
      user_id: req.user.user_id,
      timesheet_date: moment(req.body.timesheet_date).format("YYYY/MM/DD"),
    },
    include: [
      {
        model: db.TimeSheetDTs,
        required: false,
      },
    ],
  });
  t.commit();
  res.json(defaultValue(true, null, ""));
};

const updateTimeSheet = async (req, res) => {
  let t = await db.sequelize.transaction();
  if (req.body) {
    let timeSheetDt = [];
    req.body.timeSheetDt.map(async (e, i) => {
      console.log("eeeeeeee", req.body.timeSheetHd.timesheethd_id);
      if (e.timesheetdt_id) {
        const updateDt = await update(
          db.TimeSheetDTs,
          {
            start_time: e.timeStart,
            end_time: e.timeEnd,
            detail: e.detail,
            work_code: e.work_code,
            work_name: e.work_name,
            project_name: e.project_name,
            work_type: e.work_type,
            update_by: e.updateBy,
            created_by: req.user.user_id,
            is_deleted: false,
            total: e.total,
          },
          { timesheetdt_id: e.timesheetdt_id },
          t
        );
      } else {
        let Value = {
          start_time: e.timeStart,
          end_time: e.timeEnd,
          detail: e.detail,
          work_code: e.work_code,
          work_name: e.work_name,
          project_name: e.project_name,
          work_type: e.work_type,
          update_by: req.user.user_id,
          created_by: req.user.user_id,
          is_deleted: false,
          timesheethd_id: req.body.timeSheetHd.timesheethd_id,
          total: e.total,
        };
        timeSheetDt.push(Value);
        console.log("Value", Value);
      }
    });
    if (timeSheetDt.length > 0) {
      const createsDt = await bulk_create(db.TimeSheetDTs, timeSheetDt, t);
    }
  }
  t.commit();
  res.json(defaultValue(true, null, ""));
};

const fetchTimeSheetByDate = async (req, res) => {
  console.log("req.user.userId", req.user.user_id);
  const dataTimeSheet = await db.TimeSheetHDs.findAll({
    where: {
      user_id: req.user.user_id,
      timesheet_date: moment(req.body.timesheet_date).format("YYYY/MM/DD"), // Use the correct column name
      is_deleted: false,
    },
    include: [
      {
        model: db.TimeSheetDTs,
        required: false,
        where: { is_deleted: false },
      },
    ],
    order: [["TimeSheetDTs", "start_time", "ASC"]],
  });
  console.log(dataTimeSheet);

  res.json(defaultValue(true, dataTimeSheet, ""));
};

module.exports = {
  createTimeSheet,
  fetchTimeSheetByDate,
  deleteTimeSheet,
  updateTimeSheet,
};
