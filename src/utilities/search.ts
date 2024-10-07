import { IDocuments, IDocument } from "metadata";
import { IDoc, ISearchResults } from "response";
import {
  BC_LAW_SEARCH_API,
  FETCH_TIMEOUT_DURATION_MS,
  PAGE_SIZE,
} from "./constants";
import { createXMLBuilder } from "./parser";

/**
 * Fetches documents metadata for a given term and jurisdiction
 *
 * @param jurisdiction - The jurisdiction to search within
 * @param term - The search term used to query the BC Law API
 * @param page - The page number of results to fetch
 * @returns A promise that resolves to documents result
 * @throws Error if the fetch request fails or if parsing fails
 */
export const fetchDocumentsMetadata = async (
  jurisdiction: string,
  term: string,
  page: number
): Promise<IDocuments> => {
  const pageStart = page * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;

  try {
    const response = await fetch(
      `${BC_LAW_SEARCH_API}?q=title:${encodeURIComponent(
        term
      )}&qTerms=${encodeURIComponent(term)}&ancestor=${encodeURIComponent(
        jurisdiction
      )}&f=title&s=${pageStart}&e=${pageEnd}&nFrag=5&IFrag=100`,
      { signal: AbortSignal.timeout(FETCH_TIMEOUT_DURATION_MS) }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlData = await response.text();
    return await parseXML(xmlData, page);
  } catch (error) {
    console.error("Error fetching documents metadata:", error);
    throw error;
  }
};

/**
 * Parses XML data into a structured IDocuments object
 *
 * @param xmlData - The XML data to parse
 * @param page - The current page number
 * @returns A promise that resolves to an IDocuments object
 * @throws Error if parsing fails
 */
export const parseXML = async (
  xmlData: string,
  page: number
): Promise<IDocuments> => {
  try {
    const xmlContent = createXMLBuilder(xmlData) as ISearchResults;
    const totalHits = Number(xmlContent.results.totalhits);
    const totalPages = Math.ceil(totalHits / PAGE_SIZE);

    if (isNaN(totalHits)) {
      throw new Error("Invalid totalhits value in XML response");
    }

    if (page > totalPages) {
      throw new Error("Given page is greater than the total pages");
    }

    if (totalHits < 1) {
        throw new Error("No result found for the given query");
    }

    return {
      page: page + 1,
      per_page: PAGE_SIZE,
      total: totalHits,
      total_pages: totalPages,
      data: buildResult(xmlContent.results.doc),
    };
  } catch (error) {
    console.error("Error parsing XML:", error);
    throw error;
  }
};

/**
 * Builds an array of IDocument objects from the parsed XML data
 *
 * @param documentsMetadata - Array of IDoc objects from parsed XML
 * @returns An array of IDocument objects
 */
const buildResult = (documentsMetadata: Array<IDoc>): Array<IDocument> => {
  return documentsMetadata.map(
    ({
      CIVIX_DOCUMENT_ID,
      CIVIX_INDEX_ID,
      CIVIX_DOCUMENT_LOC,
      CIVIX_DOCUMENT_TITLE,
    }) => ({
      document_id: CIVIX_DOCUMENT_ID,
      index_id: CIVIX_INDEX_ID,
      location: CIVIX_DOCUMENT_LOC,
      title: CIVIX_DOCUMENT_TITLE,
    })
  );
};
