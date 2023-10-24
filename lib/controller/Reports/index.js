const db = require("../../../models");
const { defaultValue } = require("../../../services/defaultValue");
const moment = require("moment");

const getAllUsers = async (req, res) => {
  const dataTimeSheet = await db.tbUser.findAll({
    where: {
      isDeleted: false,
      //   timeSheetDate: moment(req.body.timeSheetDate).format("YYYY/MM/DD"),
    },
    include: [
      {
        model: db.tbTimeSheetHD,
        required: false,
        include: [
          {
            model:db.tbTimeSheetDT,
            required: false
          }
        ]
      },
    ],
    // order: [["tbUsers", "startTime", "ASC"]],
  });
  res.json(defaultValue(true, dataTimeSheet, ""));

};

const fetchUserSheet = async (req, res) => {
  const dataUserSheet = await db.Users.findAll({
    where: {
      is_deleted: false,
    },
    include: [
      {
        model: db.TimeSheetHDs,
        required: false,
        include: [
          {
            model:db.TimeSheetDTs,
            required: false
          }
        ]
      },
    ],
    // order: [["tbUsers", "startTime", "ASC"]],
  });
  console.log(dataUserSheet);

  res.json(defaultValue(true, dataUserSheet, ""));

};


const getJackofAllUsers = async (req, res) => {
  try {
    const dataTimeSheet = await db.tbUser.findAll({
      isDeleted: false,
      include: [
        {
          model: db.tbTimeSheetHD,
          required: false,
          include: [
            {
              model: db.tbTimeSheetDT,
              required: false
            }
          ]
        },
      ],
      // order: [["startTime", "ASC"]],
    });

    console.log(dataTimeSheet);
    res.json(defaultValue(true, dataTimeSheet, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving data TimeSheet"));
  }
};


module.exports = {
  getAllUsers,
  fetchUserSheet,
  getJackofAllUsers

};
