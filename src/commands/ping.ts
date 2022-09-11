import { GET } from "../apiCall.ts";
import { Params, Options } from "../types.ts";

export default async function ping(params: Params, cmdOpt: Options) {
  const res = await GET("/api/", { });

  const responseText = await res.text();
  console.log(responseText);
}
