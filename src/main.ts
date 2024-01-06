import { readContentFromS3 } from "./room-service";

document
  .querySelector<HTMLButtonElement>("#submit")!
  .addEventListener("click", () => handleSubmit());

interface FormData {
  address: string;
  key: string;
  secret: string;
  cid: string;
}

const address = document.getElementById("address") as HTMLInputElement;
const key = document.getElementById("key") as HTMLInputElement;
const secret = document.getElementById("secret") as HTMLInputElement;
const cid = document.getElementById("cid") as HTMLInputElement;

address.value = localStorage.getItem("a") || "s3://jvalanen-diory-test3/room";
key.value = localStorage.getItem("k") || "key";
secret.value = localStorage.getItem("s") || "secret";
cid.value =
  localStorage.getItem("cid") ||
  "bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu";

async function fetchBufferAndRenderImage(formData: FormData) {
  console.log(formData);

  const credentials = {
    accessKeyId: formData.key,
    secretAccessKey: formData.secret,
  };

  const base64Image = await readContentFromS3(
    formData.address,
    formData.cid,
    credentials
  );

  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  // Render the image
  const imageContainer = document.getElementById(
    "imageContainer"
  ) as HTMLImageElement;
  const fetchedImage = document.getElementById(
    "fetchedImage"
  ) as HTMLImageElement;

  fetchedImage.src = dataUrl;
  imageContainer.style.display = "block";
}

// Handle form submission
export function handleSubmit() {
  const address = document.getElementById("address") as HTMLInputElement;
  const key = document.getElementById("key") as HTMLInputElement;
  const secret = document.getElementById("secret") as HTMLInputElement;
  const cid = document.getElementById("cid") as HTMLInputElement;

  const formData: FormData = {
    address: address.value,
    key: key.value,
    secret: secret.value,
    cid: cid.value,
  };

  fetchBufferAndRenderImage(formData);
}
