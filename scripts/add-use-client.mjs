/**
 * Prepends 'use client' to any component that uses browser hooks
 * but doesn't already have the directive.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const HOOK_PATTERNS = [
  /\buseState\b/, /\buseEffect\b/, /\buseRouter\b/, /\buseParams\b/,
  /\busePathname\b/, /\buseToast\b/, /\buseAuth\b/, /\buseProposal\b/,
  /\buseRef\b/, /\buseCallback\b/, /\buseMemo\b/, /\buseReducer\b/,
  /\buseContext\b/, /\buseSearchParams\b/,
]

function walkDir(dir, ext = ['.ts', '.tsx']) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) results.push(...walkDir(full, ext))
    else if (ext.some(e => full.endsWith(e))) results.push(full)
  }
  return results
}

const files = walkDir(join(process.cwd(), 'src'))
let changed = 0

for (const file of files) {
  // Skip context files - they'll add 'use client' manually
  if (file.includes('/context/')) continue

  const src = readFileSync(file, 'utf8')

  // Already has directive
  if (src.startsWith("'use client'") || src.startsWith('"use client"')) continue

  // Check if any hook is used
  const usesHooks = HOOK_PATTERNS.some(p => p.test(src))
  if (!usesHooks) continue

  writeFileSync(file, `'use client'\n${src}`, 'utf8')
  changed++
  console.log(`Added 'use client': ${file}`)
}

console.log(`\nDone — ${changed} files updated.`)
