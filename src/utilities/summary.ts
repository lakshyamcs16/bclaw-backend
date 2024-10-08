import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const prompt = `Summarize this document and provide the response in complete, valid HTML format. Do not use markdown. The response should include:

1. A brief introduction paragraph
2. An unordered list with bullet points summarizing key aspects
3. A brief concluding paragraph

Ensure all HTML tags are properly opened and closed but DO NOT use header tags eg., (h1, h2) etc., and use appropriate semantic HTML5 elements where applicable. The response should be ready to be inserted into an HTML document body.`;

export const summarizeDocument = async (filepath: string): Promise<string> => {
  if (!filepath || filepath === "" || !filepath.includes("/")) {
    throw new Error("Invalid filepath");
  }

  const pathComponents = filepath.split("/");
  let fileManager: GoogleAIFileManager | null = null;
  let uploadedFileName: string | null = null;

  try {
    // Check if API key is set
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    // Initialize GoogleGenerativeAI with your API_KEY.
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // Initialize GoogleAIFileManager with your API_KEY.
    fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const uploadResponse = await fileManager.uploadFile(filepath, {
      mimeType: "text/xml",
      displayName: pathComponents[pathComponents.length - 1],
    });

    uploadedFileName = uploadResponse.file.name;

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );

    // Generate content using text and the URI reference for the uploaded file.
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: prompt },
    ]);

    if (!result.response) {
      throw new Error("Failed to generate content");
    }

    return result.response.text();
  } catch (error) {
    console.error("Error in summarizeDocument:", error);
    throw error; // throw the error after logging
  } finally {
    // delete the uploaded file if it exists
    if (fileManager && uploadedFileName) {
      try {
        await fileManager.deleteFile(uploadedFileName);
        console.log(`Deleted ${uploadedFileName}`);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
  }
};