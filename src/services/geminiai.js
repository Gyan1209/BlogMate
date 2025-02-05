import conf from '../conf/conf.js';

class SummaryService {
    constructor() {
        this.API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
        this.API_KEY = conf.geminiApiKey; // Add this to your conf.js
    }

    async generateSummary(content) {
        try {
            // Clean the content by removing HTML tags and trimming
            const plainText = content.replace(/<[^>]*>/g, '').trim();
            
            if (!plainText) {
                throw new Error('Please add some content to summarize');
            }

            // Prepare the prompt for better summaries
            const prompt = `Please create a concise and engaging summary of the following blog post. 
            Keep it under 150 words while maintaining the key points and main message:
            
            ${plainText}`;

            // Make the API call to Gemini
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 200,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error?.message || 'Failed to generate summary');
            }

            const result = await response.json();

            // Extract the summary from Gemini's response
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                return result.candidates[0].content.parts[0].text.trim();
            } else {
                throw new Error('Invalid response format from the summarization service');
            }

        } catch (error) {
            console.error('Summary Service Error:', error);
            throw new Error(error.message || 'Failed to generate summary. Please try again.');
        }
    }
}

export default new SummaryService();
