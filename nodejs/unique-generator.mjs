export function uniqueIdGenerator() {
  const baseId = Date.now().toString().slice(5)
  let lastId = 0

  return () => `${baseId}-${lastId++}`
}
