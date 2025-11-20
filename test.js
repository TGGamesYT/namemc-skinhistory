import { getUuidFromUsername, getSkinHistory } from"./index.js";

const main = async () => {
  const uuid = await getUuidFromUsername("TGdoesCode");
  console.log("UUID:", uuid);

  const skins = await getSkinHistory(uuid);
  console.log("Skins:", skins);
};

main();