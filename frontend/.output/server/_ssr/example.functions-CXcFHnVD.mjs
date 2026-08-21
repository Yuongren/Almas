import { c as createServerRpc } from "./createServerRpc-DA05l0Yc.mjs";
import { a as createServerFn } from "./server-Bhy4EJDI.mjs";
import process from "node:process";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV
    // Add server-only values here, e.g.:
    //   databaseUrl: process.env.DATABASE_URL,
    //   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };
}
const getGreeting_createServerFn_handler = createServerRpc({
  id: "a8ea96f55c98d9dfe39eba1f21271c6c33bfa924611fe9d828fca0774e41b939",
  name: "getGreeting",
  filename: "src/lib/api/example.functions.ts"
}, (opts) => getGreeting.__executeServer(opts));
const getGreeting = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  name: stringType().min(1)
})).handler(getGreeting_createServerFn_handler, async ({
  data
}) => {
  const config = getServerConfig();
  return {
    greeting: `Hello, ${data.name}!`,
    mode: config.nodeEnv ?? "unknown"
  };
});
export {
  getGreeting_createServerFn_handler
};
