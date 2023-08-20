import { MilvusClient } from "@zilliz/milvus2-sdk-node";
const address = "localhost:19530";
const username = "username";
const password = "password";
const ssl = false;
const milvusClient = new MilvusClient({address, ssl, username, password});

export default milvusClient
