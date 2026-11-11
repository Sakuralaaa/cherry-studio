import {
  Activity,
  Archive,
  Bell,
  Cloud,
  FileCode,
  HardDrive,
  Info,
  Package,
  Palette,
  ScanText,
  Search,
  Settings2,
  UserRound
} from 'lucide-react'
import type { ReactNode } from 'react'
import { createElement } from 'react'

import { parseAppRouteUrl } from '@renderer/utils/appRouteUrl'
import { isSettingsPath } from '@shared/data/types/settingsPath'

/** Resolve the section label without changing the default settings tab title. */
export function getSettingsSectionTitleKey(url: string): string | undefined {
  if (!isSettingsPath(url)) return undefined
  const pathname = parseAppRouteUrl(url)?.pathname
  if (pathname === undefined) return undefined
  return (
    settingsMenu.find(({ route }) => pathname === route || pathname.startsWith(`${route}/`))?.titleKey ??
    (pathname === '/settings/search' ? 'common.search' : undefined)
  )
}
export interface SettingsMenuEntry {
  /** Settings section route; also the aggregation key for `.search.ts` leaves */
  route: string
  /** i18n key of the menu title — always searchable as the section baseline */
  titleKey: string
  icon: ReactNode
  /** Group title key (`settings.menuGroups.*`); omitted for the ungrouped head section */
  groupKey?: string
}

export const BUILTIN_TOOLS_GROUP_KEY = 'settings.menuGroups.builtinTools'

/**
 * Single source of truth for the settings sidebar menu.
 * Array order = menu render order = search tie-break order.
 * Adding a settings section requires registering it here, which also makes its
 * title searchable — the settings search baseline is structural, not manual.
 */
export const settingsMenu: readonly SettingsMenuEntry[] = [
  { route: '/settings/profile', titleKey: 'settings.profile.title', icon: createElement(UserRound) },
  { route: '/settings/provider', titleKey: 'settings.provider.title', icon: createElement(Cloud) },
  { route: '/settings/model', titleKey: 'settings.model', icon: createElement(Package) },
  {
    route: '/settings/websearch',
    titleKey: 'settings.tool.websearch.title',
    icon: createElement(Search),
    groupKey: BUILTIN_TOOLS_GROUP_KEY
  },
  {
    route: '/settings/file-processing',
    titleKey: 'settings.tool.file_processing.features.document_to_markdown.title',
    icon: createElement(FileCode),
    groupKey: BUILTIN_TOOLS_GROUP_KEY
  },
  {
    route: '/settings/ocr',
    titleKey: 'settings.tool.file_processing.features.image_to_text.title',
    icon: createElement(ScanText),
    groupKey: BUILTIN_TOOLS_GROUP_KEY
  },
  {
    route: '/settings/general',
    titleKey: 'settings.general.common.title',
    icon: createElement(Settings2),
    groupKey: 'settings.menuGroups.personal'
  },
  {
    route: '/settings/appearance',
    titleKey: 'settings.appearance.title',
    icon: createElement(Palette),
    groupKey: 'settings.menuGroups.personal'
  },
  {
    route: '/settings/notifications',
    titleKey: 'settings.notification.title',
    icon: createElement(Bell),
    groupKey: 'settings.menuGroups.personal'
  },
  {
    route: '/settings/data',
    titleKey: 'settings.data.title',
    icon: createElement(HardDrive),
    groupKey: 'settings.menuGroups.personal'
  },
  {
    route: '/settings/archive',
    titleKey: 'settings.data.trash.title',
    icon: createElement(Archive),
    groupKey: 'settings.menuGroups.personal'
  },
  {
    route: '/settings/usage',
    titleKey: 'settings.usage.title',
    icon: createElement(Activity),
    groupKey: 'settings.menuGroups.personal'
  },
  {
    route: '/settings/about',
    titleKey: 'settings.about.label',
    icon: createElement(Info),
    groupKey: 'settings.menuGroups.system'
  }
]
