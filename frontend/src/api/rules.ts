// frontend/src/api/rules.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/rules";

export interface RuleBook {
  filename: string;
  title: string;
  description: string;
  size: number;
  url: string;
}

export interface RuleCategory {
  id: string;
  name: string;
  books: RuleBook[];
}

/**
 * Get all rulebook categories from the API
 * @returns Array of rulebook categories with their books
 */
export const getRuleBooks = async (): Promise<RuleCategory[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books/`);
    
    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error("Failed to get rulebooks data");
    }
  } catch (error) {
    console.error("❌ Failed to get rulebooks:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Error ${error.response.status}: ${error.response.data.error || 'Unknown error'}`);
    }
    throw new Error("Network error while fetching rulebooks");
  }
};

/**
 * Get URL for viewing a specific PDF
 * @param filename Name of the PDF file
 * @returns Full URL to access the PDF
 */
export const getPDFViewUrl = (filename: string): string => {
  return `${API_BASE_URL}/pdf/${encodeURIComponent(filename)}`;
};

/**
 * Get download URL for a specific PDF
 * @param filename Name of the PDF file
 * @returns Full URL to download the PDF
 */
export const getPDFDownloadUrl = (filename: string): string => {
  return `${API_BASE_URL}/pdf/${encodeURIComponent(filename)}`;
};