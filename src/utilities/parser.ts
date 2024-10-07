import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { ISearchResults } from "response";

export const createXMLBuilder = (xmlData: string): ISearchResults => {
    const parser = new XMLParser({
        ignoreDeclaration: true,
        attributeNamePrefix: "",
        ignorePiTags: true,
        ignoreAttributes: false,
    });
    const jObj = parser.parse(xmlData);

    return jObj as ISearchResults;
}