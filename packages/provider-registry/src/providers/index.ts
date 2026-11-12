import p_anthropic from './anthropic'
import p_aws_bedrock from './aws-bedrock'
import p_azure_openai from './azure-openai'
import p_baichuan from './baichuan'
import p_baidu_cloud from './baidu-cloud'
import p_dashscope from './dashscope'
import p_deepseek from './deepseek'
import p_doubao from './doubao'
import p_gemini from './gemini'
import p_grok from './grok'
import p_jina from './jina'
import p_longcat from './longcat'
import p_mimo from './mimo'
import p_minimax from './minimax'
import p_minimax_global from './minimax-global'
import p_mistral from './mistral'
import p_moonshot from './moonshot'
import p_moonshot_global from './moonshot-global'
import p_openai from './openai'
import p_perplexity from './perplexity'
import p_qwencloud from './qwencloud'
import p_stepfun from './stepfun'
import type { Provider } from './types'
import p_vertexai from './vertexai'
import p_voyageai from './voyageai'
import p_zai from './zai'
import p_zhipu from './zhipu'

/** Every provider, in registry order. Source of truth for data/providers.json + data/provider-models.json. */
export const PROVIDERS: Provider[] = [
  p_zhipu,
  p_deepseek,
  p_anthropic,
  p_openai,
  p_azure_openai,
  p_gemini,
  p_vertexai,
  p_moonshot,
  p_moonshot_global,
  p_baichuan,
  p_dashscope,
  p_qwencloud,
  p_stepfun,
  p_doubao,
  p_minimax,
  p_grok,
  p_mistral,
  p_jina,
  p_perplexity,
  p_baidu_cloud,
  p_voyageai,
  p_aws_bedrock,
  p_longcat,
  p_mimo,
  p_zai,
  p_minimax_global
]
