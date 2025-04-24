"use client"

import mammoth from 'mammoth'
import { createCanvas } from 'canvas'
import JSZip from 'jszip'
import * as pdfjsLib from 'pdfjs-dist'

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

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

// Thumbnail styling
interface ThumbnailOptions {
  width: number
  height: number
  backgroundColor: string
  textColor: string
}

const DEFAULT_OPTIONS: ThumbnailOptions = {
  width: 400,
  height: 300,
  backgroundColor: '#ffffff',
  textColor: '#333333'
}

function createBaseCanvas(options: Partial<ThumbnailOptions> = {}) {
  const merged = { ...DEFAULT_OPTIONS, ...options }
  const canvas = createCanvas(merged.width, merged.height)
  const ctx = canvas.getContext('2d')
  
  ctx.fillStyle = merged.backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  return { canvas, ctx, options: merged }
}

// File handlers
type ThumbnailGenerator = (file: File) => Promise<string | null>

interface FileHandler {
  test: (bytes: Uint8Array) => boolean
  handle: ThumbnailGenerator
}

async function generatePdfThumbnail(file: File): Promise<string | null> {
  try {
    const { canvas, ctx } = createBaseCanvas()
    
    // Create a simple PDF preview with icon
    ctx.fillStyle = '#f40f02' // PDF red color
    ctx.fillRect(canvas.width/2 - 40, 20, 80, 100)
    
    // Add white "PDF" text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('PDF', canvas.width/2, 80)
    
    // Add file name below
    ctx.fillStyle = DEFAULT_OPTIONS.textColor
    ctx.font = '14px Arial'
    ctx.fillText(file.name, canvas.width/2, 140)
    
    // Add file size
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    ctx.fillText(`${sizeMB} MB`, canvas.width/2, 160)

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('PDF processing error:', error)
    throw new ThumbnailError(
      'Failed to generate PDF thumbnail',
      'PDF_PROCESSING_ERROR'
    )
  }
}

async function generateDocxThumbnail(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)
    
    // Try to find first image
    const imageEntries = Object.keys(zip.files)
      .filter(path => path.startsWith('word/media/'))
    
    if (imageEntries.length > 0 && imageEntries[0]) {
      const imageFile = zip.file(imageEntries[0])
      if (imageFile) {
        const imageData = await imageFile.async('base64')
        return `data:image/png;base64,${imageData}`
      }
    }

    // Fallback to text preview
    const { canvas, ctx } = createBaseCanvas()
    const result = await mammoth.extractRawText({ arrayBuffer })
    const text = result.value.substring(0, 500)
    
    ctx.fillStyle = DEFAULT_OPTIONS.textColor
    ctx.font = '14px Arial'
    ctx.textBaseline = 'top'
    
    // Type assertion for ctx since we know it's compatible
    const lines = wrapText(ctx as unknown as CanvasRenderingContext2D, text, canvas.width - 40)
    lines.forEach((line, index) => {
      ctx.fillText(line, 20, 40 + (index * 16))
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('DOCX processing error:', error)
    throw new ThumbnailError('Failed to generate DOCX thumbnail', 'DOCX_PROCESSING_ERROR')
  }
}

// Helper functions
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) lines.push(currentLine)
  return lines.slice(0, 15)
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
    
    if (!handler) return null
    return await handler.handle(file)
  } catch (error) {
    console.error('Thumbnail generation failed:', error)
    return null
  }
}

export { generateThumbnail, ThumbnailError }
