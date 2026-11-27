import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BUFFER_CATEGORY = /misc|contingency|buffer|emergency/i;

/**
 * LLMs are unreliable at arithmetic, so the server recomputes the totals
 * from the model's own line items instead of trusting its numbers.
 * - estimated_total_cost = base expenses + recommended_misc_buffer
 * - weekly_savings_target_per_person = (total - current savings) / people / weeks
 * Breakdown rows that are themselves the buffer are excluded from the base,
 * so the buffer is never counted twice.
 */
export function verifyPlanMath(plan, tripData) {
  if (plan.financial_health_status === 'Out of Scope') return plan;

  const buffer = Number(plan.recommended_misc_buffer) || 0;
  const base = plan.expense_breakdown
    .filter((item) => !BUFFER_CATEGORY.test(item.category))
    .reduce((sum, item) => sum + (Number(item.estimated_amount) || 0), 0);

  const total = base + buffer;
  const remaining = Math.max(0, total - Number(tripData.currentSavings));
  const weekly = Math.ceil(remaining / tripData.groupSize / tripData.weeksLeft);

  return {
    ...plan,
    estimated_total_cost: total,
    weekly_savings_target_per_person: weekly,
  };
}

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

    return verifyPlanMath(JSON.parse(fullText), tripData);
  } catch (error) {
    console.error('Gemini API Streaming Error:', error);
    throw new Error('Failed to generate AI trip budget plan.');
  }
}