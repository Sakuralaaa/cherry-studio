import { randomUUID } from 'node:crypto'

import { application } from '@application'
import { AgentSessionEditError } from '@data/services/AgentSessionEditError'
import { temporaryChatService } from '@data/services/TemporaryChatService'
import { findPersistedToolOutput } from '@main/ai/messages/persistedToolOutput'
import { AiStreamAdmissionError, type MainDispatchRequest } from '@main/ai/streamManager'
import type { MessageProjectionUpdate } from '@shared/ai/messageProjection'
import { aiErrorCodes } from '@shared/ipc/errors/ai'
import { IpcError } from '@shared/ipc/errors/IpcError'
import type { aiRequestSchemas } from '@shared/ipc/schemas/ai'
import type { IpcHandlersFor, WindowId } from '@shared/ipc/types'

import { exposeAiError } from './exposeAiError'

async function exposeAiStreamAdmission<T>(op: () => Promise<T>): Promise<T> {
  try {
    return await op()
  } catch (error) {
    if (error instanceof AgentSessionEditError) {
      throw new IpcError(aiErrorCodes.AI_AGENT_SESSION_EDIT_FAILED, error.reason, { reason: error.reason })
    }
    if (error instanceof AiStreamAdmissionError) {
      throw new IpcError(aiErrorCodes.AI_STREAM_ADMISSION_REJECTED, error.reason, { reason: error.reason })
    }
    throw error
  }
}

/**
 * The caller window's `WebContents`, resolved from its WindowId — the stream listener
 * needs the raw `WebContents` for its directed `send` + liveness, which IpcApi hides
 * behind `senderId`. `undefined` when the sender is not a managed window (null senderId
 * or window already gone); stream open/attach reject on that, detach treats it as a no-op.
 */
function senderWebContents(senderId: WindowId | null): Electron.WebContents | undefined {
  if (senderId == null) return undefined
  return application.get('WindowManager').getWindow(senderId)?.webContents
}

/**
 * Cherry Studio Lite: the agent feature (agent runtimes, sessions, scheduled tasks,
 * Claude Code binary) is removed. The IPC routes stay declared so the shared contract
 * is unchanged, but every agent route rejects.
 */
function agentsUnavailable(): never {
  throw new Error('Agents are not available in Cherry Studio Lite')
}

