import { ConnectionClient, Room, RoomClient } from "@diograph/diograph";
import { S3Client } from "./s3Client";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const getClientAndVerify = async (
  clientType: string,
  address: string,
  credentials: AwsCredentialIdentity
): Promise<ConnectionClient> => {
  console.log(`Verifying address for ${clientType}:`, address);
  let client: ConnectionClient;

  if ("S3Client") {
    client = new S3Client(address, { region: "eu-west-1", credentials });
    await client.verify();
  } else {
    throw new Error(`getClientAndVerify: Unknown clientType: ${clientType}`);
  }

  return client;
};

const initiateRoom = async (client: ConnectionClient): Promise<Room> => {
  const roomClient = new RoomClient(client);
  const room = new Room(roomClient);
  return room;
};

const readContentFromS3 = async (
  address: string,
  cid: string,
  credentials: AwsCredentialIdentity
) => {
  const roomClientType = "S3Client";

  const client = await getClientAndVerify(roomClientType, address, credentials);
  const room = await initiateRoom(client);
  // await room.loadRoom({ S3Client: S3Client });
  // // TODO: Should use S3Client#readToStream
  // const response = await room.readContent(cid);

  // return response.toString("base64");
  return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOMPvD6PwAGiwMHcHyXEAAAAABJRU5ErkJggg==";
};

export { readContentFromS3 };
