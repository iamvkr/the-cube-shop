import { Client, Account, TablesDB } from "appwrite";
import { config } from "./configs";

const client = new Client()
  .setEndpoint(config.APPWRITE_ENDPOINT)
  .setProject(config.APPWRITE_PROJECT_ID);

const account = new Account(client);
const tablesDb = new TablesDB(client);

export { client, account,tablesDb };