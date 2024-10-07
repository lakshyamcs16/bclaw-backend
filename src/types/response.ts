export interface ISearchResults {
    results: IResults
}

interface IResults {
    query: string;
    allHits: number;
    totalhits: number;
    doc: IDoc[];
}

export interface IDoc {
  hits: number;
  CIVIX_DOCUMENT_TITLE: string;
  CIVIX_DOCUMENT_LOC: string;
  CIVIX_DOCUMENT_ID: string;
  CIVIX_INDEX_ID: string;
  CIVIX_DOCUMENT_INDEX: boolean;
  CIVIX_DOCUMENT_TYPE: string;
  CIVIX_DOCUMENT_PARENT: string;
  CIVIX_DOCUMENT_ANCESTORS: string[];
  CIVIX_DOCUMENT_STATUS?: string;
  frag: IFrag;
}

interface IFrag {
  b: IB[];
  text: string;
}

interface IB {
  loc: number;
  text: string;
}