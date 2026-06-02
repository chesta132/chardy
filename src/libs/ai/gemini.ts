import { Content, GenerateContentResponse } from "@google/genai";
import { portfolioToolDeclarations, portfolioToolHandlers } from "./tools";
import { ai } from "./client";
import { collectStream, createGeneratorWithFakeStream, execTools } from "./gemini.lib";

type AgentLoopResult = {
  /** `finalContents` not include returned `generator` content */
  finalContents: Content[];
  generator: AsyncGenerator<GenerateContentResponse>;
};

const MAX_AGENT_LOOP = 3;

// this func wait for stream 2 times
//  - generator from `generateContentStream`
//  - on return - to avoid n+1 generate content
// or if max iter reached, it returns real generator
export async function runAgentLoop(contents: Content[], systemInstruction: string, model: string): Promise<AgentLoopResult> {
  let currentContents = [...contents];

  // max iter is MAX_AGENT_LOOP - 1
  for (let i = 1; i < MAX_AGENT_LOOP; i++) {
    const iterGenerator = await ai.models.generateContentStream({
      model,
      contents: currentContents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: portfolioToolDeclarations }],
      },
    });

    // collect full response from stream
    const { chunks, contentParts, functionCalls } = await collectStream(iterGenerator);

    // no func calls = return generator
    if (!functionCalls.length) {
      // replay chunks as async generator
      return {
        finalContents: currentContents,
        generator: createGeneratorWithFakeStream(chunks, 20, 50),
      };
    }

    // exec tools
    const toolResults = await execTools(functionCalls, portfolioToolHandlers);

    // append this iteration context
    if (contentParts.length) {
      currentContents.push({ role: "model", parts: contentParts });
    }
    if (toolResults.length) {
      currentContents.push({ role: "tool", parts: toolResults });
    }
  }

  // max iteration reached
  const finalGenerator = await ai.models.generateContentStream({
    model,
    contents: currentContents,
    config: {
      systemInstruction,
    },
  });

  return {
    finalContents: currentContents,
    generator: finalGenerator,
  };
}
