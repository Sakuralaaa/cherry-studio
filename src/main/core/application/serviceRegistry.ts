import { CacheService } from '@data/CacheService'
import { DataApiService } from '@data/DataApiService'
import { DbService } from '@data/db/DbService'
import { PreferenceService } from '@data/PreferenceService'
import { AgentJobsService } from '@main/ai/agents/AgentJobsService'
import { AgentLifecycleService } from '@main/ai/agents/AgentLifecycleService'
import { AgentSessionDeliveryService } from '@main/ai/agentSession/AgentSessionDeliveryService'
import { AgentSessionRuntimeService } from '@main/ai/agentSession/AgentSessionRuntimeService'
import { AiService } from '@main/ai/AiService'
import { ChannelManager } from '@main/ai/channels'
import { TtsInferenceService } from '@main/ai/localModel'
import { AsrInferenceService } from '@main/ai/localModel'
import { EmbeddingInferenceService } from '@main/ai/localModel'
import { LocalModelService } from '@main/ai/localModel'
import { OcrInferenceService } from '@main/ai/localModel'
import { McpCatalogService } from '@main/ai/mcp/McpCatalogService'
import { McpPackageService } from '@main/ai/mcp/McpPackageService'
import { McpRuntimeService } from '@main/ai/mcp/McpRuntimeService'
import { ClaudeCodeTraceBridgeService, NodeTraceService, TraceStorageService } from '@main/ai/observability'
import {
  ClaudeCodeBinaryService,
  ClaudeCodeProcessManager,
  ClaudeCodeSessionStateService,
  ClaudeCodeWarmQueryManager
} from '@main/ai/runtime/claudeCode'
import { SkillSubscriptionService } from '@main/ai/skills/SkillSubscriptionService'
import { AiStreamManager } from '@main/ai/streamManager'
import { VoiceSessionService } from '@main/ai/voice/VoiceSessionService'
import { RuntimeActivityService } from '@main/core/application/RuntimeActivityService'
import { JobManager } from '@main/core/job/JobManager'
import type { ServiceConstructor } from '@main/core/lifecycle'
import { PowerService } from '@main/core/power/PowerService'
import { SchedulerService } from '@main/core/scheduler/SchedulerService'
import { UtilityProcessManager } from '@main/core/utilityProcess/UtilityProcessManager'
import { WindowManager } from '@main/core/window/WindowManager'
import { FileProcessingService, TesseractRuntimeService } from '@main/features/fileProcessing'
import { KnowledgeService, KnowledgeVectorStoreService } from '@main/features/knowledge'
import { ApiGatewayService } from '@main/features/apiGateway/ApiGatewayService'
import { BrowserSessionService } from '@main/features/browser'
import { IpcApiService } from '@main/ipc/IpcApiService'
import { CodeCliService } from '@main/services/codeCli'
import { AttachmentPresenceService, RemoteAccessService } from '@main/services/remoteAccess'
import { ComputerUseService } from '@main/services/ComputerUseService'
import { AppMenuService } from '@main/services/AppMenuService'
import { AppService } from '@main/services/AppService'
import { AutoBackupService } from '@main/services/AutoBackupService'
import { AutomationReplService } from '@main/services/automation'
import { BinaryManager } from '@main/services/binaryManager'
import { CherryCloudNotificationService } from '@main/services/cherryCloud/CherryCloudNotificationService'
import { CherryCloudService } from '@main/services/cherryCloud/CherryCloudService'
import { CitationPreviewService } from '@main/services/CitationPreviewService'
import { CommandService } from '@main/services/CommandService'
import { ConversationNavigationService } from '@main/services/ConversationNavigationService'
import { ConversationNotificationService } from '@main/services/ConversationNotificationService'
import { DoctorAgentService, DoctorService } from '@main/services/diagnostics'
import { DirectoryTreeManager, FileManager, FileIntakeService, FileEditService } from '@main/services/file'
import { LogRetentionService } from '@main/services/LogRetentionService'
import { MainNetworkDevtoolsService } from '@main/services/mainNetworkDevtools'
import { MainWindowService } from '@main/services/MainWindowService'
import { MediaProtocolService } from '@main/services/mediaProtocol'
import { NetworkService } from '@main/services/network'
import { NotificationService } from '@main/services/NotificationService'
import { OAuthRuntimeService } from '@main/services/oauth/runtime/OAuthRuntimeService'
import { PdfTranslationService } from '@main/services/PdfTranslationService'
import { ProtocolService } from '@main/services/protocol/ProtocolService'
import { ProxyService } from '@main/services/proxy/ProxyService'
import { PythonService } from '@main/services/PythonService'
import { RuntimeQuitConfirmationService } from '@main/services/RuntimeQuitConfirmationService'
import { ShortcutService } from '@main/services/ShortcutService'
import { StorageMonitorService } from '@main/services/StorageMonitorService'
import { SubWindowService } from '@main/services/SubWindowService'
import { ThemeService } from '@main/services/ThemeService'
import { TrashService } from '@main/services/trash'
import { TrayService } from '@main/services/TrayService'
import { UsageBudgetNotificationService } from '@main/services/UsageBudgetNotificationService'
import { WebSearchService } from '@main/services/webSearch'
import { WebviewService } from '@main/services/webview'

