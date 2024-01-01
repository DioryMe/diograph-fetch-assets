import { ConnectionClient, Room, RoomClient } from "@diograph/diograph";
import { S3Client } from "@diograph/s3-client";

const getClientAndVerify = async (
  clientType: string,
  address: string
): Promise<ConnectionClient> => {
  console.log(`Verifying address for ${clientType}:`, address);
  let client: ConnectionClient;
  if ("S3Client") {
    client = new S3Client(address);
    await client.verify();
  } else {
    throw new Error(`getClientAndVerify: Unknown clientType: ${clientType}`);
  }

  return client;
};

const initiateRoom = async (
  contentClientType: string,
  address: string
): Promise<Room> => {
  const client = await getClientAndVerify(contentClientType, address);
  const roomClient = new RoomClient(client);
  const room = new Room(roomClient);
  return room;
};

const readContentFromS3 = async (address: string, cid: string) => {
  const roomClientType = "S3Client";

  const room = await initiateRoom(roomClientType, address);
  await room.loadRoom({ S3Client: S3Client });
  // TODO: Should use S3Client#readToStream
  const response = await room.readContent(cid);

  return response.toString("base64");
};

export { readContentFromS3 };
