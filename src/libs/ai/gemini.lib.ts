import { FunctionCall, GenerateContentResponse, Part } from "@google/genai";
import { sleep } from "../manipulate/date";

export const collectStream = async (generator: AsyncGenerator<GenerateContentResponse, any, any>) => {
  const chunks: GenerateContentResponse[] = [];
  const functionCalls: FunctionCall[] = [];
  const contentParts: Part[] = [];

  for await (const chunk of generator) {
    chunks.push(chunk);

    if (chunk.functionCalls?.length) functionCalls.push(...chunk.functionCalls);

    const parts = chunk.candidates?.[0]?.content?.parts;
    if (parts?.length) contentParts.push(...parts);
  }

  return { chunks, functionCalls, contentParts };
};

export async function* createGeneratorWithFakeStream(chunks: GenerateContentResponse[], min: number, max: number) {
  for (const chunk of chunks) {
    // fake stream effect
    await sleep(Math.random() * (max - min) + min);
    yield chunk;
  }
}

export const execTools = (functionCalls: FunctionCall[], handlers: Record<string, () => Promise<unknown>>) => {
  return Promise.all(
    functionCalls.map(async (call): Promise<Part> => {
      const handler = handlers[call.name || ""];
      if (!handler || typeof handler !== "function") {
        return {
          functionResponse: {
            response: { error: `Tool with name "${call.name}" not found` },
          },
        };
      }
      const result = await handler();
      return {
        functionResponse: {
          name: call.name!,
          response: result as Record<string, unknown>,
        },
      };
    }),
  );
};
