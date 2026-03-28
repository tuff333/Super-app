import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SearchResult {
  type: string;
  title: string;
  description: string;
  moduleId: string;
}

export async function performAISearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for "${query}" across a super app with modules: 
      - Nirnay Calendar (Panchang, events)
      - Secure Vault (passwords, secrets, Netflix login)
      - Office Hub (documents, notes)
      - AI Nexus (AI chat)
      - CRM Hub (pipelines, leads, contacts like Rahul, Ram, Ramesh)
      - GlobeTrot (travel planning)
      - Budgeted (finance, subscriptions like Netflix)
      - Calculator (math, unit conversion)
      - Spiritual Hub (Vachanamrut, Swamini Vato)
      - PDF Tools (merge, split pdf)
      - Settings (dark mode, language, preferences)

      Instructions:
      1. If the query is a typo (e.g., "raseh"), correct it to "rasesh" and search for related contacts.
      2. If the query is "Netflix", return results for both Secure Vault (password) and Budgeted (subscription).
      3. If the query is "dark" or "theme", return a result for Settings (Dark Mode).
      4. Return a JSON array of up to 5 relevant results.
      5. Each result should have: type (string), title (string), description (string), moduleId (one of: nirnay, vault, office, nexus, crm, globetrot, budgeted, calculator, spiritual, pdf, settings).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              moduleId: { type: Type.STRING },
            },
            required: ["type", "title", "description", "moduleId"],
          },
        },
      },
    });

    const results = JSON.parse(response.text || "[]");
    return results;
  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
}
