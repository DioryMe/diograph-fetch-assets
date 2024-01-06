import { ConnectionClient, Room, RoomClient } from "@diograph/diograph";
import { S3Client } from "./s3Client";
// import { S3Client } from "@diograph/s3-client";
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
  await room.loadRoom({
    S3Client: {
      clientConstructor: S3Client,
      credentials: { region: "eu-west-1", credentials },
    },
  });
  // // TODO: Should use S3Client#readToStream
  const response = await room.readContent(cid);

  return _arrayBufferToBase64(response);
};

function _arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export { readContentFromS3 };
