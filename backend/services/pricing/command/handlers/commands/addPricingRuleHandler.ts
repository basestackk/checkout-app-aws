import { getInventoryItems } from '../../../../../repositories/';
import { GPTService } from '../../../../../gpt';
import { addPricingRule } from '../../../../../repositories/pricingRepository';
import * as dotenv from 'dotenv';

dotenv.config();

export async function addPricingRuleHandler(command: Record<string, unknown>): Promise<string> {
  try {
    const { rule } = command.payload as Record<string, unknown>;
    const items = await getInventoryItems('inventory');
    
    if (!items?.Items?.length) {
      throw new Error("No items found in the inventory.");
    }

    const prompt = process.env.DISCOUNT_RULE_PROMPT || '';
    const finalPrompt = `${prompt} ${rule} ${JSON.stringify(items)}`;

    const gptService = GPTService.instance(process.env.OPENAI_API_KEY || '');
    const gptOutput = await gptService.generateOutput(finalPrompt);

    return await addPricingRule('pricing', gptOutput);
  } catch (error) {
    throw new Error(`Error in addPricingRuleHandler: ${(error as Error).message}`);
  }
}
