import { constructAndLoadRoom } from "@diograph/utils";
import { S3Client } from "@diograph/s3-client";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const readContentFromS3 = async (
  address: string,
  cid: string,
  credentials: AwsCredentialIdentity
) => {
  const roomClientType = "S3Client";

  const room = await constructAndLoadRoom(address, roomClientType, {
    S3Client: {
      clientConstructor: S3Client,
      credentials: { region: "eu-west-1", credentials },
    },
  });

  // TODO: Should use S3Client#readToStream
  const response = await room.readContent(cid);

  return arrayBufferToBase64(response);
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window
    ? window.btoa(binary)
    : Buffer.from(buffer).toString("base64");
}

export { readContentFromS3 };
