import { Content, FunctionCall, GenerateContentResponse, Part } from "@google/genai";
import { portfolioToolDeclarations, portfolioToolHandlers } from "./tools";
import { ai } from "./client";
import { sleep } from "../manipulate/date";

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
    const generator = await ai.models.generateContentStream({
      model,
      contents: currentContents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: portfolioToolDeclarations }],
      },
    });

    // collect full response from stream
    const chunks: GenerateContentResponse[] = [];
    const functionCalls: FunctionCall[] = [];
    const contentParts: Part[] = [];

    for await (const chunk of generator) {
      chunks.push(chunk);

      if (chunk.functionCalls?.length) functionCalls.push(...chunk.functionCalls);

      const parts = chunk.candidates?.[0]?.content?.parts;
      if (parts?.length) contentParts.push(...parts);
    }

    // no func calls = return generator
    if (!functionCalls?.length) {
      // replay chunks as async generator
      return {
        finalContents: currentContents,
        generator: (async function* () {
          for (const chunk of chunks) {
            // fake stream effect
            await sleep(Math.random() * 30 + 20); // 20-50ms
            yield chunk;
          }
        })(),
      };
    }

    // exec tools
    const toolResults = await Promise.all(
      functionCalls.map(async (call): Promise<Part> => {
        if (!call.name || !(call.name in portfolioToolHandlers)) {
          return {
            functionResponse: {
              response: { error: `Tool with name "${call.name}" not found` },
            },
          };
        }
        const handler = portfolioToolHandlers[call.name as keyof typeof portfolioToolHandlers];
        const result = await handler();
        return {
          functionResponse: {
            name: call.name!,
            response: result as Record<string, unknown>,
          },
        };
      }),
    );

    if (toolResults.length) {
      currentContents.push({ role: "tool", parts: toolResults });
    }
    if (contentParts.length) {
      currentContents.push({ role: "model", parts: contentParts });
    }
  }

  // max iteration reached
  const generator = await ai.models.generateContentStream({
    model,
    contents: currentContents,
    config: {
      systemInstruction,
    },
  });

  return {
    finalContents: currentContents,
    generator,
  };
}
