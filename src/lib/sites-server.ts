import { createServerFn } from "@tanstack/react-start";
import { fetchHomeData as getSitesData } from "../server/sites-server";

export const fetchHomeData = createServerFn({ method: "GET" }).handler(async () => {
  return await getSitesData();
});
