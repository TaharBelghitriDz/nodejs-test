import got from "got";
import { URL } from "node:url";
import "dotenv/config";

const baseUrl = process.env.BASELINK as string;

// token needs to regenerate every 3 days
const token = process.env.TOKEN as string;

const getClients = async (query: { limit: number; offset: number }) => {
  const url = new URL(baseUrl);

  url.searchParams.append("limit", query.limit.toString());
  url.searchParams.append("offset", query.offset.toString());

  return got
    .get(url.href, {
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
    })
    .then((result) => ({ error: null, json: JSON.parse(result.body) }))
    .catch((e) => ({ json: null, error: e }));
};

const getClientsStatus = (body: { userIds: number[] }) =>
  got
    .post(baseUrl, {
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    .then((result) => ({
      error: null,
      json: JSON.parse(result.body),
    }))
    .catch((e) => ({ json: null, error: e }));

// call taskTest to test the api calls
const taskTest = async () => {
  const clientsQuery = {
    limit: Math.floor(Math.random() * 100),
    offset: Math.floor(Math.random() * 100),
  };

  const clients = await getClients(clientsQuery);
  console.log(clients);

  const clientsStatusBody = {
    userIds: Array.from({ length: Math.floor(Math.random() * 100) }).map(
      (_, i) => i
    ),
  };

  const clientsStatus = await getClientsStatus(clientsStatusBody);
  console.log(clientsStatus);
};

taskTest();