/**
 * Centralized service registry.
 * Add services here for both runtime registration and type-safe resolution.
 *
 * Services managed by the lifecycle system should NOT export singleton instances.
 * Main process code accesses services via `application.get('ServiceName')`.
 * The service CLASS is exported for type references (e.g., @DependsOn, ServiceRegistry).
 *
 * @example
 * // Adding a new service:
 * import { NewService } from './path/NewService'
 *
 * export const services = {
 *   ...existingServices,
 *   NewService,  // ← Just add one line, types are auto-derived
 * } as const
 */

/**
 * Service registry object.
 * Key = service name for application.get('xxx')
 * Value = service class constructor
 */
export const services = {
  ComputerUseService,
  CodeCliService,
  BrowserSessionService,
  ApiGatewayService,
  RemoteAccessService,
  AttachmentPresenceService,
  AutomationReplService,
  MainNetworkDevtoolsService,
  WindowManager,
  UtilityProcessManager,
  DbService,
  CacheService,
  DataApiService,
  IpcApiService,
  SubWindowService,
  PreferenceService,
  TesseractRuntimeService,
  AppMenuService,
  AppService,
  SkillSubscriptionService,
  CommandService,
  ConversationNavigationService,
  CitationPreviewService,
  CherryCloudService,
  CherryCloudNotificationService,
  FileManager,
  FileEditService,
  FileIntakeService,
  DirectoryTreeManager,
  FileProcessingService,
  PowerService,
  RuntimeActivityService,
  RuntimeQuitConfirmationService,
  ShortcutService,
  ThemeService,
  TraceStorageService,
  NodeTraceService,
  ClaudeCodeTraceBridgeService,
  ProtocolService,
  MediaProtocolService,
  ProxyService,
  NetworkService,
  StorageMonitorService,
  DoctorService,
  DoctorAgentService,
  LogRetentionService,
  PythonService,
  TrayService,
  WebSearchService,
  WebviewService,
  OAuthRuntimeService,
  MainWindowService,
  NotificationService,
  ConversationNotificationService,
  UsageBudgetNotificationService,
  McpPackageService,
  McpRuntimeService,
  McpCatalogService,
  BinaryManager,
  PdfTranslationService,
  ClaudeCodeBinaryService,
  ClaudeCodeProcessManager,
  AgentSessionRuntimeService,
  AgentSessionDeliveryService,
  AgentJobsService,
  AgentLifecycleService,
  ChannelManager,
  AiService,
  VoiceSessionService,
  ClaudeCodeWarmQueryManager,
  ClaudeCodeSessionStateService,
  AiStreamManager,
  AsrInferenceService,
  TtsInferenceService,
  EmbeddingInferenceService,
  OcrInferenceService,
  LocalModelService,
  KnowledgeService,
  KnowledgeVectorStoreService,
  AutoBackupService,
  SchedulerService,
  JobManager,
  TrashService
} as const

/** Auto-derived service name to instance type mapping */
export type ServiceRegistry = {
  [K in keyof typeof services]: InstanceType<(typeof services)[K]>
}

/** Service list for Application.registerAll() */
export const serviceList = Object.values(services) as ServiceConstructor[]
