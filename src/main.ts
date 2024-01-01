// Mocked response with ReadableStream
function getMockedResponse(): Response {
  const base64ImageData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOMPvD6PwAGiwMHcHyXEAAAAABJRU5ErkJggg==";

  // Decode the base64 string to an array of bytes
  const decodedImageData = atob(base64ImageData.split(",")[1]);
  const byteArray = new Uint8Array(decodedImageData.length);

  for (let i = 0; i < decodedImageData.length; i++) {
    byteArray[i] = decodedImageData.charCodeAt(i);
  }

  // Create a ReadableStream from the mocked image data
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(byteArray);
      controller.close();
    },
  });

  // Create a Response object with the ReadableStream
  const mockedResponse = new Response(stream, {
    headers: { "Content-Type": "image/jpeg" }, // Adjust the content type accordingly
  });

  return mockedResponse;
}

// Define a function to fetch and render the image from a ReadableStream
async function fetchAndRenderImage(formData: any) {
  console.log(formData);
  try {
    // const response = await fetch("YOUR_API_ENDPOINT", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });

    const response = getMockedResponse();

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Render the image
      const imageContainer = document.getElementById(
        "imageContainer"
      ) as HTMLImageElement;
      const fetchedImage = document.getElementById(
        "fetchedImage"
      ) as HTMLImageElement;

      fetchedImage.src = imageUrl;
      imageContainer.style.display = "block";
    } else {
      throw new Error("Failed to fetch image");
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// Handle form submission
function handleSubmit() {
  const address = document.getElementById("address") as HTMLInputElement;
  const key = document.getElementById("key") as HTMLInputElement;
  const secret = document.getElementById("secret") as HTMLInputElement;
  const cid = document.getElementById("cid") as HTMLInputElement;

  const formData = {
    address: address.value,
    key: key.value,
    secret: secret.value,
    cid: cid.value,
  };

  fetchAndRenderImage(formData);
}
