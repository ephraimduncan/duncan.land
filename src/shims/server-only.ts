// No-op shim for server-only package.
// In TanStack Start there is no RSC server/client boundary distinction.
// Packages like `bright` import server-only which throws in non-RSC contexts.
export {};
