import algoliasearch from "https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch.esm.browser.js";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const { ALGOLIASEARCH_APPLICATION_ID, ALGOLIASEARCH_ADMIN_API_KEY } = config({ safe: true });

const algoliaConfig = JSON.parse(Deno.readTextFileSync("algolia/config.json"));
import { Index } from "../types.ts";
import * as fetch from "../requests/index.ts";

const client = algoliasearch(ALGOLIASEARCH_APPLICATION_ID, ALGOLIASEARCH_ADMIN_API_KEY);

type ResponsePutSettings = {
  updatedAt: string;
  taskID: string;
};

export let indices: Record<string, any>;

export async function initAlgolia(): Promise<void> {
  for (const [index, settings] of Object.entries(algoliaConfig.indices)) {
    indices = {
      ...indices,
      [index]: client.initIndex(index),
    };
    await putToAlgolia(`/indexes/${index}/settings`, settings);
  }
}

export async function putToAlgolia(path: string, payload: any): Promise<ResponsePutSettings> {
  const baseUrl: string = `https://${ALGOLIASEARCH_APPLICATION_ID}-dsn.algolia.net/1`;
	const url: string = baseUrl + path;
  const response = await fetch.put<unknown, ResponsePutSettings>(url, payload, {
    headers: {
      "X-Algolia-API-Key": ALGOLIASEARCH_ADMIN_API_KEY,
      "X-Algolia-Application-Id": ALGOLIASEARCH_APPLICATION_ID,
    },
  });
  return response;
}

initAlgolia();