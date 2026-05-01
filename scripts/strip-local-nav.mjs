// Remove local LandingNav and Header imports/usages from page components.
// The global SiteHeader in app/layout.tsx replaces them.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const PAGES = join(process.cwd(), 'src/components/pages')

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir)) {
    const full = join(dir, e)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) out.push(full)
  }
  return out
}

let changed = 0

for (const file of walk(PAGES)) {
  let src = readFileSync(file, 'utf8')
  const orig = src

  // Remove import lines
  src = src.replace(/^import \{ LandingNav \} from ['"][^'"]+['"]\n?/gm, '')
  src = src.replace(/^import \{ Header \} from ['"][^'"]+Header['"]\n?/gm, '')

  // Remove JSX usage (with optional whitespace/newline around)
  src = src.replace(/[ \t]*<LandingNav ?\/>[ \t]*\n?/g, '')
  src = src.replace(/[ \t]*<Header ?\/>[ \t]*\n?/g, '')

  if (src !== orig) {
    writeFileSync(file, src, 'utf8')
    changed++
    console.log(`Stripped nav: ${file.replace(process.cwd(), '')}`)
  }
}

console.log(`\nDone — ${changed} files updated.`)
