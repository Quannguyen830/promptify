import mammoth from 'mammoth';

export const convertDocxToText = async (buffer: ArrayBuffer) => {
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
    return result.value;
  } catch (error) {
    console.error('Error converting DOCX to text:', error);
    return 'Error converting document';
  }
};