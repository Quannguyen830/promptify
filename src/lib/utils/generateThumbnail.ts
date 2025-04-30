"use client"

import mammoth from 'mammoth'
import JSZip from 'jszip'
import * as pdfjsLib from 'pdfjs-dist'

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const FILE_SIGNATURES = {
  pdf: new Uint8Array([0x25, 0x50, 0x44, 0x46]), // %PDF
  docx: new Uint8Array([0x50, 0x4B, 0x03, 0x04]) // PK\x03\x04
}

// Error handling
class ThumbnailError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'ThumbnailError'
  }
}

// File handlers
type ThumbnailGenerator = (file: File) => Promise<string | null>

interface FileHandler {
  test: (bytes: Uint8Array) => boolean
  handle: ThumbnailGenerator
}

async function generatePdfThumbnail(file: File): Promise<string | null> {
  try {
    // Return a base64 encoded SVG for PDF files
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect x="160" y="20" width="80" height="100" fill="#f40f02" />
        <text x="200" y="80" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">PDF</text>
        <text x="200" y="140" font-family="Arial" font-size="14" fill="#333333" text-anchor="middle">${file.name}</text>
        <text x="200" y="160" font-family="Arial" font-size="14" fill="#333333" text-anchor="middle">${(file.size / (1024 * 1024)).toFixed(2)} MB</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  } catch (error) {
    console.error('PDF processing error:', error)
    return null
  }
}

async function generateDocxThumbnail(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // Try to extract text from DOCX
    let text = "";
    try {
      const result = await mammoth.extractRawText({ arrayBuffer })
      text = result.value.substring(0, 100) + (result.value.length > 100 ? "..." : "");
    } catch (err) {
      console.error("Error extracting text:", err);
      text = "Document preview not available";
    }
    
    // Create SVG with text preview
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#ffffff" />
        <rect x="160" y="20" width="80" height="100" fill="#2b579a" />
        <text x="200" y="80" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">DOCX</text>
        <text x="200" y="140" font-family="Arial" font-size="14" fill="#333333" text-anchor="middle">${file.name}</text>
        <text x="200" y="180" font-family="Arial" font-size="12" fill="#333333" text-anchor="middle">${text}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  } catch (error) {
    console.error('DOCX processing error:', error)
    return null
  }
}

const handlers: FileHandler[] = [
  {
    test: (bytes) => bytes.slice(0, 4).every((v, i) => v === FILE_SIGNATURES.pdf[i]),
    handle: generatePdfThumbnail
  },
  {
    test: (bytes) => bytes.slice(0, 4).every((v, i) => v === FILE_SIGNATURES.docx[i]),
    handle: generateDocxThumbnail
  }
]

// Main export
async function generateThumbnail(file: File): Promise<string | null> {
  try {
    if (file.size > MAX_FILE_SIZE) return null
    
    const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer())
    const handler = handlers.find(h => h.test(bytes))
    
    if (!handler) {
      // Generic thumbnail for unsupported file types
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#ffffff" />
          <rect x="160" y="20" width="80" height="100" fill="#888888" />
          <text x="200" y="80" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${fileExtension}</text>
          <text x="200" y="140" font-family="Arial" font-size="14" fill="#333333" text-anchor="middle">${file.name}</text>
          <text x="200" y="160" font-family="Arial" font-size="14" fill="#333333" text-anchor="middle">${(file.size / (1024 * 1024)).toFixed(2)} MB</text>
        </svg>
      `;
      
      return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    }
    
    return await handler.handle(file)
  } catch (error) {
    console.error('Thumbnail generation failed:', error)
    return null
  }
}

export { generateThumbnail, ThumbnailError }
