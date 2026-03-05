import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import {
  MODELS_CACHE_TTL_MS,
  FALLBACK_MODELS,
  type ModelOption,
} from '../../lib/constants';

/**
 * Playground models API – returns available AI models for generation.
 *
 * GET: List models by parsing the `--model` choices from `copilot --help`.
 *      Returns an error when the CLI is unavailable.
 *      Caches results in-memory for 5 minutes.
 */

// In-memory cache
let cachedModels: ModelOption[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = MODELS_CACHE_TTL_MS;

/**
 * Parse model ids from `copilot --help` by extracting the quoted values in
 * the `--model <model> ... (choices: ...)` section.
 */
function parseModelsFromHelp(helpText: string): ModelOption[] {
  const models: ModelOption[] = [{ value: '', label: 'Auto (Default)' }];

  const modelSectionMatch = helpText.match(/--model\s+<model>[\s\S]*?\(choices:\s*([\s\S]*?)\)\s*(?:--|Commands:)/);
  if (!modelSectionMatch) {
    return models;
  }

  const choicesBlock = modelSectionMatch[1];
  const modelIdRegex = /"([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = modelIdRegex.exec(choicesBlock)) !== null) {
    const value = match[1].trim();
    if (!value) continue;

    const label = value
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\bGpt\b/g, 'GPT')
      .replace(/\bCodex\b/g, 'Codex')
      .replace(/\bClaude\b/g, 'Claude');

    models.push({ value, label });
  }

  return models;
}

function fetchModelsFromCLI(): Promise<ModelOption[]> {
  return new Promise((resolve, reject) => {
    execFile('copilot', ['--help'], { timeout: 15000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(
          error.message.includes('ENOENT')
            ? 'Copilot CLI not found. Make sure `copilot` is in your PATH.'
            : `copilot --help failed: ${stderr || error.message}`
        ));
        return;
      }

      const models = parseModelsFromHelp(stdout);

      // Must have more than just the "Auto (Default)" entry
      if (models.length <= 1) {
        reject(new Error('No models parsed from copilot --help output'));
        return;
      }

      resolve(models);
    });
  });
}

export async function GET() {
  // Return cached models if still fresh
  const now = Date.now();
  if (cachedModels && now - cacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      models: cachedModels,
      source: 'copilot-cache',
      provider: 'copilot',
    });
  }

  try {
    const models = await fetchModelsFromCLI();
    cachedModels = models;
    cacheTimestamp = Date.now();

    return NextResponse.json({
      success: true,
      models,
      source: 'copilot-cli',
      provider: 'copilot',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Playground][models] Copilot CLI fetch failed:', message);

    // Do not fail the UI when CLI model listing is unavailable.
    // Use bundled fallback models so the iterate dialog still works.
    return NextResponse.json({
      success: true,
      models: FALLBACK_MODELS,
      source: 'fallback',
      provider: 'copilot',
      warning: message,
    });
  }
}
