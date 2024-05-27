/**
 * Returns whether we should download the bulk data again.
 */
export function shouldDownloadData(): boolean {
  /**
   * 1. Get info:
   *    previous downloaded timestamp
   *    current timestamp (now())
   * 2. Calculate difference
   * 3. If greater than 1 week: return true
   *    Else return false
   */
  return true;
}

/**
 * Fetches the bulk-data from Scryfall API and stores it.
 * Returns `true` if successful, and `false` if failure
 */
export function fetchBulkData(): boolean {
  return true;
}
