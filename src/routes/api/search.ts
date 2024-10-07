import { Router, Request, Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import { validateQuery, errorHandler, validateInput, validatePage } from "../../middleware/validate";
import { fetchDocumentsMetadata } from "../../utilities/search";

// Create a new Express router
const router: Router = Router();

// @route   GET api/search/{jurisdiction}?query=<search_query>&page=<page_number>
// @desc    Get results for a given query and page under the {jurisdiction}
// @access  Public
router.get(
  "/:jurisdiction",
  validateQuery,  // Middleware to validate the query parameter
  validatePage,   // Middleware to validate the page number
  validateInput,  // Middleware to validate the input
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the path variable from the request
      const { jurisdiction } = req.params;

      // Extract the query parameter from the request
      const { query, page } = req.query;

      let pageInt = 0;

      // Check if query is provided and is a string
      if (!query || typeof query !== 'string') {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ error: "Query parameter is required and must be a string" });
      }

      // Check if page is provided and is a number
      if (!page || typeof page !== 'string') {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ error: "Page parameter is required" });
      }

      pageInt = parseInt(page, 10);
      if (!pageInt || pageInt < 1) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ error: "Page must be a number >= 1" });
      }

      // Normalize the query to NFC (Normalization Form Canonical Composition)
      const normalizedQuery = query.normalize("NFC");
      
      const parsedResponse = await fetchDocumentsMetadata(jurisdiction, normalizedQuery, pageInt - 1);

      // Send the response with the search results
      res
      .status(HttpStatusCodes.OK)
      .json({
        data: parsedResponse
      });
    } catch (err) {
      // Pass any errors to the error handling middleware
      next(err);
    }
  }
);

// Apply error handling middleware to the router
router.use(errorHandler);

export default router;