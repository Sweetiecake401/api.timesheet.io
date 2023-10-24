const axios = require("axios");
const db = require("../../../models");
const { create, bulk_create, destroy, update } = require("../../repositories");
const { defaultValue } = require("../../../services/defaultValue");
const service = require("undefined-service-api");
const moment = require("moment");

const apiKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI2Mjc2ODQyMywiYWFpIjoxMSwidWlkIjozNjk4NDYwNSwiaWFkIjoiMjAyMy0wNi0xNVQwNzo0NToxMC40MTFaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQzMTk2NzMsInJnbiI6InVzZTEifQ.EYkDuJdWxZFCa2OLc84ZFX23stZZPPmzeDdJiXi91Gw";
const apiUrl = "https://api.monday.com/v2";

const getMondayData = async (req, res) => {
  const boardId = req.body;
  console.log("This is sparta", boardId);

  try {
    const response = await axios.post(
      apiUrl,
      {
        query: `
          query GetBoardData($ids: [Int]) {
            boards(ids: $ids) {
              name
              items {
                id
                name
                column_values(ids : ["status", "person"]){
                  id
                  title
                  value
                  text
                }
              }
            }
          }
        `,
        variables: {
          ids: Object.keys(boardId).map(Number),
        },
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    console.log(data);
    res.json(defaultValue(true, data, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving Monday data"));
  }
};

const getDataAll = async (req, res) => {
  const boardId = req.body;
  console.log("This is sparta", boardId);

  try {
    const response = await axios.post(
      apiUrl,
      {
        query: `
          query{
            boards{
              name
              items {
                id
                name
                column_values(ids : ["status", "person"]){
                  id
                  title
                  value
                  text
                }
              }
            }
          }
        `,
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    console.log(data);
    res.json(defaultValue(true, data, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving Monday data"));
  }
};

const getBoardId = async (req, res) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        query: `
          query {
            boards {
              id
              name
            }
          }
        `,
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    console.log(data);
    res.json(defaultValue(true, data, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving Monday data"));
  }
};

const fetchMondayUser = async (req, res) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        query: `
          query {
            users{
              id
              name
             email
            }
          }
        `,
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    console.log(data);
    res.json(defaultValue(true, data, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving Monday data"));
  }
};

const createMonday = async (req, res) => {
  let t;
  try {
    t = await db.sequelize.transaction();

    const valuesToCreate = req.body.map((item) => ({
      mondayId: item.id,
      mondayProName: item.projectName,
      startDate: item.startDate,
      endDate: item.endDate,
      userId: req.user.userId,
      sumTime: item.sumTime,
      mondaySubName: item.subitemName,
      owner: item.owner,
      email: item.email,
      mondayStatus: item.status,
      statusOnHand: item.statusOnHand,
      timer: item.timer,
    }));

    const createdRecords = await db.Mondays.bulkCreate(valuesToCreate, {
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

const fetchMonday = async (req, res) => {
  try {
    const customerTable = await db.Mondays.findAll();
    console.log(customerTable);
    res.json(defaultValue(true, customerTable, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving workNo data"));
  }
};

const getProjectName = async (req, res) => {
  try {
    const responsePname = await axios.post(
      apiUrl,
      {
        query: `
        query {
          boards {
            id
            name
            items {
              id
              column_values {
                id
                title
                value
              }
            }
          }
          users {
            name
            id
          }
        }
        `,
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const data = responsePname.data;

    console.log(data);
    res.json(defaultValue(true, data, ""));
  } catch (error) {
    console.error(error);
    res.json(defaultValue(false, null, "Error retrieving Monday data"));
  }
};

module.exports = {
  getMondayData,
  getBoardId,
  fetchMondayUser,
  getDataAll,
  createMonday,
  fetchMonday,
  getProjectName,
};
