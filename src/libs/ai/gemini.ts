import { Content, FunctionCall, GenerateContentResponse, Part } from "@google/genai";
import { portfolioToolDeclarations, portfolioToolHandlers } from "./tools";
import { ai } from "./client";
import { sleep } from "../manipulate/date";

// this func wait for stream 2 times
//  - generator from `generateContentStream`
//  - on return - to avoid n+1 generate content
export async function runAgentLoop(contents: Content[], systemInstruction: string, model: string) {
  let currentContents = [...contents];

  while (true) {
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
            await sleep(50); // fake stream
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

    if (contentParts.length) {
      currentContents.push({ role: "model", parts: contentParts });
    }
    if (toolResults.length) {
      currentContents.push({ role: "tool", parts: toolResults });
    }
  }
}
