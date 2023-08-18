import { MilvusClient } from "@zilliz/milvus2-sdk-node";
const address = "https://7200-202-173-127-209.ngrok-free.app";
const username = "username";
const password = "password";
const ssl = false;
const milvusClient = new MilvusClient({address, ssl, username, password});

export default milvusClient
