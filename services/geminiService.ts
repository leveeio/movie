import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, MovieResource } from '../types';

// Lazy initialization to prevent runtime crashes if process.env is not immediately available
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResource = async (title: string, synopsis: string): Promise<AnalysisResult> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following film resource as if you are a high-tech surveillance system profiling a suspect or an event. Return the analysis in CHINESE.
      
      Film: ${title}
      Synopsis: ${synopsis}
      
      Provide a psychological profile of the main character(s), key visual motifs, and a "risk assessment" of the film's themes (e.g. is it disturbing, revolutionary, calm?).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            psychologicalProfile: {
              type: Type.STRING,
              description: "A clinical, detached analysis of the protagonist's mental state in Chinese.",
            },
            visualMotifs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 key visual elements observed (in Chinese).",
            },
            riskAssessment: {
              type: Type.STRING,
              description: "High, Medium, or Low threat level based on intensity (in Chinese).",
            }
          },
          required: ["psychologicalProfile", "visualMotifs", "riskAssessment"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      psychologicalProfile: "数据损坏。无法生成档案。",
      visualMotifs: ["静止", "噪点", "错误"],
      riskAssessment: "未知"
    };
  }
};

export const generateMovieMetadata = async (title: string): Promise<Partial<MovieResource>> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Identify the film "${title}". Return a JSON object with the following fields.
            Important: The 'synopsis' and 'systemNotes' and 'styleKeywords' and 'genre' MUST be in CHINESE.
            
            - year (number)
            - director (string - keep original name if famous, or Chinese translation)
            - genre (array of strings in Chinese)
            - synopsis (a single sentence summary in Chinese)
            - styleKeywords (3 adjectives describing visual style in Chinese)
            - systemNotes (a short, cryptic, sci-fi style status report about the film's content in Chinese, e.g. "检测到现实扭曲力场。")`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        year: { type: Type.NUMBER },
                        director: { type: Type.STRING },
                        genre: { type: Type.ARRAY, items: { type: Type.STRING } },
                        synopsis: { type: Type.STRING },
                        styleKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        systemNotes: { type: Type.STRING }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No metadata returned");
        return JSON.parse(text);
    } catch (error) {
        console.error("Metadata generation failed:", error);
        return {
            year: new Date().getFullYear(),
            director: "Unknown",
            genre: ["未分类"],
            synopsis: "档案中无可用数据。",
            styleKeywords: ["N/A"],
            systemNotes: "需要手动录入。自动扫描失败。"
        };
    }
}