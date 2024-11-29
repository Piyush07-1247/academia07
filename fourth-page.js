import { gapi } from "https://apis.google.com/js/api.js";

// Google API credentials
const CLIENT_ID = "122863126500-sn9g76tcas0g4mss9d8t4prqe3pbi8p5.apps.googleusercontent.com";
const API_KEY = "AIzaSyAQJaxsZxHcL1VmfGssXweRVHFKyjVn28k"; // Replace with your actual API key
const SCOPES = "https://www.googleapis.com/auth/drive.file";

function handleAuthClick(folderName) {
  gapi.load("client:auth2", async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      scope: SCOPES,
    });

    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(() => createDriveFolder(folderName));
  });
}

async function createDriveFolder(folderName) {
  try {
    const response = await gapi.client.drive.files.create({
      resource: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });
    alert(`Folder "${folderName}" created successfully!`);
    window.open("https://drive.google.com/drive/u/0/my-drive");
  } catch (error) {
    console.error("Error creating folder:", error);
    alert("Failed to create folder. Check console for details.");
  }
}

document.querySelectorAll(".folder").forEach((folder) => {
  folder.addEventListener("click", (event) => {
    const folderName = event.currentTarget.id.replace("-", " ");
    handleAuthClick(folderName);
  });
});
