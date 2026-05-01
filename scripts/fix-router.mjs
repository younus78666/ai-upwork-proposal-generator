/**
 * Replaces react-router-dom imports/usage with Next.js equivalents.
 * Run once: node scripts/fix-router.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

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
  let src = readFileSync(file, 'utf8')
  const original = src

  // 1. Replace standalone Link-only import
  src = src.replace(
    /import\s*\{\s*Link\s*\}\s*from\s*['"]react-router-dom['"]/g,
    `import Link from 'next/link'`
  )

  // 2. Replace Link + other exports (e.g., { Link, useNavigate })
  // Extract non-Link exports and replace Link with next/link
  src = src.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]react-router-dom['"]/g,
    (match, imports) => {
      const parts = imports.split(',').map(s => s.trim()).filter(Boolean)
      const linkParts = parts.filter(p => p === 'Link')
      const otherParts = parts.filter(p => p !== 'Link' && p !== 'Navigate')
      const navigateParts = parts.filter(p => p === 'Navigate')

      const lines = []
      if (linkParts.length > 0) lines.push(`import Link from 'next/link'`)
      if (navigateParts.length > 0) lines.push(`import { redirect } from 'next/navigation'`)
      if (otherParts.length > 0) {
        // Map react-router hooks to next/navigation equivalents
        const mapped = otherParts.map(p => {
          if (p === 'useNavigate') return 'useRouter'
          if (p === 'useLocation') return 'usePathname'
          if (p === 'useParams') return 'useParams'
          return p
        })
        lines.push(`import { ${mapped.join(', ')} } from 'next/navigation'`)
      }
      return lines.join('\n')
    }
  )

  // 3. Fix Link prop: to="..." → href="..."
  src = src.replace(/<Link\s+to=\{`/g, '<Link href={`')
  src = src.replace(/<Link\s+to=\{/g, '<Link href={')
  src = src.replace(/<Link\s+to="/g, '<Link href="')
  src = src.replace(/(\s)to="(\/[^"]*)"(\s)/g, '$1href="$2"$3')
  src = src.replace(/(\s)to=\{/g, ' href={')

  // 4. useNavigate() → useRouter()
  src = src.replace(/const\s+navigate\s*=\s*useNavigate\(\)/g, 'const router = useRouter()')
  // navigate(path) → router.push(path) — careful not to match navigate inside strings
  src = src.replace(/\bnavigate\((['"`])/g, 'router.push($1')
  src = src.replace(/\bnavigate\((-?\d)/g, 'router.push($1')
  src = src.replace(/\bnavigate\(\s*`/g, 'router.push(`')
  // navigate(path, { replace: true }) → router.replace(path)
  src = src.replace(/router\.push\(([^,)]+),\s*\{\s*replace:\s*true\s*\}\)/g, 'router.replace($1)')

  // 5. useLocation() → usePathname()
  src = src.replace(/const\s+location\s*=\s*useLocation\(\)/g, 'const pathname = usePathname()')
  src = src.replace(/location\.pathname/g, 'pathname')

  // 6. useParams — just remove the type annotation (Next.js version is untyped)
  src = src.replace(/useParams<\{[^}]*\}>\(\)/g, 'useParams()')
  // params.id → params?.id (Next.js params can be string | string[])
  src = src.replace(/const\s*\{\s*(\w+)\s*\}\s*=\s*useParams\(\)/g, (m, name) => {
    return `const params = useParams()\n  const ${name} = params?.${name} as string`
  })

  // 7. <Navigate to="..."> → useRouter redirect (simple case: replace with null render + push)
  src = src.replace(/<Navigate\s+to="([^"]+)"\s*\/>/g, (m, path) => {
    return `null /* Redirect to ${path} — use router.push in useEffect */`
  })

  if (src !== original) {
    writeFileSync(file, src, 'utf8')
    changed++
    console.log(`Fixed: ${file}`)
  }
}

console.log(`\nDone — ${changed} files updated.`)
