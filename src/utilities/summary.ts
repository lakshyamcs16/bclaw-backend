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

  // Initialize GoogleGenerativeAI with your API_KEY.
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // Initialize GoogleAIFileManager with your API_KEY.
  const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    // Choose a Gemini model.
    model: "gemini-1.5-flash",
  });

  const uploadResponse = await fileManager.uploadFile(filepath, {
    mimeType: "text/xml",
    displayName: pathComponents[pathComponents.length - 1],
  });

  // View the response.
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

  await fileManager.deleteFile(uploadResponse.file.name);
  console.log(`Deleted ${uploadResponse.file.displayName}`);

  return result.response.text();
};
