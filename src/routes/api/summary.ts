import { Router, Request, Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import {
  errorHandler,
  validateInput,
} from "../../middleware/validate";
import { deleteDocument, fetchDocument } from "../../utilities/document";
import { BC_LAW_DOCUMENT_API } from "../../utilities/constants";
import { summarizeDocument } from "../../utilities/summary";
// Create a new Express router
const router: Router = Router();

// @route   GET api/summarize/{jurisdiction}/{documentId}
// @desc    Get a summary of the given document
// @access  Public
router.get(
  "/:jurisdiction/:documentId",
  validateInput, // Middleware to validate the input
  async (req: Request, res: Response, next: NextFunction) => {
    let filepath = "";

    try {
      // Extract the path variable from the request
      const { jurisdiction, documentId } = req.params;

      filepath = await fetchDocument(jurisdiction, documentId);
      const startTime = performance.now();
      const summarizedContent = await summarizeDocument(filepath);
      const timeTaken = performance.now() - startTime;

      // Send the response with the search results
      res
      .status(HttpStatusCodes.OK)
      .json({
        url: `${BC_LAW_DOCUMENT_API}/${encodeURIComponent(
          jurisdiction
        )}/${encodeURIComponent(documentId)}`,
        summary: summarizedContent,
        time_taken: parseInt(timeTaken.toFixed(2), 10)
      });
    } catch (err) {
      // Pass any errors to the error handling middleware
      next(err);
    } finally {
      deleteDocument(filepath);
    }
  }
);

// Apply error handling middleware to the router
router.use(errorHandler);

export default router;
