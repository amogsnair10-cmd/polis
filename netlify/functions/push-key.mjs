import { keys } from "../lib/push.mjs";
export default async () => Response.json({ key: (await keys()).publicKey });
export const config = { path: "/api/push-key" };
