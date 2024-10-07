import { BC_LAW_DOCUMENT_API, FETCH_TIMEOUT_DURATION_MS } from "./constants";
import fs from 'fs/promises';
import path from 'path';

export const fetchDocument = async (
  jurisdiction: string,
  documentId: string,
): Promise<string> => {
  try {
    const response = await fetch(
      `${BC_LAW_DOCUMENT_API}/${encodeURIComponent(jurisdiction)}/${encodeURIComponent(documentId)}/xml`,
      { signal: AbortSignal.timeout(FETCH_TIMEOUT_DURATION_MS) }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlContent = await response.text();
    const filepath = await downloadDocument(jurisdiction, documentId, xmlContent);
    
    return filepath;
  } catch (error) {
    console.error("Error fetching or saving document:", error);
    throw error;
  }
};

export const downloadDocument = async (
    jurisdiction: string,
    documentId: string,
    xmlContent: string
): Promise<string> => {

    // Create a filename based on jurisdiction and documentId
    const filename = `${jurisdiction}_${documentId}.xml`;
    const filepath = path.join(process.cwd(), 'documents', filename);

    // Ensure the directory exists
    await fs.mkdir(path.dirname(filepath), { recursive: true });

    // Write the XML content to the file
    await fs.writeFile(filepath, xmlContent, 'utf8');

    console.log(`XML response saved to ${filepath}`);

    return filepath;
}

export const deleteDocument = async (
    filepath: string
): Promise<boolean> => {
    try{
        await fs.rm(filepath);
        return true;
    } catch(err) {
        console.log(`Failed to delete directory`);
    }

    return false;
}