import { get } from "../apiCall.ts";
import { Params, Options } from "../types.ts";

export default async function ping(params: Params, options: Options) {
  const res = await get("/api/", { });

  const responseText = await res.text();
  console.log(responseText);
}
