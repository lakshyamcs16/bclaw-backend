export interface IDocuments  {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: Array<IDocument>;
}

export interface IDocument {
    title: string;
    location: string;
    document_id: string;
    index_id: string;
}