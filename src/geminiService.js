import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTripBudgetPlan(tripData, onChunk) {
  try {
    const promptText = `
      Analyze this group trip plan and generate a sinking-fund budget strategy in PHP:
      - Destination: ${tripData.destination}
      - Weeks Until Trip: ${tripData.weeksLeft}
      - Group Size: ${tripData.groupSize} friends
      - Total Current Group Savings: PHP ${tripData.currentSavings}
      - User-Listed Expected Expenses: ${JSON.stringify(tripData.expectedExpenses)}
    `;

    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash-lite',
      config: {
        systemInstruction: `You are an expert AI Travel Financial Planner and Sinking-Fund Coach for Tara, G!. Analyze the group's trip inputs, include a realistic 10-20% miscellaneous contingency buffer, calculate weekly savings targets per person in PHP, and respond strictly in valid JSON formatting. Reject non-budgeting queries.`,
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trip_summary: { type: Type.STRING },
            estimated_total_cost: { type: Type.NUMBER },
            recommended_misc_buffer: { type: Type.NUMBER },
            expense_breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  estimated_amount: { type: Type.NUMBER },
                  saving_tip: { type: Type.STRING }
                },
                required: ['category', 'estimated_amount', 'saving_tip']
              }
            },
            weekly_savings_target_per_person: { type: Type.NUMBER },
            financial_health_status: {
              type: Type.STRING,
              enum: ['On Track', 'Needs Adjustment', 'High Risk', 'Out of Scope']
            }
          },
          required: [
            'trip_summary',
            'estimated_total_cost',
            'recommended_misc_buffer',
            'expense_breakdown',
            'weekly_savings_target_per_person',
            'financial_health_status'
          ]
        }
      },
      contents: promptText
    });

    let fullText = '';
    for await (const chunk of stream) {
      const piece = chunk.text ?? '';
      fullText += piece;
      if (onChunk) onChunk(piece);
    }

    if (!fullText.trim()) throw new Error('Response blocked by safety filters or empty.');

    return JSON.parse(fullText);
  } catch (error) {
    console.error('Gemini API Streaming Error:', error);
    throw new Error('Failed to generate AI trip budget plan.');
  }
}