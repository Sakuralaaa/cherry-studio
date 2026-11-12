/**
 * Lite edition: preset providers hidden from model management.
 * Relays, resellers, sponsored platforms, local runtimes and coding-agent bridges are dropped;
 * first-party model vendors and major cloud platforms stay. Custom providers are never hidden.
 */
const LITE_HIDDEN_PROVIDER_IDS: ReadonlySet<string> = new Set([
  '302ai',
  'aihubmix',
  'aionly',
  'alayanew',
  'burncloud',
  'cerebras',
  'cherryin',
  'claude-code',
  'comfyui',
  'copilot',
  'dmxapi',
  'fireworks',
  'gateway',
  'gpustack',
  'grok-cli',
  'groq',
  'huggingface',
  'lanyun',
  'litellm',
  'lmstudio',
  'modelscope',
  'new-api',
  'nvidia',
  'ocoolai',
  'ollama',
  'omlx',
  'openai-codex',
  'opencode',
  'openrouter',
  'ovms',
  'ph8',
  'poe',
  'ppio',
  'qiniu',
  'radeon-cloud',
  'silicon',
  'sophnet',
  'together',
  'tokendance',
  'tokenhub',
  'xirang'
])

export function isLiteHiddenProvider(providerId: string): boolean {
  return LITE_HIDDEN_PROVIDER_IDS.has(providerId)
}
