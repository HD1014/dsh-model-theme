// dsh-model-theme host entry (ESM).
// The visual work lives in the web client half (lib/client.js). The host half
// provides same-origin endpoints used by the model-pet card:
//   GET /api/dsh-model-theme/pet-check              -- silent install self-check
//   GET /api/dsh-model-theme/pet-avatar/:id         -- pet preview image
//   GET /api/dsh-model-theme/download/model-pets.zip -- bundled 16-pet pack
//
// The self-check is intentionally not rendered as user-facing text; the client
// stores the result in a hidden node at the bottom of the model-theme section.

import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const API_PREFIX = '/api/dsh-model-theme'
const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSET_DIR = resolve(__dirname, '..', 'assets')
const ZIP_FILE = join(ASSET_DIR, 'dsh-model-pets.zip')
const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
const PET_ROOT = join(DSH_HOME, 'dsh-pet', 'pet')
const EXPECTED_PETS = [
  'qwen', 'glm', 'chatgpt', 'claude', 'gemini', 'kimi',
  'grok', 'doubao', 'ernie', 'yuanbao', 'minimax', 'nvidia',
  'copilot', 'claude-fish', 'claude-opus', 'qwq'
]

/** Read JSON without letting a broken optional file crash the host. */
function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

/** Find the installed dsh-pet program, preferring the current profile sibling. */
function findPetProgram() {
  const candidates = [
    resolve(__dirname, '..', '..', 'dsh-pet'),
    join(DSH_HOME, 'profiles', 'desktop', 'node_modules', 'dsh-pet'),
    join(DSH_HOME, 'local-plugins', 'dsh-pet'),
  ]
  for (const dir of candidates) {
    const pkg = readJson(join(dir, 'package.json'))
    if (pkg && typeof pkg.name === 'string' && pkg.name === 'dsh-pet') {
      return { installed: true, dir, version: String(pkg.version || '') }
    }
  }
  return { installed: false, dir: '', version: '' }
}

/** Silent model-pet self-check: program + 16 pet packs + bundled download. */
function petCheck() {
  const program = findPetProgram()
  let files = []
  try {
    files = existsSync(PET_ROOT)
      ? readdirSync(PET_ROOT).filter((name) => name.endsWith('-config.json'))
      : []
  } catch {
    files = []
  }
  const ids = files.map((name) => name.slice(0, -'-config.json'.length)).sort()
  const missing = EXPECTED_PETS.filter((id) => !ids.includes(id))
  const animated = EXPECTED_PETS.filter((id) => existsSync(join(PET_ROOT, id + '-animation')))
  const zipExists = existsSync(ZIP_FILE)
  const zipBytes = zipExists ? statSync(ZIP_FILE).size : 0
  const status = !program.installed
    ? 'missing'
    : (missing.length === 0 && animated.length === EXPECTED_PETS.length ? 'ok' : 'partial')
  return {
    ok: true,
    status,
    petProgram: program,
    petPacks: {
      root: PET_ROOT,
      installed: ids.length,
      expected: EXPECTED_PETS.length,
      ids,
      missing,
      animated: animated.length,
    },
    download: {
      available: zipExists,
      file: 'dsh-model-pets.zip',
      bytes: zipBytes,
    },
    checkedAt: new Date().toISOString(),
  }
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

function sendZip(req, res) {
  if (!existsSync(ZIP_FILE)) {
    sendJson(res, 404, { ok: false, error: 'model-pets.zip not packaged' })
    return
  }
  const stat = statSync(ZIP_FILE)
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename="dsh-model-pets.zip"',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  const stream = createReadStream(ZIP_FILE)
  stream.on('error', () => {
    try { res.destroy() } catch {}
  })
  stream.pipe(res)
}

function sendAvatar(req, res, id) {
  if (!/^[a-z0-9-]+$/.test(id)) {
    sendJson(res, 400, { ok: false, error: 'bad-pet-id' })
    return
  }
  let file = ''
  if (id === 'main') {
    const program = findPetProgram()
    if (program.installed) {
      const logo = join(program.dir, 'assets', 'logo.png')
      if (existsSync(logo)) file = logo
    }
  } else {
    const avatar = join(PET_ROOT, id + '-avatar.png')
    if (existsSync(avatar)) file = avatar
  }
  if (!file || !existsSync(file)) {
    sendJson(res, 404, { ok: false, error: 'avatar-not-found' })
    return
  }
  const stat = statSync(file)
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': stat.size,
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  const stream = createReadStream(file)
  stream.on('error', () => {
    try { res.destroy() } catch {}
  })
  stream.pipe(res)
}

export const inject = ['webServer']

export function apply(ctx) {
  // Diagnostic only: this line lives at the bottom of the host plugin and is
  // written to the DSH host log, not to the settings UI.
  try {
    const check = petCheck()
    console.log('[dsh-model-theme] model-pet self-check:', check.status,
      '| program:', check.petProgram.installed,
      '| packs:', check.petPacks.installed + '/' + check.petPacks.expected,
      '| zip:', check.download.available)
  } catch {}

  const webServer = ctx && (ctx.webServer || (typeof ctx.get === 'function' ? ctx.get('webServer') : null))
  if (!webServer || typeof webServer.register !== 'function') return

  try {
    webServer.register({
      kind: 'prefix',
      path: API_PREFIX,
      handler: async (req, res) => {
        let route = '/'
        try {
          const url = new URL(req.url || '/', 'http://127.0.0.1')
          route = url.pathname.startsWith(API_PREFIX)
            ? (url.pathname.slice(API_PREFIX.length) || '/')
            : '/'
        } catch {
          route = '/'
        }

        if (route === '/pet-check' && req.method === 'GET') {
          return sendJson(res, 200, petCheck())
        }
        if (route.startsWith('/pet-avatar/') && (req.method === 'GET' || req.method === 'HEAD')) {
          let id = ''
          try { id = decodeURIComponent(route.slice('/pet-avatar/'.length)).trim() } catch {}
          return sendAvatar(req, res, id)
        }
        if (route === '/download/model-pets.zip' && (req.method === 'GET' || req.method === 'HEAD')) {
          return sendZip(req, res)
        }
        return sendJson(res, 404, { ok: false, error: 'not-found' })
      },
    })
  } catch (error) {
    /* 插件热重载或同一进程重复 apply 时，旧实例的路由可能还没释放。
       路由前缀相同且旧路由仍然可用，直接复用，不再把整个插件标记成异常。 */
    const message = String((error && error.message) || error || '')
    if (message.includes('duplicate prefix route')) {
      console.warn('[dsh-model-theme] webServer prefix already registered; reuse existing route', API_PREFIX)
      return
    }
    throw error
  }
}
