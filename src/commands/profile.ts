import { GET } from "../apiCall.ts";
import { globalOptionHelp } from "../options.ts";
import { printResult } from "../printResult.ts";
import { Params, Options } from "../types.ts";

export default async function profile(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(profileHelp);
    Deno.exit(0);
  }

  if (params.length !== 0) {
    console.error(profileHelp);
    Deno.exit(1);
  }

  try {
    const res = await GET("/api/me", { });
    await printResult(res);
    Deno.exit(0);
  } catch (err) {
    console.error(err.message);
    Deno.exit(1);
  }
}

export const profileHelp = `
marvin profile

Get profile information. For documentation about the result, see:
https://github.com/amazingmarvin/MarvinAPI/wiki/Marvin-Data-Types#profile for

EXAMPLE:
    $ marvin profile
    {
      userId: "301231023",
      email: "tester@marvintesting.com",
      parentEmail: "",
      emailConfirmed: true,
      billingPeriod: "TRIAL",
      paidThrough: "2021-04-26T15:54:07.628206Z",
      iosSub: false,
      marvinPoints: 32142,
      nextMultiplier: 0,
      rewardPointsEarned: 25,
      rewardPointsSpent: 12,
      rewardPointsEarnedToday: 2,
      rewardPointsSpentToday: 1,
      rewardPointsLastDate: "2021-04-12",
      tomatoes: 184,
      tomatoesToday: 3,
      tomatoTime: 102844000,
      tomatoTimeTOday: 142000,
      tomatoDate: "2021-04-10",
      defaultSnooze: 0,
      defaultAutoSnooze: false,
      defaultOffset: 0,
      currentVersion: "1.60.0",
      signupAppVersion: "1.58.0",
    }
OPTIONS:
${globalOptionHelp}
`.trim();
