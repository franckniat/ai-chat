import { algoliasearch } from "algoliasearch";

export const searchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID! as string,
    process.env.ALGOLIA_WRITE_API_KEY! as string
);

