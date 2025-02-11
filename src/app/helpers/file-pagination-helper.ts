// Constants for pagination
const CHARS_PER_PAGE = 3000; // Adjust based on your needs
const MIN_LINES_PER_PAGE = 50; // Minimum number of lines per page

// Utility function to split content into pages
export function paginateContent(content: string): string[] {
  // Split the content into lines first
  const lines = content.split('\n');
  const pages: string[] = [];
  let currentPage = '';
  let currentChars = 0;
  let currentLines = 0;

  for (const line of lines) {
    // Check if adding this line would exceed our target page size
    if (currentChars + line.length > CHARS_PER_PAGE || currentLines >= MIN_LINES_PER_PAGE) {
      // If we have content for the current page, add it to pages
      if (currentPage) {
        pages.push(currentPage.trim());
        currentPage = '';
        currentChars = 0;
        currentLines = 0;
      }
    }

    // Add the line to the current page
    currentPage += line + '\n';
    currentChars += line.length;
    currentLines++;
  }

  // Add the last page if there's any content left
  if (currentPage) {
    pages.push(currentPage.trim());
  }

  // If no pages were created (very short content), create at least one page
  if (pages.length === 0) {
    pages.push(content.trim());
  }

  return pages;
}