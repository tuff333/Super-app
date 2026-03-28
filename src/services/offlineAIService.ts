import { GoogleGenAI, Type } from "@google/genai";
import { AppModule } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SearchResult {
  type: string;
  title: string;
  description: string;
  moduleId: AppModule;
}

const OFFLINE_KNOWLEDGE_BASE = [
  { keywords: ['netflix', 'subscription', 'bill'], title: 'Netflix Subscription', description: 'Manage your Netflix subscription and billing in Budgeted.', moduleId: 'budgeted' as AppModule },
  { keywords: ['netflix', 'password', 'login'], title: 'Netflix Credentials', description: 'View your Netflix login details in SecureVault.', moduleId: 'vault' as AppModule },
  { keywords: ['panchang', 'tithi', 'ekadashi', 'festival'], title: 'Nirnay Panchang', description: 'Check today\'s Tithi, Ekadashi, and upcoming festivals.', moduleId: 'nirnay' as AppModule },
  { keywords: ['muhurat', 'marriage', 'vastu'], title: 'Auspicious Muhurats', description: 'Find the best dates for marriage, vastu, and other events.', moduleId: 'nirnay' as AppModule },
  { keywords: ['contact', 'lead', 'pipeline', 'crm', 'rasesh', 'ramesh', 'rahul'], title: 'CRM Contacts', description: 'Manage your business leads and contacts in CRM Hub.', moduleId: 'crm' as AppModule },
  { keywords: ['travel', 'flight', 'passport', 'india', 'trip'], title: 'Travel Planner', description: 'Organize your trip to India and check passport status in GlobeTrot.', moduleId: 'globetrot' as AppModule },
  { keywords: ['budget', 'expense', 'money', 'finance'], title: 'Budget Tracker', description: 'Monitor your spending and financial goals in Budgeted.', moduleId: 'budgeted' as AppModule },
  { keywords: ['document', 'pdf', 'ocr', 'merge', 'split'], title: 'Office Tools', description: 'Edit, convert, and manage your documents in Office Hub.', moduleId: 'office' as AppModule },
  { keywords: ['vachanamrut', 'swamini vato', 'spiritual', 'satsang'], title: 'Spiritual Hub', description: 'Read and listen to Vachanamrut and Swamini Vato.', moduleId: 'spiritual' as AppModule },
  { keywords: ['calculator', 'math', 'unit', 'conversion'], title: 'Smart Calculator', description: 'Perform complex calculations and unit conversions.', moduleId: 'calculator' as AppModule },
  { keywords: ['dark', 'theme', 'language', 'settings', 'gujarati'], title: 'App Settings', description: 'Customize your experience, change language or theme.', moduleId: 'settings' as AppModule },
];

export async function performAISearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  // If API key is present, try real AI search
  if (process.env.GEMINI_API_KEY) {
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
      console.error("AI Search Error, falling back to offline:", error);
    }
  }

  // Offline Fallback - Fuzzy Keyword Matching
  const lowerQuery = query.toLowerCase();
  const offlineResults: SearchResult[] = [];

  OFFLINE_KNOWLEDGE_BASE.forEach(item => {
    const isMatch = item.keywords.some(k => k.includes(lowerQuery) || lowerQuery.includes(k));
    if (isMatch) {
      offlineResults.push({
        type: 'offline',
        title: item.title,
        description: item.description,
        moduleId: item.moduleId
      });
    }
  });

  return offlineResults.slice(0, 5);
}

export async function getAIResponse(query: string): Promise<string> {
  if (!query) return "How can I help you today?";

  // If API key is present, try real AI response
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction: "You are AI Nexus, the central intelligence of a Super App. You have access to Nirnay Calendar (Panchang), Secure Vault, Office Hub, CRM Hub, GlobeTrot, Budgeted, and Spiritual Hub. Provide helpful, concise answers. If the user asks about app features, guide them to the relevant module. Use 'Jay Swaminarayan' as a greeting.",
        }
      });
      return response.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("AI Response Error, falling back to offline:", error);
    }
  }

  // Offline Fallback - Simple Rule-based Responses
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('panchang') || lowerQuery.includes('tithi') || lowerQuery.includes('ekadashi')) {
    return "Today is a great day to check the Nirnay Calendar. You can find the current Tithi, Choghadiya, and upcoming Ekadashi dates there.";
  }
  if (lowerQuery.includes('netflix')) {
    return "I found two entries for Netflix: your login credentials in SecureVault and your subscription details in Budgeted.";
  }
  if (lowerQuery.includes('trip') || lowerQuery.includes('india') || lowerQuery.includes('travel')) {
    return "Planning a trip? GlobeTrot can help you manage your itinerary, check world clocks, and track your passport status.";
  }
  if (lowerQuery.includes('budget') || lowerQuery.includes('expense') || lowerQuery.includes('money')) {
    return "You can track all your expenses and set financial goals in the Budgeted module.";
  }
  if (lowerQuery.includes('vachanamrut') || lowerQuery.includes('spiritual')) {
    return "The Spiritual Hub contains Vachanamrut and Swamini Vato for your daily study and reflection.";
  }
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('jay swaminarayan')) {
    return "Jay Swaminarayan! I'm your AI Nexus assistant. How can I help you manage your ecosystem today?";
  }

  return "I'm currently in Offline Mode. I can help with basic queries about your app modules like Calendar, Vault, Budget, and Spiritual Hub. For more complex reasoning, please connect to the internet.";
}
