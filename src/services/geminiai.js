import conf from '../conf/conf.js';

class SummaryService {
    constructor() {
        this.API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";
        this.API_KEY = conf.geminiApiKey; 
    }

    async generateSummary(content) {
  try {
   
    const plainText = content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!plainText) {
      throw new Error("Please add some content to summarize");
    }


    const prompt = `
Generate a concise, reader-friendly summary of the blog post below.
- Maximum 150 words
- Focus on main ideas and conclusions
- Do not add new information
- Avoid repetition

Blog post:
${plainText}
`;

    const response = await fetch(
      `${this.API_URL}?key=${this.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 150
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error?.error?.message || "Failed to generate summary"
      );
    }

    const result = await response.json();

   
    const summary =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      throw new Error("Empty summary received from AI service");
    }

    return summary.trim();

  } catch (error) {
    console.error("Summary Service Error:", error);
    throw new Error(
      error.message || "Failed to generate summary. Please try again."
    );
  }
}
}

export default new SummaryService();
