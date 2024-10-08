# Design assumptions

1. The system will use the [BC Laws database](https://bclaws.gov.bc.ca) as the primary source for searches and document retrievals.

2. Search functionality will focus on document titles adhering to the requirement of searching by topic, not full-text, simplifying the process but potentially limiting result depth. It will distinguish between two **assumed jurisdictions**: Public Statutes and Regulations, and Private, Special and Local Statutes and Regulations, covering all relevant areas of BC legislation.

3. A Large Language Model (LLM) will generate concise paragraph summaries of selected documents. Thus, the **summary generation may be slower and vary slightly with each generation due to LLM processing**.

4. As a Proof of Concept (PoC), performance optimizations like caching, multi-threading, or advanced indexing are out of scope. This allows for straightforward implementation but may impact system responsiveness and efficiency.

5. Due to the frontend being hosted on GitHub Pages, which uses HTTPS, the backend must also use the same secure protocol. To achieve this, I've implemented a self-signed SSL certificate. However, this may trigger security warnings when accessing the site for the first time. **Users might need to manually allow insecure connections to proceed**, particularly in browsers like **Safari** for the application to work.
