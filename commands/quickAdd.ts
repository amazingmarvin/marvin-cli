import { get } from "../apiCall.ts";
import { Params, Options } from "../types.ts";

export default async function quickAdd(params: Params, cmdOpt: Options) {
  const res = await get("/api/quickAdd", { });

  const responseText = await res.text();
  console.log(responseText);
}
