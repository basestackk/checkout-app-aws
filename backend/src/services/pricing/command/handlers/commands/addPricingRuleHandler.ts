import { getInventoryItems } from '../../../../../repositories/';
import { GPTService } from '../../../../../gpt';
import { addPricingRule } from '../../../../../repositories/pricingRepository';
import * as dotenv from 'dotenv';

dotenv.config();

export async function addPricingRuleHandler(command: any): Promise<string> {
  try {
    const { rule } = command.payload;
    const items = await getInventoryItems('inventory');
    
    if (!items?.length) {
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