export const aiHandlers: IpcHandlersFor<typeof aiRequestSchemas> = {
  'ai.projection.attach': ({ target, subscriptionId }, { senderId }) => {
    const sender = senderWebContents(senderId)
    if (!sender || senderId === null) throw new Error('Projection subscription requires a window')
    if (target.kind !== 'topic') agentsUnavailable()
    const send = (update: MessageProjectionUpdate) =>
      application.get('IpcApiService').send(senderId, 'ai.projection.changed', { subscriptionId, update })
    return application.get('AiStreamManager').attachProjection(sender, target.topicId, subscriptionId, send)
  },
  'ai.projection.detach': async ({ target, subscriptionId }, { senderId }) => {
    const sender = senderWebContents(senderId)
    if (!sender) return
    if (target.kind === 'topic') application.get('AiStreamManager').detachProjection(sender, subscriptionId)
  },
  'ai.agent.child.message': agentsUnavailable,
  'ai.claude_code.binary.status': agentsUnavailable,
  'ai.claude_code.binary.ensure': agentsUnavailable,
  'ai.claude_code.binary.retry': agentsUnavailable,
  // ── One-shot model calls — AiService owns the provider clients. ──
  // A renderer one-shot call has no topic; it is its own conversation.
  'ai.text.generate': ({ requestId, ...request }) => {
    const generate = { ...request, conversation: { id: `one-shot:${randomUUID()}` } }
    return exposeAiError('ai.text.generate', () =>
      requestId
        ? application.get('AiService').runTextRequest(requestId, generate)
        : application.get('AiService').generateText(generate)
    )
  },
  'ai.text.abort': async ({ requestId }) => {
    application.get('AiService').abortRequest(requestId)
  },
  'ai.embedding.embed_many': (request) =>
    exposeAiError('ai.embedding.embed_many', () => application.get('AiService').embedMany(request)),
  'ai.image.generate': ({ requestId, payload }) =>
    exposeAiError('ai.image.generate', () => application.get('AiService').runImageRequest(requestId, payload)),
  'ai.image.abort': async ({ requestId }) => {
    application.get('AiService').abortRequest(requestId)
  },

  // ── Provider model catalog & reachability probe. ──
  'ai.provider.model.list': (request) =>
    exposeAiError('ai.provider.model.list', () => application.get('AiService').listModels(request)),
  'ai.provider.model.check': (request) =>
    exposeAiError('ai.provider.model.check', () => application.get('AiService').checkModel(request)),

  // ── Streaming chat — delegate to AiStreamManager, which owns the stream registry. ──
  'ai.stream.open': async (request, { senderId }) => {
    if (!senderId) throw new Error('ai.stream.open requires a managed window')
    const wc = senderWebContents(senderId)
    if (!wc) throw new Error('ai.stream.open requires a managed window')
    const dispatchRequest: MainDispatchRequest = { ...request, interactionWindowId: senderId }
    return exposeAiStreamAdmission(() => application.get('AiStreamManager').dispatchCommand(dispatchRequest))
  },
  'ai.stream.attach': async (request, { senderId }) => {
    const wc = senderWebContents(senderId)
    if (!wc) throw new Error('ai.stream.attach requires a managed window')
    return application.get('AiStreamManager').attach(wc, request)
  },
  'ai.stream.detach': async (request, { senderId }) => {
    // Best-effort: a gone window has no listener to remove, so a missing WebContents is a no-op.
    const wc = senderWebContents(senderId)
    if (wc) application.get('AiStreamManager').detach(wc, request)
  },
  'ai.stream.abort': async ({ topicId }) => {
    await application.get('AiStreamManager').abortAndDrain(topicId, 'user-requested')
  },

  // ── Tool calls — deferred output lookup + approval decisions. ──
  'ai.tool.get_result': async ({ topicId, messageId, toolCallId }) => {
    // Active stream first: it is the only source holding the value before the message persists.
    const live = application.get('AiStreamManager').getDeferredToolOutput(topicId, toolCallId)
    if (live.found) return live
    return findPersistedToolOutput(topicId, messageId, toolCallId)
  },
  // The continuation dispatch streams to the caller window, so it needs that window's WebContents.
  'ai.tool.respond_approval': (payload, { senderId }) =>
    application.get('AiService').respondToolApproval(payload, senderWebContents(senderId)),

  // ── Agent routes — removed in Cherry Studio Lite. ──
  'ai.agent.create': agentsUnavailable,
  'ai.agent.restore': agentsUnavailable,
  'ai.agent.delete': agentsUnavailable,
  'ai.agent.delete_permanently': agentsUnavailable,
  'ai.agent.attachment_selections.list': agentsUnavailable,
  'ai.agent.sessions.delete': agentsUnavailable,
  'ai.agent.support_session.create': agentsUnavailable,
  'ai.agent.assistant_session.create': agentsUnavailable,
  'ai.agent.skill_session.create': agentsUnavailable,
  'ai.agent.session.prewarm': async () => {},
  'ai.agent.session.close_warm': async () => {},
  'ai.agent.session.delete': agentsUnavailable,
  'ai.agent.session.restore': agentsUnavailable,
  'ai.agent.session.delete_permanently': agentsUnavailable,
  'ai.agent.session.reuse_or_create': agentsUnavailable,
  'ai.agent.session.fork': agentsUnavailable,
  'ai.agent.workspace.register': agentsUnavailable,
  'ai.agent.workspace.delete': agentsUnavailable,
  'ai.agent.session.edit_target': agentsUnavailable,
  'ai.agent.session.set_pending_input_count': async () => {},
  'ai.agent.session.edit_resend': agentsUnavailable,
  'ai.agent.session.refresh_context_usage': async () => {},
  'ai.agent.session.stop_background_task': agentsUnavailable,
  'ai.agent.session.open_path': agentsUnavailable,
  'ai.agent.heartbeat.read': agentsUnavailable,
  'ai.agent.heartbeat.write': agentsUnavailable,
  'ai.agent.heartbeat.run': agentsUnavailable,
  'ai.agent.task.create': agentsUnavailable,
  'ai.agent.task.update': agentsUnavailable,
  'ai.agent.task.pause': agentsUnavailable,
  'ai.agent.task.resume': agentsUnavailable,
  'ai.agent.task.delete': agentsUnavailable,
  'ai.agent.task.run': agentsUnavailable,
  'ai.temporary_topic.create': async (dto) => temporaryChatService.createTopic(dto),
  'ai.temporary_topic.delete': async ({ id }) => {
    temporaryChatService.deleteTopic(id)
  },
  'ai.temporary_topic.persist': async ({ id }) => {
    temporaryChatService.persist(id)
  }
}
