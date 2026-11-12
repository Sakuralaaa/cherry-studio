export function resolvePaintingProvider(
  requestedProvider: string | undefined,
  defaultProvider: string | undefined,
  validOptions: string[]
): string | undefined {
  if (requestedProvider && validOptions.includes(requestedProvider)) {
    return requestedProvider
  }

  if (defaultProvider && validOptions.includes(defaultProvider)) {
    return defaultProvider
  }

  return validOptions[0]
}
