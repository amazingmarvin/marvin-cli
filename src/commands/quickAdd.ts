import { GET } from "../apiCall.ts";
import { Params, Options } from "../types.ts";

export default async function quickAdd(params: Params, cmdOpt: Options) {
  const res = await GET("/api/quickAdd", { });

  const responseText = await res.text();
  console.log(responseText);
}
