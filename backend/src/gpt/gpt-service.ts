import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

export class GPTService {
  static _instance: GPTService;
  private _client: OpenAI;

  private constructor(key: string) {
    this._client = new OpenAI({ apiKey: key });
  }

  static instance(key: string): GPTService {
    if (!GPTService._instance) {
      GPTService._instance = new GPTService(key);
    }
    return GPTService._instance;
  }

  async generateOutput(prompt: string): Promise<any> {
    try {
      const completion = await this._client.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const outputResponse = completion.choices[0].message;

      const cleanedContent = outputResponse
        .content!.replace(/^```json\n|\n```$/g, "")
        .trim();

      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Error deleting data from DynamoDB:", error);
      throw new Error("Failed to generate output from OpenAI");
    }
  }
}
