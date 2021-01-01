const apis = require("./apis");

const wsEvent = async (data) => {
  const message = JSON.parse(data);
  let res = message;
  switch (message.type) {
    case "MESSAGE_CREATED":
      await apis.getMessage(message.body.id);
      break;

    default:
      break;
  }
  return res;
};

module.exports = wsEvent;
