import { ExecutionEnv } from "@/lib/types/executor";
import { ExtractDataWithAiTask } from "../task/extract-data-with-ai-task";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI, { OpenAIError } from "openai";

export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnv<typeof ExtractDataWithAiTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("Missing required input: Credentials.");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("Missing required input: Prompt.");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("Missing required input: Content.");
      return false;
    }

    environment.log.info(
      `Starting AI data extraction using credential ID: ${credentials}`
    );

    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });

    if (!credential) {
      environment.log.error(`Credential not found for ID: ${credentials}`);
      return false;
    }

    const decryptedCredentialValue = symmetricDecrypt(credential.secret);
    if (!decryptedCredentialValue) {
      environment.log.error("Failed to decrypt credential secret.");
      return false;
    }

    const systemMessage = `
You are a data extraction engine.
Your task is to extract structured data from raw text or HTML content.

Rules:
- Return ONLY valid JSON
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include extra text
- If a field is missing, return null
- Follow the schema exactly as requested
`;

    environment.log.info("Calling OpenAI for data extraction.");

    const openai = new OpenAI({
      apiKey: decryptedCredentialValue,
    });
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: `Extraction instructions: ${prompt} Raw content:${content}`,
        },
      ],
    });

    environment.log.info(
      `AI usage — prompt tokens: ${res.usage?.prompt_tokens}, completion tokens: ${res.usage?.completion_tokens}`
    );

    const result = res.choices[0].message?.content;

    if (!result) {
      environment.log.error("AI returned an empty extraction result.");
      return false;
    }

    environment.log.info("AI data extraction completed successfully.");
    // const mockExtractedData = {
    //   usernameSelector: "#username",
    //   passwordSelector: "#password",
    //   loginSelector: "body > div > form > input.btn.btn-primary",
    // };

    // environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));
    environment.setOutput("Extracted data", result);
    return true;
  } catch (error) {
    environment.log.error("AI data extraction failed.");

    if (error instanceof OpenAIError) {
      environment.log.error("OpenAI API error occurred.");
      environment.log.error(`OpenAI error: ${error.message}`);
      return false;
    }

    const e = error as Error;
    environment.log.error("Unexpected internal error.");
    environment.log.error(`Internal error: ${e.message}`);

    return false;
  }
}
