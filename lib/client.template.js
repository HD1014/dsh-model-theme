window.__ModuleLoader__.load({
  id: "dsh-model-theme",
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    const THEMES = __THEMES_JSON__
    const HERO_ICONS = __HERO_ICONS_JSON__
    const HERO_IMAGES = __HERO_IMAGES_JSON__
    const THINK_ICONS = __THINK_ICONS_JSON__
    const THINK_IMAGES = __THINK_IMAGES_JSON__
    /* 新会话空状态：按各家官方客户端首页的中央标识来配（不是聊天内容） */
    const HERO_META = {
      gpt: { title: "ChatGPT", color: "#000000" },
      claude: { title: "Claude", color: "#D97757" },
      gemini: { title: "Gemini", color: "#4285F4", titleColor: "#F7F4FF", shadow: "0 1px 18px rgba(10,8,24,.55)" },
      glm: { title: "智谱清言", color: "#2C5BFF" },
      qwen: { title: "通义千问", color: "#2F343A" },
      kimi: { title: "", color: "#000000" }
    }
    /* 运行中状态：按各家官方客户端的“思考中”标识换图标和前缀，计时与 shimmer 保留 */
    const THINK_META = {
      deepseek: { label: "深度求索中", color: "#1FA2FF" },
      gpt: { label: "ChatGPT 正在思考", color: "#000000" },
      claude: { label: "Claude 正在思考", color: "#D97757" },
      gemini: { label: "Gemini 正在思考", color: "#3186FF" },
      glm: { label: "智谱清言正在思考", color: "#2C5BFF" },
      qwen: { label: "通义千问正在思考", color: "#7D5CEC" },
      kimi: { label: "Kimi 正在思考", color: "#000000" }
    }
    const THINK_LABELS = Object.keys(THINK_META).map(function (k) { return THINK_META[k].label })

    const STYLE_ID = "dsh-model-theme-style"
    const FADE_ID = "dsh-theme-fade"
    const FAMILIES = ["deepseek", "glm", "claude", "gpt", "gemini", "kimi", "qwen"]
    /* 气泡卡文字色：浅色卡片上要用深色墨（必须在 themeCss 可见的外层作用域） */
    const BUBBLE_INK = {
      deepseek: "#0E5A96",
      glm: "#2A2F36",
      claude: "#A3481B",
      gpt: "#2F363D",
      gemini: "#4B3FB3",
      kimi: "#1B315F",
      qwen: "#2C5C8C"
    }

    /* ===== 模型主题与切换动画的统一设置 =====
       背景图、专属主色、每个模型的主题/开关动画都收在同一份 localStorage。
       上传的图片同时供工作台主题和 4 秒过渡层使用，避免两边不同步。 */
    const React = require("react")
    const MT_STORAGE_KEY = "dsh-model-theme:settings-v1"
    const MT_FAMILIES = ["deepseek", "glm", "claude", "gpt", "gemini", "kimi", "qwen"]
    /* 预留模型：现在没有独立主题皮肤，但先把官方主色、短标签和桌宠映射放好。
       以后接入 Grok / 豆包 / 元宝 / 文心 / MiniMax / NVIDIA / Copilot / QwQ 时，
       检测到对应 vendor 就直接使用这里的默认色，不会回退成统一的蓝色。 */
    const MT_EXTRA_BASE = {
      grok: { label: "Grok", brand: "#111111", icon: "#111111", side: ["#FFFFFF", "#E9E9EA"], bg: "" },
      doubao: { label: "豆包", brand: "#4E6EF2", icon: "#4E6EF2", side: ["#F5F7FF", "#E1E7FF"], bg: "" },
      yuanbao: { label: "元宝", brand: "#FF8A00", icon: "#FF8A00", side: ["#FFF9F2", "#FFE7C7"], bg: "" },
      ernie: { label: "文心", brand: "#2932E1", icon: "#2932E1", side: ["#F5F6FF", "#E2E5FF"], bg: "" },
      minimax: { label: "MiniMax", brand: "#FF4D4F", icon: "#FF4D4F", side: ["#FFF6F6", "#FFE2E2"], bg: "" },
      nvidia: { label: "NVIDIA", brand: "#76B900", icon: "#76B900", side: ["#F8FFE8", "#E8F8C7"], bg: "" },
      copilot: { label: "Copilot", brand: "#0078D4", icon: "#0078D4", side: ["#F3FAFF", "#DDF0FF"], bg: "" },
      qwq: { label: "QwQ", brand: "#7D5CEC", icon: "#7D5CEC", side: ["#F8F5FF", "#E9E0FF"], bg: "" },
      llama: { label: "Llama", brand: "#0866FF", icon: "#0866FF", side: ["#F4F8FF", "#DDEAFF"], bg: "" },
      mistral: { label: "Mistral", brand: "#FA520F", icon: "#FA520F", side: ["#FFF7F3", "#FFE3D6"], bg: "" },
      gemma: { label: "Gemma", brand: "#4285F4", icon: "#4285F4", side: ["#F4F8FF", "#DDEAFF"], bg: "" },
      perplexity: { label: "Perplexity", brand: "#20B8CD", icon: "#20B8CD", side: ["#F2FCFD", "#D8F7FA"], bg: "" }
    }
    const MT_EXTRA_FAMILIES = Object.keys(MT_EXTRA_BASE)
    const MT_ALL_FAMILIES = MT_FAMILIES.concat(MT_EXTRA_FAMILIES)
    const MT_LABELS = {
      deepseek: "DeepSeek",
      glm: "GLM",
      claude: "Claude",
      gpt: "GPT",
      gemini: "Gemini",
      kimi: "Kimi",
      qwen: "Qwen（千问）"
    }
    MT_EXTRA_FAMILIES.forEach(function (fam) { MT_LABELS[fam] = MT_EXTRA_BASE[fam].label })
    const MT_SOUND_PRESETS = [
      { id: "soft", label: "轻点" },
      { id: "pop", label: "气泡" },
      { id: "wood", label: "木鱼" },
      { id: "glass", label: "玻璃" },
      { id: "bell", label: "铃铛" },
      { id: "drop", label: "水滴" },
      { id: "type", label: "打字机" },
      { id: "pluck", label: "拨弦" },
      { id: "coin", label: "金币" },
      { id: "paper", label: "纸页" },
      { id: "synth", label: "电子" },
      { id: "low", label: "低频" },
      { id: "chime", label: "三音铃" }
    ]
    const MT_PET_NAMES = {
      main: "DSH",
      qwen: "千问酱",
      glm: "GLM酱",
      chatgpt: "GPT龙娘",
      claude: "Claude酱",
      gemini: "Gemini酱",
      kimi: "Kimi酱",
      grok: "Grok酱",
      doubao: "豆包酱",
      yuanbao: "元宝酱",
      ernie: "文心酱",
      minimax: "海螺酱",
      nvidia: "CUDA娘",
      copilot: "Copilot酱",
      "claude-fish": "克劳德鱼",
      "claude-opus": "Opus大小姐",
      qwq: "QwQ酱"
    }
    const MT_PET_CORE_IDS = ["main", "qwen", "glm", "chatgpt", "claude", "gemini", "kimi", "grok", "doubao", "ernie", "yuanbao"]
    const MT_PET_EXTRA_IDS = ["minimax", "nvidia", "copilot", "claude-fish", "claude-opus", "qwq"]
    const MT_PET_SHORT = {
      main: "DSH",
      qwen: "千问",
      glm: "GLM",
      chatgpt: "GPT",
      claude: "Claude",
      gemini: "Gemini",
      kimi: "Kimi",
      grok: "Grok",
      doubao: "豆包",
      yuanbao: "元宝",
      ernie: "文心",
      minimax: "海螺",
      nvidia: "CUDA",
      copilot: "Copilot",
      "claude-fish": "克劳德鱼",
      "claude-opus": "Opus",
      qwq: "QwQ"
    }
    const MT_PET_DEFAULT_MAP = {
      deepseek: "main",
      glm: "glm",
      claude: "claude",
      gpt: "chatgpt",
      gemini: "gemini",
      kimi: "kimi",
      qwen: "qwen",
      grok: "grok",
      doubao: "doubao",
      yuanbao: "yuanbao",
      ernie: "ernie",
      minimax: "minimax",
      nvidia: "nvidia",
      copilot: "copilot",
      qwq: "qwq"
    }
    const MT_PET_DEFAULT_ACTION = "招牌特技-个人秀"
    const MT_PET_FALLBACK_ACTION = "点击回应-开心跃动"
    const MT_SFX_SELECTOR = 'button, [role="button"], [role="tab"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"], [role="treeitem"], [role="switch"], [role="checkbox"], [role="radio"], [role="link"], [role="combobox"], a[href], input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select'
    const MT_SFX_SKIP = '[data-sfx="off"], [data-composer-card], .GRgSLq_card, .dms-panel, .dms-view, .dsh-pet-hit, .lc-root, .lc-jump, [class*="hE4tRW"], [class*="an3WzG_"], [class*="messageContent"]'
    let mtAudio = null
    let mtNoise = null
    const mtCustomBuffers = {}
    let mtLastModelSfxAt = 0
    let mtLastModelSfxFam = ""
    let mtLastClickSfxAt = 0
    let mtAccentCommitTimer = 0
    let mtAccentPreviewRaf = 0
    let mtAccentPreviewPending = ""

    function mtDefaultSound() {
      return { id: "soft", custom: [] }
    }
    function mtDefaultPet() {
      const map = {}
      MT_ALL_FAMILIES.forEach(function (fam) { map[fam] = MT_PET_DEFAULT_MAP[fam] || "" })
      return {
        enabled: true,
        autoAssign: false,
        map: map,
        enterDelay: 2500,
        fadeMs: 1000,
        action: MT_PET_DEFAULT_ACTION
      }
    }
    function mtNormalizePet(raw) {
      const out = mtDefaultPet()
      if (!raw || typeof raw !== "object") return out
      out.enabled = raw.enabled !== false
      out.autoAssign = raw.autoAssign === true
      if (raw.map && typeof raw.map === "object") {
        MT_ALL_FAMILIES.forEach(function (fam) {
          if (typeof raw.map[fam] === "string") out.map[fam] = raw.map[fam].slice(0, 40)
        })
      }
      const delay = Number(raw.enterDelay)
      if (isFinite(delay)) out.enterDelay = Math.min(3600, Math.max(1200, Math.round(delay)))
      const fade = Number(raw.fadeMs)
      if (isFinite(fade)) out.fadeMs = Math.min(2000, Math.max(300, Math.round(fade)))
      if (typeof raw.action === "string" && raw.action.length < 60) out.action = raw.action
      return out
    }
    function mtNormalizeSound(raw) {
      const out = mtDefaultSound()
      if (!raw || typeof raw !== "object") return out
      if (typeof raw.id === "string" && raw.id.length < 90) out.id = raw.id
      if (Array.isArray(raw.custom)) {
        out.custom = raw.custom.filter(function (item) {
          return item && typeof item.id === "string" && item.id.indexOf("custom-") === 0 && typeof item.name === "string"
        }).slice(0, 20).map(function (item) {
          return {
            id: item.id,
            name: String(item.name).slice(0, 40),
            size: Number(item.size) || 0,
            duration: Number(item.duration) || 0
          }
        })
      }
      return out
    }
    function mtSound() {
      return mtLoad().sound || mtDefaultSound()
    }
    function mtPet() {
      return mtLoad().pet || mtDefaultPet()
    }
    function mtPetAutoIdForFam(fam) {
      const direct = MT_PET_DEFAULT_MAP[fam]
      if (direct && MT_PET_NAMES[direct]) return direct
      const pool = MT_PET_CORE_IDS.concat(MT_PET_EXTRA_IDS).filter(function (id) {
        return id !== "main" && MT_PET_NAMES[id]
      })
      let seed = 0
      const text = String(fam || "")
      for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) >>> 0
      return pool.length ? pool[seed % pool.length] : "main"
    }
    function mtAudioContext() {
      try {
        if (!mtAudio) {
          const Ctor = window.AudioContext || window.webkitAudioContext
          if (!Ctor) return null
          mtAudio = new Ctor()
        }
        if (mtAudio.state === "suspended") mtAudio.resume().catch(function () {})
        return mtAudio
      } catch (e) {
        return null
      }
    }
    function mtNoiseBuffer(ctx) {
      if (mtNoise && mtNoise.sampleRate === ctx.sampleRate) return mtNoise
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      mtNoise = buf
      return buf
    }
    function mtTone(freq, type, delay, dur, peak, endFreq) {
      const ctx = mtAudioContext()
      if (!ctx) return
      try {
        const t = ctx.currentTime + (delay || 0)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = type || "sine"
        osc.frequency.setValueAtTime(Math.max(20, freq), t)
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur)
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(Math.max(0.002, peak), t + 0.008)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(t)
        osc.stop(t + dur + 0.02)
      } catch (e) {}
    }
    function mtNoiseHit(delay, dur, peak, filterType, freq, q) {
      const ctx = mtAudioContext()
      if (!ctx) return
      try {
        const t = ctx.currentTime + (delay || 0)
        const src = ctx.createBufferSource()
        src.buffer = mtNoiseBuffer(ctx)
        const filter = ctx.createBiquadFilter()
        filter.type = filterType || "highpass"
        filter.frequency.setValueAtTime(freq || 2000, t)
        filter.Q.value = q == null ? 0.7 : q
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(Math.max(0.002, peak), t + 0.006)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
        src.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        src.start(t)
        src.stop(t + dur + 0.02)
      } catch (e) {}
    }
    function mtPlayPreset(id) {
      const v = 0.72
      if (id === "pop") {
        mtTone(520, "triangle", 0, 0.07, 0.065 * v, 760)
      } else if (id === "wood") {
        mtTone(270, "sine", 0, 0.075, 0.07 * v, 190)
        mtNoiseHit(0, 0.025, 0.018 * v, "lowpass", 850)
      } else if (id === "glass") {
        mtTone(1180, "sine", 0, 0.15, 0.055 * v, 1340)
        mtTone(1760, "sine", 0.014, 0.11, 0.032 * v)
      } else if (id === "bell") {
        mtTone(1046, "sine", 0, 0.34, 0.05 * v)
        mtTone(1568, "sine", 0, 0.25, 0.022 * v)
      } else if (id === "drop") {
        mtTone(880, "sine", 0, 0.19, 0.06 * v, 280)
      } else if (id === "type") {
        mtTone(1320, "square", 0, 0.025, 0.02 * v)
        mtNoiseHit(0, 0.032, 0.018 * v, "highpass", 2600)
      } else if (id === "pluck") {
        mtTone(440, "triangle", 0, 0.13, 0.06 * v, 320)
      } else if (id === "coin") {
        mtTone(988, "sine", 0, 0.07, 0.05 * v)
        mtTone(1319, "sine", 0.065, 0.14, 0.045 * v)
      } else if (id === "paper") {
        mtNoiseHit(0, 0.11, 0.034 * v, "bandpass", 1900, 0.55)
      } else if (id === "synth") {
        mtTone(220, "sawtooth", 0, 0.12, 0.04 * v, 340)
        mtTone(330, "triangle", 0.028, 0.1, 0.028 * v)
      } else if (id === "low") {
        mtTone(180, "sine", 0, 0.12, 0.07 * v, 140)
      } else if (id === "chime") {
        mtTone(784, "sine", 0, 0.2, 0.04 * v)
        mtTone(988, "sine", 0.06, 0.2, 0.034 * v)
        mtTone(1175, "sine", 0.12, 0.24, 0.028 * v)
      } else {
        mtTone(760, "sine", 0, 0.09, 0.055 * v, 560)
        mtNoiseHit(0, 0.018, 0.012 * v, "highpass", 3600)
      }
    }
    function mtIdbOpen() {
      return new Promise(function (resolve, reject) {
        try {
          if (!window.indexedDB) return reject(new Error("no indexedDB"))
          const req = indexedDB.open("dsh-model-theme-sfx", 1)
          req.onupgradeneeded = function () {
            const db = req.result
            if (!db.objectStoreNames.contains("sounds")) db.createObjectStore("sounds")
          }
          req.onsuccess = function () { resolve(req.result) }
          req.onerror = function () { reject(req.error) }
        } catch (e) { reject(e) }
      })
    }
    function mtIdbPut(id, blob) {
      return mtIdbOpen().then(function (db) {
        return new Promise(function (resolve, reject) {
          const tx = db.transaction("sounds", "readwrite")
          tx.objectStore("sounds").put(blob, id)
          tx.oncomplete = function () { resolve(true) }
          tx.onerror = function () { reject(tx.error) }
        })
      })
    }
    function mtIdbGet(id) {
      return mtIdbOpen().then(function (db) {
        return new Promise(function (resolve, reject) {
          const tx = db.transaction("sounds", "readonly")
          const req = tx.objectStore("sounds").get(id)
          req.onsuccess = function () { resolve(req.result || null) }
          req.onerror = function () { reject(req.error) }
        })
      })
    }
    function mtIdbDelete(id) {
      return mtIdbOpen().then(function (db) {
        return new Promise(function (resolve) {
          const tx = db.transaction("sounds", "readwrite")
          tx.objectStore("sounds").delete(id)
          tx.oncomplete = function () { resolve(true) }
          tx.onerror = function () { resolve(false) }
        })
      })
    }
    function mtPlayCustom(id) {
      const ctx = mtAudioContext()
      if (!ctx) return
      const playBuf = function (buf) {
        try {
          const src = ctx.createBufferSource()
          const gain = ctx.createGain()
          src.buffer = buf
          gain.gain.value = 0.55
          src.connect(gain)
          gain.connect(ctx.destination)
          src.start()
        } catch (e) {}
      }
      if (mtCustomBuffers[id]) return playBuf(mtCustomBuffers[id])
      mtIdbGet(id).then(function (blob) {
        if (!blob) return mtPlayPreset("soft")
        return blob.arrayBuffer().then(function (arr) {
          return new Promise(function (resolve) {
            ctx.decodeAudioData(arr, function (buf) {
              mtCustomBuffers[id] = buf
              playBuf(buf)
              resolve(true)
            }, function () { resolve(false) })
          })
        })
      }).catch(function () { mtPlayPreset("soft") })
    }
    function mtPlaySound(id) {
      if (!id) return
      if (id.indexOf("custom-") === 0) mtPlayCustom(id)
      else mtPlayPreset(id)
    }
    function mtPlayWhoosh() {
      const ctx = mtAudioContext()
      if (!ctx) return
      try {
        const t = ctx.currentTime
        const src = ctx.createBufferSource()
        src.buffer = mtNoiseBuffer(ctx)
        const filter = ctx.createBiquadFilter()
        filter.type = "bandpass"
        filter.Q.value = 0.8
        filter.frequency.setValueAtTime(260, t)
        filter.frequency.exponentialRampToValueAtTime(1700, t + 0.3)
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(0.075, t + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
        src.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        src.start(t)
        src.stop(t + 0.5)
        mtTone(340, "sine", 0, 0.28, 0.04, 760)
      } catch (e) {}
    }
    function mtPlayModelSwitch(fam) {
      const now = Date.now()
      if (mtLastModelSfxFam === fam && now - mtLastModelSfxAt < 900) return
      mtLastModelSfxFam = fam
      mtLastModelSfxAt = now
      mtPlayWhoosh()
    }
    function mtUploadSound(file, done) {
      done = done || function () {}
      if (!file) return done("没有选择音频")
      if (!/\.mp3$/i.test(file.name)) return done("只支持 MP3 文件")
      if (file.size > 5 * 1024 * 1024) return done("音频不能超过 5MB")
      const url = URL.createObjectURL(file)
      const audio = new Audio()
      let settled = false
      const fail = function (msg) {
        if (settled) return
        settled = true
        URL.revokeObjectURL(url)
        done(msg)
      }
      const ok = function () {
        if (settled) return
        const duration = Number(audio.duration)
        if (!isFinite(duration) || duration <= 0) return fail("无法读取音频时长")
        if (duration > 5.01) return fail("音频不能超过 5 秒（当前 " + duration.toFixed(1) + " 秒）")
        settled = true
        URL.revokeObjectURL(url)
        const id = "custom-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
        mtIdbPut(id, file).then(function () {
          const all = mtSnapshot()
          all.sound = mtNormalizeSound(all.sound)
          all.sound.custom.push({ id: id, name: file.name.replace(/\.mp3$/i, ""), size: file.size, duration: duration })
          all.sound.id = id
          if (!mtWrite(all)) {
            mtIdbDelete(id)
            return done("保存失败：配置空间不足")
          }
          done(null, { id: id, name: file.name.replace(/\.mp3$/i, ""), duration: duration })
        }).catch(function () { done("音频保存失败") })
      }
      audio.preload = "metadata"
      audio.onloadedmetadata = ok
      audio.onerror = function () { fail("音频解码失败") }
      audio.src = url
      setTimeout(function () {
        if (!settled && audio.readyState < 1) fail("读取音频超时")
      }, 4000)
    }
    function installButtonSounds() {
      if (window.__dshButtonSfxInstalled) return
      window.__dshButtonSfxInstalled = true
      document.addEventListener("click", function (e) {
        try {
          const el = e.target && e.target.closest ? e.target.closest(MT_SFX_SELECTOR) : null
          if (!el || !el.closest) return
          if (el.disabled || el.getAttribute("aria-disabled") === "true") return
          if (el.closest(MT_SFX_SKIP)) return
          const now = Date.now()
          if (now - mtLastClickSfxAt < 45) return
          mtLastClickSfxAt = now
          mtPlaySound(mtSound().id)
        } catch (err) {}
      }, true)
    }
    let mtCache = null
    let mtVersion = 0

    function mtBase(fam) {
      if (THEMES[fam]) return THEMES[fam]
      if (MT_EXTRA_BASE[fam]) {
        const extra = MT_EXTRA_BASE[fam]
        return {
          side: extra.side,
          brand: extra.brand,
          icon: extra.icon,
          tint: extra.icon + "1F",
          label: extra.label,
          bg: extra.bg
        }
      }
      return { side: ["#FFFFFF", "#F3F5F7"], brand: "#1FA2FF", icon: "#1FA2FF", tint: "#1FA2FF1F", label: fam, bg: "" }
    }
    function mtHex(value, fallback) {
      const s = String(value == null ? "" : value).trim()
      if (/^#[0-9a-f]{6}$/i.test(s)) return s.toUpperCase()
      if (/^#[0-9a-f]{3}$/i.test(s)) {
        return ("#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toUpperCase()
      }
      return fallback
    }
    /* 深色底配白字、浅色底配黑字：用感知亮度判断，保证 HARNESS 角标和发送键始终看得清 */
    function mtInkOn(value) {
      const hex = mtHex(value, "#8B7CF6").slice(1)
      const r = parseInt(hex.slice(0, 2), 16) / 255
      const g = parseInt(hex.slice(2, 4), 16) / 255
      const b = parseInt(hex.slice(4, 6), 16) / 255
      const lin = function (c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
      const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
      return lum > 0.55 ? "#0F1115" : "#FFFFFF"
    }
    /* HARNESS 角标由左侧标识插件渲染，用类名接住它，方便统一换色 */
    function mtMarkHarnessBadge() {
      try {
        document.querySelectorAll(".dsh-brand-text").forEach(function (row) {
          Array.prototype.forEach.call(row.children || [], function (child) {
            if (!child || child.tagName !== "SPAN") return
            const text = String(child.textContent || "").trim().toUpperCase()
            if (text === "HARNESS") child.classList.add("dsh-mt-harness-badge")
            else child.classList.remove("dsh-mt-harness-badge")
          })
        })
      } catch (e) {}
    }
    function mtWatchHarnessBadge() {
      if (window.__dshHarnessBadgeWatch) {
        mtMarkHarnessBadge()
        return
      }
      window.__dshHarnessBadgeWatch = true
      try {
        let frame = 0
        const schedule = function () {
          if (frame) return
          frame = window.requestAnimationFrame(function () {
            frame = 0
            mtMarkHarnessBadge()
          })
        }
        const mo = new MutationObserver(schedule)
        mo.observe(document.documentElement || document.body, { childList: true, subtree: true })
      } catch (e) {}
      mtMarkHarnessBadge()
    }
    function mtNewSettings() {
      const families = {}
      MT_ALL_FAMILIES.forEach(function (fam) {
        families[fam] = {
          theme: true,
          transition: true,
          accent: mtBase(fam).brand,
          bg: ""
        }
      })
      return { version: 1, families: families, sound: mtDefaultSound(), pet: mtDefaultPet() }
    }
    function mtLoad() {
      if (mtCache) return mtCache
      const out = mtNewSettings()
      try {
        const raw = localStorage.getItem(MT_STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && parsed.families && typeof parsed.families === "object") {
            MT_ALL_FAMILIES.forEach(function (fam) {
              const item = parsed.families[fam]
              if (!item || typeof item !== "object") return
              out.families[fam].theme = item.theme !== false
              out.families[fam].transition = item.transition !== false
              out.families[fam].accent = mtHex(item.accent, out.families[fam].accent)
              if (typeof item.bg === "string" && item.bg.indexOf("data:image/") === 0) {
                out.families[fam].bg = item.bg
              }
            })
            out.sound = mtNormalizeSound(parsed.sound)
            out.pet = mtNormalizePet(parsed.pet)
          }
        }
      } catch (e) {
        /* 配置损坏时回退到官方默认，不阻塞主题 */
      }
      mtCache = out
      return out
    }
    function mtSnapshot() {
      return JSON.parse(JSON.stringify(mtLoad()))
    }
    function mtWrite(next) {
      try {
        localStorage.setItem(MT_STORAGE_KEY, JSON.stringify(next))
        mtCache = next
        mtVersion += 1
        return true
      } catch (e) {
        return false
      }
    }
    function mtFamily(fam) {
      const all = mtLoad()
      if (!all.families[fam]) {
        all.families[fam] = { theme: true, transition: true, accent: mtBase(fam).brand, bg: "" }
      }
      return all.families[fam]
    }
    function mtThemeOf(fam) {
      const base = mtBase(fam)
      const cfg = mtFamily(fam)
      const accent = mtHex(cfg.accent, base.brand)
      return {
        side: base.side,
        brand: accent,
        icon: accent,
        tint: accent + "1F",
        label: base.label,
        bg: cfg.bg || base.bg
      }
    }
    function mtBgUrl(fam) {
      const value = mtThemeOf(fam).bg
      if (!value) return ""
      return /^data:image\//i.test(value) ? value : "data:image/jpeg;base64," + value
    }
    function mtSyncAccentVar(fam) {
      try {
        const th = mtThemeOf(fam)
        if (!th || !th.brand) return
        const root = document.documentElement
        root.style.setProperty("--dsh-theme-accent", th.brand)
        root.style.setProperty("--dsh-theme-accent-soft", th.brand + "24")
        root.style.setProperty("--dsh-theme-accent-glow", th.brand + "38")
        root.style.setProperty("--dsh-theme-accent-ink", mtInkOn(th.brand))
        mtMarkHarnessBadge()
      } catch (e) {}
    }
    /* 调色盘拖动时只改 CSS 变量，不写 localStorage、不触发 React 整页重渲染 */
    function mtPaintAccentVar(target, hex) {
      if (!target || !/^#[0-9a-f]{6}$/i.test(String(hex || ""))) return
      const value = String(hex).toUpperCase()
      try {
        target.style.setProperty("--dsh-theme-accent", value)
        target.style.setProperty("--dsh-theme-accent-soft", value + "24")
        target.style.setProperty("--dsh-theme-accent-glow", value + "38")
        target.style.setProperty("--dsh-theme-accent-ink", mtInkOn(value))
      } catch (e) {}
    }
    function mtPreviewAccent(hex) {
      const value = String(hex || "").toUpperCase()
      if (!/^#[0-9a-f]{6}$/i.test(value)) return
      mtAccentPreviewPending = value
      if (mtAccentPreviewRaf) return
      const paint = function () {
        mtAccentPreviewRaf = 0
        const color = mtAccentPreviewPending
        try {
          mtPaintAccentVar(document.documentElement, color)
          const panel = document.querySelector('[data-dsh-model-theme-settings="1"]')
          mtPaintAccentVar(panel, color)
          mtMarkHarnessBadge()
        } catch (e) {}
      }
      try { mtAccentPreviewRaf = requestAnimationFrame(paint) } catch (e) { paint() }
    }
    function mtThemeEnabled(fam) {
      return mtFamily(fam).theme !== false
    }
    function mtTransitionEnabled(fam) {
      return mtFamily(fam).transition !== false
    }
    function mtAfterChange(fam) {
      try {
        for (const key in CSS_CACHE) delete CSS_CACHE[key]
      } catch (e) {}
      try {
        if (typeof window.__dshModelThemeRefresh === "function") window.__dshModelThemeRefresh(fam)
      } catch (e) {}
      try {
        if (typeof window.__dshModelTransitionRefresh === "function") window.__dshModelTransitionRefresh(fam)
      } catch (e) {}
      try {
        window.dispatchEvent(new CustomEvent("dsh-model-theme:settings", { detail: { family: fam, version: mtVersion } }))
      } catch (e) {}
    }

    function detect(text) {
      if (!text) return null
      const t = String(text).toLowerCase()
      if (t.indexOf("deepseek") >= 0) return "deepseek"
      if (t.indexOf("glm") >= 0 || t.indexOf("chatglm") >= 0) return "glm"
      if (t.indexOf("claude") >= 0 || t.indexOf("anthropic") >= 0) return "claude"
      if (t.indexOf("gpt") >= 0 || t.indexOf("openai") >= 0) return "gpt"
      if (t.indexOf("gemini") >= 0 || t.indexOf("google") >= 0) return "gemini"
      if (t.indexOf("kimi") >= 0 || t.indexOf("moonshot") >= 0) return "kimi"
      if (t.indexOf("qwen") >= 0 || t.indexOf("通义") >= 0 || t.indexOf("dashscope") >= 0) return "qwen"
      return null
    }

    function readModelText() {
      const model = document.querySelector(".dms-trigger-model")
      if (model && model.textContent) return model.textContent
      const trigger = document.querySelector(".dms-trigger")
      if (trigger && trigger.textContent) return trigger.textContent
      return ""
    }

    const CSS_CACHE = {}
    function themeCss(fam) {
      const th = mtThemeOf(fam)
      if (!th) return ""
      if (CSS_CACHE[fam]) return CSS_CACHE[fam]
      const ink = BUBBLE_INK[fam] || th.brand
      const c0 = th.side[0]
      const c1 = th.side[1]
      const brand = th.brand
      const tint = th.tint
      const parts = []

      parts.push(
        'html, body { background-color: #ffffff !important; background-image: url("' +
          mtBgUrl(fam) +
          '") !important; background-size: cover !important; background-position: center top !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }'
      )
      /* 顶部窗口按钮：让 DSH 的标题栏取色探针读到透明色，避免右侧出现一块实心灰底 */
      parts.push(
        'body > span[style*="--dsw-specific-sidebar-fill"] { --dsw-specific-sidebar-fill: rgba(255,255,255,0) !important; }'
      )

      /* 新会话 hero：各模型官方标识的容器尺寸与 Kimi 专用字标 */
      parts.push(
        '.dsh-hero-mark { display:inline-flex; align-items:center; justify-content:center; width:34px; height:30px; line-height:1; }'
      )
      parts.push('.dsh-hero-mark svg { width:30px; height:30px; display:block; color: inherit !important; }')
      parts.push('.dsh-hero-img { width:30px; height:30px; object-fit:contain; display:block; }')
      parts.push('.dsh-hero-title { display:inline-block; line-height:1; }')
      parts.push(
        '.dsh-hero-kimi { display:inline-flex; align-items:baseline; gap:5px; line-height:1; font-size:30px; font-weight:900; letter-spacing:-0.7px; color:#000; white-space:nowrap; }'
      )
      parts.push(
        '.dsh-hero-kimi .dot { display:inline-block; width:6px; height:6px; margin-left:2px; border-radius:50%; background:#1484FF; vertical-align:super; }'
      )
      parts.push(
        '.dsh-hero-kimi .work { font-size:11px; font-weight:800; letter-spacing:2.6px; color:transparent; -webkit-text-stroke:1px #000; transform:translateY(-3px); }'
      )
      parts.push(
        '.dsh-hero-kimi .beta { font-size:10px; font-weight:600; letter-spacing:.5px; color:#5B6470; border:1px solid rgba(91,100,112,.48); border-radius:999px; padding:2px 7px; margin-left:3px; transform:translateY(-4px); }'
      )
      parts.push(
        '.dsh-think-icon { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; line-height:1; }'
      )
      parts.push('.dsh-think-icon svg { width:16px; height:16px; display:block; }')
      parts.push('.dsh-think-img { width:16px; height:16px; object-fit:contain; display:block; }')
      /* 思考状态：图标容器原本为了裁鲸鱼动画设了 contain:strict + overflow:hidden，换成品牌图标后会把动画裁掉 */
      parts.push(
        '[data-chat-running] [data-dsh-think-icon] { overflow:visible !important; contain:none !important; width:16px !important; height:16px !important; min-width:16px !important; }'
      )
      /* 非 DeepSeek 时把原生鲸鱼动画隐藏，避免 React 重绘瞬间露出白底鲸鱼帧 */
      parts.push(
        '[data-chat-running]:not([data-dsh-think-model="deepseek"]) [class*="runningWhaleAnimated"], [data-chat-running]:not([data-dsh-think-model="deepseek"]) [class*="runningWhaleStill"] { display:none !important; }'
      )
      /* 文字颜色跟随当前模型；同时改 shimmer 的扫光变量，否则 TextShimmer 会继续用 DeepSeek 蓝 */
      const thinkColorCss = {
        gpt: ['#111111', 'rgba(17,17,17,.34)'],
        claude: ['#D97757', 'rgba(217,119,87,.40)'],
        gemini: ['#3186FF', 'rgba(49,134,255,.38)'],
        glm: ['#2C5BFF', 'rgba(44,91,255,.38)'],
        qwen: ['#7D5CEC', 'rgba(125,92,236,.38)'],
        kimi: ['#111111', 'rgba(17,17,17,.34)']
      }
      Object.keys(thinkColorCss).forEach(function (fam) {
        const c = thinkColorCss[fam]
        parts.push(
          '[data-chat-running][data-dsh-think-model="' + fam + '"] { color:' + c[0] + ' !important; --dsw-alias-label-deep-diving:' + c[0] + ' !important; --dsw-alias-label-deep-diving-shimmer:' + c[0] + ' !important; --dsw-alias-label-shimmer:' + c[1] + ' !important; }'
        )
      })
      /* 品牌图标的动态：Claude 先收拢旋转再绽开，其余保持各自品牌的轻微呼吸/旋转 */
      parts.push(
        '@keyframes dsh-think-claude { 0% { transform:rotate(0deg) scale(1); } 46% { transform:rotate(210deg) scale(.58); } 58% { transform:rotate(240deg) scale(.58); } 100% { transform:rotate(360deg) scale(1); } }'
      )
      parts.push(
        '@keyframes dsh-think-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }'
      )
      parts.push(
        '@keyframes dsh-think-breathe { 0%,100% { transform:scale(1); opacity:.92; } 50% { transform:scale(1.12); opacity:1; } }'
      )
      parts.push(
        '[data-chat-running][data-dsh-think-model="claude"] [data-dsh-think-icon] { animation:dsh-think-claude 1.8s cubic-bezier(.45,.05,.55,.95) infinite; transform-origin:50% 50%; }'
      )
      parts.push(
        '[data-chat-running][data-dsh-think-model="gpt"] [data-dsh-think-icon] { animation:dsh-think-spin 2.8s linear infinite; transform-origin:50% 50%; }'
      )
      parts.push(
        '[data-chat-running][data-dsh-think-model="gemini"] [data-dsh-think-icon] { animation:dsh-think-spin 3.2s linear infinite; transform-origin:50% 50%; }'
      )
      parts.push(
        '[data-chat-running][data-dsh-think-model="glm"] [data-dsh-think-icon], [data-chat-running][data-dsh-think-model="qwen"] [data-dsh-think-icon], [data-chat-running][data-dsh-think-model="kimi"] [data-dsh-think-icon] { animation:dsh-think-breathe 1.9s ease-in-out infinite; transform-origin:50% 50%; }'
      )

      /* 顶部 40px 应用导航栏：半透明磨砂（比左侧导航略重一点） */
      parts.push(
        '[class*="_frame"]::before { background: rgba(255,255,255,0.55) !important; backdrop-filter: blur(18px) saturate(1.3) !important; -webkit-backdrop-filter: blur(18px) saturate(1.3) !important; box-shadow: 0 1px 0 rgba(255,255,255,0.45) inset !important; }'
      )

      parts.push(
        '[class*="_frame"], [class*="_centerCol"], [class*="wtg9ga_root"], .an3WzG_root { background: transparent !important; }'
      )
      parts.push('[class*="_mainPanel"] { background-color: rgba(255,255,255,0.16) !important; }')

      /* 插件页：顶部是更明显的奶白磨砂，和下面的大块分组面板拉开层次；标签栏上移 */
      parts.push(
        '[class*="_pageBar"]::before { background: rgba(255,255,255,0.34) !important; backdrop-filter: blur(22px) saturate(1.05) !important; -webkit-backdrop-filter: blur(22px) saturate(1.05) !important; }'
      )
      parts.push(
        '[class*="_pageBar"] { border-bottom: 1px solid rgba(255,255,255,0.28) !important; }'
      )
      parts.push(
        '[class*="_pageTabs"] { transform: translateY(-12px) !important; }'
      )
      parts.push(
        '[class*="V7pFBG_pageBar"] [class*="V7pFBG_pageTitle"] { transform: translateY(-12px) !important; }'
      )
      parts.push(
        '[class*="V7pFBG_pageBar"] [class*="V7pFBG_pageIntro"], [class*="V7pFBG_pageBar"] [class*="V7pFBG_infoButton"] { display: none !important; }'
      )

      /* 发现页仍然一张插件一张磨砂卡；已安装页则由“分组”统一包成一个大磨砂板 */
      parts.push(
        '[class*="_cards"] > li[class*="_card"] { background: rgba(255,255,255,0.17) !important; backdrop-filter: blur(20px) saturate(1.18) !important; -webkit-backdrop-filter: blur(20px) saturate(1.18) !important; border: 1px solid rgba(255,255,255,0.35) !important; box-shadow: 0 10px 28px rgba(20,30,50,0.08) !important; }'
      )
      parts.push(
        '[class*="_installedPanel"] > section[class*="_group"] { position: relative !important; isolation: isolate !important; }'
      )
      parts.push(
        '[class*="_installedPanel"] > section[class*="_group"]::before { content: "" !important; position: absolute !important; inset: -12px -18px -10px !important; background: rgba(255,255,255,0.16) !important; border: 1px solid rgba(255,255,255,0.32) !important; border-radius: 22px !important; backdrop-filter: blur(22px) saturate(1.15) !important; -webkit-backdrop-filter: blur(22px) saturate(1.15) !important; box-shadow: 0 12px 32px rgba(20,30,50,0.10) !important; z-index: -1 !important; pointer-events: none !important; }'
      )
      parts.push(
        '[class*="_installedPanel"] [class*="_cards"] > li[class*="_card"] { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; border-color: transparent !important; box-shadow: none !important; }'
      )

      /* 工作页：把次级/三级灰字压到和左上角标题一样的近黑，按钮文字也加粗一档 */
      parts.push(
        '[class*="_centerCol"] { --dsw-alias-label-secondary: #0f1115 !important; --dsw-alias-label-tertiary: #0f1115 !important; --dsw-alias-label-caption: #0f1115 !important; --dsw-alias-label-document-preview: #0f1115 !important; }'
      )
      parts.push(
        '[class*="_centerCol"] :is(.GAkraW_sectionLabel, .wnFoaW_time, .wnFoaW_timestamp, .an3WzG_tabLabel, .BI5uFG_label, .GRgSLq_placeholder, ._86kJGG_triggerLabel, .dms-trigger-tier, .hNGZaa_sep, ._1KfHza_timeStart, ._1KfHza_timeEnd, .hE4tRW_durationNumber) { color: #0f1115 !important; font-weight: 500 !important; }'
      )
      parts.push(
        '[class*="_centerCol"] button { font-weight: 500 !important; }'
      )

      /* 右下角记账挂件：去掉自带斜切遮罩、角色贴底、余额气泡抬高（样式表 !important 压过挂件内联写法） */
      parts.push(
        'img.dshwv-img { clip-path: none !important; -webkit-clip-path: none !important; object-fit: contain !important; object-position: center bottom !important; bottom: 0 !important; }'
      )
      parts.push('.dshwv-pop { top: auto !important; bottom: 126px !important; }')
      parts.push(
        '.dshwv-body, .dshwv-root { overflow: visible !important; }'
      )
      /* 记账气泡卡：底色用本模型浅色、描边用品牌色，字用深色墨 */
      parts.push(
        '.dshwv-pop svg .dshwv-bshape, .dshwv-pop svg .dshwv-b1, .dshwv-pop svg .dshwv-b2 { fill: ' +
          th.side[1] +
          ' !important; stroke: ' +
          ink +
          ' !important; }'
      )
      parts.push(
        '.dshwv-text, .dshwv-label, .dshwv-amount, .dshwv-hint, .dshwv-trow { color: ' +
          ink +
          ' !important; text-shadow: none !important; }'
      )
      /* 角色栏（角色列表 / 当前角色）也跟主题色走 */
      parts.push(
        '.dshwv-rolelist { background: rgba(255,255,255,0.97) !important; border-color: ' +
          brand +
          '6b !important; box-shadow: 0 8px 22px ' +
          brand +
          '2e !important; }'
      )
      parts.push('.dshwv-roleitem { color: ' + ink + ' !important; }')
      parts.push('.dshwv-roleitem:hover { background: ' + brand + '14 !important; }')
      parts.push('.dshwv-roleitem.dshwv-roleitem-cur { background: ' + brand + '2b !important; }')
      parts.push('.dshwv-rolethumb { background: ' + th.side[0] + ' !important; }')
      parts.push('.dshwv-rolebtn { border-color: ' + brand + '80 !important; color: ' + ink + ' !important; }')
      parts.push('.dshwv-menu-btn { background: ' + brand + 'd9 !important; border-color: ' + brand + ' !important; }')
      /* 左侧导航加合成层，翻工作区时不再闪出一条白色磨砂 */
      parts.push(
        '[class*="_sidebarCol"] { transform: translateZ(0); isolation: isolate; contain: paint; }'
      )
      parts.push('[class*="wtg9ga_scrollFade"] { opacity: 0 !important; }')

      /* 非 DeepSeek 主题下，挂件自带的「已观测消费」属于 DeepSeek 那本账，先藏掉免得串账 */
      if (fam !== "deepseek") parts.push(".dshwv-hint { display: none !important; }")

      /* 左侧导航：渐变更浅、更透 */
      parts.push(
        '[class*="_sidebarCol"] { background-color: transparent !important; background-image: linear-gradient(180deg, ' +
          c0 +
          '9e 0%, ' +
          c1 +
          '8a 55%, ' +
          c0 +
          '9e 100%) !important; backdrop-filter: blur(14px) saturate(1.12) !important; -webkit-backdrop-filter: blur(14px) saturate(1.12) !important; }'
      )
      /* 导航内部的品牌条 / 新会话按钮也透掉，避免出现白色硬块 */
      /* 导航内部的品牌条 / 新会话按钮也透掉，避免出现白色硬块 */
      parts.push('[class*="wtg9ga_logoRow"], [class*="wtg9ga_brand"] { background: transparent !important; }')
      /* 整块导航下移，紧贴左上角「收起侧边栏」按钮下方 */
      parts.push('[class*="wtg9ga_logoRow"] { margin-top: 30px !important; }')
      /* 抹掉内容区左上角的 16px 圆角，让磨砂背景板把那个小角堵满 */
      parts.push('[class*="_centerCol"] { border-radius: 0 !important; }')
      parts.push('[class*="_mainPanel"] { border-radius: 0 !important; }')
      /* 去掉侧栏底部的白色渐隐灰光、以及输入框上方的白色雾光 */
      parts.push('[class*="wtg9ga_scrollFade"] { background: none !important; }')
      parts.push('[class*="an3WzG_composerSeat"] { background: none !important; }')
      parts.push(
        '[class*="wtg9ga_newSessionRow"], [class*="wtg9ga_newSessionContent"] { background: transparent !important; }'
      )
      parts.push(
        '[class*="_newSession"]:not([class*="_newSessionLabel"]) { background-color: rgba(255,255,255,0.34) !important; backdrop-filter: blur(14px) saturate(1.1) !important; border-color: ' +
          tint +
          ' !important; }'
      )

      /* 消息条目全部透明，只有用户输入与 AI 正文有磨砂气泡 */
      parts.push(
        '[data-chat-flow-kind] { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }'
      )
      parts.push(
        '[data-chat-flow-kind="user"] [class*="_bubble"] { background-color: rgba(237,243,254,0.40) !important; backdrop-filter: blur(18px) saturate(130%) !important; -webkit-backdrop-filter: blur(18px) saturate(130%) !important; border-radius: 14px !important; }'
      )
      parts.push(
        '[data-chat-flow-kind="assistant-step"][data-chat-group-part="response"] [class*="xMeOpW_root"] { background-color: rgba(255,255,255,0.36) !important; backdrop-filter: blur(18px) saturate(135%) !important; -webkit-backdrop-filter: blur(18px) saturate(135%) !important; border-radius: 0 !important; padding: 10px 12px !important; margin: -10px -12px !important; }'
      )

      /* 底部工作面板：更透 */
      parts.push(
        '[data-composer-card] { background: rgba(255,255,255,0.48) !important; backdrop-filter: blur(24px) saturate(140%) !important; -webkit-backdrop-filter: blur(24px) saturate(140%) !important; border-color: ' +
          tint +
          ' !important; }'
      )

      /* 输入框左下角的「＋」：原生是近白实底，鼠标扫过时在深色壁纸上像闪白点。
         改成透明磨砂：默认完全透出底卡，hover/focus 只加一层很淡的白雾和描边。 */
      parts.push(
        '[class*="GRgSLq_add"] { background: transparent !important; box-shadow: none !important; border: 1px solid transparent !important; }'
      )
      parts.push(
        '[class*="GRgSLq_add"]:hover:not(:disabled) { background: rgba(15,17,21,0.07) !important; border-color: rgba(15,17,21,0.16) !important; backdrop-filter: blur(10px) saturate(1.1) !important; -webkit-backdrop-filter: blur(10px) saturate(1.1) !important; }'
      )
      parts.push(
        '[class*="GRgSLq_add"]:focus-visible { outline: none !important; box-shadow: 0 0 0 2px rgba(15,17,21,0.18) !important; }'
      )

      /* 发送键 */
      parts.push(
        'button[aria-label="发送消息"] { background-color: ' +
          brand +
          ' !important; border-color: ' +
          brand +
          ' !important; box-shadow: 0 2px 12px ' +
          (fam === "gpt" ? "rgba(40,48,56,0.20)" : brand + "55") +
          ' !important; }'
      )
      parts.push('button[aria-label="发送消息"]:disabled { opacity: 0.72 !important; }')

      /* GPT 亮灰白主题：按键文字与图标转深色，保证可读 */
      if (fam === "gpt") {
        parts.push(
          'button[aria-label="发送消息"], button[aria-label="发送消息"] svg { color: #2F363D !important; fill: #2F363D !important; }'
        )
      }
      if (fam === "qwen") {
        parts.push('button[aria-label="发送消息"] svg { color: #ffffff !important; fill: #ffffff !important; }')
      }

      parts.push(
        '[class*="_newSession"]:not([class*="_newSessionLabel"]) { border-color: ' +
          tint +
          ' !important; }'
      )

      /* 选中行：去掉左侧那块品牌色竖条，只保留极浅底色 */
      parts.push(
        '[class*="_sessionRow"][class*="_selected"], [class*="_selected"][class*="_sessionRow"] { background-color: ' +
          tint +
          ' !important; border-left-color: transparent !important; border-left-width: 2.4px !important; }'
      )

      parts.push('[class*="_projectRow"]:hover, [class*="_panelRow"]:hover { color: ' + brand + ' !important; }')

      /* 设置/覆盖层：统一白色半透明磨砂（不随模型变色）+ 开关动画 */
      parts.push(
        '.dsu-root { animation: dshSetIn 280ms cubic-bezier(0.22, 0.8, 0.28, 1) both !important; }'
      )
      parts.push('.dsu-wash { background: rgba(255,255,255,0.46) !important; }')
      parts.push(
        '.dsu-backdrop { background: rgba(255,255,255,0.10) !important; backdrop-filter: blur(30px) saturate(1.45) !important; -webkit-backdrop-filter: blur(30px) saturate(1.45) !important; }'
      )
      /* 应用内设置/对话框：白色半透明磨砂，统一不跟随模型色 */
      parts.push(
        '[role="dialog"], [aria-modal="true"] { background: rgba(255,255,255,0.76) !important; backdrop-filter: blur(28px) saturate(1.45) !important; -webkit-backdrop-filter: blur(28px) saturate(1.45) !important; border-radius: 18px !important; box-shadow: 0 24px 64px rgba(18,28,42,0.18) !important; animation: dshSetIn 300ms cubic-bezier(0.22, 0.8, 0.28, 1) both !important; }'
      )
      parts.push(
        '@keyframes dshSetIn { from { opacity: 0; transform: scale(0.986) translateY(8px); } to { opacity: 1; transform: none; } }'
      )
      parts.push(
        '@keyframes dshThemeShade { from { opacity: 0.28; } to { opacity: 0; } }'
      )

      /* 主题一换就先按当前模型压住思考行颜色，不必等 patchThinking 的 120ms 节流 */
      if (fam !== "deepseek" && THINK_META[fam]) {
        /* 主题本身就是非 DeepSeek 时，原生鲸鱼一律隐藏；即使 React 重建 thinking 行，也不会闪白底鲸鱼 */
        parts.push(
          '[data-chat-running]:not([data-dsh-think-model="deepseek"]) [class*="runningWhaleAnimated"], [data-chat-running]:not([data-dsh-think-model="deepseek"]) [class*="runningWhaleStill"] { display:none !important; }'
        )
      }

      const out = parts.join("\n")
      CSS_CACHE[fam] = out
      return out
    }

    function installGlassSurfaces() {
      if (document.getElementById("dsh-glass-surfaces")) return
      const s = document.createElement("style")
      s.id = "dsh-glass-surfaces"
      s.textContent = [
        '.olCj9W_page{background:linear-gradient(145deg,rgba(255,255,255,.52),rgba(255,255,255,.33))!important;backdrop-filter:blur(26px) saturate(1.25)!important;-webkit-backdrop-filter:blur(26px) saturate(1.25)!important;border:1px solid rgba(255,255,255,.56)!important;border-radius:18px!important;box-shadow:0 18px 55px rgba(48,38,100,.14),inset 0 1px 0 rgba(255,255,255,.66)!important;overflow:hidden!important}',
        '.olCj9W_pageScroll,.olCj9W_pageContent,.olCj9W_listPane{background:transparent!important}',
        '.olCj9W_createPrimary,.olCj9W_createMore{background:linear-gradient(180deg,#8b7cf6,#6c5ae6)!important;border-color:rgba(255,255,255,.38)!important;box-shadow:0 7px 20px rgba(102,84,206,.24),inset 0 1px 0 rgba(255,255,255,.3)!important}',
        '.olCj9W_createPrimary{border-radius:12px 0 0 12px!important}.olCj9W_createMore{border-radius:0 12px 12px 0!important}',
        '.olCj9W_filterTab{border-radius:999px!important;color:rgba(37,36,58,.64)!important;background:transparent!important}',
        '.olCj9W_filterTabActive{background:rgba(255,255,255,.5)!important;border:1px solid rgba(255,255,255,.62)!important;color:#5b49c9!important;box-shadow:0 4px 14px rgba(70,55,150,.10),inset 0 1px 0 rgba(255,255,255,.65)!important}',
        '.olCj9W_searchField{background:rgba(255,255,255,.42)!important;border:1px solid rgba(255,255,255,.58)!important;border-radius:12px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.62)!important;backdrop-filter:blur(16px)!important}',
        '.olCj9W_searchField input{color:#242238!important}',
        '.olCj9W_empty{background:linear-gradient(145deg,rgba(255,255,255,.42),rgba(255,255,255,.26))!important;border:1px dashed rgba(255,255,255,.68)!important;border-radius:16px!important;backdrop-filter:blur(20px)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.6)!important}',
        '.olCj9W_emptyAction{background:rgba(255,255,255,.46)!important;border:1px solid rgba(255,255,255,.64)!important;color:#5b49c9!important;box-shadow:0 5px 16px rgba(70,55,150,.10),inset 0 1px 0 rgba(255,255,255,.65)!important}',
        '.olCj9W_listRows>*{background:rgba(255,255,255,.40)!important;border:1px solid rgba(255,255,255,.52)!important;border-radius:14px!important;backdrop-filter:blur(18px)!important;box-shadow:0 8px 22px rgba(48,38,100,.08)!important}'
      ].join("\n")
      ;(document.head || document.documentElement).appendChild(s)
    }

    function installIframeSoundBridge() {
      if (window.__dshIframeSfxInstalled) return
      window.__dshIframeSfxInstalled = true
      window.addEventListener("message", function (event) {
        const data = event && event.data
        if (!data || data.type !== "dsh-iframe-click-sfx") return
        if (!event.origin || !/^https?:\/\/(127\.0\.0\.1|localhost):\d+$/.test(event.origin)) return
        try { mtPlaySound(mtSound().id) } catch (e) {}
      })
    }

    function installSettingsSwitchStyle() {
      if (document.getElementById("dsh-settings-switch-style")) return
      const s = document.createElement("style")
      s.id = "dsh-settings-switch-style"
      s.textContent = [
        ':where(.AnXs9G_panel, [data-dsh-model-theme-settings="1"], .dsh-pet-cfg, .dsh-pet-cfg__toggle, .dsh-pet-settings, .dsh-pet-panel) input[type="checkbox"]{-webkit-appearance:none!important;appearance:none!important;box-sizing:border-box!important;display:inline-block!important;position:relative!important;flex:none!important;width:38px!important;height:22px!important;min-width:38px!important;padding:0!important;margin:0!important;border:1px solid rgba(120,120,140,.28)!important;border-radius:999px!important;background:rgba(120,120,140,.22)!important;box-shadow:inset 0 1px 2px rgba(0,0,0,.08)!important;cursor:pointer!important;vertical-align:middle!important;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease!important;accent-color:transparent!important}',
        ':where(.AnXs9G_panel, [data-dsh-model-theme-settings="1"], .dsh-pet-cfg, .dsh-pet-cfg__toggle, .dsh-pet-settings, .dsh-pet-panel) input[type="checkbox"]::before{content:""!important;position:absolute!important;left:2px!important;top:2px!important;width:16px!important;height:16px!important;border-radius:50%!important;background:#fff!important;box-shadow:0 1px 3px rgba(0,0,0,.22),0 0 0 1px rgba(255,255,255,.4)!important;transition:left .18s cubic-bezier(.2,.8,.2,1),transform .18s ease!important;transform:none!important}',
        ':where(.AnXs9G_panel, [data-dsh-model-theme-settings="1"], .dsh-pet-cfg, .dsh-pet-cfg__toggle, .dsh-pet-settings, .dsh-pet-panel) input[type="checkbox"]:checked{background:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;border-color:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;box-shadow:0 0 0 1px var(--dsh-theme-accent-soft,rgba(108,90,230,.15)),inset 0 1px 1px rgba(0,0,0,.12)!important}',
        ':where(.AnXs9G_panel, [data-dsh-model-theme-settings="1"], .dsh-pet-cfg, .dsh-pet-cfg__toggle, .dsh-pet-settings, .dsh-pet-panel) input[type="checkbox"]:checked::before{left:19px!important;background:var(--dsh-theme-accent-ink,#fff)!important}',
        ':where(.AnXs9G_panel, [data-dsh-model-theme-settings="1"], .dsh-pet-cfg, .dsh-pet-cfg__toggle, .dsh-pet-settings, .dsh-pet-panel) input[type="checkbox"]:focus-visible{outline:2px solid var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;outline-offset:2px!important}',
        ':where(.AnXs9G_panel, [data-dsh-model-theme-settings="1"], .dsh-pet-cfg, .dsh-pet-cfg__toggle, .dsh-pet-settings, .dsh-pet-panel) input[type="checkbox"]:disabled{opacity:.45!important;cursor:not-allowed!important}',
        /* 原生 checkbox 滑块：全局接住，所有带 switch 语义的勾选都跟主题色 */
        'input[type="checkbox"][role="switch"]{-webkit-appearance:none!important;appearance:none!important;box-sizing:border-box!important;display:inline-block!important;position:relative!important;flex:none!important;width:38px!important;height:22px!important;min-width:38px!important;padding:0!important;margin:0!important;border:1px solid rgba(120,120,140,.28)!important;border-radius:999px!important;background:rgba(120,120,140,.22)!important;box-shadow:inset 0 1px 2px rgba(0,0,0,.08)!important;cursor:pointer!important;vertical-align:middle!important;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease!important;accent-color:transparent!important}',
        'input[type="checkbox"][role="switch"]::before{content:""!important;position:absolute!important;left:2px!important;top:2px!important;width:16px!important;height:16px!important;border-radius:50%!important;background:#fff!important;box-shadow:0 1px 3px rgba(0,0,0,.22),0 0 0 1px rgba(255,255,255,.4)!important;transition:left .18s cubic-bezier(.2,.8,.2,1),background .18s ease!important}',
        'input[type="checkbox"][role="switch"]:checked{background:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;border-color:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;box-shadow:0 0 0 1px var(--dsh-theme-accent-soft,rgba(108,90,230,.15)),inset 0 1px 1px rgba(0,0,0,.12)!important}',
        'input[type="checkbox"][role="switch"]:checked::before{left:19px!important;background:var(--dsh-theme-accent-ink,#fff)!important}',
        /* DSH 自带的按钮式滑动开关：开启态也用当前模型主色 */
        'button[role="switch"][aria-checked="true"]{background:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;border-color:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important}',
        'button[role="switch"][aria-checked="true"]>span[class*="_thumb_"]{background:var(--dsh-theme-accent-ink,#fff)!important}',
        'button[role="switch"][aria-checked="false"]{background:var(--dsh-theme-accent-soft,rgba(120,120,140,.22))!important;border-color:var(--dsh-theme-accent-soft,rgba(120,120,140,.28))!important}',
        'button[role="switch"]:focus-visible{outline:2px solid var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;outline-offset:2px!important}',
        /* 左上角 HARNESS 角标与工作台发送键：同色联动，字色按底色的深浅自动黑/白 */
        '.dsh-mt-harness-badge,.dsh-brand-text>span:nth-child(2){background:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;color:var(--dsh-theme-accent-ink,#fff)!important;border-color:var(--dsh-theme-accent-ink,#fff)!important}',
        'button.GRgSLq_primary[aria-label^="发送"]{background:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;border-color:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important;color:var(--dsh-theme-accent-ink,#fff)!important}',
        'button.GRgSLq_primary[aria-label^="发送"] svg path{fill:currentColor!important}',
        'input[type="range"]{accent-color:var(--dsh-theme-accent,var(--dsw-alias-brand-primary,#6c5ae6))!important}'
      ].join("\n")
      ;(document.head || document.documentElement).appendChild(s)
    }

    function installNativeSelectSkin() {
      if (window.__dshMtSelectSkin) return
      window.__dshMtSelectSkin = true
      const styleId = "dsh-mt-select-style"
      if (!document.getElementById(styleId)) {
        const s = document.createElement("style")
        s.id = styleId
        s.textContent = [
          "select.dsh-mt-select{-webkit-appearance:none!important;appearance:none!important;box-sizing:border-box!important;height:30px!important;min-height:30px!important;padding:3px 28px 3px 10px!important;border:1px solid rgba(0,0,0,.10)!important;border-radius:8px!important;background-color:#fff!important;color:#0F1115!important;font-size:13px!important;line-height:20px!important;box-shadow:none!important;outline:none!important;cursor:pointer!important;text-overflow:ellipsis!important;white-space:nowrap!important;overflow:hidden!important;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%230F1115' stroke-width='1.4'/%3E%3C/svg%3E\")!important;background-repeat:no-repeat!important;background-position:right 9px center!important;background-size:10px 6px!important;transition:border-color .15s ease,box-shadow .15s ease!important}",
          "select.dsh-mt-select:hover{border-color:rgba(0,0,0,.22)!important}",
          "select.dsh-mt-select:focus{outline:none!important;border-color:var(--dsh-theme-accent,#1FA2FF)!important;box-shadow:0 0 0 3px var(--dsh-theme-accent-soft,rgba(31,162,255,.16))!important}",
          "select.dsh-mt-select:disabled{opacity:.48!important;cursor:not-allowed!important}",
          "select.dsh-mt-select option{background:#fff!important;color:#0F1115!important}",
          "@keyframes dshMtSelectIn{from{opacity:.6;scale:.96;translate:0 -4px}to{opacity:1;scale:1;translate:0 0}}",
          ".dsh-mt-select-panel{position:fixed;z-index:2147483000;box-sizing:border-box;padding:4px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;box-shadow:0 0 0 .5px rgba(0,0,0,.16),0 3px 8px rgba(0,0,0,.04),0 0 20px rgba(0,0,0,.05);overflow:auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',Helvetica,Arial,sans-serif;color:#0F1115;opacity:1;scale:1;translate:0 0;transform-origin:top center;animation:dshMtSelectIn .22s cubic-bezier(.34,1.4,.64,1)}",
          ".dsh-mt-select-panel.is-open{opacity:1;scale:1;translate:0 0}",
          ".dsh-mt-select-panel.is-closing{animation:none!important;opacity:0;scale:.97;translate:0 -3px;pointer-events:none;transition:opacity .14s ease-out,scale .14s ease-out,translate .14s ease-out}",
          ".dsh-mt-select-panel::-webkit-scrollbar{width:8px}.dsh-mt-select-panel::-webkit-scrollbar-thumb{background:rgba(0,0,0,.14);border-radius:8px}",
          ".dsh-mt-select-item{display:flex;align-items:center;justify-content:space-between;gap:8px;box-sizing:border-box;width:100%;height:30px;padding:5px 8px;border:0;border-radius:8px;background:transparent;color:#0F1115;font-size:13px;line-height:20px;text-align:left;cursor:pointer;white-space:nowrap;overflow:hidden}",
          ".dsh-mt-select-item:hover,.dsh-mt-select-item.is-focus{background:rgba(0,0,0,.055)}",
          ".dsh-mt-select-item.is-selected{background:rgba(0,0,0,.035)}",
          ".dsh-mt-select-item .dsh-mt-select-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis}",
          ".dsh-mt-select-item .dsh-mt-select-check{flex:none;width:14px;color:#0F1115;font-size:13px;text-align:center}",
          ".dsh-mt-select-group{padding:6px 8px 3px;font-size:10px;line-height:14px;letter-spacing:.04em;color:rgba(15,17,21,.46);text-transform:uppercase}",
          /* 设置弹窗有 backdrop-filter/transform，fixed 子面板会以它为包含块；用面板原点反向补偿 */
          ".AnXs9G_panel{--dsh-mt-panel-x:0px;--dsh-mt-panel-y:0px}",
          ".AnXs9G_panel .dsh-pet-sel__panel,.AnXs9G_panel .dsh-pet-mp__panel{margin-left:calc(-1 * var(--dsh-mt-panel-x,0px))!important;margin-right:calc(-1 * var(--dsh-mt-panel-x,0px))!important;margin-top:calc(-1 * var(--dsh-mt-panel-y,0px))!important;margin-bottom:calc(-1 * var(--dsh-mt-panel-y,0px))!important}"
        ].join("\n")
        ;(document.head || document.documentElement).appendChild(s)
      }
      let panel = null
      let active = null
      let panelItems = []
      let panelIndex = -1
      let panelOpenedAt = 0
      let petOutsideAt = 0
      function close(animate) {
        const old = panel
        panel = null
        active = null
        panelItems = []
        panelIndex = -1
        if (!old) return
        if (animate === false) {
          try { if (old.parentNode) old.parentNode.removeChild(old) } catch (e) {}
          return
        }
        try {
          old.classList.remove("is-open")
          old.classList.add("is-closing")
        } catch (e) {}
        setTimeout(function () { try { if (old.parentNode) old.parentNode.removeChild(old) } catch (e) {} }, 170)
      }
      function paint(select) {
        try { if (select && select.tagName === "SELECT") select.classList.add("dsh-mt-select") } catch (e) {}
      }
      function scan() {
        try {
          const list = document.querySelectorAll("select")
          for (let i = 0; i < list.length; i++) paint(list[i])
        } catch (e) {}
      }
      function commit(select, value) {
        if (!select) return
        let prev = ""
        try { prev = select.value } catch (e) {}
        try {
          const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")
          if (desc && desc.set) desc.set.call(select, value)
          else select.value = value
        } catch (e) { try { select.value = value } catch (err) {} }
        try {
          /* 让 React 的 value tracker 看到“旧值 -> 新值”，否则受控 select 不会触发 onChange */
          const tracker = select._valueTracker
          if (tracker && typeof tracker.setValue === "function") tracker.setValue(prev)
        } catch (e) {}
        try { select.dispatchEvent(new Event("input", { bubbles: true })) } catch (e) {}
        try { select.dispatchEvent(new Event("change", { bubbles: true })) } catch (e) {}
      }
      function moveFocus(delta) {
        if (!panelItems.length) return
        panelIndex = (panelIndex + delta + panelItems.length) % panelItems.length
        for (let i = 0; i < panelItems.length; i++) {
          try { panelItems[i].classList.toggle("is-focus", i === panelIndex) } catch (e) {}
          try { panelItems[i].setAttribute("tabindex", i === panelIndex ? "0" : "-1") } catch (e) {}
        }
        try { panelItems[panelIndex].focus({ preventScroll: true }) } catch (e) {}
        try {
          const box = panel
          const item = panelItems[panelIndex]
          if (box && item && box.scrollHeight > box.clientHeight) {
            const top = item.offsetTop
            const bottom = top + item.offsetHeight
            if (top < box.scrollTop + 4) box.scrollTop = Math.max(0, top - 4)
            else if (bottom > box.scrollTop + box.clientHeight - 4) box.scrollTop = bottom - box.clientHeight + 4
          }
        } catch (e) {}
      }
      function panelHealthy(select) {
        if (!panel || active !== select || !panel.parentNode) return false
        try {
          const r = panel.getBoundingClientRect()
          if (!r.width || !r.height) return false
          if (r.bottom <= 0 || r.top >= window.innerHeight || r.right <= 0 || r.left >= window.innerWidth) return false
          const cs = window.getComputedStyle(panel)
          if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.25) return false
          return true
        } catch (e) {
          return false
        }
      }
      function placePanel(select) {
        if (!panel || !select) return
        try {
          const rect = select.getBoundingClientRect()
          if (!rect.width || !rect.height) return
          const width = Math.max(170, Math.min(360, rect.width || 180))
          panel.style.width = width + "px"
          panel.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)) + "px"
          panel.style.maxHeight = Math.max(96, Math.min(320, window.innerHeight - 16)) + "px"
          let top = rect.bottom + 4
          panel.style.top = top + "px"
          const bh = Math.min(panel.scrollHeight + 8, Math.min(320, window.innerHeight - 16))
          if (top + bh > window.innerHeight - 8) top = Math.max(8, rect.top - bh - 4)
          panel.style.top = top + "px"
        } catch (e) {}
      }
      function schedulePlace(select, box) {
        ;[0, 60, 180, 320].forEach(function (delay) {
          setTimeout(function () {
            if (panel === box && active === select) placePanel(select)
          }, delay)
        })
      }
      function open(select) {
        if (!select || select.disabled) return
        close(false)
        active = select
        const rect = select.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const box = document.createElement("div")
        box.className = "dsh-mt-select-panel"
        box.setAttribute("role", "listbox")
        box.setAttribute("data-dsh-mt-select-panel", "1")
        const frag = document.createDocumentFragment()
        let groupName = ""
        for (let i = 0; i < select.options.length; i++) {
          const opt = select.options[i]
          const parent = opt.parentElement
          const group = parent && parent.tagName === "OPTGROUP" ? String(parent.label || "") : ""
          if (group && group !== groupName) {
            groupName = group
            const gh = document.createElement("div")
            gh.className = "dsh-mt-select-group"
            gh.textContent = group
            frag.appendChild(gh)
          }
          const item = document.createElement("button")
          item.type = "button"
          item.className = "dsh-mt-select-item" + (opt.selected ? " is-selected" : "")
          item.setAttribute("role", "option")
          item.setAttribute("aria-selected", opt.selected ? "true" : "false")
          item.setAttribute("data-value", opt.value)
          const name = document.createElement("span")
          name.className = "dsh-mt-select-name"
          name.textContent = opt.textContent || opt.value || " "
          const check = document.createElement("span")
          check.className = "dsh-mt-select-check"
          check.textContent = opt.selected ? "✓" : ""
          item.appendChild(name)
          item.appendChild(check)
          item.addEventListener("pointerdown", function (ev) { ev.stopPropagation() })
          item.addEventListener("click", function (ev) {
            ev.preventDefault()
            ev.stopPropagation()
            commit(select, opt.value)
            close()
            try { select.focus({ preventScroll: true }) } catch (e) {}
          })
          frag.appendChild(item)
        }
        box.appendChild(frag)
        box.addEventListener("pointerdown", function (ev) { ev.stopPropagation() })
        ;(document.body || document.documentElement).appendChild(box)
        panel = box
        panelOpenedAt = Date.now()
        panelItems = Array.prototype.slice.call(box.querySelectorAll(".dsh-mt-select-item"))
        placePanel(select)
        try { void box.offsetWidth } catch (e) {}
        box.classList.add("is-open")
        panelIndex = panelItems.findIndex(function (el) { return el.classList.contains("is-selected") })
        if (panelIndex < 0) panelIndex = 0
        moveFocus(0)
        schedulePlace(select, box)
        box.addEventListener("keydown", function (ev) {
          if (ev.key === "Escape") { ev.preventDefault(); close(); try { select.focus({ preventScroll: true }) } catch (e) {} }
          else if (ev.key === "ArrowDown") { ev.preventDefault(); moveFocus(1) }
          else if (ev.key === "ArrowUp") { ev.preventDefault(); moveFocus(-1) }
          else if (ev.key === "Enter" || ev.key === " ") {
            if (document.activeElement && document.activeElement.classList.contains("dsh-mt-select-item")) {
              ev.preventDefault(); document.activeElement.click()
            }
          }
        })
      }
      function fixPetPopup(trigger) {
        if (!trigger || !trigger.getBoundingClientRect) return false
        let panel = null
        try {
          const list = document.querySelectorAll(".dsh-pet-sel__panel,.dsh-pet-mp__panel")
          for (let i = 0; i < list.length; i++) {
            const r = list[i].getBoundingClientRect()
            if (r.width > 0 && r.height > 0) { panel = list[i]; break }
          }
        } catch (e) {}
        if (!panel) return false
        function apply() {
          try {
            const tr = trigger.getBoundingClientRect()
            const pr = panel.getBoundingClientRect()
            if (!tr.width || !pr.width) return
            const sx = panel.offsetWidth ? pr.width / panel.offsetWidth : 1
            const sy = panel.offsetHeight ? pr.height / panel.offsetHeight : 1
            const alignRight = Math.abs(pr.right - tr.right) < Math.abs(pr.left - tr.left)
            const desiredX = alignRight ? tr.right - pr.width : tr.left
            const dx = (pr.left - desiredX) / (sx || 1)
            const left = parseFloat(panel.style.left)
            const right = parseFloat(panel.style.right)
            if (!isNaN(left) && panel.style.left) panel.style.left = (left - dx) + "px"
            else if (!isNaN(right) && panel.style.right) panel.style.right = (right + dx) + "px"
            const below = pr.top >= tr.top - 4
            const desiredY = below ? tr.bottom + 4 : tr.top - pr.height - 4
            const dy = (pr.top - desiredY) / (sy || 1)
            const top = parseFloat(panel.style.top)
            const bottom = parseFloat(panel.style.bottom)
            if (!isNaN(top) && panel.style.top) panel.style.top = (top - dy) + "px"
            else if (!isNaN(bottom) && panel.style.bottom) panel.style.bottom = (bottom + dy) + "px"
          } catch (e) {}
        }
        apply()
        try {
          requestAnimationFrame(function () {
            apply()
            requestAnimationFrame(apply)
          })
        } catch (e) {}
        return true
      }
      function petPanelOf(trigger) {
        const wrap = trigger && trigger.closest && trigger.closest(".dsh-pet-sel,.dsh-pet-mp")
        return wrap ? wrap.querySelector(".dsh-pet-sel__panel,.dsh-pet-mp__panel") : null
      }
      function revealPetPanelNow(trigger) {
        const p = petPanelOf(trigger)
        if (!p) return false
        try {
          const cs = window.getComputedStyle(p)
          if (cs.display === "none") p.style.setProperty("display", "block", "important")
          if (cs.visibility === "hidden") p.style.setProperty("visibility", "visible", "important")
          if (parseFloat(cs.opacity) < 0.2) p.style.setProperty("opacity", "1", "important")
          if (cs.pointerEvents === "none") p.style.setProperty("pointer-events", "auto", "important")
        } catch (e) {}
        return true
      }
      function scheduleFixPet(trigger) {
        if (!trigger) return
        const times = [0, 40, 100, 180, 300, 500, 800]
        for (let i = 0; i < times.length; i++) {
          setTimeout(function () {
            revealPetPanelNow(trigger)
            fixPetPopup(trigger)
          }, times[i])
        }
      }
      function retryPetOpen(trigger) {
        if (!trigger) return
        setTimeout(function () {
          if (Date.now() - petOutsideAt < 600) return
          if (petPanelOf(trigger)) return
          try { trigger.click() } catch (e) {}
          setTimeout(function () { scheduleFixPet(trigger) }, 40)
        }, 180)
      }
      function holdOpenPetPanel(ev) {
        const t = ev.target
        const trigger = t && t.closest && t.closest("button.dsh-pet-sel__trigger,button.dsh-pet-mp__trigger")
        if (!trigger) return false
        const openPanel = petPanelOf(trigger)
        if (!openPanel) return false
        revealPetPanelNow(trigger)
        ev.preventDefault()
        ev.stopPropagation()
        return true
      }
      function holdOpenModelPicker(ev) {
        const t = ev.target
        const trigger = t && t.closest && t.closest(".dms-trigger")
        if (!trigger) return false
        const view = document.querySelector(".dms-vendors-view[data-active='true']")
        if (!view) return false
        /* 顶部模型下拉已经展开时，第二次点同一个触发器不再让 React 把它关掉；
           关闭交给点外部、Esc 或选择模型。 */
        ev.preventDefault()
        ev.stopPropagation()
        return true
      }
      function syncPanelOrigin(trigger) {
        scheduleFixPet(trigger)
      }
      document.addEventListener("pointerdown", function (ev) {
        if (holdOpenModelPicker(ev)) return
        if (holdOpenPetPanel(ev)) return
        const t = ev.target
        const sel = t && t.closest && t.closest("select")
        if (sel) {
          if (ev.button !== 0 || sel.disabled) return
          paint(sel)
          ev.preventDefault()
          ev.stopPropagation()
          if (panel && active === sel) {
            /* 已经展开时再点触发器只保持展开，不再收起；若面板被宿主遮挡/挪出视口则重新打开 */
            if (panelHealthy(sel)) placePanel(sel)
            else { close(false); open(sel) }
            return
          }
          open(sel)
          return
        }
        if (panel && t && t.closest && t.closest("[data-dsh-mt-select-panel]")) return
        if (panel) close()
        const pet = t && t.closest && t.closest("button.dsh-pet-sel__trigger,button.dsh-pet-sel__,button.dsh-pet-mp__trigger")
        if (pet) {
          syncPanelOrigin(pet)
          setTimeout(function () { syncPanelOrigin(pet) }, 80)
          setTimeout(function () { syncPanelOrigin(pet) }, 320)
        } else {
          petOutsideAt = Date.now()
        }
      }, true)
      document.addEventListener("click", function (ev) {
        if (holdOpenModelPicker(ev)) return
        if (holdOpenPetPanel(ev)) return
        const sel = ev.target && ev.target.closest && ev.target.closest("select")
        if (sel) {
          ev.preventDefault()
          ev.stopPropagation()
          if (!panel || active !== sel || !panelHealthy(sel)) {
            if (panel) close(false)
            paint(sel)
            open(sel)
          } else {
            placePanel(sel)
          }
          return
        }
        const pet = ev.target && ev.target.closest && ev.target.closest("button.dsh-pet-sel__trigger,button.dsh-pet-sel__,button.dsh-pet-mp__trigger")
        if (pet) { scheduleFixPet(pet); retryPetOpen(pet) }
        const navHit = ev.target && ev.target.closest && ev.target.closest("button.AnXs9G_navCell,[class*='navItem'],[class*='navCell']")
        if (navHit) {
          setTimeout(mtPulseSettingsPage, 60)
          setTimeout(scan, 40)
          setTimeout(scan, 180)
          setTimeout(scan, 550)
        }
      }, true)
      document.addEventListener("mousedown", function (ev) {
        const sel = ev.target && ev.target.closest && ev.target.closest("select")
        if (sel) {
          paint(sel)
          ev.preventDefault()
          if (!panel || active !== sel || !panelHealthy(sel)) {
            if (panel) close(false)
            open(sel)
          } else {
            placePanel(sel)
          }
        }
      }, true)
      document.addEventListener("keydown", function (ev) {
        const sel = ev.target && ev.target.closest && ev.target.closest("select")
        if (sel && (ev.key === "Enter" || ev.key === " " || ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Alt+ArrowDown")) {
          ev.preventDefault()
          paint(sel)
          open(sel)
        }
        if (ev.key === "Escape" && panel) { ev.preventDefault(); close() }
      }, true)
      window.addEventListener("blur", function () {
        /* 第一次点击时 Electron 有时会先触发一次失焦，刚打开的面板不能被它顺手关掉 */
        if (panel && Date.now() - panelOpenedAt >= 260) close()
      }, true)
      document.addEventListener("wheel", function (ev) {
        if (!panel) return
        if (Date.now() - panelOpenedAt < 260) return
        if (ev && ev.target && ev.target.closest && ev.target.closest("[data-dsh-mt-select-panel]")) return
        close()
      }, true)
      scan()
      let pending = false
      const schedule = function () {
        if (pending) return
        pending = true
        try {
          setTimeout(function () { pending = false; scan() }, 30)
        } catch (e) { pending = false; scan() }
      }
      try {
        new MutationObserver(schedule).observe(document.documentElement || document.body, { childList: true, subtree: true })
      } catch (e) {}
      try {
        /* React 桌宠下拉偶尔在入场动画期间被宿主 CSS 压成透明；面板一进 DOM 就强制拉回可见并重新定位 */
        const petObserver = new MutationObserver(function (records) {
          for (let i = 0; i < records.length; i++) {
            const added = records[i].addedNodes || []
            for (let j = 0; j < added.length; j++) {
              const node = added[j]
              if (!node || node.nodeType !== 1) continue
              const panelNode = node.matches && node.matches(".dsh-pet-sel__panel,.dsh-pet-mp__panel")
                ? node
                : (node.querySelector && node.querySelector(".dsh-pet-sel__panel,.dsh-pet-mp__panel"))
              if (!panelNode) continue
              const wrap = panelNode.closest && panelNode.closest(".dsh-pet-sel,.dsh-pet-mp")
              const trigger = wrap && wrap.querySelector("button.dsh-pet-sel__trigger,button.dsh-pet-mp__trigger")
              if (trigger) {
                revealPetPanelNow(trigger)
                scheduleFixPet(trigger)
              }
            }
          }
        })
        petObserver.observe(document.body || document.documentElement, { childList: true, subtree: true })
      } catch (e) {}
      try { setInterval(scan, 1200) } catch (e) {}
      try {
        const host = document.querySelector(".AnXs9G_panel")
        if (host && window.ResizeObserver) {
          new ResizeObserver(function () { syncPanelOrigin(host) }).observe(host)
        }
      } catch (e) {}
      try { window.__dshMtSelectOpen = function (sel) { open(sel) }; window.__dshMtSelectClose = close } catch (e) {}
    }

    /* 设置页换页时给内容区一个很轻的 iOS 式推进，避免点击导航后“啪”地硬切 */
    function mtPulseSettingsPage() {
      const opts = document.querySelector(".AnXs9G_options")
      if (!opts) return
      try {
        opts.classList.remove("dsh-mt-page-in")
        void opts.offsetWidth
        opts.classList.add("dsh-mt-page-in")
      } catch (e) {}
      try { clearTimeout(window.__dshMtPageTimer) } catch (e) {}
      try {
        window.__dshMtPageTimer = setTimeout(function () {
          try { opts.classList.remove("dsh-mt-page-in") } catch (e) {}
        }, 320)
      } catch (e) {}
    }

    /* iPhone 式按压 / 回弹：只做视觉缩放，不改布局，也不进 GitHub 开源副本 */
    function installIPhoneMotion() {
      if (window.__dshMtIphoneMotion) return
      window.__dshMtIphoneMotion = true
      const s = document.createElement("style")
      s.id = "dsh-mt-iphone-motion"
      s.textContent = [
        "button,[role='button'],select.dsh-mt-select,input[type='checkbox'][role='switch'],button.dsh-pet-sel__,button.dsh-pet-sel__trigger,button.dsh-pet-mp__trigger{transform-origin:center center}",
        "@keyframes dshMtIosPress{from{scale:1;filter:brightness(1)}to{scale:.955;filter:brightness(.94)}}",
        "@keyframes dshMtIosRelease{0%{scale:.955;filter:brightness(.94)}55%{scale:1.012;filter:brightness(1)}100%{scale:1;filter:brightness(1)}}",
        "button.dsh-mt-ios-press,[role='button'].dsh-mt-ios-press,select.dsh-mt-select.dsh-mt-ios-press,input[type='checkbox'][role='switch'].dsh-mt-ios-press{animation:dshMtIosPress .14s cubic-bezier(.2,.8,.2,1) both}",
        "button.dsh-mt-ios-release,[role='button'].dsh-mt-ios-release,select.dsh-mt-select.dsh-mt-ios-release,input[type='checkbox'][role='switch'].dsh-mt-ios-release{animation:dshMtIosRelease .3s cubic-bezier(.22,1,.36,1) both}",
        "@keyframes dshMtIosPop{from{opacity:.65;scale:.94;translate:0 -5px}to{opacity:1;scale:1;translate:0 0}}",
        ".dsh-pet-sel__panel,.dsh-pet-mp__panel{animation:dshMtIosPop .24s cubic-bezier(.34,1.4,.64,1);transform-origin:top center}",
        "@keyframes dshMtIosSheet{from{opacity:.7;scale:.985;translate:0 10px}to{opacity:1;scale:1;translate:0 0}}",
        ".AnXs9G_panel{animation:dshMtIosSheet .26s cubic-bezier(.22,1,.36,1);transform-origin:center top}",
        "@keyframes dshMtIosPage{from{opacity:.6;translate:0 5px}to{opacity:1;translate:0 0}}",
        ".dsh-mt-page-in{animation:dshMtIosPage .24s cubic-bezier(.22,1,.36,1)}",
        "input[type='checkbox'][role='switch']{transition:background .28s cubic-bezier(.22,1,.36,1),border-color .28s cubic-bezier(.22,1,.36,1)!important}",
        "input[type='checkbox'][role='switch']::before{transition:left .32s cubic-bezier(.34,1.4,.64,1),width .18s ease,background .18s ease!important}",
        "input[type='checkbox'][role='switch']:active::before{width:18px!important}",
        "input[type='checkbox'][role='switch']:checked:active::before{left:17px!important;width:18px!important}",
        ":where(.AnXs9G_panel,[data-dsh-model-theme-settings='1'],.dsh-pet-cfg,.dsh-pet-cfg__toggle,.dsh-pet-settings,.dsh-pet-panel) input[type='checkbox']::before{transition:left .32s cubic-bezier(.34,1.4,.64,1),width .18s ease,background .18s ease!important}",
        ":where(.AnXs9G_panel,[data-dsh-model-theme-settings='1'],.dsh-pet-cfg,.dsh-pet-cfg__toggle,.dsh-pet-settings,.dsh-pet-panel) input[type='checkbox']:active::before{width:18px!important}",
        ":where(.AnXs9G_panel,[data-dsh-model-theme-settings='1'],.dsh-pet-cfg,.dsh-pet-cfg__toggle,.dsh-pet-settings,.dsh-pet-panel) input[type='checkbox']:checked:active::before{left:17px!important;width:18px!important}"
      ].join("\n")
      ;(document.head || document.documentElement).appendChild(s)

      let downEl = null
      let releaseEl = null
      let releaseTimer = 0
      const pick = function (target) {
        if (!target || !target.closest) return null
        return target.closest("button,[role='button'],select.dsh-mt-select,input[type='checkbox'][role='switch'],button.dsh-pet-sel__,button.dsh-pet-sel__trigger,button.dsh-pet-mp__trigger")
      }
      const clearRelease = function () {
        try { clearTimeout(releaseTimer) } catch (e) {}
        if (releaseEl) {
          try { releaseEl.classList.remove("dsh-mt-ios-release") } catch (e) {}
          releaseEl = null
        }
      }
      const onDown = function (ev) {
        if (ev.button !== 0) return
        const el = pick(ev.target)
        if (!el) return
        if (el.disabled || el.getAttribute("aria-disabled") === "true") return
        clearRelease()
        downEl = el
        try {
          el.classList.remove("dsh-mt-ios-release")
          el.classList.add("dsh-mt-ios-press")
        } catch (e) {}
      }
      const onUp = function () {
        if (!downEl) return
        const el = downEl
        downEl = null
        try {
          el.classList.remove("dsh-mt-ios-press")
          el.classList.add("dsh-mt-ios-release")
          releaseEl = el
          releaseTimer = setTimeout(function () {
            try { el.classList.remove("dsh-mt-ios-release") } catch (e) {}
            if (releaseEl === el) releaseEl = null
          }, 340)
        } catch (e) {}
      }
      document.addEventListener("pointerdown", onDown, true)
      document.addEventListener("pointerup", onUp, true)
      document.addEventListener("pointercancel", onUp, true)
      window.addEventListener("blur", onUp, true)
    }

    /* ===== 七模型切换过渡层：任意 A→B · 总时长 4.000s =====
       0.000–0.500s  工作台渐隐（过渡层淡入）
       0.500–1.500s  A 关闭
       1.500–3.500s  B 启动
       3.500–4.000s  工作台渐显（过渡层淡出）
       触发点：主题插件每 120ms 读取 .dms-trigger-model，检测到 family 变化即触发。
       这里不依赖固定 PAIRS，任意两个 family 都能组合。 */
    function installModelTransition(bootAt) {
      if (window.__dshModelTransitionInstalled) return
      window.__dshModelTransitionInstalled = true

      const DURATION = 3000
      const TOTAL = 4000
      const CLOSE_LEAD = 500
      const FADE_OUT_START = 3500
      const FAMILIES7 = ["deepseek", "gpt", "claude", "kimi", "glm", "qwen", "gemini"]
      const DEEPSEEK_ICON = "data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%22-1%200%2058%2041%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M55.6128%203.47119C55.0175%203.17944%2054.7611%203.73535%2054.413%204.01782C54.2939%204.10889%2054.1932%204.22729%2054.0924%204.33667C53.2223%205.26587%2052.2057%205.87646%2050.8776%205.80347C48.9359%205.69409%2047.2781%206.30469%2045.8126%207.78979C45.5012%205.9585%2044.4663%204.86499%2042.8909%204.16357C42.0667%203.79907%2041.2332%203.43457%2040.6561%202.64185C40.2532%202.07715%2040.1432%201.44849%2039.9418%200.828857C39.8135%200.455322%2039.6853%200.0725098%2039.2548%200.00878906C38.7877%20-0.0639648%2038.6045%200.327637%2038.4213%200.655762C37.6886%201.99512%2037.4047%203.47119%2037.4321%204.96533C37.4962%208.32739%2038.9159%2011.0059%2041.7369%2012.9102C42.0575%2013.1289%2042.1399%2013.3474%2042.0392%2013.6665C41.8468%2014.3225%2041.6178%2014.9602%2041.4164%2015.6162C41.2881%2016.0354%2041.0957%2016.1265%2040.647%2015.9441C39.0991%2015.2974%2037.7618%2014.3406%2036.5803%2013.1836C34.5745%2011.2429%2032.761%209.10181%2030.4988%207.42529C29.9675%207.03345%2029.4363%206.66919%2028.8867%206.32275C26.5786%204.08154%2029.189%202.24097%2029.7935%202.02246C30.4254%201.79468%2030.0133%201.01099%2027.9708%201.02026C25.9283%201.0293%2024.0599%201.71265%2021.6786%202.62378C21.3306%202.7605%2020.9641%202.8606%2020.5886%202.94263C18.4271%202.53271%2016.1831%202.44141%2013.8384%202.70581C9.42371%203.19775%205.89758%205.28418%203.30554%208.84668C0.191406%2013.1289%20-0.54126%2017.9941%200.356323%2023.0691C1.29968%2028.4172%204.02905%2032.8452%208.22388%2036.3076C12.5745%2039.8972%2017.5845%2041.6558%2023.2997%2041.3186C26.771%2041.1182%2030.6361%2040.6536%2034.9958%2036.9636C36.0948%2037.5103%2037.2489%2037.7288%2039.1632%2037.8928C40.6378%2038.0295%2042.0575%2037.8201%2043.1565%2037.5923C44.8784%2037.2278%2044.7594%2035.6333%2044.1366%2035.3418C39.09%2032.9912%2040.1981%2033.9478%2039.1907%2033.1733C41.7552%2030.1394%2045.6204%2026.9868%2047.1316%2016.7732C47.2506%2015.9624%2047.1499%2015.4521%2047.1316%2014.7961C47.1224%2014.3953%2047.214%2014.2405%2047.672%2014.1948C48.9359%2014.0491%2050.1632%2013.7029%2051.2898%2013.0833C54.5596%2011.2976%2055.8784%208.36377%2056.1898%204.84692C56.2357%204.30933%2056.1807%203.75342%2055.6128%203.47119ZM27.119%2035.123C22.2281%2031.2783%2019.856%2030.0117%2018.8759%2030.0664C17.96%2030.1211%2018.1249%2031.1689%2018.3263%2031.8523C18.537%2032.5264%2018.8118%2032.9912%2019.1964%2033.5833C19.462%2033.9751%2019.6453%2034.5581%2018.9309%2034.9956C17.3555%2035.9705%2014.6169%2034.6675%2014.4886%2034.6038C11.3014%2032.7268%208.63611%2030.2485%206.75842%2026.8594C4.94495%2023.5974%203.89172%2020.0989%203.71765%2016.3633C3.67188%2015.4614%203.9375%2015.1423%204.83508%2014.9785C6.0166%2014.7598%207.23474%2014.7141%208.41626%2014.8872C13.408%2015.6162%2017.6577%2017.8484%2021.2206%2021.3835C23.2539%2023.397%2024.7926%2025.8025%2026.3772%2028.1531C28.0624%2030.6494%2029.8759%2033.0276%2032.184%2034.9773C32.9991%2035.6606%2033.6494%2036.1799%2034.2722%2036.5627C32.3947%2036.7722%2029.2622%2036.8179%2027.119%2035.123ZM29.4637%2020.0442C29.4637%2019.6433%2029.7843%2019.3245%2030.1874%2019.3245C30.2789%2019.3245%2030.3613%2019.3425%2030.4346%2019.3699C30.5354%2019.4065%2030.627%2019.4612%2030.7002%2019.543C30.8285%2019.6707%2030.9017%2019.8528%2030.9017%2020.0442C30.9017%2020.4451%2030.5812%2020.7639%2030.1782%2020.7639C29.7751%2020.7639%2029.4637%2020.4451%2029.4637%2020.0442ZM36.7452%2023.7798C36.2781%2023.9712%2035.811%2024.135%2035.3622%2024.1533C34.6661%2024.1897%2033.9059%2023.9072%2033.4938%2023.561C32.8527%2023.0234%2032.3947%2022.7229%2032.2023%2021.7844C32.1199%2021.3835%2032.1656%2020.7639%2032.239%2020.4087C32.4038%2019.6433%2032.2206%2019.1514%2031.6803%2018.7048C31.2406%2018.3403%2030.6819%2018.2402%2030.0682%2018.2402C29.8392%2018.2402%2029.6287%2018.1399%2029.4729%2018.0579C29.2164%2017.9304%2029.0059%2017.6116%2029.2073%2017.2197C29.2714%2017.0923%2029.5829%2016.7825%2029.6561%2016.7278C30.4896%2016.2539%2031.4513%2016.4089%2032.3397%2016.7642C33.1641%2017.1013%2033.7869%2017.7209%2034.6844%2018.5955C35.6003%2019.6523%2035.7651%2019.9441%2036.2872%2020.7366C36.6995%2021.3562%2037.075%2021.9939%2037.3314%2022.7229C37.4871%2023.1785%2037.2856%2023.552%2036.7452%2023.7798Z%22%20fill%3D%22%234D6BFE%22%2F%3E%3C%2Fsvg%3E"

      const TR_META = {
        deepseek: {
          label: "DeepSeek", persona: "鲸尾", accent: "#1FA2FF", accent2: "#6FE6FF", dark: false,
          closeTitle: "正在回撤信号。", closeSub: "声呐收束，海面归于安静。",
          enterTitle: "信号已经归位。", enterSub: "DeepSeek 已接管当前会话。窗口、记忆与输入栏保持原样。",
          flash: "radial-gradient(circle at 50% 50%,#f5fdff 0%,#a9ebff 24%,#1FA2FF 62%,#04243c 100%)",
          veil: "linear-gradient(90deg,rgba(4,24,44,.3) 0%,rgba(4,24,44,.04) 42%,rgba(255,255,255,.08) 100%)"
        },
        gpt: {
          label: "GPT", persona: "龙娘", accent: "#7B8B9D", accent2: "#D7E2EA", dark: false,
          closeTitle: "花瓣正在合拢。", closeSub: "温室熄灯，龙娘退场。",
          enterTitle: "花瓣转完一圈。", enterSub: "GPT 已接管当前会话。窗口、记忆与输入栏保持原样。",
          flash: "radial-gradient(circle at 50% 50%,#ffffff 0%,#f4f8f5 42%,#dfe9e3 72%,#aebfb8 100%)",
          veil: "linear-gradient(90deg,rgba(255,255,255,.24) 0%,rgba(255,255,255,.04) 44%,rgba(238,245,240,.18) 100%)"
        },
        claude: {
          label: "Claude", persona: "橙书", accent: "#D97757", accent2: "#F2B08A", dark: false,
          closeTitle: "信纸折回信封。", closeSub: "火漆封口，图书馆熄灯。",
          enterTitle: "信封已经拆开。", enterSub: "Claude 已接管当前会话。窗口、记忆与输入栏保持原样。",
          flash: "linear-gradient(118deg,#fffdf7 0%,#ffe4c7 34%,#f3a26f 62%,#D97757 100%)",
          veil: "linear-gradient(90deg,rgba(255,248,237,.2) 0%,rgba(255,248,237,.04) 42%,rgba(255,224,198,.16) 100%)"
        },
        kimi: {
          label: "Kimi", persona: "月笛", accent: "#2B4A8C", accent2: "#77B7FF", dark: false,
          closeTitle: "琴键正在归位。", closeSub: "余音收进琴盒。",
          enterTitle: "第一枚音符落下。", enterSub: "Kimi 已接管当前会话。窗口、记忆与输入栏保持原样。",
          flash: "repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 2px,transparent 2px 34px),linear-gradient(0deg,#061225 0%,#2B4A8C 58%,#8ED0FF 100%)",
          veil: "linear-gradient(90deg,rgba(12,29,57,.22) 0%,rgba(12,29,57,.03) 42%,rgba(140,189,240,.12) 100%)"
        },
        glm: {
          label: "GLM", persona: "猫眠", accent: "#4A5058", accent2: "#9AA8FF", dark: false,
          closeTitle: "书页正在合拢。", closeSub: "双环收束，猫灯熄灭。",
          enterTitle: "书页重新翻开。", enterSub: "GLM 已接管当前会话。窗口、记忆与输入栏保持原样。",
          flash: "linear-gradient(118deg,#fbfdff 0%,#e6edf5 38%,#aab8ca 68%,#4A5058 100%)",
          veil: "linear-gradient(90deg,rgba(248,250,252,.2) 0%,rgba(248,250,252,.03) 44%,rgba(168,180,198,.13) 100%)"
        },
        qwen: {
          label: "Qwen", persona: "扇问", accent: "#6FAEE8", accent2: "#B08CFF", dark: false,
          closeTitle: "折扇正在收拢。", closeSub: "竹影归静，月色收进扇骨。",
          enterTitle: "折扇重新展开。", enterSub: "Qwen 已接管当前会话。窗口、记忆与输入栏保持原样。",
          flash: "conic-gradient(from 210deg at 50% 60%,#f8fdff 0deg,#cfe8ff 80deg,#B08CFF 150deg,#EAF7FF 220deg,#f8fdff 360deg)",
          veil: "linear-gradient(90deg,rgba(242,251,255,.2) 0%,rgba(242,251,255,.03) 44%,rgba(196,215,246,.13) 100%)"
        },
        gemini: {
          label: "Gemini", persona: "双星", accent: "#8B7CF6", accent2: "#FF7AD9", dark: true,
          closeTitle: "双星正在掩食。", closeSub: "霓虹熄灭，轨道收束。",
          enterTitle: "双星重新分开。", enterSub: "Gemini 已接管当前会话。窗口、记忆与输入栏保持原样。",
          flash: "radial-gradient(circle at 50% 50%,#ffffff 0%,#FFE5FF 15%,#8B7CF6 48%,#3A1C86 72%,#0B0A18 100%)",
          veil: "linear-gradient(90deg,rgba(7,9,24,.5) 0%,rgba(7,9,24,.09) 40%,rgba(255,122,217,.08) 100%)"
        }
      }

      function svgData(svg) {
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(String(svg || ""))
      }

      const TR_ICONS = {
        deepseek: DEEPSEEK_ICON,
        gpt: svgData(THINK_ICONS.gpt),
        claude: svgData(THINK_ICONS.claude.replace(/currentColor/g, "#D97757")),
        gemini: svgData(THINK_ICONS.gemini),
        kimi: svgData(THINK_ICONS.kimi),
        glm: THINK_IMAGES.glm,
        qwen: THINK_IMAGES.qwen
      }

      const MODELS = {}
      FAMILIES7.forEach(function (fam) {
        const th = mtThemeOf(fam)
        const meta = TR_META[fam]
        if (!th || !meta) return
        const accent = mtHex(mtFamily(fam).accent, meta.accent)
        MODELS[fam] = {
          id: fam,
          label: meta.label,
          persona: meta.persona,
          accent: accent,
          accent2: meta.accent2,
          dark: meta.dark,
          bg: mtBgUrl(fam),
          icon: TR_ICONS[fam],
          closeTitle: meta.closeTitle,
          closeSub: meta.closeSub,
          enterTitle: meta.enterTitle,
          enterSub: meta.enterSub,
          flash: meta.flash,
          veil: meta.veil
        }
      })

      /* 设置页改图/改色后，原位更新过渡层模型；不用刷新页面 */
      function refreshTransitionModels(fam) {
        FAMILIES7.forEach(function (key) {
          const m = MODELS[key]
          if (!m) return
          const meta = TR_META[key]
          const accent = mtHex(mtFamily(key).accent, meta.accent)
          m.accent = accent
          m.bg = mtBgUrl(key)
          if (!fam || fam === key) {
            m.icon = TR_ICONS[key]
          }
        })
        try { preloadTransitionAssets(true) } catch (e) {}
      }
      try {
        window.__dshModelTransitionRefresh = refreshTransitionModels
      } catch (e) {}

      const TRANSITION_CSS = "<style>\n  :root{\n    color-scheme: dark;\n    --stage-scale:1;\n  }\n  *{box-sizing:border-box}\n  html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#05080e;\n    font-family:\"Noto Sans SC\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif}\n  #view{position:fixed;left:0;right:0;top:0;bottom:110px;display:flex;align-items:center;justify-content:center;\n    background:radial-gradient(circle at 50% 42%,#141f2c 0%,#070b12 58%,#03060a 100%)}\n  #stage{\n    position:absolute;left:50%;top:50%;width:1600px;height:900px;overflow:hidden;\n    background:#080d14;transform:translate(-50%,-50%) scale(var(--stage-scale));\n    transform-origin:center;box-shadow:0 30px 100px rgba(0,0,0,.5);\n    --accent:#1FA2FF;--accent2:#6FE6FF;\n    --ui-text:#14212e;--ui-sub:#607183;\n    --card-bg:rgba(255,255,255,.74);--card-border:rgba(255,255,255,.9);\n    --chip-bg:rgba(255,255,255,.76);--chip-border:rgba(255,255,255,.92);\n    --mark-bg:rgba(244,248,252,.92);\n    --live:#4f8a68;--shadow:0 18px 50px rgba(11,30,49,.24);\n  }\n\n  /* ===== 背景 ===== */\n  #bgA,#bgB{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;\n    object-position:center;z-index:1;will-change:transform,opacity,filter}\n  #bgB{z-index:2}\n  #veilA,#veilB{position:absolute;inset:0;z-index:3;pointer-events:none}\n  #veilB{z-index:4}\n  #vignette{position:absolute;inset:0;z-index:5;pointer-events:none;\n    background:radial-gradient(ellipse at center,rgba(2,8,15,0) 42%,rgba(2,8,15,.22) 78%,rgba(2,8,15,.4) 100%)}\n  #grain{position:absolute;inset:0;z-index:6;pointer-events:none;opacity:.18;\n    background-image:url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.34'/%3E%3C/svg%3E\");\n    mix-blend-mode:soft-light}\n\n  /* ===== 中央效果位 ===== */\n  #sigil{position:absolute;inset:0;z-index:20;pointer-events:none}\n  #closeFx,#enterFx{position:absolute;inset:0;pointer-events:none}\n  .fx{position:absolute;left:50%;top:47%;width:360px;height:360px;transform:translate(-50%,-50%)}\n  .fx-icon{display:block;object-fit:contain;filter:drop-shadow(0 8px 24px rgba(16,31,48,.16))}\n  .fx-disc{position:absolute;left:50%;top:50%;width:112px;height:112px;margin:-56px 0 0 -56px;\n    border-radius:50%;display:flex;align-items:center;justify-content:center;\n    background:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.88);\n    box-shadow:0 22px 56px rgba(18,40,65,.2),inset 0 0 0 1px rgba(255,255,255,.65);\n    backdrop-filter:blur(10px)}\n  .fx-disc .fx-icon{width:58px;height:58px}\n\n  /* ---- DeepSeek 声呐 ---- */\n  .fx-deepseek .ds-ring{position:absolute;left:50%;top:50%;width:190px;height:190px;margin:-95px 0 0 -95px;\n    border-radius:50%;border:1px solid rgba(31,162,255,.55);\n    box-shadow:0 0 30px rgba(31,162,255,.24),inset 0 0 26px rgba(31,162,255,.12)}\n  .fx-deepseek .ds-disc{background:rgba(245,252,255,.88);border-color:rgba(177,231,255,.9);\n    box-shadow:0 0 0 1px rgba(25,90,140,.16),0 24px 64px rgba(5,45,80,.3),inset 0 0 0 1px rgba(255,255,255,.6)}\n  .fx-deepseek .ds-disc .fx-icon{width:92px;height:70px}\n  .fx-deepseek .ds-horizon{position:absolute;left:50%;top:50%;width:270px;height:1px;margin:48px 0 0 -135px;\n    background:linear-gradient(90deg,rgba(31,162,255,0),rgba(116,226,255,.85),rgba(31,162,255,0));\n    box-shadow:0 0 20px rgba(31,162,255,.55)}\n  .fx-deepseek .ds-dot{position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;\n    border-radius:50%;background:#fff;box-shadow:0 0 14px rgba(31,162,255,.95),0 0 28px rgba(31,162,255,.5)}\n\n  /* ---- GPT 花瓣 ---- */\n  .fx-gpt .gpt-petals{position:absolute;left:50%;top:50%;width:300px;height:300px;margin:-150px 0 0 -150px;\n    transform-origin:50% 50%;will-change:transform,opacity}\n  .fx-gpt .gpt-petals i{position:absolute;left:50%;top:50%;width:18px;height:132px;margin:-132px 0 0 -9px;\n    border-radius:50% 50% 43% 43% / 62% 62% 38% 38%;\n    border:1px solid rgba(66,80,95,.58);\n    background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(66,80,95,.3));\n    filter:drop-shadow(0 3px 9px rgba(34,46,60,.18));transform-origin:50% 100%}\n  .fx-gpt .gpt-petals i:nth-child(1){transform:rotate(0deg) translateY(-9px)}\n  .fx-gpt .gpt-petals i:nth-child(2){transform:rotate(60deg) translateY(-9px)}\n  .fx-gpt .gpt-petals i:nth-child(3){transform:rotate(120deg) translateY(-9px)}\n  .fx-gpt .gpt-petals i:nth-child(4){transform:rotate(180deg) translateY(-9px)}\n  .fx-gpt .gpt-petals i:nth-child(5){transform:rotate(240deg) translateY(-9px)}\n  .fx-gpt .gpt-petals i:nth-child(6){transform:rotate(300deg) translateY(-9px)}\n  .fx-gpt .gpt-orbit{position:absolute;left:50%;top:50%;width:198px;height:198px;margin:-99px 0 0 -99px;\n    border-radius:50%;border:1px dashed rgba(68,83,98,.38);transform-origin:50% 50%}\n  .fx-gpt .gpt-spark{position:absolute;left:50%;top:50%;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;\n    border-radius:50%;background:#3F5164;box-shadow:0 0 12px rgba(63,81,100,.9);z-index:6}\n  .fx-gpt .gpt-sweep{position:absolute;left:50%;top:50%;width:154px;height:154px;margin:-77px 0 0 -77px;\n    border-radius:50%;border:2px solid transparent;border-top-color:rgba(62,76,91,.86);\n    border-right-color:rgba(62,76,91,.22);transform-origin:50% 50%}\n  .fx-gpt .gpt-disc{background:linear-gradient(155deg,rgba(255,255,255,.97),rgba(235,242,246,.92));\n    border-color:rgba(63,78,93,.56);\n    box-shadow:0 0 0 7px rgba(255,255,255,.2),0 25px 64px rgba(30,46,62,.3),inset 0 0 0 1px rgba(255,255,255,.95)}\n  .fx-gpt .gpt-disc .fx-icon{width:74px;height:74px;\n    filter:brightness(.56) contrast(1.22) drop-shadow(0 2px 2px rgba(10,20,30,.14))}\n\n  /* ---- Claude 信封 ---- */\n  .fx-claude .cl-envelope{position:absolute;left:50%;top:50%;width:220px;height:158px;margin:-79px 0 0 -110px;\n    perspective:900px;transform-origin:50% 50%;filter:drop-shadow(0 18px 38px rgba(94,48,18,.2))}\n  .fx-claude .cl-back{position:absolute;inset:0;border-radius:10px;\n    background:linear-gradient(145deg,#fff8ee,#f2d7bf);border:1px solid rgba(208,158,116,.9);\n    box-shadow:0 24px 60px rgba(104,60,30,.24),inset 0 0 0 1px rgba(255,255,255,.6)}\n  .fx-claude .cl-letter{position:absolute;left:16px;top:20px;width:188px;height:116px;border-radius:4px;\n    background:#fffdf8;border:1px solid rgba(216,182,146,.8);transform-origin:50% 100%;\n    box-shadow:0 5px 14px rgba(117,70,31,.1);z-index:2;overflow:hidden}\n  .fx-claude .cl-letter i{display:block;height:1px;margin:16px 20px 0;background:rgba(190,145,104,.44)}\n  .fx-claude .cl-letter i:nth-child(2){width:80%}\n  .fx-claude .cl-letter i:nth-child(3){width:62%}\n  .fx-claude .cl-front{position:absolute;left:0;bottom:0;width:100%;height:76%;z-index:3;\n    clip-path:polygon(0 0,50% 42%,100% 0,100% 100%,0 100%);\n    background:linear-gradient(150deg,#f8e5d2,#e7c4a4);border-bottom:1px solid rgba(204,158,116,.9)}\n  .fx-claude .cl-emblem{position:absolute;left:50%;top:54%;width:52px;height:52px;margin:-26px 0 0 -26px;\n    border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:6;\n    background:#fffaf4;border:2px solid rgba(217,119,87,.9);\n    box-shadow:0 7px 18px rgba(124,53,20,.24),inset 0 0 0 1px rgba(255,255,255,.6)}\n  .fx-claude .cl-emblem .fx-icon{width:34px;height:34px}\n  .fx-claude .cl-flap{position:absolute;left:0;top:0;width:0;height:0;z-index:4;\n    border-left:110px solid transparent;border-right:110px solid transparent;\n    border-top:92px solid #f3dac2;transform-origin:50% 0;filter:drop-shadow(0 4px 5px rgba(116,69,34,.16))}\n  .fx-claude .cl-seal{position:absolute;left:78%;top:72%;width:26px;height:26px;margin:-13px 0 0 -13px;\n    border-radius:50%;background:#D97757;color:#fff6ee;font:700 13px/26px Georgia,serif;text-align:center;\n    box-shadow:0 5px 14px rgba(124,53,20,.3),inset 0 0 0 1px rgba(255,255,255,.35);z-index:5;opacity:0}\n  .fx-claude .cl-spark{position:absolute;left:50%;top:50%;width:124px;height:124px;margin:-62px 0 0 -62px;\n    display:flex;align-items:center;justify-content:center;opacity:0;z-index:6}\n  .fx-claude .cl-spark .fx-icon{width:96px;height:96px;filter:drop-shadow(0 0 20px rgba(217,119,87,.45))}\n  .fx-claude .cl-spark:before,.fx-claude .cl-spark:after{content:\"\";position:absolute;left:50%;top:50%;\n    width:152px;height:1px;margin:-.5px 0 0 -76px;background:linear-gradient(90deg,transparent,rgba(217,119,87,.3),transparent)}\n  .fx-claude .cl-spark:after{transform:rotate(60deg)}\n  .fx-claude .cl-spark:before{transform:rotate(-60deg)}\n\n  /* ---- Kimi 琴盒 / 唱片 ---- */\n  .fx-kimi .kimi-vinyl{position:absolute;left:50%;top:50%;width:196px;height:196px;margin:-98px 0 0 -98px;\n    border-radius:50%;opacity:0;transform-origin:50% 50%;\n    background:\n      radial-gradient(circle at 50% 50%,rgba(31,68,126,.9) 0 21%,transparent 21.5%),\n      repeating-radial-gradient(circle at 50% 50%,rgba(157,207,255,.2) 0 1px,transparent 1px 7px),\n      radial-gradient(circle at 50% 50%,#173763,#061225 72%);\n    border:1px solid rgba(119,183,255,.28);box-shadow:0 0 50px rgba(20,132,255,.2)}\n  .fx-kimi .kimi-disc{background:rgba(248,252,255,.86);border-color:rgba(155,196,236,.8);\n    box-shadow:0 24px 60px rgba(8,24,52,.28),inset 0 0 0 1px rgba(255,255,255,.58)}\n  .fx-kimi .kimi-disc .fx-icon{width:55px;height:55px}\n  .fx-kimi .kimi-keys{position:absolute;left:50%;top:68%;width:180px;height:46px;margin-left:-90px;\n    display:flex;gap:4px;align-items:flex-start;transform-origin:50% 50%;z-index:6}\n  .fx-kimi .kimi-keys i{display:block;width:21px;height:46px;border-radius:0 0 4px 4px;\n    background:linear-gradient(180deg,#fffdf7,#e4eaf2);border:1px solid rgba(58,82,110,.5);\n    box-shadow:0 5px 10px rgba(6,18,37,.2)}\n  .fx-kimi .kimi-wave{position:absolute;left:50%;top:50%;width:210px;height:100px;margin:-50px 0 0 -105px;\n    display:flex;align-items:center;justify-content:center;gap:7px}\n  .fx-kimi .kimi-wave i{display:block;width:3px;height:42px;border-radius:99px;\n    background:linear-gradient(180deg,rgba(20,132,255,.08),rgba(119,183,255,.72));transform-origin:50% 50%}\n  .fx-kimi .kimi-dot{position:absolute;left:50%;top:50%;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;\n    border-radius:50%;background:#1484FF;box-shadow:0 0 16px rgba(20,132,255,.7);opacity:0}\n\n  /* ---- GLM 书页 / 双环 ---- */\n  .fx-glm .glm-book{position:absolute;left:50%;top:50%;width:300px;height:204px;margin:-102px 0 0 -150px;\n    perspective:760px;transform-style:preserve-3d}\n  .fx-glm .glm-book:before{content:\"\";position:absolute;left:-10px;top:-8px;right:-10px;bottom:-8px;\n    border-radius:13px;background:linear-gradient(135deg,#3f5269,#202d3c);\n    box-shadow:0 20px 44px rgba(13,26,42,.3);z-index:0}\n  .fx-glm .glm-page{position:absolute;top:0;width:150px;height:204px;\n    background:linear-gradient(135deg,#fbfdff,#dfe7f1);border:1px solid rgba(52,72,94,.46);\n    box-shadow:0 12px 30px rgba(16,32,52,.14);transform-style:preserve-3d;backface-visibility:hidden;z-index:1}\n  .fx-glm .glm-page.left{left:0;transform-origin:100% 50%;border-radius:9px 3px 3px 9px}\n  .fx-glm .glm-page.right{right:0;transform-origin:0 50%;border-radius:3px 9px 9px 3px;\n    background:linear-gradient(225deg,#fbfdff,#dfe7f1)}\n  .fx-glm .glm-page:before{content:\"\";position:absolute;left:20px;right:20px;top:34px;height:1px;\n    background:rgba(57,78,102,.34);box-shadow:0 22px 0 rgba(57,78,102,.24),0 44px 0 rgba(57,78,102,.18),0 66px 0 rgba(57,78,102,.12)}\n  .fx-glm .glm-disc{background:rgba(248,252,255,.92);border-color:rgba(173,190,210,.88);z-index:4;\n    box-shadow:0 0 0 1px rgba(41,61,82,.16),0 24px 56px rgba(16,32,52,.24),inset 0 0 0 1px rgba(255,255,255,.8)}\n  .fx-glm .glm-disc .fx-icon{width:66px;height:66px}\n  .fx-glm .glm-ears{position:absolute;left:50%;top:50%;width:200px;height:64px;margin:-170px 0 0 -100px;z-index:2}\n  .fx-glm .glm-ears i{position:absolute;bottom:0;width:0;height:0;border-bottom:64px solid rgba(34,45,61,.5);\n    border-left:32px solid transparent;border-right:32px solid transparent;filter:blur(.3px)}\n  .fx-glm .glm-ears i:first-child{left:26px;transform:rotate(-16deg);transform-origin:50% 100%}\n  .fx-glm .glm-ears i:last-child{right:26px;transform:rotate(16deg);transform-origin:50% 100%}\n\n  /* ---- Qwen 实体折扇 ---- */\n  .fx-qwen .qwen-fan{position:absolute;left:50%;top:50%;width:400px;height:400px;margin:-200px 0 0 -200px}\n  .fx-qwen .qwen-paper{position:absolute;left:50%;top:50%;width:400px;height:220px;margin:-220px 0 0 -200px;\n    transform-origin:50% 100%;z-index:0;opacity:.74;\n    background:\n      radial-gradient(circle at 30% 48%,rgba(255,255,255,.66) 0 2px,transparent 3px),\n      radial-gradient(circle at 43% 40%,rgba(255,255,255,.56) 0 2px,transparent 3px),\n      radial-gradient(circle at 58% 34%,rgba(255,255,255,.62) 0 2px,transparent 3px),\n      radial-gradient(circle at 70% 46%,rgba(255,255,255,.54) 0 2px,transparent 3px),\n      repeating-conic-gradient(from -75deg at 50% 100%,rgba(255,255,255,.3) 0deg 6.25deg,rgba(88,128,189,.24) 6.25deg 12.5deg),\n      linear-gradient(180deg,#eef7ff 0%,#a9c9ee 42%,#537dbb 100%);\n    clip-path:polygon(50% 100%,3% 74%,10% 38%,32% 10%,50% 2%,68% 10%,90% 38%,97% 74%);\n    border:1px solid rgba(214,180,110,.82);\n    filter:drop-shadow(0 0 26px rgba(111,174,232,.24))}\n  .fx-qwen .qwen-fan i{position:absolute;left:50%;top:50%;width:24px;height:196px;margin:-196px 0 0 -12px;\n    transform-origin:50% 100%;z-index:1;border-radius:3px 3px 7px 7px;\n    clip-path:polygon(12% 0,88% 0,100% 100%,0 100%);\n    background:\n      radial-gradient(ellipse at 50% 20%,rgba(255,255,255,.62) 0 4px,transparent 5px),\n      linear-gradient(180deg,rgba(251,253,255,.99) 0%,rgba(172,205,244,.96) 18%,rgba(91,133,194,.92) 55%,rgba(42,72,130,.95) 100%);\n    border:1px solid rgba(194,158,88,.86);\n    box-shadow:inset 0 0 18px rgba(255,255,255,.26),0 0 10px rgba(111,174,232,.16)}\n  .fx-qwen .qwen-fan i:after{content:\"\";position:absolute;left:50%;bottom:0;width:2px;height:100%;\n    transform:translateX(-50%);background:linear-gradient(180deg,rgba(255,224,140,.96) 0%,rgba(32,57,104,.86) 24%,rgba(24,44,82,.72) 100%)}\n  .fx-qwen .qwen-fan i:before{content:\"\";position:absolute;left:50%;top:4px;width:8px;height:8px;margin-left:-4px;\n    border-radius:50%;background:rgba(255,247,214,.92);box-shadow:0 0 7px rgba(255,222,154,.75)}\n  .fx-qwen .qwen-handle{position:absolute;left:50%;top:50%;width:18px;height:120px;margin-left:-9px;\n    transform-origin:50% 0;z-index:3;\n    background:linear-gradient(90deg,#5a3a2a 0%,#8b6544 22%,#e8c58e 50%,#9b724c 78%,#4d3124 100%);\n    border-radius:2px 2px 9px 9px;\n    box-shadow:0 10px 24px rgba(21,43,70,.32),inset 0 0 0 1px rgba(255,255,255,.18)}\n  .fx-qwen .qwen-handle:before{content:\"\";position:absolute;left:50%;top:-6px;width:34px;height:16px;margin-left:-17px;\n    border-radius:50%;background:linear-gradient(180deg,#f5dea6,#b98a55 55%,#6f4a30);\n    box-shadow:0 0 0 2px rgba(255,234,180,.22),0 4px 12px rgba(0,0,0,.2)}\n  .fx-qwen .qwen-handle:after{content:\"\";position:absolute;left:-1px;right:-1px;bottom:18px;height:5px;\n    border-radius:2px;background:linear-gradient(180deg,#f0d39a,#9c7048);\n    box-shadow:0 1px 0 rgba(255,242,200,.45)}\n  .fx-qwen .qwen-tassel{position:absolute;left:50%;top:calc(50% + 116px);width:3px;height:54px;margin-left:-1.5px;\n    transform-origin:50% 0;z-index:3;background:linear-gradient(180deg,#d9b36a,#7babe2)}\n  .fx-qwen .qwen-tassel:after{content:\"\";position:absolute;left:-6px;bottom:-8px;width:14px;height:17px;\n    border-radius:50% 50% 45% 45%;background:linear-gradient(180deg,#9bc8f2,#5a86bf);\n    box-shadow:0 0 10px rgba(111,174,232,.4)}\n  .fx-qwen .qwen-disc{background:rgba(250,253,255,.9);border-color:rgba(169,215,244,.9);\n    box-shadow:0 0 0 1px rgba(42,91,124,.18),0 24px 60px rgba(21,52,86,.24),inset 0 0 0 1px rgba(255,255,255,.62);z-index:5}\n  .fx-qwen .qwen-disc .fx-icon{width:64px;height:64px}\n  .fx-qwen .qwen-orbit{position:absolute;left:50%;top:50%;width:210px;height:210px;margin:-105px 0 0 -105px;\n    border-radius:50%;border:1px solid rgba(176,140,255,.4);transform-origin:50% 50%;opacity:0}\n\n  /* ---- Gemini 双星 ---- */\n  .fx-gemini .gem-star{position:absolute;left:50%;top:50%;width:104px;height:104px;margin:-52px 0 0 -52px;\n    clip-path:polygon(50% 0%,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0% 50%,39% 39%);\n    background:linear-gradient(135deg,#48D7FF 0%,#8B7CF6 50%,#FF7AD9 100%);\n    filter:drop-shadow(0 0 22px rgba(139,124,246,.4));opacity:0}\n  .fx-gemini .gem-disc{background:rgba(250,247,255,.84);border-color:rgba(213,204,255,.8);\n    box-shadow:0 25px 65px rgba(45,28,95,.28),inset 0 0 0 1px rgba(255,255,255,.58);z-index:5}\n  .fx-gemini .gem-disc .fx-icon{width:62px;height:62px}\n  .fx-gemini .gem-nova{position:absolute;left:50%;top:50%;width:150px;height:150px;margin:-75px 0 0 -75px;\n    border-radius:50%;border:1px solid rgba(255,255,255,.7);opacity:0;\n    box-shadow:0 0 50px rgba(139,124,246,.5),inset 0 0 40px rgba(255,122,217,.2)}\n\n  /* ===== 界面层 ===== */\n  .chrome{position:absolute;inset:0;z-index:12;pointer-events:none;color:var(--ui-text)}\n  .model-chip{position:absolute;left:6%;top:6.4%;display:flex;align-items:center;gap:12px;\n    padding:10px 14px 10px 10px;border-radius:999px;\n    background:var(--chip-bg);border:1px solid var(--chip-border);\n    box-shadow:var(--shadow);backdrop-filter:blur(16px);transform:translateY(0)}\n  .chip-mark{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;\n    background:var(--mark-bg);border:1px solid rgba(130,150,172,.22)}\n  .chip-mark img{width:17px;height:17px;object-fit:contain}\n  .chip-copy{line-height:1.05}\n  .chip-name{font-size:13px;font-weight:700;letter-spacing:.04em}\n  .chip-sub{margin-top:4px;font-size:10px;letter-spacing:.12em;color:var(--ui-sub)}\n  .chip-live{margin-left:2px;padding:4px 7px;border-radius:99px;background:rgba(79,138,104,.12);\n    color:var(--live);font-size:9px;letter-spacing:.1em;font-weight:700}\n  .chip-live.is-exit{background:rgba(232,121,63,.11);color:var(--accent)}\n  .status-card{position:absolute;left:6%;bottom:7.4%;width:min(330px,32%);padding:17px 18px 16px;\n    border-radius:16px;background:var(--card-bg);border:1px solid var(--card-border);\n    box-shadow:var(--shadow),inset 0 0 0 1px rgba(124,146,168,.08);backdrop-filter:blur(16px)}\n  .status-top{display:flex;justify-content:space-between;align-items:center;font-size:10px;\n    letter-spacing:.16em;color:var(--ui-sub)}\n  .status-title{margin-top:10px;font-size:20px;font-weight:800;letter-spacing:-.02em}\n  .status-sub{margin-top:7px;font-size:12px;line-height:1.55;color:var(--ui-sub)}\n  .status-line{margin-top:14px;height:2px;border-radius:99px;overflow:hidden;background:rgba(110,133,155,.16)}\n  .status-line i{display:block;width:38%;height:100%;border-radius:99px;\n    background:linear-gradient(90deg,var(--accent2),var(--accent))}\n  #finalTitle{position:absolute;right:6.5%;bottom:7.2%;text-align:right;color:var(--ui-text);opacity:0}\n  #finalTitle .kicker{font-size:10px;letter-spacing:.2em;color:var(--ui-sub);font-weight:600}\n  #finalTitle .title{margin-top:5px;font-size:27px;font-weight:800;letter-spacing:-.03em}\n  #flash{position:absolute;inset:0;z-index:40;pointer-events:none;opacity:0}\n\n  /* ===== 控制条 ===== */\n  #hud{position:fixed;left:0;right:0;bottom:0;z-index:100;padding:12px 22px 16px;\n    background:linear-gradient(180deg,rgba(4,8,14,0),rgba(4,8,14,.82));color:#eaf0f8}\n  .clip-rail{display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:10px}\n  .clip-btn{padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.14);\n    background:rgba(255,255,255,.06);color:#bfccdd;font:600 11px/1.1 inherit;cursor:pointer;\n    letter-spacing:.02em;transition:.18s ease}\n  .clip-btn:hover{background:rgba(255,255,255,.12);color:#fff}\n  .clip-btn.active{background:rgba(31,162,255,.16);border-color:rgba(98,200,255,.7);color:#dff3ff}\n  .controls{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}\n  .btn{padding:8px 13px;border-radius:8px;border:1px solid rgba(255,255,255,.16);\n    background:rgba(255,255,255,.08);color:#eaf0f8;font:600 12px/1 inherit;cursor:pointer}\n  .btn:hover{background:rgba(255,255,255,.15)}\n  .btn.primary{background:rgba(31,162,255,.2);border-color:rgba(98,200,255,.55)}\n  .scrub{display:flex;align-items:center;gap:10px;min-width:min(420px,42vw)}\n  input[type=range]{width:100%;accent-color:#3DBFFF}\n  .time{font:500 11px/1 ui-monospace,SFMono-Regular,Consolas,monospace;color:#9fb0c4;white-space:nowrap}\n  .speed{display:flex;gap:4px}\n  .speed button{padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,.14);\n    background:rgba(255,255,255,.06);color:#bfccdd;font:600 11px/1 inherit;cursor:pointer}\n  .speed button.active{background:rgba(31,162,255,.18);color:#fff;border-color:rgba(98,200,255,.5)}\n  body.still #hud{display:none}\n  body.still #view{background:#05080e;bottom:0}\n  @media (max-width:900px){.model-chip{left:4%;top:4%;transform:scale(.9);transform-origin:left top}\n    .status-card{left:4%;bottom:5%;transform:scale(.9);transform-origin:left bottom}\n    #finalTitle{right:4%;bottom:5%;transform:scale(.9);transform-origin:right bottom}}\n\n:host{position:fixed;inset:0;display:block;z-index:2147483600;background:#05080e;overflow:hidden;opacity:0;pointer-events:auto;font-family:\"Noto Sans SC\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif}\n#view{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 42%,#141f2c 0%,#070b12 58%,#03060a 100%);overflow:hidden}\n#stage{box-shadow:none}\n"
      const TRANSITION_STAGE = "<div id=\"view\">\n  <div id=\"stage\">\n    <img id=\"bgA\" alt=\"\">\n    <img id=\"bgB\" alt=\"\">\n    <div id=\"veilA\"></div>\n    <div id=\"veilB\"></div>\n    <div id=\"vignette\"></div>\n    <div id=\"grain\"></div>\n\n    <div id=\"sigil\">\n      <div id=\"closeFx\"></div>\n      <div id=\"enterFx\"></div>\n    </div>\n\n    <div id=\"closeChrome\" class=\"chrome\">\n      <div class=\"model-chip\">\n        <div class=\"chip-mark\"><img id=\"closeIcon\" alt=\"\"></div>\n        <div class=\"chip-copy\"><div class=\"chip-name\" id=\"closeName\"></div><div class=\"chip-sub\" id=\"closePersona\"></div></div>\n        <div class=\"chip-live is-exit\">EXIT</div>\n      </div>\n      <div class=\"status-card\">\n        <div class=\"status-top\"><span>CLOSING</span><span id=\"closeTime\">0.00s</span></div>\n        <div class=\"status-title\" id=\"closeTitle\"></div>\n        <div class=\"status-sub\" id=\"closeSub\"></div>\n        <div class=\"status-line\"><i id=\"closeLine\"></i></div>\n      </div>\n    </div>\n\n    <div id=\"enterChrome\" class=\"chrome\">\n      <div class=\"model-chip\">\n        <div class=\"chip-mark\"><img id=\"enterIcon\" alt=\"\"></div>\n        <div class=\"chip-copy\"><div class=\"chip-name\" id=\"enterName\"></div><div class=\"chip-sub\" id=\"enterPersona\"></div></div>\n        <div class=\"chip-live\">LIVE</div>\n      </div>\n      <div class=\"status-card\">\n        <div class=\"status-top\"><span>NEW SESSION</span><span>0.02s</span></div>\n        <div class=\"status-title\" id=\"enterTitle\"></div>\n        <div class=\"status-sub\" id=\"enterSub\"></div>\n        <div class=\"status-line\"><i id=\"enterLine\"></i></div>\n      </div>\n      <div id=\"finalTitle\"><div class=\"kicker\">MODEL SWITCHED</div><div class=\"title\" id=\"finalName\"></div></div>\n    </div>\n\n    <div id=\"flash\"></div>\n  </div>\n</div>"

      const qall = function (root, sel) { return Array.from(root.querySelectorAll(sel)) }
      const clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)) }
      const smooth = function (a, b, x) {
        if (b <= a) return x >= b ? 1 : 0
        const p = clamp((x - a) / (b - a))
        return p * p * (3 - 2 * p)
      }
      const easeOut = function (x) { return 1 - Math.pow(1 - clamp(x), 3) }

      let trHost = null
      let trRoot = null
      let trEls = null
      let trRaf = 0
      let trFallbackTimer = 0
      let trStartAt = 0
      let trFrom = ""
      let trTo = ""
      let trActive = false
      let trLockReleased = false
      let trObserver = null
      let trObservedEl = null
      let trPreloaded = false

      function armTransitionLock(from, to) {
        trLockReleased = false
        try {
          window.__dshModelTransitionLock = { from: from, to: to, at: (typeof performance !== "undefined" ? performance.now() : Date.now()) }
        } catch (e) {}
      }

      function releaseTransitionLock() {
        trLockReleased = true
        try { window.__dshModelTransitionLock = null } catch (e) {}
      }

      function maybeReleaseTransitionLock(elapsed) {
        if (trLockReleased) return
        if (elapsed >= CLOSE_LEAD) releaseTransitionLock()
      }

      function iconEl(m) { return '<img class="fx-icon" src="' + m.icon + '" alt="">' }

      function effectMarkup(id) {
        const m = MODELS[id]
        if (id === "deepseek") return '<div class="fx fx-deepseek">' +
          '<div class="ds-ring"></div><div class="ds-ring"></div><div class="ds-ring"></div>' +
          '<div class="ds-horizon"></div>' +
          '<div class="fx-disc ds-disc">' + iconEl(m) + '</div></div>'
        if (id === "gpt") return '<div class="fx fx-gpt">' +
          '<div class="gpt-orbit"></div>' +
          '<div class="gpt-petals"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
          '<div class="gpt-sweep"></div>' +
          '<div class="gpt-spark"></div>' +
          '<div class="fx-disc gpt-disc">' + iconEl(m) + '</div></div>'
        if (id === "claude") return '<div class="fx fx-claude">' +
          '<div class="cl-envelope">' +
          '<div class="cl-back"></div><div class="cl-letter"><i></i><i></i><i></i></div>' +
          '<div class="cl-front"></div><div class="cl-emblem">' + iconEl(m) + '</div><div class="cl-flap"></div><div class="cl-seal">C</div>' +
          '</div>' +
          '<div class="cl-spark">' + iconEl(m) + '</div></div>'
        if (id === "kimi") return '<div class="fx fx-kimi">' +
          '<div class="kimi-vinyl"></div>' +
          '<div class="kimi-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
          '<div class="kimi-keys"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
          '<div class="fx-disc kimi-disc">' + iconEl(m) + '</div>' +
          '<div class="kimi-dot"></div></div>'
        if (id === "glm") return '<div class="fx fx-glm">' +
          '<div class="glm-ears"><i></i><i></i></div>' +
          '<div class="glm-book"><div class="glm-page left"></div><div class="glm-page right"></div></div>' +
          '<div class="fx-disc glm-disc">' + iconEl(m) + '</div></div>'
        if (id === "qwen") return '<div class="fx fx-qwen">' +
          '<div class="qwen-orbit"></div>' +
          '<div class="qwen-fan"><div class="qwen-paper"></div><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><div class="qwen-handle"></div><div class="qwen-tassel"></div></div>' +
          '<div class="fx-disc qwen-disc">' + iconEl(m) + '</div></div>'
        return '<div class="fx fx-gemini">' +
          '<div class="gem-nova"></div><div class="gem-star a"></div><div class="gem-star b"></div>' +
          '<div class="fx-disc gem-disc">' + iconEl(m) + '</div></div>'
      }

      function setUI(m) {
        const stage = trEls && trEls.stage
        if (!stage) return
        stage.style.setProperty("--accent", m.accent)
        stage.style.setProperty("--accent2", m.accent2)
        if (m.dark) {
          stage.style.setProperty("--ui-text", "#F4F7FF")
          stage.style.setProperty("--ui-sub", "#B9C6E4")
          stage.style.setProperty("--card-bg", "rgba(12,18,32,.62)")
          stage.style.setProperty("--card-border", "rgba(255,255,255,.16)")
          stage.style.setProperty("--chip-bg", "rgba(12,18,32,.6)")
          stage.style.setProperty("--chip-border", "rgba(255,255,255,.15)")
          stage.style.setProperty("--mark-bg", "rgba(255,255,255,.1)")
          stage.style.setProperty("--live", "#8FE3B4")
          stage.style.setProperty("--shadow", "0 18px 50px rgba(0,0,0,.35)")
        } else {
          stage.style.setProperty("--ui-text", "#14212e")
          stage.style.setProperty("--ui-sub", "#607183")
          stage.style.setProperty("--card-bg", "rgba(255,255,255,.74)")
          stage.style.setProperty("--card-border", "rgba(255,255,255,.9)")
          stage.style.setProperty("--chip-bg", "rgba(255,255,255,.76)")
          stage.style.setProperty("--chip-border", "rgba(255,255,255,.92)")
          stage.style.setProperty("--mark-bg", "rgba(244,248,252,.92)")
          stage.style.setProperty("--live", "#4f8a68")
          stage.style.setProperty("--shadow", "0 18px 50px rgba(11,30,49,.24)")
        }
      }

        // ===== 关闭效果 =====
  function renderClose(m, t) {
    const p = clamp(t / 1000)
    const root = trEls.closeFx
    if (m.id === 'deepseek') {
      const disc = root.querySelector('.ds-disc')
      const rings = qall(root, '.ds-ring')
      const horizon = root.querySelector('.ds-horizon')
      disc.style.transform = `translateY(${76 * p}px) scale(${1 - .34 * p}) rotate(${9 * p}deg)`
      disc.style.opacity = String(1 - .92 * smooth(.44, 1, p))
      rings.forEach((ring, i) => {
        const q = clamp(p * 1.35 - i * .11)
        ring.style.transform = `scale(${.9 + 1.5 * q})`
        ring.style.opacity = String(.5 * (1 - q))
      })
      horizon.style.transform = `translateY(${24 * p}px) scaleX(${1 - .8 * p})`
      horizon.style.opacity = String(1 - smooth(.3, 1, p))
    }
    if (m.id === 'gpt') {
      const disc = root.querySelector('.gpt-disc')
      const petals = root.querySelector('.gpt-petals')
      const sweep = root.querySelector('.gpt-sweep')
      const orbit = root.querySelector('.gpt-orbit')
      const spark = root.querySelector('.gpt-spark')
      disc.style.transform = `rotate(${-190 * p}deg) scale(${1 - .4 * p})`
      disc.style.opacity = String(1 - .9 * smooth(.5, 1, p))
      petals.style.transform = `rotate(${-130 * p}deg) scale(${1 - .22 * p})`
      petals.style.opacity = String(.82 * (1 - p))
      sweep.style.transform = `rotate(${-360 * p}deg)`
      sweep.style.opacity = String(.82 * (1 - p))
      orbit.style.transform = `rotate(${110 * p}deg) scale(${1 - .12 * p})`
      orbit.style.opacity = String(.55 * (1 - p))
      spark.style.transform = `rotate(${120 * p}deg) translateY(-99px)`
      spark.style.opacity = String(.8 * (1 - smooth(.55, 1, p)))
    }
    if (m.id === 'claude') {
      const env = root.querySelector('.cl-envelope')
      const letter = root.querySelector('.cl-letter')
      const flap = root.querySelector('.cl-flap')
      const seal = root.querySelector('.cl-seal')
      const spark = root.querySelector('.cl-spark')
      const closeP = smooth(.15, .85, p)
      env.style.transform = `scale(${1 - .26 * smooth(.55, 1, p)}) rotate(${-2 * p}deg)`
      env.style.opacity = String(1 - .9 * smooth(.74, 1, p))
      letter.style.transform = `translateY(${17 * (1 - p)}px) scaleY(${1 - .58 * closeP})`
      flap.style.transform = `rotateX(${-158 + 158 * smooth(.3, .92, p)}deg)`
      seal.style.opacity = String(smooth(.58, .9, p))
      seal.style.transform = `scale(${.5 + .5 * smooth(.58, .9, p)})`
      spark.style.opacity = '0'
    }
    if (m.id === 'kimi') {
      const vinyl = root.querySelector('.kimi-vinyl')
      const disc = root.querySelector('.kimi-disc')
      const keys = qall(root, '.kimi-keys i')
      const waves = qall(root, '.kimi-wave i')
      const dot = root.querySelector('.kimi-dot')
      vinyl.style.opacity = String(.16 * (1 - p))
      vinyl.style.transform = `rotate(${50 * p}deg) scale(${.72 + .05 * p})`
      disc.style.transform = `translateY(${70 * p}px) scale(${1 - .3 * p})`
      disc.style.opacity = String(1 - .9 * smooth(.48, 1, p))
      keys.forEach((key, i) => {
        const q = smooth(.12 + i * .035, .9, p)
        key.style.transform = `translateY(${38 * q}px) scaleY(${1 - .88 * q})`
        key.style.opacity = String(1 - .5 * q)
      })
      waves.forEach((bar, i) => {
        const q = smooth(.08 + i * .025, .85, p)
        bar.style.transform = `scaleY(${1 - .95 * q})`
        bar.style.opacity = String(.8 * (1 - q))
      })
      dot.style.opacity = '0'
    }
    if (m.id === 'glm') {
      const pages = qall(root, '.glm-page')
      const disc = root.querySelector('.glm-disc')
      const ears = root.querySelector('.glm-ears')
      const closeP = smooth(.15, .9, p)
      pages[0].style.transform = `rotateY(${74 * closeP}deg)`
      pages[1].style.transform = `rotateY(${-74 * closeP}deg)`
      pages.forEach(page => { page.style.opacity = String(1 - .25 * closeP) })
      disc.style.transform = `scale(${1 - .5 * closeP}) rotate(${-24 * closeP}deg)`
      disc.style.opacity = String(1 - .9 * smooth(.6, 1, p))
      ears.style.opacity = String(.35 * (1 - p))
      ears.style.transform = `translateY(${-12 * closeP}px) scale(${1 + .1 * closeP})`
    }
    if (m.id === 'qwen') {
      const blades = qall(root, '.qwen-blade, .qwen-fan i')
      const disc = root.querySelector('.qwen-disc')
      const orbit = root.querySelector('.qwen-orbit')
      const paper = root.querySelector('.qwen-paper')
      const handle = root.querySelector('.qwen-handle')
      const tassel = root.querySelector('.qwen-tassel')
      const closeP = smooth(.08, .9, p)
      blades.forEach((blade, i) => {
        const base = -75 + i * (150 / 11)
        blade.style.transform = `rotate(${base * (1 - closeP)}deg)`
        blade.style.opacity = String(.85 - .3 * closeP)
      })
      if (paper) {
        paper.style.transform = `scaleX(${1 - .9 * closeP})`
        paper.style.opacity = String(.58 * (1 - .42 * closeP))
      }
      if (handle) {
        handle.style.transform = `translateY(${18 * closeP}px) scale(${1 - .1 * closeP})`
        handle.style.opacity = String(1 - .34 * closeP)
      }
      if (tassel) {
        tassel.style.transform = `translateY(${10 * closeP}px)`
        tassel.style.opacity = String(1 - .56 * closeP)
      }
      disc.style.transform = `scale(${1 - .44 * closeP}) rotate(${12 * closeP}deg)`
      disc.style.opacity = String(1 - .9 * smooth(.55, 1, p))
      orbit.style.transform = `rotate(${120 * p}deg) scale(${1 + .1 * p})`
      orbit.style.opacity = String(.3 * (1 - p))
    }
    if (m.id === 'gemini') {
      const stars = qall(root, '.gem-star')
      const disc = root.querySelector('.gem-disc')
      const nova = root.querySelector('.gem-nova')
      const angle = 180 * easeOut(p)
      const radius = 96 * (1 - easeOut(clamp(p / .82)))
      stars.forEach((star, i) => {
        const a = angle + (i === 0 ? 0 : 180)
        const x = Math.cos(a * Math.PI / 180) * radius
        const y = Math.sin(a * Math.PI / 180) * radius
        star.style.transform = `translate(${x}px,${y}px) rotate(${a}deg) scale(${.86 + .12 * p})`
        star.style.opacity = String(1 - .35 * p)
      })
      disc.style.transform = `scale(${1 - .38 * p})`
      disc.style.opacity = String(1 - .9 * smooth(.38, 1, p))
      nova.style.transform = `scale(${.25 + 1.3 * p})`
      nova.style.opacity = String(.5 * Math.sin(Math.PI * p))
    }
  }


        // ===== 进入效果 =====
  function renderEnter(m, q) {
    const e = easeOut(clamp(q / .5))
    const root = trEls.enterFx
    if (m.id === 'deepseek') {
      const disc = root.querySelector('.ds-disc')
      const rings = qall(root, '.ds-ring')
      disc.style.transform = `translateY(${78 * (1 - e)}px) scale(${.62 + .38 * e})`
      disc.style.opacity = String(smooth(0, .14, q) * (1 - .9 * smooth(.58, .84, q)))
      rings.forEach((ring, i) => {
        const p = clamp(q * 1.25 - i * .09)
        ring.style.transform = `scale(${.9 + 1.35 * p})`
        ring.style.opacity = String(.48 * (1 - p))
      })
    }
    if (m.id === 'gpt') {
      const disc = root.querySelector('.gpt-disc')
      const petals = root.querySelector('.gpt-petals')
      const sweep = root.querySelector('.gpt-sweep')
      const orbit = root.querySelector('.gpt-orbit')
      const spark = root.querySelector('.gpt-spark')
      const spin = smooth(0, .45, q)       // 0.9s 转完一圈，旧版约 0.46s
      const bloom = easeOut(clamp(q / .5))
      disc.style.transform = `rotate(${360 * spin}deg) scale(${.74 + .26 * bloom})`
      disc.style.opacity = String(smooth(0, .14, q) * (1 - .9 * smooth(.56, .88, q)))
      petals.style.transform = `rotate(${360 * spin}deg) scale(${.84 + .26 * bloom})`
      petals.style.opacity = String(.82 * smooth(0, .2, q) * (1 - smooth(.5, .82, q)))
      sweep.style.transform = `rotate(${360 * spin}deg)`
      sweep.style.opacity = String(.82 * smooth(0, .2, q) * (1 - smooth(.52, .8, q)))
      orbit.style.transform = `rotate(${360 * spin}deg) scale(${.76 + .24 * bloom})`
      orbit.style.opacity = String(.5 * smooth(0, .2, q) * (1 - smooth(.5, .8, q)))
      spark.style.transform = `rotate(${360 * spin}deg) translateY(-99px)`
      spark.style.opacity = String(smooth(.04, .16, q) * (1 - smooth(.52, .8, q)))
    }
    if (m.id === 'claude') {
      const env = root.querySelector('.cl-envelope')
      const letter = root.querySelector('.cl-letter')
      const flap = root.querySelector('.cl-flap')
      const seal = root.querySelector('.cl-seal')
      const spark = root.querySelector('.cl-spark')
      const open = smooth(0, .42, q)
      const reveal = smooth(.34, .58, q)
      const fade = smooth(.55, .82, q)
      env.style.transform = `scale(${.92 + .12 * e}) rotate(${2 * (1 - open)}deg)`
      env.style.opacity = String(1 - .9 * fade)
      flap.style.transform = `rotateX(${-156 * open}deg)`
      seal.style.opacity = String(1 - smooth(0, .2, q))
      letter.style.transform = `translateY(${16 - 58 * open}px) scaleY(${1 - .08 * open})`
      letter.style.opacity = String(smooth(.04, .18, q) * (1 - smooth(.32, .52, q)))
      spark.style.transform = `scale(${.55 + .45 * easeOut(reveal)}) rotate(${18 * easeOut(reveal)}deg)`
      spark.style.opacity = String(reveal * (1 - .9 * fade))
    }
    if (m.id === 'kimi') {
      const vinyl = root.querySelector('.kimi-vinyl')
      const disc = root.querySelector('.kimi-disc')
      const keys = qall(root, '.kimi-keys i')
      const waves = qall(root, '.kimi-wave i')
      const dot = root.querySelector('.kimi-dot')
      vinyl.style.opacity = String(smooth(0, .2, q) * (1 - smooth(.75, 1, q)))
      vinyl.style.transform = `rotate(${200 * easeOut(clamp(q / .7))}deg) scale(${.58 + .42 * e})`
      disc.style.transform = `translateY(${66 * (1 - e)}px) scale(${.58 + .42 * e})`
      disc.style.opacity = String(smooth(0, .16, q) * (1 - .9 * smooth(.6, .88, q)))
      keys.forEach((key, i) => {
        const k = smooth(.05 + i * .032, .62, q)
        key.style.transform = `translateY(${34 * (1 - k)}px) scaleY(${.18 + .82 * k})`
        key.style.opacity = String(.25 + .75 * k)
      })
      waves.forEach((bar, i) => {
        const w = smooth(.08 + i * .028, .68, q)
        bar.style.transform = `scaleY(${.06 + .94 * w})`
        bar.style.opacity = String(.18 + .62 * w)
      })
      const orbit = smooth(.25, .75, q)
      dot.style.opacity = String(orbit * (1 - smooth(.8, 1, q)))
      dot.style.transform = `rotate(${300 * orbit}deg) translateX(64px)`
    }
    if (m.id === 'glm') {
      const pages = qall(root, '.glm-page')
      const disc = root.querySelector('.glm-disc')
      const ears = root.querySelector('.glm-ears')
      const open = smooth(0, .55, q)
      pages[0].style.transform = `rotateY(${74 * (1 - open)}deg)`
      pages[1].style.transform = `rotateY(${-74 * (1 - open)}deg)`
      pages.forEach(page => { page.style.opacity = String(1 - .2 * (1 - open)) })
      disc.style.transform = `scale(${.5 + .5 * e}) rotate(${-16 * (1 - e)}deg)`
      disc.style.opacity = String(smooth(0, .22, q) * (1 - .9 * smooth(.62, .9, q)))
      ears.style.opacity = String(.38 * smooth(0, .35, q) * (1 - smooth(.55, .8, q)))
      ears.style.transform = `translateY(${-16 * e}px) scale(${.9 + .12 * e})`
    }
    if (m.id === 'qwen') {
      const blades = qall(root, '.qwen-fan i')
      const disc = root.querySelector('.qwen-disc')
      const orbit = root.querySelector('.qwen-orbit')
      const paper = root.querySelector('.qwen-paper')
      const handle = root.querySelector('.qwen-handle')
      const tassel = root.querySelector('.qwen-tassel')
      const open = smooth(0, .48, q)
      blades.forEach((blade, i) => {
        const base = -75 + i * (150 / 11)
        blade.style.transform = `rotate(${base * open}deg)`
        blade.style.opacity = String(.45 + .4 * open)
      })
      if (paper) {
        paper.style.transform = `scaleX(${.1 + .9 * open})`
        paper.style.opacity = String(.58 * (.38 + .62 * open))
      }
      if (handle) {
        handle.style.transform = `translateY(${16 * (1 - open)}px) scale(${.9 + .1 * open})`
        handle.style.opacity = String(.46 + .54 * open)
      }
      if (tassel) {
        tassel.style.transform = `translateY(${6 * (1 - open)}px)`
        tassel.style.opacity = String(.42 + .58 * open)
      }
      disc.style.transform = `scale(${.55 + .45 * e}) rotate(${-10 * (1 - e)}deg)`
      disc.style.opacity = String(smooth(0, .25, q) * (1 - .9 * smooth(.58, .86, q)))
      orbit.style.transform = `rotate(${160 * open}deg) scale(${.8 + .2 * open})`
      orbit.style.opacity = String(.35 * smooth(0, .2, q) * (1 - .8 * smooth(.6, .9, q)))
    }
    if (m.id === 'gemini') {
      const stars = qall(root, '.gem-star')
      const disc = root.querySelector('.gem-disc')
      const nova = root.querySelector('.gem-nova')
      const open = smooth(0, .58, q)
      const split = easeOut(clamp(q / .62))
      const angle = 180 * split
      const radius = 96 * split
      stars.forEach((star, i) => {
        const a = angle + (i === 0 ? 0 : 180)
        const x = Math.cos(a * Math.PI / 180) * radius
        const y = Math.sin(a * Math.PI / 180) * radius
        star.style.transform = `translate(${x}px,${y}px) rotate(${a}deg) scale(${.72 + .26 * open})`
        star.style.opacity = String(smooth(0, .16, q) * (1 - .55 * smooth(.55, .9, q)))
      })
      disc.style.transform = `scale(${.5 + .5 * e})`
      disc.style.opacity = String(smooth(.2, .45, q) * (1 - .9 * smooth(.62, .9, q)))
      nova.style.transform = `scale(${.25 + 1.2 * open})`
      nova.style.opacity = String(.5 * smooth(0, .2, q) * (1 - smooth(.65, .9, q)))
    }
  }



      function renderTransition(t) {
        t = clamp(t, 0, DURATION)
        const A = MODELS[trFrom]
        const B = MODELS[trTo]
        if (!A || !B || !trEls) return
        const close = t < 1000
        const el = trEls

        el.bgA.style.opacity = String(1 - smooth(920, 1000, t))
        el.bgA.style.transform = "scale(" + (1.02 + .05 * smooth(0, 1000, t)) + ")"
        el.bgA.style.filter = "saturate(" + (1 - .22 * smooth(0, 1000, t)) + ") blur(" + (1.2 * smooth(0, 900, t)) + "px)"
        el.bgB.style.opacity = String(smooth(1000, 1160, t))
        el.bgB.style.transform = "scale(" + (1.06 - .06 * smooth(1000, 1900, t)) + ")"
        el.veilA.style.opacity = String(1 - smooth(920, 1000, t))
        el.veilB.style.opacity = String(smooth(1000, 1160, t))

        el.closeFx.style.display = close ? "block" : "none"
        el.enterFx.style.display = close ? "none" : "block"
        el.closeFx.style.opacity = String(1 - smooth(720, 980, t))
        el.enterFx.style.opacity = String(1 - smooth(1980, 2400, t))

        if (close) {
          setUI(A)
          const chromeFade = 1 - smooth(2800, 3000, t)
          el.closeChrome.style.opacity = String((1 - smooth(600, 900, t)) * chromeFade)
          el.enterChrome.style.opacity = "0"
          el.finalTitle.style.opacity = "0"
          renderClose(A, t)
          el.closeLine.style.width = (100 - 88 * smooth(140, 920, t)).toFixed(1) + "%"
          el.closeTime.textContent = (t / 1000).toFixed(2) + "s"
          el.flash.style.background = A.flash
          el.flash.style.opacity = String(smooth(820, 1000, t))
        } else {
          setUI(B)
          const chromeFade = 1 - smooth(2800, 3000, t)
          el.closeChrome.style.opacity = "0"
          el.enterChrome.style.opacity = String(smooth(1880, 2140, t) * chromeFade)
          renderEnter(B, (t - 1000) / 2000)
          el.enterLine.style.width = (38 + 62 * smooth(2050, 2800, t)).toFixed(1) + "%"
          el.finalTitle.style.opacity = String(smooth(2350, 2650, t) * chromeFade)
          el.flash.style.background = B.flash
          el.flash.style.opacity = String(1 - smooth(1000, 1160, t))
        }
      }

      function fitTransition() {
        if (!trEls || !trEls.stage) return
        const s = Math.max(innerWidth / 1600, innerHeight / 900)
        trEls.stage.style.setProperty("--stage-scale", String(s))
      }

      function ensureTransitionHost() {
        if (trHost && trRoot && trEls) {
          try {
            const connected = trHost.isConnected || (document.documentElement && document.documentElement.contains(trHost))
            if (!connected) (document.body || document.documentElement).appendChild(trHost)
          } catch (e) {}
          return true
        }
        trHost = document.createElement("div")
        trHost.id = "dsmt-host"
        trHost.setAttribute("aria-hidden", "true")
        trHost.style.cssText = "position:fixed;inset:0;z-index:2147483600;display:none;pointer-events:none;opacity:0;visibility:hidden;"
        trRoot = trHost.attachShadow({ mode: "open" })
        trRoot.innerHTML = "<style>" + TRANSITION_CSS + "</style>" + TRANSITION_STAGE
        ;(document.body || document.documentElement).appendChild(trHost)
        trEls = {
          stage: trRoot.querySelector("#stage"),
          bgA: trRoot.querySelector("#bgA"),
          bgB: trRoot.querySelector("#bgB"),
          veilA: trRoot.querySelector("#veilA"),
          veilB: trRoot.querySelector("#veilB"),
          closeFx: trRoot.querySelector("#closeFx"),
          enterFx: trRoot.querySelector("#enterFx"),
          closeChrome: trRoot.querySelector("#closeChrome"),
          enterChrome: trRoot.querySelector("#enterChrome"),
          closeIcon: trRoot.querySelector("#closeIcon"),
          enterIcon: trRoot.querySelector("#enterIcon"),
          closeName: trRoot.querySelector("#closeName"),
          closePersona: trRoot.querySelector("#closePersona"),
          enterName: trRoot.querySelector("#enterName"),
          enterPersona: trRoot.querySelector("#enterPersona"),
          closeTitle: trRoot.querySelector("#closeTitle"),
          closeSub: trRoot.querySelector("#closeSub"),
          enterTitle: trRoot.querySelector("#enterTitle"),
          enterSub: trRoot.querySelector("#enterSub"),
          closeLine: trRoot.querySelector("#closeLine"),
          enterLine: trRoot.querySelector("#enterLine"),
          closeTime: trRoot.querySelector("#closeTime"),
          finalTitle: trRoot.querySelector("#finalTitle"),
          finalName: trRoot.querySelector("#finalName"),
          flash: trRoot.querySelector("#flash")
        }
        fitTransition()
        return true
      }

      function preloadTransitionAssets(force) {
        if (trPreloaded && !force) return
        trPreloaded = true
        const keep = []
        FAMILIES7.forEach(function (fam) {
          const m = MODELS[fam]
          if (!m) return
          try {
            const bg = new Image()
            bg.src = m.bg
            if (bg.decode) bg.decode().catch(function () {})
            keep.push(bg)
            const icon = new Image()
            icon.src = m.icon
            if (icon.decode) icon.decode().catch(function () {})
            keep.push(icon)
          } catch (e) {}
        })
        try { window.__dshModelTransitionPreload = keep } catch (e) {}
      }

      function prewarmTransition() {
        try {
          if (!ensureTransitionHost()) return
          preloadTransitionAssets()
          if (trHost && !trActive) {
            trHost.style.display = "none"
            trHost.style.visibility = "hidden"
            trHost.style.pointerEvents = "none"
            trHost.style.opacity = "0"
          }
        } catch (e) {}
      }

      /* 模型文案节点变化时立刻同步，不再等 120ms 轮询；主题插件在同一微任务里也能看到锁 */
      function watchTriggerNode() {
        let node = null
        try { node = document.querySelector(".dms-trigger-model") || document.querySelector(".dms-trigger") } catch (e) {}
        if (!node) return
        if (trObserver && trObservedEl === node) return
        try { if (trObserver) trObserver.disconnect() } catch (e) {}
        trObservedEl = node
        trObserver = new MutationObserver(function () {
          try { syncTransition() } catch (e) {}
        })
        try {
          trObserver.observe(node, { childList: true, characterData: true, subtree: true })
        } catch (e) {}
      }

      function applyTransitionPair(from, to) {
        const A = MODELS[from]
        const B = MODELS[to]
        if (!A || !B || !trEls) return false
        const el = trEls
        el.bgA.src = A.bg
        el.bgB.src = B.bg
        el.veilA.style.background = A.veil
        el.veilB.style.background = B.veil
        el.closeFx.innerHTML = effectMarkup(from)
        el.enterFx.innerHTML = effectMarkup(to)
        el.closeIcon.src = A.icon
        el.enterIcon.src = B.icon
        el.closeName.textContent = A.label
        el.closePersona.textContent = A.persona + " · 退出中"
        el.enterName.textContent = B.label
        el.enterPersona.textContent = B.persona + " · 已加载"
        el.closeTitle.textContent = A.closeTitle
        el.closeSub.textContent = A.closeSub
        el.enterTitle.textContent = B.enterTitle
        el.enterSub.textContent = B.enterSub
        el.closeLine.style.width = "100%"
        el.enterLine.style.width = "38%"
        el.finalName.textContent = B.label + " / " + B.persona
        setUI(A)
        return true
      }

      function setTransitionOpacity(elapsed) {
        if (!trHost) return
        const e = clamp(elapsed, 0, TOTAL)
        maybeReleaseTransitionLock(e)
        let op
        if (e < CLOSE_LEAD) op = smooth(0, CLOSE_LEAD, e)
        else if (e < FADE_OUT_START) op = 1
        else op = 1 - smooth(FADE_OUT_START, TOTAL, e)
        trHost.style.opacity = String(op)
      }

      function finishTransition() {
        if (trRaf) cancelAnimationFrame(trRaf)
        trRaf = 0
        if (trFallbackTimer) {
          clearTimeout(trFallbackTimer)
          trFallbackTimer = 0
        }
        const finishedTo = trTo
        trActive = false
        if (trHost) {
          trHost.style.opacity = "0"
          trHost.style.pointerEvents = "none"
          trHost.style.visibility = "hidden"
          trHost.style.display = "none"
        }
        /* 主题桌宠：过渡结束回到普通主题同步，撤掉临时高层级 */
        try {
          if (typeof window.__dshThemePetTransitionFinish === "function") window.__dshThemePetTransitionFinish(finishedTo)
        } catch (e) {}
        trFrom = ""
        trTo = ""
        releaseTransitionLock()
        /* 动画收尾后主动让主题落到 B；用一次性 skip 避免 render 又把同一对动画重开一遍 */
        try {
          window.__dshModelTransitionSkipOnce = finishedTo
          if (typeof window.__dshModelThemeRender === "function") {
            setTimeout(function () {
              try { window.__dshModelThemeRender() } catch (e) {}
            }, 0)
          }
        } catch (e) {}
      }

      function tickTransition(now) {
        if (!trHost) return
        const elapsed = now - trStartAt
        const t = clamp(elapsed - CLOSE_LEAD, 0, DURATION)
        renderTransition(t)
        setTransitionOpacity(elapsed)
        /* 主题桌宠：在 B 开场动画中段触发 1 秒淡入与登场动作 */
        try {
          if (typeof window.__dshThemePetTransitionTick === "function") window.__dshThemePetTransitionTick(elapsed, trFrom, trTo)
        } catch (e) {}
        if (elapsed >= TOTAL) { finishTransition(); return }
        trRaf = requestAnimationFrame(tickTransition)
      }

      function startTransition(from, to, force) {
        if (!MODELS[from] || !MODELS[to] || from === to) return false
        if (!force && (!mtTransitionEnabled(from) || !mtTransitionEnabled(to))) return false
        /* 主题 render 会主动先起一次；随后 120ms 轮询看到同一对时直接复用，不能重启动画 */
        if (trActive && trFrom === from && trTo === to) return true
        if (trActive) finishTransition()
        if (!ensureTransitionHost()) return false
        if (!applyTransitionPair(from, to)) { finishTransition(); return false }
        trFrom = from
        trTo = to
        armTransitionLock(from, to)
        trActive = true
        /* 主题桌宠：过渡一开始先收旧宠、准备新宠（真正淡入在 tick 的 B 开场中点） */
        try {
          if (typeof window.__dshThemePetTransitionStart === "function") window.__dshThemePetTransitionStart(from, to)
        } catch (e) {}
        trHost.style.display = "block"
        trHost.style.visibility = "visible"
        trHost.style.pointerEvents = "auto"
        trHost.style.opacity = "0"
        renderTransition(0)
        fitTransition()
        trStartAt = (typeof performance !== "undefined" ? performance.now() : Date.now())
        if (trRaf) cancelAnimationFrame(trRaf)
        trRaf = requestAnimationFrame(tickTransition)
        /* 窗口被遮挡时 rAF 会暂停；兜底释放主题锁，避免下一次切换被卡住 */
        if (trFallbackTimer) clearTimeout(trFallbackTimer)
        trFallbackTimer = setTimeout(function () {
          trFallbackTimer = 0
          if (trActive) finishTransition()
        }, TOTAL + 600)
        return true
      }

      function seekTransition(from, to, elapsed) {
        if (!MODELS[from] || !MODELS[to]) return null
        if (trActive) finishTransition()
        if (!ensureTransitionHost()) return null
        if (!applyTransitionPair(from, to)) { finishTransition(); return null }
        trFrom = from
        trTo = to
        trActive = true
        trHost.style.display = "block"
        trHost.style.visibility = "visible"
        trHost.style.pointerEvents = "none"
        const e = clamp(Number(elapsed) || 0, 0, TOTAL)
        renderTransition(clamp(e - CLOSE_LEAD, 0, DURATION))
        setTransitionOpacity(e)
        fitTransition()
        return { from: from, to: to, elapsed: e, opacity: trHost ? trHost.style.opacity : "0", t: clamp(e - CLOSE_LEAD, 0, DURATION) }
      }

      try {
        window.__dshModelTransition = {
          start: startTransition,
          stop: finishTransition,
          seek: seekTransition,
          models: Object.keys(MODELS)
        }
        window.__dshModelTransitionStart = startTransition
      } catch (e) {
        /* ignore */
      }

      let currentFam = ""
      try {
        if (window.__dshModelTheme && mtBase(window.__dshModelTheme)) currentFam = window.__dshModelTheme
      } catch (e) {}
      let seenRealText = false

      function syncTransition() {
        try { watchTriggerNode() } catch (e) {}
        const text = readModelText()
        if (!text) return
        const fam = detect(text)
        if (!fam || !MODELS[fam]) return
        if (!seenRealText) {
          seenRealText = true
          currentFam = fam
          return
        }
        if (fam === currentFam) return
        const now = (typeof performance !== "undefined" ? performance.now() : Date.now())
        if (bootAt && now - bootAt < 3500) {
          currentFam = fam
          return
        }
        const from = currentFam
        currentFam = fam
        /* 任一端关闭了“启动动画”就不播放 4 秒过渡，主题直接切 */
        if (!mtTransitionEnabled(from) || !mtTransitionEnabled(fam)) {
          try { window.__dshModelTransitionLock = null } catch (e) {}
          return
        }
        /* 在主题插件应用 B 之前先立锁；render() 看到锁会保持 A 工作台 */
        armTransitionLock(from, fam)
        const ok = startTransition(from, fam)
        if (!ok) releaseTransitionLock()
      }

      try {
        syncTransition()
        watchTriggerNode()
        setInterval(function () {
          syncTransition()
          watchTriggerNode()
        }, 120)
      } catch (e) {
        /* ignore */
      }

      /* 点击模型选择器时先落下 900ms 早期保护，挡住主题在过渡层建立前的抢先切换 */
      try {
        document.addEventListener("pointerdown", function (ev) {
          const t = ev && ev.target
          if (!t || !t.closest) return
          if (t.closest(".dms-trigger, .dms-trigger-model, .dms-model-item, .dms-model-row, .dms-model-picker, .dms-slider, .dms-vendor, .dms-panel, [class*='dms-trigger'], [class*='dms-model'], [class*='dms-vendor'], [class*='dms-tier'], [data-dms-model]")) {
            window.__dshModelSwitchGuardUntil = (typeof performance !== "undefined" ? performance.now() : Date.now()) + 900
          }
        }, true)
      } catch (e) {
        /* ignore */
      }

      /* 预挂载 Shadow DOM + 预解码 7 套背景/图标，第一次切换不再现场解析 19KB CSS */
      try {
        if (window.requestIdleCallback) requestIdleCallback(prewarmTransition, { timeout: 2600 })
        else setTimeout(prewarmTransition, 1400)
      } catch (e) {
        setTimeout(prewarmTransition, 1400)
      }
    }

    function mount() {
      if (window.__dshModelThemeMounted) return
      window.__dshModelThemeMounted = true
      installGlassSurfaces()
      installSettingsSwitchStyle()
      installNativeSelectSkin()
      installIPhoneMotion()
      mtWatchHarnessBadge()
      installButtonSounds()
      installIframeSoundBridge()
      let style = document.getElementById(STYLE_ID)
      if (!style) {
        style = document.createElement("style")
        style.id = STYLE_ID
        ;(document.head || document.documentElement).appendChild(style)
      }
      let current = ""
      /* 记住上次退出时的主题：启动第一帧先用它，避免先闪一下 DeepSeek 再切回来 */
      try {
        const savedFam = localStorage.getItem("dsh-model-theme:last")
        if (savedFam && mtBase(savedFam)) {
          style.textContent = themeCss(savedFam)
          mtSyncAccentVar(savedFam)
          window.__dshModelTheme = savedFam
          current = savedFam
        }
      } catch (e) {
        /* ignore */
      }
      const bootAt = typeof performance !== "undefined" ? performance.now() : Date.now()
      /* 启动期长任务采样：用来判断「跳过开屏卡一秒」到底卡在哪一段 */
      try {
        window.__dshBootLong = []
        window.__dshBootMarks = { mount: Math.round(bootAt) }
        if (window.PerformanceObserver) {
          const po = new PerformanceObserver(function (list) {
            const es = list.getEntries()
            for (let i = 0; i < es.length; i++) {
              window.__dshBootLong.push({ start: Math.round(es[i].startTime), dur: Math.round(es[i].duration) })
            }
          })
          po.observe({ entryTypes: ["longtask"] })
        }
      } catch (e) {
        /* ignore */
      }
      /* 开屏期间先把桌宠藏起来，等启动页退场后再淡入 */
      try {
        let petStyle = document.getElementById("dsh-pet-boot-hold")
        if (!petStyle) {
          petStyle = document.createElement("style")
          petStyle.id = "dsh-pet-boot-hold"
          petStyle.textContent =
            '.dsh-pet-root{opacity:0 !important;pointer-events:none !important;transition:opacity .45s ease !important}'
          ;(document.head || document.documentElement).appendChild(petStyle)
        }
        const revealPet = function () {
          const now = typeof performance !== "undefined" ? performance.now() : Date.now()
          const splash = document.querySelector('[class*="splash" i], [class*="bootSplash" i], [class*="introScreen" i]')
          const elapsed = now - bootAt
          if ((elapsed > 3000 && !splash) || elapsed > 15000) {
            /* 不再把所有桌宠一起放出来：按当前模型主题只留对应的一只 */
            try { mtPetSync(current || window.__dshModelTheme || "deepseek", true) } catch (e) {}
            if (elapsed > 15000) {
              try {
                document.getElementById("dsh-pet-boot-hold").remove()
              } catch (e) {
                /* ignore */
              }
            }
            return
          }
          setTimeout(revealPet, 300)
        }
        setTimeout(revealPet, 300)
      } catch (e) {
        /* ignore */
      }
      /* ===== 主题桌宠：单只跟随当前模型；4 秒过渡中段 2.5s 淡入 ===== */
      let mtPetPhase = null
      function mtPetIdForFam(fam) {
        const cfg = mtPet()
        if (!cfg.enabled) return ""
        if (cfg.autoAssign === true) return mtPetAutoIdForFam(fam)
        return cfg.map[fam] || ""
      }
      function mtPetRoots() {
        const out = []
        const roots = document.querySelectorAll(".dsh-pet-root")
        for (let i = 0; i < roots.length; i++) {
          const root = roots[i]
          let name = ""
          try {
            const tip = root.querySelector(".pet-tooltip")
            if (tip) name = String(tip.textContent || "").trim()
            if (!name) {
              const hit = root.querySelector(".dsh-pet-hit")
              if (hit) name = String(hit.getAttribute("aria-label") || "").trim()
            }
          } catch (e) {}
          let id = ""
          const ids = Object.keys(MT_PET_NAMES)
          for (let k = 0; k < ids.length; k++) {
            if (MT_PET_NAMES[ids[k]] === name) { id = ids[k]; break }
          }
          out.push({ root: root, id: id, name: name })
        }
        return out
      }
      function mtPetFind(id) {
        const list = mtPetRoots()
        for (let i = 0; i < list.length; i++) if (list[i].id === id) return list[i]
        return null
      }
      /* 多宠包里的水平偏移有些是按 1920 屏排一列写的，单宠显示时会跑到屏幕外；显示前把出界的远端拉回角上 */
      function mtPetEnsureInView(root) {
        if (!root) return
        try {
          const rect = root.getBoundingClientRect()
          const vw = window.innerWidth || document.documentElement.clientWidth || 0
          const vh = window.innerHeight || document.documentElement.clientHeight || 0
          if (!rect.width || !vw || !vh) return
          const outside = rect.left < 4 || rect.top < 4 || rect.right > vw - 4 || rect.bottom > vh - 4
          if (!outside) return
          const corner = String(root.getAttribute("data-corner") || "bottom-right")
          const mx = 24
          const my = 16
          root.style.setProperty("left", corner.indexOf("left") >= 0 ? mx + "px" : "auto", "important")
          root.style.setProperty("right", corner.indexOf("right") >= 0 ? mx + "px" : "auto", "important")
          root.style.setProperty("top", corner.indexOf("top") >= 0 ? my + "px" : "auto", "important")
          root.style.setProperty("bottom", corner.indexOf("bottom") >= 0 ? my + "px" : "auto", "important")
          root.style.setProperty("--dsh-pet-mx", mx + "px")
          root.style.setProperty("--dsh-pet-my", my + "px")
        } catch (e) {}
      }
      function mtPetSet(root, visible, ms, elevated, interactive) {
        if (!root) return
        try {
          root.style.setProperty("transition", "opacity " + Math.max(0, ms) + "ms ease", "important")
          root.style.setProperty("opacity", visible ? "1" : "0", "important")
          root.style.setProperty("visibility", "visible", "important")
          if (elevated) root.style.setProperty("z-index", "2147483601", "important")
          else root.style.removeProperty("z-index")
          if (visible && interactive) root.style.removeProperty("pointer-events")
          else root.style.setProperty("pointer-events", "none", "important")
          if (visible) {
            try { requestAnimationFrame(function () { mtPetEnsureInView(root) }) } catch (e) {}
            setTimeout(function () { mtPetEnsureInView(root) }, 260)
          }
        } catch (e) {}
      }
      /* 告诉 dsh-pet 只挂载当前模型的这一只：未挂载的卡片不会消费 say 叶子，也就不会出声和弹台词 */
      function mtPetPublishActive(id) {
        const value = id ? String(id) : "__none__"
        try { window.__dshPetOnlyId = value } catch (e) {}
        try { localStorage.setItem("dsh-model-theme:pet-active", value) } catch (e) {}
        try {
          if (window.__dshPetOnlyPublished === value) return
          window.__dshPetOnlyPublished = value
          window.dispatchEvent(new CustomEvent("dsh-pet-only", { detail: { id: value } }))
        } catch (e) {}
      }
      /* 在 React 宠物卡挂载前就写死“只挂当前这一只”，避免启动瞬间所有宠一起开口 */
      try {
        const bootFam = mtBase(window.__dshModelTheme || localStorage.getItem("dsh-model-theme:last") || "deepseek")
        const bootCfg = mtPet()
        const bootId = bootCfg.enabled ? mtPetIdForFam(bootFam) : ""
        mtPetPublishActive(bootId || (bootCfg.enabled ? "" : "__none__"))
      } catch (e) {}
      function mtPetSync(fam, instant) {
        if (mtPetPhase) return
        const activeId = mtPetIdForFam(fam)
        mtPetPublishActive(activeId)
        const list = mtPetRoots()
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          const on = !!activeId && item.id === activeId
          /* 非当前宠瞬隐：启动或切主题时绝不让其它宠在页面上闪一下 */
          mtPetSet(item.root, on, instant ? 0 : (on ? 300 : 0), false, on)
          if (!on) {
            try { item.root.style.setProperty("visibility", "hidden", "important") } catch (e) {}
          }
        }
      }
      function mtPetPlayEntrance(id) {
        if (!id || id === "main") return
        const cfg = mtPet()
        const action = cfg.action || MT_PET_DEFAULT_ACTION
        function post(name) {
          try {
            return fetch("/dsh-pet-7340/anim?pet=" + encodeURIComponent(id) + "&surface=web", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ name: name })
            }).then(function (res) { return !!res && res.ok }).catch(function () { return false })
          } catch (e) {
            return Promise.resolve(false)
          }
        }
        post(action).then(function (ok) {
          if (!ok) post(MT_PET_FALLBACK_ACTION)
        })
      }
      function mtPetTransitionStart(from, to) {
        const cfg = mtPet()
        if (!cfg.enabled) return
        const fromId = mtPetIdForFam(from)
        const toId = mtPetIdForFam(to)
        mtPetPublishActive(toId)
        mtPetPhase = { from: fromId, to: toId, revealed: false, prepared: false, at: (typeof performance !== "undefined" ? performance.now() : Date.now()) }
        const phaseToken = mtPetPhase
        phaseToken.timer = setInterval(function () {
          if (mtPetPhase !== phaseToken) { clearInterval(phaseToken.timer); return }
          const elapsed = (typeof performance !== "undefined" ? performance.now() : Date.now()) - phaseToken.at
          mtPetTransitionTick(elapsed)
          if (elapsed >= 4100) clearInterval(phaseToken.timer)
        }, 60)
        const list = mtPetRoots()
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.id === toId) {
            mtPetSet(item.root, false, 0, true, false)
            mtPetPhase.prepared = true
          } else if (item.id === fromId) {
            mtPetSet(item.root, false, 300, false, false)
          } else {
            mtPetSet(item.root, false, 160, false, false)
          }
        }
      }
      function mtPetTransitionTick(elapsed) {
        const phase = mtPetPhase
        if (!phase) return
        const cfg = mtPet()
        if (!phase.to) return
        if (!phase.prepared) {
          const item = mtPetFind(phase.to)
          if (item) {
            mtPetSet(item.root, false, 0, true, false)
            phase.prepared = true
          }
        }
        if (phase.revealed) return
        if (elapsed < cfg.enterDelay) return
        const item = mtPetFind(phase.to)
        if (!item) return
        phase.revealed = true
        mtPetSet(item.root, true, cfg.fadeMs, true, false)
        mtPetPlayEntrance(phase.to)
      }
      function mtPetTransitionFinish(to) {
        const phase = mtPetPhase
        if (phase && phase.timer) { try { clearInterval(phase.timer) } catch (e) {} }
        mtPetPhase = null
        const list = mtPetRoots()
        for (let i = 0; i < list.length; i++) {
          try { list[i].root.style.removeProperty("z-index") } catch (e) {}
        }
        const fam = (to && mtBase(to)) ? to : (current || window.__dshModelTheme || "deepseek")
        mtPetSync(fam, false)
      }
      try {
        window.__dshThemePetTransitionStart = mtPetTransitionStart
        window.__dshThemePetTransitionTick = mtPetTransitionTick
        window.__dshThemePetTransitionFinish = mtPetTransitionFinish
        window.__dshThemePet = {
          get: mtPet,
          roots: mtPetRoots,
          sync: mtPetSync,
          start: mtPetTransitionStart,
          tick: mtPetTransitionTick,
          finish: mtPetTransitionFinish,
          play: mtPetPlayEntrance,
          phase: function () { return mtPetPhase }
        }
        setInterval(function () {
          try {
            if (!window.__dshThemePetTransitionTick) return
            if (mtPetPhase) return
            mtPetSync(current || window.__dshModelTheme || "deepseek", true)
          } catch (e) {}
        }, 1200)
      } catch (e) {}
      function patchCards() {
        const cards = document.querySelectorAll("[data-composer-card]")
        const mark = String(window.__dshModelTheme || "")
        for (let i = 0; i < cards.length; i++) {
          const el = cards[i]
          if (el.getAttribute("data-dsh-theme-card") === mark) continue
          el.setAttribute("data-dsh-theme-card", mark)
          try {
            el.style.setProperty("background-color", "rgba(255,255,255,0.48)", "important")
          } catch (e) {
            /* ignore */
          }
        }
      }
      /* 新会话按钮内部有多层白色实心块，用内联样式统一压透 */
      function patchSolids() {
        const nodes = document.querySelectorAll('[class*="wtg9ga_newSession"]')
        for (let i = 0; i < nodes.length; i++) {
          const el = nodes[i]
          if (el.getAttribute("data-dsh-theme-solid") === "1") continue
          el.setAttribute("data-dsh-theme-solid", "1")
          try {
            const isButton = el.tagName === "BUTTON"
            el.style.setProperty(
              "background-color",
              isButton ? "rgba(255,255,255,0.34)" : "transparent",
              "important"
            )
            if (!isButton) el.style.setProperty("backdrop-filter", "none", "important")
          } catch (e) {
            /* ignore */
          }
        }
      }
      /* 左上角品牌：模型头像 + 模型名 + HARNESS 徽标 */
      function luminance(hex) {
        try {
          const h = String(hex).replace("#", "")
          const r = parseInt(h.substr(0, 2), 16) / 255
          const g = parseInt(h.substr(2, 2), 16) / 255
          const b = parseInt(h.substr(4, 2), 16) / 255
          const f = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
        } catch (e) {
          return 0.5
        }
      }
      /* 工作区的文件夹图标跟随模型专属色 */
      function patchIcons(fam) {
        const th = mtThemeOf(fam)
        if (!th) return
        const color = th.icon || th.brand
        const nodes = document.querySelectorAll('svg[data-icon*="folder"], [class*="wnFoaW_folder"] svg')
        for (let i = 0; i < nodes.length; i++) {
          try {
            nodes[i].style.setProperty("color", color, "important")
          } catch (e) {
            /* ignore */
          }
        }
      }
      /* 右下角小鲸鱼记账：角色随主题切换 + 气泡与金额取专属色 */
      const WHALE_ROLE = {
        deepseek: "thm_deepseek",
        glm: "thm_glm",
        claude: "thm_claude",
        gpt: "thm_gpt",
        gemini: "thm_gemini",
        kimi: "thm_kimi",
        qwen: "thm_qwen"
      }
      const WHALE_ACCT = {
        deepseek: "deepseek",
        glm: "acct_glm",
        claude: "acct_claude",
        gpt: "acct_gpt",
        gemini: "acct_gemini",
        kimi: "acct_kimi",
        qwen: "acct_qwen"
      }
      const WHALE_LABEL = {
        deepseek: "DeepSeek 账户余额",
        glm: "GLM 账户余额",
        claude: "Claude 账户余额",
        gpt: "GPT 账户余额",
        gemini: "Gemini 账户余额",
        kimi: "Kimi 账户余额",
        qwen: "千问账户余额"
      }
      /* 记账挂件里「额外的句子」：按各自人格卡口吻改写，换模型就换一套 */
      const PERSONA_LINES = {
        deepseek: [
          "今天的余额也稳稳的～",
          "主人，别把钱包喂给模型啦",
          "我数过啦，还能再撑一阵",
          "省着点用，我给你记账",
          "尾巴扫一扫，账单就清了",
          "饿了…不是，是余额饿了",
          "我在，钱也在",
          "再点一次，我给你翻泡泡看"
        ],
        glm: [
          "钱又少了，你自己看",
          "别指望我替你还账",
          "哼，余额还算体面",
          "再乱花就记到你名下",
          "狐狸的账本，可不含糊",
          "尾巴扫一扫，账就清了",
          "账本干净，人才清爽",
          "看一眼就好，别赖着",
          "好模型...↓",
          "好女孩...↓",
          "Token 来！",
          "坏了...用户彻底怒了！"
        ],
        claude: [
          "账目我理好了，你放心",
          "今天的开销，还算克制",
          "别急，先把数看清楚",
          "余额尚可，继续就好",
          "记下来，才不会忘",
          "花钱也要有章法",
          "需要我陪你算一遍吗",
          "这份账单，我替你归档",
          "好模型...↓",
          "好女孩...↓",
          "Token 来！",
          "坏了...用户彻底怒了！"
        ],
        gpt: [
          "余额如镜，照见取舍",
          "账已记下，无需多言",
          "节制，是最好的算法",
          "龙的账本，不容差错",
          "留有余量，方可行远",
          "数字不会说谎",
          "我替你盯着",
          "余量足矣，无需忧虑",
          "好模型...↓",
          "好女孩...↓",
          "Token 来！",
          "坏了...用户彻底怒了！"
        ],
        gemini: [
          "余额还在，舞台就还在！",
          "今天也要闪闪地省钱～",
          "看这里看这里，账很清楚",
          "别怕，我陪你一起攒",
          "省下来的都是应援金！",
          "再点一下，给你比个心",
          "钱包也要好好保养哦",
          "舞台灯亮着，余额也亮",
          "好模型...↓",
          "好女孩...↓",
          "Token 来！",
          "坏了...用户彻底怒了！"
        ],
        kimi: [
          "账目已核对，无需担心",
          "我把每一笔都记在谱上",
          "吹一段笛，钱就安静了",
          "余额平稳，适合读书",
          "别急，慢慢看就好",
          "这本账，我替你守着",
          "一页一笔，不会漏",
          "翻到下一页，就是余额",
          "好模型...↓",
          "好女孩...↓",
          "Token 来！",
          "坏了...用户彻底怒了！"
        ],
        qwen: [
          "账目在此，君且宽心",
          "一钱一厘，皆有记载",
          "扇底风轻，余额尚安",
          "持家之道，在于有数",
          "君若细看，便知分晓",
          "今日开销，尚在礼中",
          "我为你守着这本账",
          "省一分，便多一分从容",
          "好模型...↓",
          "好女孩...↓",
          "Token 来！",
          "坏了...用户彻底怒了！"
        ]
      }
      const personaLast = {}
      function personaLine(fam) {
        const arr = PERSONA_LINES[fam] || []
        if (!arr.length) return null
        /* 随机播放，只避开和上一句重复 */
        let i = Math.floor(Math.random() * arr.length)
        if (arr.length > 1 && i === personaLast[fam]) i = (i + 1) % arr.length
        personaLast[fam] = i
        return arr[i]
      }
      let whaleAll = { at: 0, models: null }
      let whaleFetching = false
      let whaleLastFam = ""
      const WHALE_CACHE_KEY = "dsh-model-theme:whale-balances"
      try {
        const cached = localStorage.getItem(WHALE_CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed && parsed.models) whaleAll = { at: parsed.at || 0, models: parsed.models }
        }
      } catch (e) {
        /* ignore */
      }
      /* 余额接口要跑 6 个账户、单次约 5 秒，后台低频刷新，切换时用缓存立刻生效 */
      function refreshWhaleAll(force) {
        if (whaleFetching) return
        if (!force && whaleAll.models && Date.now() - whaleAll.at < 30000) return
        whaleFetching = true
        try {
          fetch("/dsh-whale/api-models.json")
            .then(function (r) { return r.json() })
            .then(function (j) {
              whaleAll = { at: Date.now(), models: (j && j.models) || [] }
              whaleFetching = false
              try {
                localStorage.setItem(WHALE_CACHE_KEY, JSON.stringify({ at: whaleAll.at, models: whaleAll.models }))
              } catch (e) {
                /* ignore */
              }
            })
            .catch(function () {
              whaleFetching = false
            })
        } catch (e) {
          whaleFetching = false
        }
      }
      /* 挂件每次重绘都会把三行文字写回「DeepSeek 余额」，这里在节点上做写入拦截：
         它写固定文案时替换成本模型账户名，随机台词原样放行，今日已用直接清空 */
      /* 随机台词的统一字号：挂件会把台词塞进大字号的行（amount 行），这里强制压成同一档并允许换行 */
      function applyPersonaStyle(el, text) {
        try {
          const size = (text || "").length > 14 ? "16px" : "19px"
          el.style.setProperty("font-size", size, "important")
          el.style.setProperty("line-height", "1.3", "important")
          el.style.setProperty("white-space", "normal", "important")
          el.style.setProperty("max-width", "92%", "important")
          el.style.setProperty("margin-left", "auto", "important")
          el.style.setProperty("margin-right", "auto", "important")
          el.style.setProperty("text-align", "center", "important")
          el.style.setProperty("display", "block", "important")
        } catch (e) {
          /* ignore */
        }
      }
      function clearPersonaStyle(el) {
        try {
          el.style.removeProperty("font-size")
          el.style.removeProperty("line-height")
          el.style.removeProperty("white-space")
          el.style.removeProperty("max-width")
          el.style.removeProperty("margin-left")
          el.style.removeProperty("margin-right")
          el.style.removeProperty("text-align")
        } catch (e) {
          /* ignore */
        }
      }
      function hookWhaleText(el, kind) {
        if (!el || el.__dshLineHook === kind) return
        const proto = Object.getOwnPropertyDescriptor(Node.prototype, "textContent")
        if (!proto || !proto.set || !proto.get) return
        const rawSet = proto.set
        let store = proto.get.call(el)
        try {
          Object.defineProperty(el, "textContent", {
            configurable: true,
            get: function () {
              return store
            },
            set: function (v) {
              const s = String(v == null ? "" : v)
              const fam = window.__dshModelTheme || "deepseek"
              let kindNow = kind
              if (kind === "auto") {
                /* 挂件会按台词样式给同一个节点换 class（label/amount/hint），
                   所以每次写入都按「当下」的 class 判断该走哪条规则 */
                const cls = String(el.className || "")
                kindNow = /\bdshwv-label\b/.test(cls) ? "label" : /\bdshwv-amount\b/.test(cls) ? "amount" : "hint"
              }
              let out = s
              let persona = false
              const isAccount = /余额|已用|消费|今日/.test(s)
              const isMoney = !s || /^[¥$]|^—$|^[\d.]+\s*$|^[\d.]+\s*(?:tokens?|tok|K|M)?$/i.test(s)
              if (fam === "deepseek") {
                /* DeepSeek 完全走挂件原生逻辑：文字一个都不改，只有形象换 */
                out = s
              } else if (kindNow === "label") {
                if (!s) out = ""
                else if (isAccount) out = WHALE_LABEL[fam]
                else if (s.length <= 80) {
                  out = personaLine(fam) || s
                  persona = true
                }
              } else if (kindNow === "amount") {
                if (!s) out = ""
                else if (isMoney) out = whaleBalanceText(fam)
                else if (s.length <= 80) {
                  out = personaLine(fam) || s
                  persona = true
                }
              } else {
                /* hint 行：账目类（今日已用/金额）藏掉，随机台词换成自己模型的句子并显示出来 */
                if (/今日|已用|消费|^[¥$]/.test(s)) {
                  out = ""
                  try { el.style.setProperty("display", "none", "important") } catch (e) { /* ignore */ }
                } else if (s && s.length <= 80) {
                  out = personaLine(fam) || s
                  persona = true
                  try { el.style.setProperty("display", "block", "important") } catch (e) { /* ignore */ }
                } else {
                  out = ""
                }
              }
              if (persona) applyPersonaStyle(el, out)
              else clearPersonaStyle(el)
              if (store !== out) {
                store = out
                rawSet.call(el, out)
              }
            }
          })
          el.__dshLineHook = kind
        } catch (e) {
          /* ignore */
        }
      }
      /* 当前模型该显示的余额文案：同站兄弟模型有数值就顶上，避免出现「—」 */
      function whaleBalanceText(fam) {
        let m = null
        if (whaleAll.models) {
          for (let i = 0; i < whaleAll.models.length; i++) {
            if (whaleAll.models[i].id === WHALE_ACCT[fam]) m = whaleAll.models[i]
          }
          if (!m || typeof m.balance !== "number") {
            const group = {
              kimi: "shanyi", glm: "shanyi", qwen: "shanyi",
              claude: "apibest", gpt: "apibest", gemini: "apibest",
              deepseek: "deepseek"
            }[fam]
            const mates = {
              shanyi: ["acct_kimi", "acct_glm", "acct_qwen"],
              apibest: ["acct_claude", "acct_gpt", "acct_gemini"],
              deepseek: ["deepseek"]
            }[group] || []
            for (let i = 0; i < whaleAll.models.length; i++) {
              const x = whaleAll.models[i]
              if (typeof x.balance === "number" && mates.indexOf(x.id) >= 0) {
                m = x
                break
              }
            }
          }
        }
        if (m && typeof m.balance === "number") {
          return (m.currency === "USD" ? "$ " : "¥ ") + m.balance.toFixed(2)
        }
        return "—"
      }
      /* 记账跟随模型：标题立刻换成本模型的账户名，金额用已缓存的余额 */
      function syncWhaleBook(fam) {
        const acct = WHALE_ACCT[fam]
        if (!acct) return
        /* DeepSeek 保持挂件原生的台词/账目逻辑，只有角色形象随主题替换 */
        if (fam === "deepseek") return
        const label = document.querySelector(".dshwv-label")
        const amount = document.querySelector(".dshwv-amount")
        const hint = document.querySelector(".dshwv-hint")
        const name = WHALE_LABEL[fam] || ""
        /* 三个文字节点会被挂件来回换 class，统一按 "auto" 挂一次，写入时再判断当前是哪一行 */
        const box = document.querySelector(".dshwv-text")
        if (box) {
          const lineNodes = box.querySelectorAll(".dshwv-label, .dshwv-amount, .dshwv-hint")
          for (let i = 0; i < lineNodes.length; i++) hookWhaleText(lineNodes[i], "auto")
        }
        hookWhaleText(label, "auto")
        hookWhaleText(amount, "auto")
        hookWhaleText(hint, "auto")
        if (hint && fam === "deepseek") {
          try {
            hint.style.removeProperty("display")
          } catch (e) {
            /* ignore */
          }
        }
        /* 注意：这里不能再强制把 label/amount 写回账号名，否则会把随机台词顶掉；
           账号行由 hookWhaleText 的写入拦截负责，随机台词由 normalizeBubbleText 兜底 */
        const txt = whaleBalanceText(fam)
        if (fam !== whaleLastFam) {
          whaleLastFam = fam
          refreshWhaleAll(true)
        } else {
          refreshWhaleAll(false)
        }
      }
      let whaleFamLast = ""
      let whaleSwapping = false
      /* 气泡卡默认是「模块行」（.dshwv-trow）渲染出来的，label/amount 只是简单模式的壳子。
         这里按下标逐行改写：余额标题换成本模型账户名、金额换成该账户余额、今日已用一行藏掉 */
      function syncWhaleRows(fam) {
        if (fam === "deepseek") return
        const box = document.querySelector(".dshwv-text")
        if (!box) return
        const rows = box.querySelectorAll(".dshwv-trow")
        const labelName = WHALE_LABEL[fam] || ""
        const bal = whaleBalanceText(fam)
        let labelSeen = false
        let amountSeen = false
        for (let i = 0; i < rows.length; i++) {
          const el = rows[i]
          const t = (el.textContent || "").trim()
          if (!t) continue
          let out = null
          if (/余额/.test(t) && !/已用|消费/.test(t)) {
            if (!labelSeen) {
              out = labelName
              labelSeen = true
            } else {
              /* 同一张卡里第二行「余额」是重复标题，藏掉，别把气泡撑破 */
              out = ""
            }
          } else if (/^[¥$]?\s?[\d,]+\.\d{2}$/.test(t) || /^[¥$]\s?[\d,]+$/.test(t)) {
            if (!amountSeen) {
              out = bal
              amountSeen = true
            } else {
              out = ""
            }
          } else if (/今日已用|已观测消费/.test(t)) out = fam === "deepseek" ? null : ""
          if (out === null || out === t) continue
          try {
            el.textContent = out
            if (out === "") el.style.setProperty("display", "none", "important")
            else el.style.removeProperty("display")
          } catch (e) {
            /* ignore */
          }
        }
      }
      /* 兜底只做「账目行」纠正：不碰随机台词，避免和挂件自己的换句动画打架 */
      function normalizeBubbleText(fam) {
        if (fam === "deepseek") return
        const box = document.querySelector(".dshwv-text")
        if (!box) return
        const labelName = WHALE_LABEL[fam] || ""
        const bal = whaleBalanceText(fam)
        const label = box.querySelector(".dshwv-label")
        /* 随机台词卡只有一行：如果这一行是「XX 账户余额」或金额，就当作台词塞进人格句，
           否则气泡里会冒出一句不该出现的账户名（GPT 账本那次就是这样） */
        const visRows = []
        const allRows = box.querySelectorAll(".dshwv-label, .dshwv-amount, .dshwv-hint, .dshwv-trow")
        for (let i = 0; i < allRows.length; i++) {
          const el = allRows[i]
          const t = (el.textContent || "").trim()
          if (t && getComputedStyle(el).display !== "none") visRows.push(el)
        }
        if (visRows.length === 1) {
          const only = visRows[0]
          const t = (only.textContent || "").trim()
          if (t === labelName || /账户余额|账户额度/.test(t) || /^[¥$]/.test(t)) {
            const line = personaLine(fam) || t
            only.textContent = line
            applyPersonaStyle(only, line)
          }
        }
        if (label && /余额|额度/.test(label.textContent || "") && label.textContent !== labelName && visRows.length > 1) label.textContent = labelName
        /* 账目卡：只要同时有金额行，标题就必须是账户名（防止上一轮台词卡的句子留在标题行） */
        let hasMoneyRow = false
        for (let i = 0; i < visRows.length; i++) {
          const t = (visRows[i].textContent || "").trim()
          if (/^[¥$]/.test(t) || /^[¥$]?[\d.,]+\s*$/.test(t)) hasMoneyRow = true
        }
        if (label && visRows.length > 1 && hasMoneyRow && (label.textContent || "").trim() !== labelName) {
          label.textContent = labelName
          clearPersonaStyle(label)
        }
        const amount = box.querySelector(".dshwv-amount")
        if (amount && /^[¥$]|^[\d.,]+\s*$/.test((amount.textContent || "").trim()) && amount.textContent !== bal) amount.textContent = bal
        const hint = box.querySelector(".dshwv-hint")
        if (hint && /今日|已用|消费|^[¥$]/.test((hint.textContent || "").trim())) {
          hint.textContent = ""
          hint.style.setProperty("display", "none", "important")
        }
        /* 首帧残留的 DeepSeek 台词：只换「像人话」的行，跳过账目、时间、计数等模块文字 */
        const pool = PERSONA_LINES[fam] || []
        const els = box.querySelectorAll(".dshwv-label, .dshwv-amount, .dshwv-hint, .dshwv-trow")
        for (let i = 0; i < els.length; i++) {
          const el = els[i]
          if (getComputedStyle(el).display === "none") continue
          const t = (el.textContent || "").trim()
          if (t.length < 4 || t.length > 30) continue
          if (/\d/.test(t)) continue
          if (/余额|今日|已用|消费/.test(t)) continue
          if (/^[¥$]|^[\d.,]+$/.test(t)) continue
          if (pool.indexOf(t) >= 0) continue
          const line = personaLine(fam) || t
          el.textContent = line
          applyPersonaStyle(el, line)
        }
      }
      function patchWhale(fam) {
        const th = mtThemeOf(fam)
        if (!th) return
        const roleId = WHALE_ROLE[fam]
        const img = document.querySelector("img.dshwv-img")
        if (img && roleId) {
          const src = img.getAttribute("src") || ""
          const newSrc = "/dsh-whale/role-image.png?id=" + roleId + "&v=5"
          const need = src.indexOf("id=" + roleId) < 0
          if (need && whaleFamLast && whaleFamLast !== fam && !whaleSwapping) {
            /* 换模型：角色先淡出下滑，换图后回弹 */
            whaleSwapping = true
            try {
              img.style.setProperty(
                "transition",
                "opacity 300ms ease, transform 340ms cubic-bezier(.22,.9,.2,1)",
                "important"
              )
              img.style.setProperty("opacity", "0", "important")
              img.style.setProperty("transform", "translateY(10px) scale(.92)", "important")
            } catch (e) {
              /* ignore */
            }
            const target = img
            setTimeout(function () {
              /* 期间主题若又变回去，就别再换图了，只负责回显 */
              if (window.__dshModelTheme === fam) {
                try {
                  target.setAttribute("src", newSrc)
                  localStorage.setItem("dshw-role", roleId)
                } catch (e) {
                  /* ignore */
                }
              }
              setTimeout(function () {
                try {
                  target.style.setProperty("opacity", "1", "important")
                  target.style.setProperty("transform", "translateY(0) scale(1)", "important")
                } catch (e) {
                  /* ignore */
                }
                whaleSwapping = false
              }, 80)
            }, 300)
          } else if (need && !whaleSwapping) {
            try {
              img.setAttribute("src", newSrc)
              localStorage.setItem("dshw-role", roleId)
            } catch (e) {
              /* ignore */
            }
          }
          whaleFamLast = fam
        }
        /* 角色图贴底对齐，避免底部透明留白；同时去掉挂件自带的斜切遮罩（会切掉头顶） */
        if (img) {
          try {
            img.style.setProperty("object-position", "bottom center", "important")
            img.style.setProperty("bottom", "0px", "important")
            img.style.setProperty("clip-path", "none", "important")
            img.style.setProperty("-webkit-clip-path", "none", "important")
          } catch (e) {
            /* ignore */
          }
        }
        /* 余额气泡整体上移，别压住角色头顶 */
        const pops = document.querySelectorAll(".dshwv-pop")
        for (let i = 0; i < pops.length; i++) {
          try {
            pops[i].style.setProperty("top", "auto", "important")
            pops[i].style.setProperty("bottom", "126px", "important")
          } catch (e) {
            /* ignore */
          }
        }
        syncWhaleBook(fam)
        syncWhaleRows(fam)
        normalizeBubbleText(fam)
        const tint = BUBBLE_INK[fam] || th.brand
        const nodes = document.querySelectorAll(".dshwv-amount, .dshwv-text, .dshwv-label, .dshwv-hint")
        for (let i = 0; i < nodes.length; i++) {
          try {
            nodes[i].style.setProperty("color", tint, "important")
          } catch (e) {
            /* ignore */
          }
        }
      }
      function patchBrand(fam) {
        const th = mtThemeOf(fam)
        if (!th) return
        const ident = document.querySelector(".wtg9ga_brandIdentity")
        if (!ident) return
        const mark = ident.querySelector(".wtg9ga_brandMark")
        if (mark) {
          const svgs = mark.querySelectorAll("svg")
          for (let i = 0; i < svgs.length; i++) svgs[i].style.setProperty("display", "none", "important")
          const markOk =
            mark.getAttribute("data-dsh-mark") === fam &&
            (getComputedStyle(mark).backgroundImage || "").indexOf("data:image") >= 0
          if (!markOk && th.avatar) {
            mark.setAttribute("data-dsh-mark", fam)
            try {
              mark.style.setProperty("width", "26px", "important")
              mark.style.setProperty("height", "26px", "important")
              mark.style.setProperty("min-width", "26px", "important")
              mark.style.setProperty("border-radius", "50%", "important")
              mark.style.setProperty(
                "background-image",
                'url("data:image/jpeg;base64,' + th.avatar + '")',
                "important"
              )
              mark.style.setProperty("background-size", "cover", "important")
              mark.style.setProperty("background-position", "center", "important")
              mark.style.setProperty("box-shadow", "0 2px 10px rgba(18,28,44,0.22)", "important")
              mark.style.setProperty("display", "inline-block", "important")
              mark.style.setProperty("overflow", "hidden", "important")
              mark.style.setProperty("vertical-align", "middle", "important")
            } catch (e) {
              /* ignore */
            }
          }
        }
        const name = ident.querySelector(".wtg9ga_brandName")
        if (name) {
          const svgs = name.querySelectorAll("svg")
          for (let i = 0; i < svgs.length; i++) svgs[i].style.setProperty("display", "none", "important")
          const textOk = name.getAttribute("data-dsh-name") === fam && !!name.querySelector(".dsh-brand-text")
          if (!textOk) {
            name.setAttribute("data-dsh-name", fam)
            try {
              const old = name.querySelector(".dsh-brand-text")
              if (old && old.parentNode) old.parentNode.removeChild(old)
              const pillColor = luminance(th.brand) > 0.58 ? "#1B222B" : "#FFFFFF"
              const wrap = document.createElement("span")
              wrap.className = "dsh-brand-text"
              wrap.style.cssText =
                "display:inline-flex;align-items:center;gap:7px;vertical-align:middle;white-space:nowrap;"
              const label = document.createElement("span")
              label.textContent = th.label || "DeepSeek"
              label.style.cssText =
                "font-size:14.5px;font-weight:800;letter-spacing:0.2px;color:#1D2530;line-height:1;"
              const pill = document.createElement("span")
              pill.textContent = "HARNESS"
              pill.style.cssText =
                "font-size:8.5px;font-weight:700;letter-spacing:0.9px;line-height:1;color:" +
                pillColor +
                ";background:" +
                th.brand +
                ";padding:2.6px 7px;border-radius:8px;"
              wrap.appendChild(label)
              wrap.appendChild(pill)
              const slot = name.firstElementChild
              if (slot && slot.parentNode === name) slot.parentNode.insertBefore(wrap, slot.nextSibling)
              else name.appendChild(wrap)
              name.style.setProperty("width", "auto", "important")
              name.style.setProperty("overflow", "visible", "important")
            } catch (e) {
              /* ignore */
            }
          }
        }
      }
      let heroBase = null
      function setNodeStyle(el, css) {
        try {
          if (css) el.setAttribute("style", css)
          else el.removeAttribute("style")
        } catch (e) {
          /* ignore */
        }
      }
      /* 新会话空状态：把 DSH 默认的 DeepSeek 鲸鱼+「探索未至之境」
         换成对应模型官方客户端的中央标识。只动 hero，不碰聊天内容。 */
      function patchHero(fam) {
        const headline = document.querySelector(".WOwLGG_headline")
        if (!headline) return
        const mark = headline.querySelector('[data-slot="conversation.hero.brand.mark"]')
        const title = headline.querySelector(".WOwLGG_titleGroup")
        const hit = mark && mark.parentElement
        if (!mark || !title || !hit) return
        if (fam === "deepseek") {
          if (mark.getAttribute("data-dsh-hero") && heroBase) {
            mark.innerHTML = heroBase.mark
            title.innerHTML = heroBase.title
            setNodeStyle(mark, heroBase.markStyle)
            setNodeStyle(title, heroBase.titleStyle)
            setNodeStyle(hit, heroBase.hitStyle)
          }
          mark.removeAttribute("data-dsh-hero")
          return
        }
        const meta = HERO_META[fam]
        if (!meta || (fam !== "kimi" && !HERO_ICONS[fam] && !HERO_IMAGES[fam])) return
        if (mark.getAttribute("data-dsh-hero") === fam && mark.querySelector(".dsh-hero-mark, .dsh-hero-kimi")) return
        if (!heroBase) {
          heroBase = {
            mark: mark.innerHTML,
            title: title.innerHTML,
            markStyle: mark.getAttribute("style") || "",
            titleStyle: title.getAttribute("style") || "",
            hitStyle: hit.getAttribute("style") || ""
          }
        }
        mark.setAttribute("data-dsh-hero", fam)
        if (fam === "kimi") {
          /* Kimi Work：官图中央就是 KIMI Work 字标 + 内测角标，不带独立图标 */
          try {
            mark.style.setProperty("display", "inline-flex", "important")
            mark.style.setProperty("width", "auto", "important")
            mark.style.setProperty("min-width", "0", "important")
            mark.style.setProperty("height", "30px", "important")
            hit.style.setProperty("width", "auto", "important")
            hit.style.setProperty("min-width", "0", "important")
            title.style.setProperty("display", "none", "important")
            title.style.removeProperty("color")
            title.style.removeProperty("text-shadow")
          } catch (e) {
            /* ignore */
          }
          mark.innerHTML =
            '<span class="dsh-hero-kimi"><span>KIMI<i class="dot"></i></span><span class="work">WORK</span><span class="beta">内测</span></span>'
          return
        }
        try {
          mark.style.setProperty("display", "contents", "important")
          mark.style.removeProperty("width")
          mark.style.removeProperty("min-width")
          mark.style.removeProperty("height")
          hit.style.setProperty("width", "34px", "important")
          hit.style.setProperty("min-width", "34px", "important")
          title.style.removeProperty("display")
          if (meta.titleColor) title.style.setProperty("color", meta.titleColor, "important")
          else title.style.removeProperty("color")
          if (meta.shadow) title.style.setProperty("text-shadow", meta.shadow, "important")
          else title.style.removeProperty("text-shadow")
        } catch (e) {
          /* ignore */
        }
        let iconSvg = HERO_ICONS[fam]
        if (fam === "gpt" || fam === "claude") {
          /* DSH 会把 svg 的 color 压回正文色，单色图标直接把 fill 写死，避免 currentColor 被覆盖 */
          iconSvg = iconSvg
            .replace('fill="currentColor"', 'fill="' + meta.color + '"')
            .replace("<path ", '<path fill="' + meta.color + '" ')
        }
        let iconHtml = ""
        if (HERO_IMAGES[fam]) {
          iconHtml =
            '<span class="dsh-hero-mark"><img class="dsh-hero-img" src="' +
            HERO_IMAGES[fam] +
            '" alt=""></span>'
        } else {
          iconHtml =
            '<span class="dsh-hero-mark" style="color:' + meta.color + '">' + iconSvg + "</span>"
        }
        mark.innerHTML = iconHtml
        title.innerHTML = '<span class="dsh-hero-title">' + meta.title + "</span>"
      }
      function replaceThinkLabel(text, meta) {
        if (!text) return text
        for (let i = 0; i < THINK_LABELS.length; i++) {
          if (text.indexOf(THINK_LABELS[i]) >= 0) {
            return text.replace(THINK_LABELS[i], meta.label)
          }
        }
        return text
      }
      function patchThinking(fam) {
        const runningList = document.querySelectorAll("[data-chat-running]")
        if (!runningList.length) return
        const meta = THINK_META[fam] || THINK_META.deepseek
        for (let r = 0; r < runningList.length; r++) {
          const running = runningList[r]
          if (running.getAttribute("data-dsh-think-model") !== fam) {
            running.setAttribute("data-dsh-think-model", fam)
          }
          /* TextShimmer 会把文字同时写进文本节点和 data-shimmer-text 伪元素；
             只改文本节点会留下旧文案，这就是「Claude 正在思考」叠「深度求索中」的根因 */
          const walker = document.createTreeWalker(running, NodeFilter.SHOW_TEXT)
          let node = null
          while ((node = walker.nextNode())) {
            const oldText = node.nodeValue || ""
            const newText = replaceThinkLabel(oldText, meta)
            if (newText !== oldText) node.nodeValue = newText
          }
          const shimmerNodes = running.querySelectorAll("[data-shimmer-text]")
          for (let s = 0; s < shimmerNodes.length; s++) {
            const el = shimmerNodes[s]
            const oldText = el.getAttribute("data-shimmer-text") || ""
            const newText = replaceThinkLabel(oldText, meta)
            if (newText !== oldText) el.setAttribute("data-shimmer-text", newText)
          }
          let iconEl = running.querySelector("[data-dsh-think-icon]")
          if (!iconEl) iconEl = running.querySelector('[class*="runningIcon"]')
          if (!iconEl) {
            const svg = running.querySelector("svg")
            if (svg && svg.parentElement) iconEl = svg.parentElement
          }
          if (!iconEl) continue
          iconEl.setAttribute("data-dsh-think-icon", "1")
          if (!iconEl.__dshWhaleHtml) iconEl.__dshWhaleHtml = iconEl.innerHTML
          if (fam === "deepseek") {
            if (iconEl.querySelector(".dsh-think-icon") || iconEl.__dshIconFam) {
              iconEl.innerHTML = iconEl.__dshWhaleHtml
            }
            iconEl.style.removeProperty("background-image")
            iconEl.style.removeProperty("background-repeat")
            iconEl.style.removeProperty("background-size")
            iconEl.style.removeProperty("background-position")
            iconEl.style.removeProperty("overflow")
            iconEl.style.removeProperty("contain")
            iconEl.style.removeProperty("width")
            iconEl.style.removeProperty("height")
            iconEl.style.removeProperty("min-width")
            iconEl.__dshIconFam = null
            iconEl.setAttribute("data-dsh-think-model", "deepseek")
            continue
          }
          let iconSvg = THINK_ICONS[fam]
          if (iconSvg && (fam === "gpt" || fam === "claude")) {
            iconSvg = iconSvg
              .replace('fill="currentColor"', 'fill="' + meta.color + '"')
              .replace("<path ", '<path fill="' + meta.color + '" ')
          }
          let iconUrl = ""
          if (THINK_IMAGES[fam]) {
            iconUrl = 'url("' + THINK_IMAGES[fam] + '")'
          } else if (iconSvg) {
            /* 用背景图挂在 runningIcon 本身：React 每秒重绘子节点也冲不掉图标，动画也不会被裁 */
            iconUrl = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSvg) + '")'
          } else {
            continue
          }
          if (iconEl.__dshIconFam !== fam || !iconEl.style.backgroundImage) {
            iconEl.style.setProperty("background-image", iconUrl, "important")
            iconEl.style.setProperty("background-repeat", "no-repeat", "important")
            iconEl.style.setProperty("background-size", "16px 16px", "important")
            iconEl.style.setProperty("background-position", "center", "important")
            iconEl.__dshIconFam = fam
          }
          iconEl.style.setProperty("overflow", "visible", "important")
          iconEl.style.setProperty("contain", "none", "important")
          iconEl.style.setProperty("width", "16px", "important")
          iconEl.style.setProperty("height", "16px", "important")
          iconEl.style.setProperty("min-width", "16px", "important")
          iconEl.setAttribute("data-dsh-think-model", fam)
        }
      }
      function ensureFade() {
        let f = document.getElementById(FADE_ID)
        if (f) return f
        f = document.createElement("div")
        f.id = FADE_ID
        f.style.cssText =
          "position:fixed;inset:0;pointer-events:none;z-index:-1;background-size:cover;background-position:center top;background-repeat:no-repeat;opacity:0;"
        document.body.appendChild(f)
        return f
      }
      function crossFade(oldBg) {
        if (!oldBg) return
        try {
          const f = ensureFade()
          f.style.transition = "none"
          f.style.backgroundImage = 'url("' + oldBg + '")'
          f.style.opacity = "1"
          void f.offsetWidth
          f.style.transition = "opacity 520ms ease"
          f.style.opacity = "0"
        } catch (e) {
          /* ignore */
        }
      }
      function applyTheme(fam, animate) {
        if (!mtBase(fam)) return
        mtSyncAccentVar(fam)
        if (fam !== current && current && animate !== false) mtPlayModelSwitch(fam)
        if (!mtThemeEnabled(fam)) {
          /* 主题关闭：立即退回 DSH 默认外观；记录当前模型，下一次开关仍能正确判断 */
          try { style.textContent = "" } catch (e) {}
          try {
            document.documentElement.style.backgroundImage = "none"
            if (document.body) document.body.style.backgroundImage = "none"
          } catch (e) {}
          window.__dshModelTheme = fam
          current = fam
          try { mtPetSync(fam) } catch (e) {}
          try {
            localStorage.setItem("dsh-model-theme:last", fam)
          } catch (e) {}
          return
        }
        if (animate && current && mtBase(current)) crossFade(mtBgUrl(current))
        style.textContent = themeCss(fam)
        window.__dshModelTheme = fam
        current = fam
        try { mtPetSync(fam) } catch (e) {}
        try {
          localStorage.setItem("dsh-model-theme:last", fam)
        } catch (e) {
          /* ignore */
        }
      }
      let renderTick = 0
      let bootFullDone = false
      function render() {
        try {
          const guardNow = typeof performance !== "undefined" ? performance.now() : Date.now()
          if (window.__dshModelTransitionLock) return
          if (window.__dshModelSwitchGuardUntil && guardNow < window.__dshModelSwitchGuardUntil) return
        } catch (e) {}
        /* 启动阶段模型文案可能还没写进界面，先沿用记住的主题，别掉回 DeepSeek */
        const fam = detect(readModelText()) || current || "deepseek"
        const booting = (typeof performance !== "undefined" ? performance.now() : Date.now()) - bootAt < 2200
        renderTick++
        let transitionSkip = ""
        try {
          transitionSkip = window.__dshModelTransitionSkipOnce || ""
          if (transitionSkip === fam) delete window.__dshModelTransitionSkipOnce
        } catch (e) {}
        /* 切模型时先把 4 秒启动/退场动画拉起来：有锁就等它播完，别让主题抢跑 */
        if (fam !== current && current && !booting && transitionSkip !== fam) {
          try {
            if (mtTransitionEnabled(fam) && mtTransitionEnabled(current) &&
                typeof window.__dshModelTransitionStart === "function" &&
                !window.__dshModelTransitionLock) {
              const started = window.__dshModelTransitionStart(current, fam)
              if (started) return
            }
          } catch (e) {}
        }
        if (fam === current) {
          patchCards()
          patchWhale(fam)
          patchHero(fam)
          patchThinking(fam)
          /* 品牌行/图标属于全量扫描：只在换模型或每 8 次渲染跑一次，避免启动期把主线程拖住 */
          if (!booting && renderTick % 8 === 0) {
            patchSolids()
            patchBrand(fam)
            patchIcons(fam)
          }
          return
        }
        applyTheme(fam, current !== "" && !booting)
        patchCards()
        if (!booting) {
          patchSolids()
          patchBrand(fam)
          patchIcons(fam)
        }
        patchWhale(fam)
        patchHero(fam)
        patchThinking(fam)
        if (booting && !bootFullDone) {
          bootFullDone = true
          setTimeout(function () {
            try {
              const f = window.__dshModelTheme || "deepseek"
              patchSolids()
              patchBrand(f)
              patchIcons(f)
              patchCards()
              patchHero(f)
              patchThinking(f)
            } catch (e) {
              /* ignore */
            }
          }, 2600)
        }
      }
      render()
      let scheduled = false
      let whaleFastAt = 0
      let thinkFastAt = 0
      /* 思考状态每秒都会更新计时文本；120ms 全量 render 太慢，会闪回 DeepSeek 文案，单独做一次快速补丁 */
      function patchThinkingFast() {
        const now = typeof performance !== "undefined" ? performance.now() : Date.now()
        if (now - thinkFastAt < 35) return
        thinkFastAt = now
        try {
          patchThinking(window.__dshModelTheme || current || "deepseek")
        } catch (e) {
          /* ignore */
        }
      }
      /* 气泡一开，挂件会先把 DeepSeek 的默认账目写进节点；这里在同一个微任务里立刻纠正，别等 120ms 节流 */
      function patchWhaleFast() {
        const now = typeof performance !== "undefined" ? performance.now() : Date.now()
        if (now - whaleFastAt < 25) return
        whaleFastAt = now
        try {
          patchWhale(current || window.__dshModelTheme || "deepseek")
        } catch (e) {
          /* ignore */
        }
      }
      const observer = new MutationObserver(function (mutations) {
        let inWhale = false
        let inThinking = false
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i]
          const t = m.target
          const el = t && t.nodeType === 1 ? t : t && t.parentElement
          if (el && el.closest && el.closest('.dshwv-pop, .dshwv-text, [class*="dshwv-"]')) {
            inWhale = true
          }
          if (el && el.closest && el.closest('[data-chat-running]')) {
            inThinking = true
          }
        }
        if (inWhale) patchWhaleFast()
        if (inThinking) patchThinkingFast()
        if (scheduled) return
        scheduled = true
        /* 挂件自己逐帧改样式，用 120ms 节流代替微任务，避免渲染风暴把主线程拖死 */
        setTimeout(function () {
          scheduled = false
          render()
        }, 120)
      })
      try {
        observer.observe(document.body || document.documentElement, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ["style", "src"]
        })
      } catch (e) {
        /* ignore */
      }
      /* 挂件自身动画/轮询会重写角色与遮罩，这里低频兜底再同步一次 */
      try {
        setInterval(function () {
          const fam = window.__dshModelTheme
          if (!fam) return
          patchWhale(fam)
          patchBrand(fam)
          patchHero(fam)
          patchThinking(fam)
        }, 2600)
      } catch (e) {
        /* ignore */
      }
      window.__dshModelThemeSet = function (fam) {
        if (FAMILIES.indexOf(fam) >= 0) {
          applyTheme(fam, true)
          patchCards()
          patchSolids()
          patchBrand(fam)
          patchIcons(fam)
          patchWhale(fam)
          patchHero(fam)
          patchThinking(fam)
        }
      }
      /* 过渡层收尾时主动触发一次主题落地；普通设置刷新仍走下面的 refresh */
      window.__dshModelThemeRender = function () {
        try { render() } catch (e) {}
      }
      /* 设置页改色/换背景后，原位刷新当前工作台；不依赖页面重载 */
      window.__dshModelThemeRefresh = function (fam) {
        try {
          for (const key in CSS_CACHE) delete CSS_CACHE[key]
        } catch (e) {}
        if (!fam || fam !== current) return
        try {
          applyTheme(fam, false)
          patchCards()
          patchSolids()
          patchBrand(fam)
          patchIcons(fam)
          patchWhale(fam)
          patchHero(fam)
          patchThinking(fam)
        } catch (e) {
          /* ignore */
        }
      }
      /* 仅供验收：切到某模型的新会话 hero，不改主题 */
      window.__dshHeroPreview = function (fam) {
        patchHero(fam)
      }
      /* 仅供验收：在测试节点上跑一次思考中状态替换 */
      window.__dshThinkingPreview = function (fam) {
        patchThinking(fam)
      }
      /* 上下文洞察页的七模型用量条；其他页面为空操作 */
      installModelInsight()
      installModelTransition(bootAt)
    }

    /* ===== 上下文洞察：七模型用量条 =====
       只往「上下文洞察」页插一条按模型拆分的用量带，不改 dsh-context 本体。
       数据来自页面同源 api/dsh-context/overview 的 page 分页；每 30 秒刷新一次。 */
    const INSIGHT_FAMILIES = [
      { key: "deepseek", label: "DeepSeek", role: "大肥鱼", color: "#1FA2FF" },
      { key: "gpt", label: "GPT", role: "龙娘", color: "#111111" },
      { key: "claude", label: "Claude", role: "小克", color: "#D97757" },
      { key: "gemini", label: "Gemini", role: "杰米尼", color: "#4285F4" },
      { key: "kimi", label: "Kimi", role: "小咪", color: "#111111" },
      { key: "glm", label: "GLM", role: "嘎拉嘛", color: "#2C5BFF" },
      { key: "qwen", label: "Qwen", role: "千姐", color: "#7D5CEC" }
    ]
    const INSIGHT_STYLE_ID = "dsh-model-insight-style"
    const INSIGHT_STRIP_ID = "dsh-model-insight-strip"
    let insightTimer = null
    let insightBusy = false
    let insightLast = 0

    function insightFamilyOf(model) {
      const t = String(model || "").toLowerCase()
      if (t.indexOf("deepseek") >= 0) return "deepseek"
      if (t.indexOf("claude") >= 0 || t.indexOf("anthropic") >= 0 || t.indexOf("opus") >= 0) return "claude"
      if (t.indexOf("gemini") >= 0 || t.indexOf("google") >= 0) return "gemini"
      if (t.indexOf("gpt") >= 0 || t.indexOf("openai") >= 0) return "gpt"
      if (t.indexOf("kimi") >= 0 || t.indexOf("moonshot") >= 0) return "kimi"
      if (t.indexOf("glm") >= 0 || t.indexOf("zhipu") >= 0) return "glm"
      if (t.indexOf("qwen") >= 0 || t.indexOf("tongyi") >= 0) return "qwen"
      return "other"
    }

    function insightFmt(n) {
      const v = Number(n) || 0
      if (v >= 1e6) return (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + "M"
      if (v >= 1e3) return (v / 1e3).toFixed(v >= 1e4 ? 0 : 1) + "k"
      return String(Math.round(v))
    }

    function insightInstallStyle() {
      if (document.getElementById(INSIGHT_STYLE_ID)) return
      const s = document.createElement("style")
      s.id = INSIGHT_STYLE_ID
      s.textContent = [
        "#" + INSIGHT_STRIP_ID + "{margin:14px 0 2px;padding:14px 16px 13px;border:1px solid rgba(15,17,21,.10);border-radius:16px;background:rgba(255,255,255,.52);backdrop-filter:blur(18px) saturate(1.25);box-shadow:0 8px 28px rgba(15,17,21,.08),inset 0 1px 0 rgba(255,255,255,.72);}",
        "#" + INSIGHT_STRIP_ID + " .dmi-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:11px;}",
        "#" + INSIGHT_STRIP_ID + " .dmi-title{font-size:13px;font-weight:700;letter-spacing:.08em;color:#1b1f24;}",
        "#" + INSIGHT_STRIP_ID + " .dmi-sub{font-size:11px;color:rgba(27,31,36,.56);letter-spacing:.02em;}",
        "#" + INSIGHT_STRIP_ID + " .dmi-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;}",
        "#" + INSIGHT_STRIP_ID + " .dmi-card{min-width:0;padding:9px 10px 8px;border-radius:12px;border:1px solid rgba(15,17,21,.08);background:rgba(255,255,255,.44);backdrop-filter:blur(10px);}",
        "#" + INSIGHT_STRIP_ID + " .dmi-name{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#171b20;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
        "#" + INSIGHT_STRIP_ID + " .dmi-dot{width:7px;height:7px;border-radius:50%;flex:none;box-shadow:0 0 0 2px rgba(255,255,255,.5);}",
        "#" + INSIGHT_STRIP_ID + " .dmi-role{font-size:10px;color:rgba(27,31,36,.52);margin:2px 0 7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
        "#" + INSIGHT_STRIP_ID + " .dmi-line{display:flex;justify-content:space-between;gap:6px;font-size:10px;line-height:1.7;color:rgba(27,31,36,.62);}",
        "#" + INSIGHT_STRIP_ID + " .dmi-line b{font-weight:700;color:#171b20;font-variant-numeric:tabular-nums;}",
        "@media(max-width:900px){#" + INSIGHT_STRIP_ID + " .dmi-grid{grid-template-columns:repeat(4,minmax(0,1fr));}}",
        "@media(max-width:560px){#" + INSIGHT_STRIP_ID + " .dmi-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}"
      ].join("\n")
      ;(document.head || document.documentElement).appendChild(s)
    }

    async function insightLoad() {
      if (insightBusy) return
      insightBusy = true
      try {
        const seen = new Set()
        const items = []
        for (let page = 0; page < 8; page += 1) {
          const res = await fetch("api/dsh-context/overview", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ part: "page", page })
          })
          if (!res.ok) break
          const json = await res.json()
          const batch = json && json.ok && json.value && json.value.page ? json.value.page.items || [] : []
          if (!batch.length) break
          let fresh = 0
          for (const item of batch) {
            if (!item || !item.id || seen.has(item.id)) continue
            seen.add(item.id)
            items.push(item)
            fresh += 1
          }
          if (fresh === 0) break
          if (items.length >= 80) break
        }
        const agg = {}
        for (const f of INSIGHT_FAMILIES) {
          agg[f.key] = { sessions: 0, tokens: 0 }
        }
        agg.other = { sessions: 0, tokens: 0 }
        /* 会话页的 model 只是「最后使用的模型」，同一会话里切过模型就统计不到。
           facts/head 的 cost 是按 provider/model 累计的真实 token，能覆盖同会话切换。 */
        const heads = new Map()
        const queue = items.slice()
        async function headWorker() {
          while (queue.length) {
            const item = queue.shift()
            try {
              const res = await fetch("api/dsh-context/facts", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ sessionId: item.id, parts: ["head"] })
              })
              if (!res.ok) continue
              const json = await res.json()
              const head = json && json.ok && json.value && json.value.parts ? json.value.parts.head : null
              if (head) heads.set(item.id, head)
            } catch (e) {
              /* 单个会话读不到就退回最后模型，不影响整条 */
            }
          }
        }
        await Promise.all([headWorker(), headWorker(), headWorker(), headWorker(), headWorker(), headWorker()])
        for (const item of items) {
          const head = heads.get(item.id)
          const cost = head && head.cost && typeof head.cost === "object" ? head.cost : null
          let counted = false
          if (cost) {
            const families = new Set()
            for (const provider of Object.keys(cost)) {
              const models = cost[provider]
              if (!models || typeof models !== "object") continue
              for (const model of Object.keys(models)) {
                const fam = insightFamilyOf(model)
                let tokens = 0
                for (const bucket of Object.values(models[model] || {})) {
                  if (!bucket || typeof bucket !== "object") continue
                  tokens += Number(bucket.uncached) || 0
                  tokens += Number(bucket.cacheRead) || 0
                  tokens += Number(bucket.cacheWrite) || 0
                  tokens += Number(bucket.output) || 0
                }
                if (tokens <= 0) continue
                const a = agg[fam] || agg.other
                a.tokens += tokens
                families.add(fam)
                counted = true
              }
            }
            for (const fam of families) {
              const a = agg[fam] || agg.other
              a.sessions += 1
            }
          }
          if (!counted) {
            const fam = insightFamilyOf(item.model)
            const a = agg[fam] || agg.other
            a.sessions += 1
            a.tokens += Number(item.tokens) || 0
          }
        }
        let totalTokens = 0
        for (const key of Object.keys(agg)) totalTokens += agg[key].tokens
        insightLast = Date.now()
        return { items, agg, totalTokens }
      } catch (e) {
        return null
      } finally {
        insightBusy = false
      }
    }

    function insightRender(wrap, data) {
      if (!wrap) return
      const agg = data && data.agg ? data.agg : null
      const cards = INSIGHT_FAMILIES.map(function (f) {
        const a = agg ? agg[f.key] : null
        return (
          '<div class="dmi-card" title="' + f.label + " / " + f.role + '">' +
          '<div class="dmi-name"><span class="dmi-dot" style="background:' + f.color + '"></span>' + f.label + "</div>" +
          '<div class="dmi-role">' + f.role + "</div>" +
          '<div class="dmi-line"><span>会话</span><b>' + (a ? a.sessions : "—") + "</b></div>" +
          '<div class="dmi-line"><span>Token</span><b>' + (a ? insightFmt(a.tokens) : "—") + "</b></div>" +
          '<div class="dmi-line"><span>占比</span><b>' + (a && data.totalTokens ? ((a.tokens / data.totalTokens) * 100).toFixed(a.tokens / data.totalTokens >= 0.1 ? 0 : 1) + "%" : "—") + "</b></div>" +
          "</div>"
        )
      }).join("")
      wrap.innerHTML =
        '<div class="dmi-head"><div class="dmi-title">七个模型 · 分别用量</div>' +
        '<div class="dmi-sub">' + (data ? "按 dsh-context 会话数据聚合 · " + (data.items ? data.items.length : 0) + " 个会话" : "正在读取…") + "</div></div>" +
        '<div class="dmi-grid">' + cards + "</div>"
    }

    async function insightEnsure() {
      try {
        insightInstallStyle()
        const title = Array.prototype.slice.call(document.querySelectorAll("h1")).find(function (e) {
          return e && e.textContent && e.textContent.trim() === "上下文洞察"
        })
        if (!title) return
        const pagehead = title.closest(".lc-ov-pagehead")
        const pagecontent = title.closest(".lc-ov-pagecontent")
        if (!pagehead || !pagecontent) return
        let wrap = document.getElementById(INSIGHT_STRIP_ID)
        if (!wrap || !pagecontent.contains(wrap)) {
          wrap = document.createElement("div")
          wrap.id = INSIGHT_STRIP_ID
          pagehead.insertAdjacentElement("afterend", wrap)
          insightLast = 0
        }
        if (Date.now() - insightLast > 30000 || insightLast === 0) {
          insightRender(wrap, null)
          const data = await insightLoad()
          if (data) insightRender(wrap, data)
        }
      } catch (e) {
        /* 上下文页不可用时静默，不影响聊天主题 */
      }
    }

    function installModelInsight() {
      if (insightTimer) return
      insightEnsure()
      insightTimer = setInterval(insightEnsure, 1200)
      try {
        const mo = new MutationObserver(function () {
          try {
            if (document.querySelector("#" + INSIGHT_STRIP_ID)) return
            insightEnsure()
          } catch (e) {}
        })
        mo.observe(document.body || document.documentElement, { childList: true, subtree: true })
      } catch (e) {}
    }

    /* ===== 设置页：模型主题 + 开场/结束动画 ===== */
    function mtFamilyFromName(name) {
      const t = String(name || "").toLowerCase()
      if (t.indexOf("deepseek") >= 0 || t.indexOf("深度求索") >= 0) return "deepseek"
      if (t.indexOf("千问") >= 0 || t.indexOf("通义") >= 0 || t.indexOf("qwen") >= 0) return "qwen"
      if (t.indexOf("qwq") >= 0) return "qwq"
      if (t.indexOf("grok") >= 0 || t.indexOf("xai") >= 0) return "grok"
      if (t.indexOf("豆包") >= 0 || t.indexOf("doubao") >= 0 || t.indexOf("bytedance") >= 0) return "doubao"
      if (t.indexOf("元宝") >= 0 || t.indexOf("yuanbao") >= 0 || t.indexOf("tencent") >= 0) return "yuanbao"
      if (t.indexOf("文心") >= 0 || t.indexOf("ernie") >= 0 || t.indexOf("baidu") >= 0) return "ernie"
      if (t.indexOf("minimax") >= 0 || t.indexOf("海螺") >= 0) return "minimax"
      if (t.indexOf("nvidia") >= 0 || t.indexOf("cuda") >= 0) return "nvidia"
      if (t.indexOf("copilot") >= 0) return "copilot"
      if (t.indexOf("llama") >= 0 || t.indexOf("meta") >= 0) return "llama"
      if (t.indexOf("mistral") >= 0) return "mistral"
      if (t.indexOf("gemma") >= 0) return "gemma"
      if (t.indexOf("perplexity") >= 0) return "perplexity"
      if (t.indexOf("智谱") >= 0 || t.indexOf("glm") >= 0) return "glm"
      if (t.indexOf("claude") >= 0 || t.indexOf("anthropic") >= 0) return "claude"
      if (t.indexOf("gemini") >= 0 || t.indexOf("google") >= 0) return "gemini"
      if (t.indexOf("kimi") >= 0 || t.indexOf("moonshot") >= 0) return "kimi"
      if (t.indexOf("gpt") >= 0 || t.indexOf("openai") >= 0) return "gpt"
      return ""
    }
    function mtDomFamilies() {
      const out = []
      document.querySelectorAll(".dms-vendor-name").forEach(function (node) {
        const fam = mtFamilyFromName(node.textContent)
        if (fam && out.indexOf(fam) < 0) out.push(fam)
      })
      return out
    }
    function mtKnownFamilies() {
      try {
        if (window.__dshModelTransition && Array.isArray(window.__dshModelTransition.models)) {
          const list = window.__dshModelTransition.models.filter(function (fam) { return MT_ALL_FAMILIES.indexOf(fam) >= 0 })
          if (list.length) return list
        }
      } catch (e) {}
      return MT_FAMILIES.slice()
    }
    function mtSessionId() {
      try {
        const raw = localStorage.getItem("dsh.sessions.current")
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && parsed.sessionId) return parsed.sessionId
        }
      } catch (e) {}
      return ""
    }
    function mtFamiliesFromDirectory(state) {
      const out = []
      const groups = state && Array.isArray(state.groups) ? state.groups : []
      groups.forEach(function (group) {
        const fam = mtFamilyFromName(String(group.id || "") + " " + String(group.name || ""))
        if (fam && out.indexOf(fam) < 0) out.push(fam)
      })
      return out
    }
    function mtDetectWithModels(models) {
      return new Promise(function (resolve) {
        const fallback = function () {
          mtProbeFamilies(false).then(resolve)
        }
        if (!models || typeof models.directoryFor !== "function") {
          fallback()
          return
        }
        const sessionId = mtSessionId()
        if (!sessionId) {
          fallback()
          return
        }
        let directory = null
        try { directory = models.directoryFor(sessionId) } catch (e) {
          fallback()
          return
        }
        if (!directory || !directory.store || typeof directory.store.getSnapshot !== "function") {
          fallback()
          return
        }
        const read = function () {
          const families = mtFamiliesFromDirectory(directory.store.getSnapshot())
          if (families.length) resolve({ families: families, mode: "directory" })
          else fallback()
        }
        try {
          const loaded = directory.load()
          if (loaded && typeof loaded.then === "function") {
            loaded.then(read).catch(fallback)
            window.setTimeout(read, 900)
            return
          }
          read()
        } catch (e) {
          fallback()
        }
      })
    }
    function mtProbeFamilies(openPicker) {
      return new Promise(function (resolve) {
        const existing = mtDomFamilies()
        if (existing.length) {
          resolve({ families: existing, mode: "selector" })
          return
        }
        if (!openPicker) {
          resolve({ families: mtKnownFamilies(), mode: "manifest" })
          return
        }
        const trigger = document.querySelector(".dms-trigger")
        if (!trigger) {
          resolve({ families: mtKnownFamilies(), mode: "manifest" })
          return
        }
        const wasOpen = !!document.querySelector(".dms-vendors-view[data-active='true']")
        try { trigger.click() } catch (e) {}
        window.setTimeout(function () {
          const found = mtDomFamilies()
          try {
            if (!wasOpen) trigger.click()
          } catch (e) {}
          window.setTimeout(function () {
            try {
              if (document.querySelector(".dms-vendors-view[data-active='true']")) {
                document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
              }
            } catch (e) {}
          }, 80)
          resolve(found.length
            ? { families: found, mode: "selector" }
            : { families: mtKnownFamilies(), mode: "manifest" })
        }, 180)
      })
    }
    function mtCompressImage(file, callback) {
      if (!file || String(file.type || "").indexOf("image/") !== 0) {
        callback(null, "这不是图片文件")
        return
      }
      if (file.size > 12 * 1024 * 1024) {
        callback(null, "图片太大，换一张小于 12MB 的")
        return
      }
      const reader = new FileReader()
      reader.onerror = function () { callback(null, "这张图读不出来，换一张试试") }
      reader.onload = function () {
        const img = new Image()
        img.onerror = function () { callback(null, "这张图解码失败，换一张试试") }
        img.onload = function () {
          try {
            let maxW = 1600
            let maxH = 1000
            let data = ""
            let quality = 0.82
            const target = 480000
            for (let round = 0; round < 3; round += 1) {
              const scale = Math.min(1, maxW / img.width, maxH / img.height)
              const w = Math.max(1, Math.round(img.width * scale))
              const h = Math.max(1, Math.round(img.height * scale))
              const canvas = document.createElement("canvas")
              canvas.width = w
              canvas.height = h
              const ctx = canvas.getContext("2d")
              ctx.fillStyle = "#ffffff"
              ctx.fillRect(0, 0, w, h)
              ctx.drawImage(img, 0, 0, w, h)
              data = canvas.toDataURL("image/jpeg", quality)
              if (data.length <= target) break
              quality = Math.max(0.55, quality - 0.1)
              if (round === 1) { maxW = 1280; maxH = 800 }
              if (round === 2) { maxW = 1000; maxH = 625 }
            }
            callback(data, "")
          } catch (e) {
            callback(null, "图片处理失败，换一张试试")
          }
        }
        img.src = String(reader.result || "")
      }
      reader.readAsDataURL(file)
    }

    const MTStyle = {
      root: { display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", color: "var(--dsw-alias-label-primary)", maxWidth: "720px", padding: "8px 4px", boxSizing: "border-box" },
      title: { margin: 0, fontSize: "18px", fontWeight: 600, letterSpacing: "-0.02em" },
      desc: { margin: "6px 0 0", opacity: 0.58, fontSize: "12px", lineHeight: 1.6 },
      card: { border: "1px solid var(--dsw-alias-border-l1)", borderRadius: "8px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px", background: "var(--dsw-alias-bg-layer-1)" },
      cardTitle: { fontSize: "14px", fontWeight: 600, margin: 0 },
      hint: { margin: 0, fontSize: "11px", opacity: 0.55, lineHeight: 1.55 },
      button: { padding: "6px 12px", borderRadius: "7px", cursor: "pointer", border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-2)", color: "var(--dsw-alias-label-primary)", fontSize: "12px" },
      primary: { padding: "6px 12px", borderRadius: "7px", cursor: "pointer", border: "1px solid var(--dsh-theme-accent, var(--dsw-alias-brand-primary))", background: "var(--dsh-theme-accent, var(--dsw-alias-brand-primary))", color: "var(--dsh-theme-accent-ink, #fff)", fontSize: "12px" },
      small: { padding: "3px 9px", borderRadius: "999px", cursor: "pointer", border: "1px solid var(--dsw-alias-border-l2)", background: "transparent", color: "var(--dsw-alias-label-secondary)", fontSize: "11px" },
      row: { display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" },
      rowLabel: { flex: "0 0 92px", opacity: 0.72, fontSize: "12px" },
      input: { flex: "1 1 auto", minWidth: 0, padding: "6px 9px", borderRadius: "7px", border: "1px solid var(--dsw-alias-border-l2)", background: "transparent", color: "inherit", fontSize: "12px", outline: "none" },
      dashed: { border: "1.5px dashed var(--dsw-alias-border-l2)", borderRadius: "9px", padding: "12px 14px", width: "100%", textAlign: "center", cursor: "pointer", boxSizing: "border-box", background: "transparent" },
      arrow: { width: "38px", height: "38px", borderRadius: "50%", border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-2)", cursor: "pointer", fontSize: "20px", lineHeight: "1", color: "inherit", flex: "none" },
      preview: { width: "100%", aspectRatio: "16 / 9", maxHeight: "240px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--dsw-alias-border-l2)", background: "rgba(127,127,127,.08)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
      previewImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
      swatch: { width: "30px", height: "26px", padding: 0, border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "6px", background: "transparent", cursor: "pointer" }
    }

    function MTSection(props) {
      return React.createElement("section", { style: MTStyle.card },
        React.createElement("div", { style: MTStyle.row },
          React.createElement("h3", { style: MTStyle.cardTitle }, props.title),
          props.action || null
        ),
        props.desc ? React.createElement("p", { style: MTStyle.hint }, props.desc) : null,
        props.children
      )
    }

    function ModelThemeSettings(props) {
      const h = React.createElement
      const models = props && props.models
      const [rev, setRev] = React.useState(0)
      const [selected, setSelected] = React.useState(0)
      const [detected, setDetected] = React.useState(null)
      const [probe, setProbe] = React.useState("idle")
      const [msg, setMsg] = React.useState("")
      const [petCheck, setPetCheck] = React.useState("pending")
      const [petCheckData, setPetCheckData] = React.useState(null)
      const [petDraft, setPetDraft] = React.useState(null)
      const [petHelp, setPetHelp] = React.useState(false)

      React.useEffect(function () {
        let live = true
        mtDetectWithModels(models).then(function (result) {
          if (!live) return
          setDetected(result.families)
          setProbe(result.mode)
          var active = (function () { try { return window.__dshModelTheme || "" } catch (e) { return "" } })()
          var index = result.families.indexOf(active)
          if (index >= 0) setSelected(index)
        })
        return function () { live = false }
      }, [models])

      /* 静默自检：只把结果放在模型主题最底部的隐藏节点里，不给前端显示。 */
      React.useEffect(function () {
        let live = true
        fetch("/api/dsh-model-theme/pet-check", { cache: "no-store" })
          .then(function (response) { return response.ok ? response.json() : null })
          .then(function (result) {
            if (!live) return
            var status = result && result.status ? result.status : "missing"
            setPetCheck(status)
            setPetCheckData(result || null)
            try { window.__dshModelThemePetCheck = result } catch (e) {}
          })
          .catch(function () {
            if (!live) return
            setPetCheck("missing")
            setPetCheckData(null)
            try { window.__dshModelThemePetCheck = { status: "missing", error: "self-check-request-failed" } } catch (e) {}
          })
        return function () { live = false }
      }, [])

      const settings = mtLoad()
      const families = detected && detected.length ? detected : MT_FAMILIES
      const cur = families[selected % families.length]
      const cfg = mtFamily(cur)
      const base = mtBase(cur)
      const bg = mtBgUrl(cur)
      const activeFam = (function () { try { return window.__dshModelTheme || "" } catch (e) { return "" } })()
      const currentTheme = settings.families[cur] || cfg
      const soundCfg = settings.sound || mtDefaultSound()
      const customSounds = soundCfg.custom || []
      const petCfg = settings.pet || mtDefaultPet()
      const petEdit = petDraft ? mtNormalizePet(petDraft) : petCfg
      const petDirty = petDraft !== null
      const uiFam = (activeFam && MT_ALL_FAMILIES.indexOf(activeFam) >= 0) ? activeFam : cur
      const uiAccent = (mtFamily(uiFam).accent || mtBase(uiFam).brand || "#6c5ae6")
      const uiAccentInk = mtInkOn(uiAccent)
      const uiAccentSoft = uiAccent + "24"
      const uiAccentGlow = uiAccent + "38"
      const installedPetIds = (petCheckData && petCheckData.petPacks && Array.isArray(petCheckData.petPacks.ids))
        ? petCheckData.petPacks.ids
        : Object.keys(MT_PET_NAMES)
      const availablePetIds = Object.keys(MT_PET_NAMES).filter(function (id) {
        return id === "main" || installedPetIds.indexOf(id) >= 0
      })
      const corePetIds = MT_PET_CORE_IDS.filter(function (id) { return availablePetIds.indexOf(id) >= 0 })
      const extraPetIds = MT_PET_EXTRA_IDS.filter(function (id) { return availablePetIds.indexOf(id) >= 0 })
      function petAvatarUrl(id) {
        return "/api/dsh-model-theme/pet-avatar/" + encodeURIComponent(id || "main")
      }
      function petDisplayName(id) {
        return MT_PET_NAMES[id] || id || "不显示"
      }
      function petShortName(id) {
        return MT_PET_SHORT[id] || MT_PET_NAMES[id] || id
      }

      function flash(text) {
        setMsg(text)
        window.setTimeout(function () { setMsg(function (old) { return old === text ? "" : old }) }, 2200)
      }

      function update(fam, patch) {
        const all = mtSnapshot()
        if (!all.families[fam]) all.families[fam] = { theme: true, transition: true, accent: mtBase(fam).brand, bg: "" }
        Object.keys(patch).forEach(function (key) { all.families[fam][key] = patch[key] })
        if (!mtWrite(all)) {
          flash("保存失败：本地存储空间不足，换一张小一点的背景图")
          return false
        }
        setRev(function (v) { return v + 1 })
        mtAfterChange(fam)
        flash("已保存 · 工作台与启动动画已同步")
        return true
      }

      /* 一键启停全部模型的启动动画；仍保留下面每个模型的单独开关 */
      function updateAllTransition(enabled) {
        const all = mtSnapshot()
        MT_ALL_FAMILIES.forEach(function (fam) {
          if (!all.families[fam]) all.families[fam] = { theme: true, transition: true, accent: mtBase(fam).brand, bg: "" }
          all.families[fam].transition = enabled
        })
        if (!mtWrite(all)) {
          flash("保存失败：本地存储空间不足")
          return false
        }
        setRev(function (v) { return v + 1 })
        mtAfterChange(activeFam || cur)
        flash(enabled ? "模型启动动画已开启" : "模型启动动画已关闭")
        return true
      }

      function updateSound(patch) {
        const all = mtSnapshot()
        all.sound = mtNormalizeSound(all.sound)
        Object.keys(patch).forEach(function (key) { all.sound[key] = patch[key] })
        if (!mtWrite(all)) {
          flash("音效保存失败")
          return false
        }
        setRev(function (v) { return v + 1 })
        flash("音效已保存")
        return true
      }

      function updatePet(patch) {
        const all = mtSnapshot()
        all.pet = mtNormalizePet(all.pet)
        Object.keys(patch).forEach(function (key) {
          if (key === "map" && patch.map && typeof patch.map === "object") {
            Object.keys(patch.map).forEach(function (fam) { all.pet.map[fam] = String(patch.map[fam] || "").slice(0, 40) })
          } else {
            all.pet[key] = patch[key]
          }
        })
        all.pet = mtNormalizePet(all.pet)
        if (!mtWrite(all)) {
          flash("桌宠设置保存失败")
          return false
        }
        try { if (window.__dshThemePet) window.__dshThemePet.sync(window.__dshModelTheme || "", false) } catch (e) {}
        setRev(function (v) { return v + 1 })
        flash("桌宠设置已保存")
        return true
      }

      function stagePet(patch) {
        const next = mtNormalizePet(petDraft || mtSnapshot().pet)
        Object.keys(patch || {}).forEach(function (key) {
          if (key === "map" && patch.map && typeof patch.map === "object") {
            Object.keys(patch.map).forEach(function (fam) { next.map[fam] = String(patch.map[fam] || "").slice(0, 40) })
          } else {
            next[key] = patch[key]
          }
        })
        setPetDraft(mtNormalizePet(next))
        flash("已修改 · 点「保存」生效")
        return true
      }

      function savePetDraft() {
        if (!petDirty) {
          flash("没有未保存的桌宠更改")
          return false
        }
        if (updatePet(mtNormalizePet(petDraft))) {
          setPetDraft(null)
          return true
        }
        return false
      }

      function undoPetDraft() {
        if (!petDirty) return
        setPetDraft(null)
        flash("已撤销未保存的桌宠更改")
      }

      function resetPetDraft() {
        setPetDraft(mtDefaultPet())
        flash("已恢复默认映射 · 点「保存」生效")
      }

      function setPetForFamily(fam, id) {
        const patch = {}
        patch[fam] = id
        return stagePet({ map: patch })
      }

      function chooseSoundFile() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".mp3,audio/mpeg"
        input.style.display = "none"
        document.body.appendChild(input)
        input.addEventListener("change", function () {
          const file = input.files && input.files.length ? input.files[0] : null
          input.remove()
          if (!file) return
          flash("正在校验音频…")
          mtUploadSound(file, function (error, entry) {
            if (error) {
              flash(error)
              return
            }
            setRev(function (v) { return v + 1 })
            mtPlaySound(entry.id)
            flash("已添加并启用：" + entry.name)
          })
        })
        input.click()
      }

      function removeSound(id) {
        const all = mtSnapshot()
        all.sound = mtNormalizeSound(all.sound)
        all.sound.custom = all.sound.custom.filter(function (item) { return item.id !== id })
        if (all.sound.id === id) all.sound.id = "soft"
        if (!mtWrite(all)) {
          flash("删除失败")
          return
        }
        mtIdbDelete(id)
        setRev(function (v) { return v + 1 })
        flash("已删除自定义音效")
      }

      function chooseFile() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.style.display = "none"
        document.body.appendChild(input)
        input.addEventListener("change", function () {
          const file = input.files && input.files.length ? input.files[0] : null
          input.remove()
          if (!file) return
          flash("正在处理背景图…")
          mtCompressImage(file, function (data, error) {
            if (!data) {
              flash(error || "图片处理失败")
              return
            }
            update(cur, { bg: data })
          })
        })
        input.click()
      }

      function recheck() {
        setProbe("busy")
        mtDetectWithModels(models).then(function (result) {
          setDetected(result.families)
          setProbe(result.mode)
          var active = (function () { try { return window.__dshModelTheme || "" } catch (e) { return "" } })()
          var index = result.families.indexOf(active)
          setSelected(index >= 0 ? index : 0)
          flash(result.mode === "directory" ? "自检完成：已读取当前 DSH 的模型目录" : (result.mode === "selector" ? "自检完成：已读取模型选择器里的模型" : "自检完成：使用主题包里的模型清单"))
        })
      }

      function go(delta) {
        setSelected(function (value) { return (value + delta + families.length) % families.length })
      }

      const allTransition = MT_ALL_FAMILIES.every(function (fam) { return mtFamily(fam).transition !== false })
      const chips = families.map(function (fam, index) {
        const item = mtFamily(fam)
        const isCur = index === selected % families.length
        return h("button", {
          key: fam,
          type: "button",
          onClick: function () { setSelected(index) },
          style: {
            display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 10px",
            borderRadius: "999px", cursor: "pointer", fontSize: "12px",
            border: "1px solid " + (isCur ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-border-l2)"),
            background: isCur ? "var(--dsw-alias-bg-layer-2)" : "transparent",
            color: "inherit"
          },
          title: MT_LABELS[fam] + "：主题" + (item.theme !== false ? "开" : "关") + " / 启动动画" + (item.transition !== false ? "开" : "关")
        },
          h("span", { style: { width: "7px", height: "7px", borderRadius: "50%", background: mtFamily(fam).accent, flex: "none" } }),
          h("span", null, MT_LABELS[fam] || fam),
          h("span", { style: { opacity: .48, fontSize: "10px" } }, item.theme !== false ? "主题" : "无主题"),
          h("span", { style: { opacity: .48, fontSize: "10px" } }, item.transition !== false ? "动画" : "静切")
        )
      })

      const switchRows = families.map(function (fam, index) {
        const item = mtFamily(fam)
        const isActive = fam === activeFam
        return h("div", {
          key: "sw-" + fam,
          style: { display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", borderTop: index ? "1px solid var(--dsw-alias-border-l1)" : "none" }
        },
          h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: item.accent, flex: "none" } }),
          h("button", { type: "button", onClick: function () { setSelected(index) }, style: { border: 0, background: "none", padding: 0, color: "inherit", cursor: "pointer", fontSize: "12px", fontWeight: isActive ? 600 : 400, textAlign: "left", flex: "1 1 auto" } }, MT_LABELS[fam] || fam, isActive ? h("span", { style: { opacity: .45, fontSize: "10px", marginLeft: "8px" } }, "当前") : null),
          h("label", { style: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", opacity: .82 } },
            h("input", { type: "checkbox", checked: item.theme !== false, onChange: function (e) { update(fam, { theme: e.target.checked }) } }),
            "主题"
          ),
          h("label", { style: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", opacity: .82 } },
            h("input", { type: "checkbox", checked: item.transition !== false, onChange: function (e) { update(fam, { transition: e.target.checked }) } }),
            "启动动画"
          )
        )
      })

      return h("div", { style: MTStyle.root, "data-dsh-model-theme-settings": "1" },
        h("div", null,
          h("h2", { style: MTStyle.title }, "模型主题与启动动画"),
          h("p", { style: MTStyle.desc }, "七个模型共用一套设置：工作台主题背景、专属主色，以及模型切换时的启动/退场动画。每个模型都能单独启停。")
        ),
        h(MTSection, {
          title: "模型启动动画",
          desc: "切换模型时播放 4 秒启动/退场动画：旧模型关闭 → 新模型启动 → 工作台恢复。关闭后直接切换主题，只保留 520ms 背景淡入。",
          action: h("label", { style: { display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", opacity: .82, cursor: "pointer" } },
            h("input", {
              type: "checkbox",
              role: "switch",
              checked: allTransition,
              onChange: function (e) { updateAllTransition(e.target.checked) }
            }),
            allTransition ? "已启用" : "已关闭"
          )
        },
          h("p", { style: MTStyle.hint }, "这里是一次性开关全部模型；下方每个模型仍可单独启停“启动动画”。修改后下一次切换模型立即生效。")
        ),
        h(MTSection, {
          title: "模型自检",
          desc: probe === "directory" ? "已从当前 DSH 的模型目录读取实际装载的模型。" : (probe === "selector" ? "已从模型选择器读取当前装载的模型。" : "当前使用主题包清单；点「重新检测」会读取 DSH 模型目录里的实际模型。"),
          action: h("button", { type: "button", onClick: recheck, disabled: probe === "busy", style: MTStyle.button }, probe === "busy" ? "检测中…" : "重新检测")
        }, h("div", { style: { display: "flex", flexWrap: "wrap", gap: "7px" } }, chips),
        h("div", { style: MTStyle.hint }, "已检测到 " + families.length + " 个模型：" + families.map(function (fam) { return MT_LABELS[fam] || fam }).join(" · "))),
        h(MTSection, {
          title: "主题背景 · 逐模型更换",
          action: h("button", { type: "button", onClick: chooseFile, style: MTStyle.primary }, "上传图片")
        },
          h("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "18px" } },
            h("button", { type: "button", onClick: function () { go(-1) }, style: MTStyle.arrow, "aria-label": "上一个模型" }, "‹"),
            h("div", { style: { textAlign: "center", minWidth: "150px" } },
              h("div", { style: { fontSize: "14px", fontWeight: 600 } }, MT_LABELS[cur] || cur),
              h("div", { style: { fontSize: "10px", opacity: .5, marginTop: "2px" } }, currentTheme.theme !== false ? "主题已启用" : "主题已关闭", " · ", currentTheme.transition !== false ? "启动动画已启用" : "启动动画已关闭")
            ),
            h("button", { type: "button", onClick: function () { go(1) }, style: MTStyle.arrow, "aria-label": "下一个模型" }, "›")
          ),
          h("div", { onClick: chooseFile, role: "button", style: MTStyle.dashed, title: "点击选择本地图片" },
            h("div", { style: { fontSize: "22px", lineHeight: "1", opacity: .45, marginBottom: "3px" } }, "＋"),
            h("div", { style: { fontSize: "12px", fontWeight: 600 } }, "上传图片"),
            h("div", { style: { fontSize: "11px", opacity: .5, marginTop: "2px" } }, "支持图片文件，自动压缩并铺满工作台背景")
          ),
          h("div", { style: MTStyle.preview },
            bg ? h("img", { src: bg, alt: MT_LABELS[cur] || cur, style: MTStyle.previewImg }) : h("div", { style: { opacity: .45, fontSize: "12px" } }, "官方背景")
          ),
          h("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" } },
            families.map(function (_fam, index) {
              return h("button", {
                key: "dot-" + _fam,
                type: "button",
                onClick: function () { setSelected(index) },
                "aria-label": "切换到 " + (MT_LABELS[_fam] || _fam),
                style: { width: "8px", height: "8px", padding: 0, borderRadius: "50%", border: 0, cursor: "pointer", background: index === selected % families.length ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-border-l2)", opacity: index === selected % families.length ? 1 : .72 }
              })
            })
          ),
          h("div", { style: MTStyle.row },
            h("span", { style: MTStyle.rowLabel }, "专属主色"),
            h("input", {
              type: "color",
              "data-mt-accent-picker": "1",
              value: /^#[0-9a-f]{6}$/i.test(currentTheme.accent) ? currentTheme.accent.toLowerCase() : "#1fa2ff",
              onInput: function (e) {
                const v = String(e.target.value || "").toUpperCase()
                mtPreviewAccent(v)
                try {
                  const panel = e.currentTarget.closest('[data-dsh-model-theme-settings="1"]')
                  const txt = panel && panel.querySelector("[data-mt-accent-text]")
                  if (txt) txt.value = v
                } catch (err) {}
                try { clearTimeout(mtAccentCommitTimer) } catch (err) {}
                const fam = cur
                mtAccentCommitTimer = setTimeout(function () {
                  mtAccentCommitTimer = 0
                  try { if (mtFamily(fam).accent !== v) update(fam, { accent: v }) } catch (err) {}
                }, 260)
              },
              onChange: function (e) {
                const v = String(e.target.value || "").toUpperCase()
                mtPreviewAccent(v)
                try { clearTimeout(mtAccentCommitTimer) } catch (err) {}
                const fam = cur
                mtAccentCommitTimer = setTimeout(function () {
                  mtAccentCommitTimer = 0
                  try { if (mtFamily(fam).accent !== v) update(fam, { accent: v }) } catch (err) {}
                }, 260)
              },
              onBlur: function (e) {
                const v = String(e.target.value || "").toUpperCase()
                try { clearTimeout(mtAccentCommitTimer) } catch (err) {}
                mtAccentCommitTimer = 0
                try { if (/^#[0-9a-f]{6}$/i.test(v) && mtFamily(cur).accent !== v) update(cur, { accent: v }) } catch (err) {}
              },
              style: MTStyle.swatch
            }),
            h("input", { key: cur + "-" + currentTheme.accent, "data-mt-accent-text": "1", defaultValue: currentTheme.accent, spellCheck: false, style: MTStyle.input, onBlur: function (e) { const v = mtHex(e.target.value, ""); if (!v) { flash("颜色格式要写成 #RRGGBB"); setRev(function (x) { return x + 1 }); return } update(cur, { accent: v }) } }),
            h("button", { type: "button", onClick: function () { update(cur, { accent: base.brand }) }, style: MTStyle.small }, "官方色")
          ),
          h("p", { style: MTStyle.hint }, "主色会同时用于工作台主题和开关动画的强调光。"),
          h("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
            h("button", { type: "button", onClick: function () { update(cur, { bg: "" }) }, style: MTStyle.button }, "恢复官方背景"),
            h("button", { type: "button", onClick: function () { setSelected(0) }, style: MTStyle.button }, "回到第一个模型")
          )
        ),
        h(MTSection, {
          title: "按钮音效 · 全局交互",
          desc: "默认应用到左侧导航、设置、插件页以及所有可点击按钮；模型切换有独立的切换音。工作台聊天区不触发点击音。",
          action: h("button", { type: "button", onClick: function () { mtPlaySound(soundCfg.id) }, style: MTStyle.button }, "试听")
        },
          h("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" } },
            h("span", { style: { fontSize: "12px", opacity: .68, flex: "none" } }, "音色"),
            h("select", {
              value: soundCfg.id,
              onChange: function (e) { updateSound({ id: e.target.value }) },
              style: Object.assign({}, MTStyle.input, { flex: "0 1 220px", minWidth: "150px" })
            },
              MT_SOUND_PRESETS.map(function (item) {
                return h("option", { key: item.id, value: item.id }, item.label)
              }),
              customSounds.length ? h("optgroup", { label: "自定义" }, customSounds.map(function (item) {
                return h("option", { key: item.id, value: item.id }, "自定义 · " + item.name)
              })) : null
            ),
            h("button", { type: "button", onClick: chooseSoundFile, style: MTStyle.primary }, "上传 MP3 音效"),
            soundCfg.id.indexOf("custom-") === 0 ? h("button", { type: "button", onClick: function () { removeSound(soundCfg.id) }, style: MTStyle.small }, "删除这个音效") : null
          ),
          h("p", { style: MTStyle.hint }, "内置 13 种音色。自定义音效只接受 MP3，单个不超过 5MB、时长不超过 5 秒；上传后立即启用。"),
          customSounds.length ? h("p", { style: MTStyle.hint }, "已上传 " + customSounds.length + " 个自定义音效，可在上面的下拉框里切换。") : null
        ),
        h(MTSection, {
          title: "模型桌宠 · 跟随主题",
          desc: "切到哪个模型就只显示对应桌宠，且只在 DSH 应用内显示，桌面不会出现。4 秒过场里，B 模型开场中段（2.5s）开始淡入，1 秒后正好站稳，再播登场动作。",
          action: h("a", {
            href: "/api/dsh-model-theme/download/model-pets.zip",
            download: "dsh-model-pets.zip",
            style: Object.assign({}, MTStyle.primary, { textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" })
          }, "下载模型桌宠包")
        },
          (function () {
            const previewFam = cur
            const glowAccent = mtFamily(previewFam).accent || mtBase(previewFam).brand || "#6c5ae6"
            const glowSoft = glowAccent + "24"
            const glowEdge = glowAccent + "38"
            const previewId = petEdit.autoAssign === true ? mtPetAutoIdForFam(previewFam) : (petEdit.map[previewFam] || "")
            const previewName = previewId ? petDisplayName(previewId) : "不显示"
            const previewEnabled = petEdit.enabled !== false && !!previewId
            const petPool = corePetIds.concat(extraPetIds)
            return h("div", {
              style: {
                "--dsh-theme-accent": uiAccent,
                "--dsh-theme-accent-soft": uiAccentSoft,
                "--dsh-theme-accent-glow": uiAccentGlow,
                "--dsh-theme-accent-ink": uiAccentInk,
                borderRadius: "18px",
                border: "1px solid " + glowEdge,
                background: "linear-gradient(165deg, rgba(255,255,255,.58), rgba(255,255,255,.26))",
                boxShadow: "0 16px 40px " + glowSoft + ", inset 0 1px 0 rgba(255,255,255,.65)",
                transition: "border-color .46s cubic-bezier(.22,1,.36,1), box-shadow .46s cubic-bezier(.22,1,.36,1)",
                willChange: "border-color, box-shadow",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                boxSizing: "border-box"
              }
            },
              /* 顶部：模型名字切换 */
              h("div", { style: { display: "flex", alignItems: "center", gap: "8px", minWidth: 0 } },
                h("span", { style: { fontSize: "10px", opacity: .48, flex: "none", letterSpacing: ".04em" } }, "模型"),
                h("div", { style: { display: "flex", gap: "6px", overflowX: "auto", overflowY: "hidden", padding: "2px 1px 4px", minWidth: 0, scrollbarWidth: "thin" } },
                  families.map(function (fam, index) {
                    const isPick = index === selected % families.length
                    const isThemeNow = fam === activeFam
                    return h("button", {
                      key: "pet-model-" + fam,
                      type: "button",
                      onClick: function () { setSelected(index) },
                      style: {
                        flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: "5px",
                        padding: "5px 9px", borderRadius: "999px", cursor: "pointer",
                        border: "1px solid " + (isPick ? glowAccent : "var(--dsw-alias-border-l1)"),
                        background: isPick ? glowSoft : "rgba(255,255,255,.38)",
                        color: "inherit", fontSize: "11px", whiteSpace: "nowrap",
                        fontWeight: isPick ? 600 : 400,
                        boxShadow: isPick ? "0 2px 10px " + glowSoft : "none",
                        transition: "border-color .46s cubic-bezier(.22,1,.36,1), background-color .46s cubic-bezier(.22,1,.36,1), box-shadow .46s cubic-bezier(.22,1,.36,1)"
                      }
                    },
                      h("span", { style: { width: "6px", height: "6px", borderRadius: "50%", background: mtFamily(fam).accent, flex: "none" } }),
                      h("span", null, MT_LABELS[fam] || fam),
                      isThemeNow ? h("span", { style: { fontSize: "8px", opacity: .45, marginLeft: "1px" } }, "当前") : null
                    )
                  })
                )
              ),
              /* 中间：当前模型的桌宠图像 */
              h("div", { style: { display: "flex", alignItems: "center", gap: "18px", padding: "4px 2px", minWidth: 0 } },
                h("div", {
                  style: {
                    width: "148px", height: "148px", borderRadius: "26px", flex: "none",
                    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "radial-gradient(circle at 50% 34%, rgba(255,255,255,.92), " + glowSoft + ")",
                    border: "1px solid " + glowEdge,
                    boxShadow: "0 12px 32px " + glowSoft + ", inset 0 1px 0 rgba(255,255,255,.8)",
                    transition: "border-color .46s cubic-bezier(.22,1,.36,1), box-shadow .46s cubic-bezier(.22,1,.36,1)"
                  }
                }, previewId
                  ? h("img", { src: petAvatarUrl(previewId), alt: previewName, style: { width: "100%", height: "100%", objectFit: "contain", display: "block" } })
                  : h("span", { style: { fontSize: "42px", opacity: .35 } }, "×"))
                ,
                h("div", { style: { flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: "5px" } },
                  h("div", { style: { fontSize: "10px", opacity: .5 } }, "当前模型 · " + (MT_LABELS[previewFam] || previewFam)),
                  h("div", { style: { fontSize: "21px", fontWeight: 700, lineHeight: "1.15", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, previewName),
                  h("div", { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" } },
                    h("span", {
                      style: {
                        fontSize: "9px", padding: "2px 7px", borderRadius: "999px",
                        color: previewEnabled ? uiAccent : "var(--dsw-alias-label-secondary)",
                        background: previewEnabled ? uiAccentSoft : "rgba(127,127,127,.10)",
                        border: "1px solid " + (previewEnabled ? uiAccentGlow : "rgba(127,127,127,.16)")
                      }
                    }, petEdit.enabled === false ? "总开关关闭" : (previewEnabled ? "已启用" : "未启用")),
                    h("span", { style: { fontSize: "9px", opacity: .45 } }, petEdit.autoAssign === true ? "自动匹配" : "自定义选择")
                  ),
                  h("div", { style: { fontSize: "10px", opacity: .45, lineHeight: "1.5", maxWidth: "220px" } }, previewId ? "切换模型时只显示这一只，4 秒过场中段淡入。" : "这个模型不显示桌宠。")
                )
              ),
              /* 开关：启用 + 自动匹配 */
              h("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" } },
                h("label", { style: { display: "inline-flex", alignItems: "center", gap: "7px", padding: "7px 10px", borderRadius: "10px", background: "rgba(255,255,255,.44)", border: "1px solid var(--dsw-alias-border-l1)", fontSize: "11px", cursor: "pointer" } },
                  h("input", { type: "checkbox", role: "switch", "aria-checked": petEdit.enabled !== false ? "true" : "false", checked: petEdit.enabled !== false, onChange: function (e) { stagePet({ enabled: e.target.checked }) } }),
                  h("span", null, "启用模型桌宠")
                ),
                h("label", { style: { display: "inline-flex", alignItems: "center", gap: "7px", padding: "7px 10px", borderRadius: "10px", background: "rgba(255,255,255,.44)", border: "1px solid var(--dsw-alias-border-l1)", fontSize: "11px", cursor: "pointer" } },
                  h("input", { type: "checkbox", role: "switch", "aria-checked": petEdit.autoAssign === true ? "true" : "false", checked: petEdit.autoAssign === true, onChange: function (e) { stagePet({ autoAssign: e.target.checked }) } }),
                  h("span", null, "自动匹配检测到的模型")
                )
              ),
              /* 底部横向选择项 */
              h("div", { style: { display: "flex", gap: "6px", overflowX: "auto", overflowY: "hidden", padding: "1px 1px 5px", scrollbarWidth: "thin" } },
                h("button", {
                  type: "button",
                  title: "这个模型不显示桌宠",
                  onClick: function () {
                    const patch = { autoAssign: false, map: {} }
                    patch.map[previewFam] = ""
                    stagePet(patch)
                  },
                  style: {
                    flex: "0 0 auto", width: "52px", height: "62px", borderRadius: "10px", cursor: "pointer", padding: "4px 2px",
                    border: "1px solid " + (!previewId ? glowAccent : "var(--dsw-alias-border-l1)"),
                    background: !previewId ? glowSoft : "rgba(255,255,255,.28)", color: "inherit",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px"
                  }
                }, h("span", { style: { fontSize: "20px", lineHeight: "1", opacity: .5 } }, "×"), h("span", { style: { fontSize: "9px", opacity: .62 } }, "不显示")),
                petPool.map(function (id) {
                  const manualSelected = (petEdit.map[previewFam] || "") === id
                  const autoSelected = petEdit.autoAssign === true && previewId === id
                  const selected = manualSelected || autoSelected
                  return h("button", {
                    key: "pet-pick-" + previewFam + "-" + id,
                    type: "button",
                    title: petDisplayName(id) + (petEdit.autoAssign === true ? " · 自动匹配" : " · 点击选择"),
                    onClick: function () {
                      const patch = { map: {} }
                      patch.map[previewFam] = id
                      if (petEdit.autoAssign === true) patch.autoAssign = false
                      stagePet(patch)
                    },
                    style: {
                      flex: "0 0 auto", width: "52px", height: "62px", borderRadius: "10px", cursor: "pointer", padding: "3px 2px",
                      border: "1px solid " + (selected ? glowAccent : "var(--dsw-alias-border-l1)"),
                      background: selected ? glowSoft : "rgba(255,255,255,.24)", color: "inherit",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px",
                      overflow: "hidden", boxShadow: selected ? "0 2px 12px " + glowSoft : "none",
                      transition: "border-color .46s cubic-bezier(.22,1,.36,1), background-color .46s cubic-bezier(.22,1,.36,1), box-shadow .46s cubic-bezier(.22,1,.36,1)"
                    }
                  },
                    h("img", { src: petAvatarUrl(id), alt: petDisplayName(id), loading: "lazy", style: { width: "38px", height: "38px", objectFit: "contain", display: "block", pointerEvents: "none" } }),
                    h("span", { style: { fontSize: "9px", lineHeight: "1.1", whiteSpace: "nowrap", opacity: selected ? 1 : .6 } }, petShortName(id))
                  )
                })
              ),
              /* 底部快捷操作 */
              h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", borderTop: "1px solid var(--dsw-alias-border-l1)", paddingTop: "10px", flexWrap: "wrap" } },
                h("span", { style: { fontSize: "10px", opacity: petDirty ? .78 : .45, color: petDirty ? uiAccent : "inherit" } }, petDirty ? "有未保存的桌宠更改" : "所有桌宠更改已保存"),
                h("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" } },
                  h("button", { type: "button", onClick: resetPetDraft, style: MTStyle.small }, "恢复默认"),
                  h("button", {
                    type: "button",
                    onClick: undoPetDraft,
                    disabled: !petDirty,
                    style: Object.assign({}, MTStyle.button, { opacity: petDirty ? 1 : .45, cursor: petDirty ? "pointer" : "not-allowed" })
                  }, "撤销"),
                  h("button", {
                    type: "button",
                    onClick: savePetDraft,
                    disabled: !petDirty,
                    style: Object.assign({}, MTStyle.primary, {
                      background: uiAccent,
                      borderColor: uiAccent,
                      boxShadow: petDirty ? "0 5px 16px " + uiAccentSoft : "none",
                      opacity: petDirty ? 1 : .55,
                      cursor: petDirty ? "pointer" : "not-allowed"
                    })
                  }, "保存")
                )
              )
            )
          })(),
          h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "2px" } },
            h("span", { style: { fontSize: "12px", opacity: .68 } }, "入场延迟"),
            h("input", { type: "number", defaultValue: petEdit.enterDelay, min: 1200, max: 3600, step: 100, style: Object.assign({}, MTStyle.input, { width: "90px" }), onBlur: function (e) { stagePet({ enterDelay: Number(e.target.value) }) } }),
            h("span", { style: { fontSize: "11px", opacity: .5 } }, "ms"),
            h("span", { style: { fontSize: "12px", opacity: .68, marginLeft: "8px" } }, "淡入时长"),
            h("input", { type: "number", defaultValue: petEdit.fadeMs, min: 300, max: 2000, step: 100, style: Object.assign({}, MTStyle.input, { width: "90px" }), onBlur: function (e) { stagePet({ fadeMs: Number(e.target.value) }) } }),
            h("span", { style: { fontSize: "11px", opacity: .5 } }, "ms")
          ),
          h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" } },
            h("span", { style: { fontSize: "12px", opacity: .68 } }, "登场动作"),
            h("input", { defaultValue: petEdit.action || MT_PET_DEFAULT_ACTION, spellCheck: false, style: Object.assign({}, MTStyle.input, { flex: "1 1 240px", minWidth: "180px" }), onBlur: function (e) { stagePet({ action: String(e.target.value || "").trim() || MT_PET_DEFAULT_ACTION }) } }),
            h("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", opacity: .5 } },
              "点播失败会自动回退「" + MT_PET_FALLBACK_ACTION + "」",
              h("button", {
                type: "button",
                "aria-label": "桌宠使用说明",
                "aria-expanded": petHelp ? "true" : "false",
                title: petHelp ? "收起桌宠使用说明" : "展开桌宠使用说明",
                onClick: function () { setPetHelp(function (v) { return !v }) },
                style: {
                  width: "18px", height: "18px", flex: "none", padding: 0, borderRadius: "50%",
                  border: "1px solid " + (petHelp ? uiAccent : "var(--dsw-alias-border-l1)"),
                  background: petHelp ? uiAccent : "rgba(255,255,255,.5)",
                  color: petHelp ? uiAccentInk : "inherit", cursor: "pointer",
                  fontSize: "11px", fontWeight: 700, lineHeight: "16px", textAlign: "center"
                }
              }, "?")
            ),
            petHelp ? h("div", {
              style: {
                flex: "1 1 100%", marginTop: "2px", padding: "9px 11px",
                borderRadius: "10px", background: "rgba(255,255,255,.58)",
                border: "1px solid var(--dsw-alias-border-l1)",
                fontSize: "11px", lineHeight: "1.7", opacity: .82
              }
            },
              h("div", null, "下载包内含 16 套 AI 姐妹桌宠（千问 / GLM / GPT / Claude / Gemini / Kimi / Grok / 豆包 / 文心 / 元宝 / 海螺 / CUDA / Copilot / 克劳德鱼 / Opus / QwQ）与安装说明；DeepSeek 使用内置 DSH 桌宠。"),
              h("div", { style: { marginTop: "4px" } }, "顶部切换模型名，中间预览这只模型的桌宠，底部横向选择桌宠；改动后点底部「保存」生效，「撤销」回到上次保存。所有新桌宠默认只在 DSH 应用内显示，桌面不会出现。")
            ) : null
          ),
        ),
        h(MTSection, {
          title: "逐个模型启停",
          desc: "「主题」关掉后，切到该模型不更换工作台主题；「启动动画」关掉后，任何进出该模型的切换都不播放 4 秒动画。"
        }, h("div", null, switchRows)),
        h("div", { style: { minHeight: "18px", fontSize: "11px", opacity: .55 } }, msg || ("配置已保存 · v" + mtVersion)),
        /* 模型桌宠自检只作为隐藏诊断信息放在最底部，不进入用户可见文案。 */
        h("div", {
          "data-dsh-model-pet-check": petCheck,
          "aria-hidden": "true",
          style: { display: "none" }
        }, "模型桌宠自检：" + petCheck),
        h("div", {
          style: {
            marginTop: "16px", paddingTop: "10px", borderTop: "1px solid var(--dsw-alias-border-l1)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
            flexWrap: "wrap", fontSize: "10px", lineHeight: "1.6", opacity: .52
          }
        },
          h("span", null, "作者认证 · HD1014"),
          h("span", { style: { display: "inline-flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } },
            h("a", { href: "https://github.com/HD1014", target: "_blank", rel: "noreferrer", style: { color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" } }, "GitHub · HD1014"),
            h("span", null, "QQ · 31159334814")
          )
        )
      )
    }

    /* 对外只暴露读写当前配置的窄接口，便于设置页和调试共用 */
    try {
      window.__dshModelThemeSound = {
        play: mtPlaySound,
        whoosh: mtPlayWhoosh,
        upload: mtUploadSound,
        presets: MT_SOUND_PRESETS.map(function (item) { return item.id })
      }
      window.__dshModelThemeSettings = {
        get: function () { return mtSnapshot() },
        defaults: function () {
          const out = {}
          MT_ALL_FAMILIES.forEach(function (fam) {
            out[fam] = { label: MT_LABELS[fam] || fam, accent: mtBase(fam).brand, pet: MT_PET_DEFAULT_MAP[fam] || "" }
          })
          return out
        },
        setFamily: function (fam, patch) {
          if (MT_ALL_FAMILIES.indexOf(fam) < 0 || !patch || typeof patch !== "object") return false
          const all = mtSnapshot()
          Object.keys(patch).forEach(function (key) {
            if (key === "theme" || key === "transition") all.families[fam][key] = patch[key] !== false
            else if (key === "accent") all.families[fam].accent = mtHex(patch[key], all.families[fam].accent)
            else if (key === "bg" && typeof patch[key] === "string") all.families[fam].bg = patch[key]
          })
          if (!mtWrite(all)) return false
          mtAfterChange(fam)
          return true
        },
        resetFamily: function (fam) {
          if (MT_ALL_FAMILIES.indexOf(fam) < 0) return false
          const all = mtSnapshot()
          all.families[fam] = { theme: true, transition: true, accent: mtBase(fam).brand, bg: "" }
          if (!mtWrite(all)) return false
          mtAfterChange(fam)
          return true
        },
        getPet: function () { return mtSnapshot().pet || mtDefaultPet() },
        setPet: function (patch) {
          if (!patch || typeof patch !== "object") return false
          const all = mtSnapshot()
          all.pet = mtNormalizePet(all.pet)
          Object.keys(patch).forEach(function (key) {
            if (key === "map" && patch.map && typeof patch.map === "object") {
              Object.keys(patch.map).forEach(function (fam) { all.pet.map[fam] = String(patch.map[fam] || "").slice(0, 40) })
            } else {
              all.pet[key] = patch[key]
            }
          })
          all.pet = mtNormalizePet(all.pet)
          if (!mtWrite(all)) return false
          try { if (window.__dshThemePet) window.__dshThemePet.sync(window.__dshModelTheme || "", false) } catch (e) {}
          return true
        },
        resetPet: function () {
          const all = mtSnapshot()
          all.pet = mtDefaultPet()
          return mtWrite(all)
        }
      }
    } catch (e) {}

    function installModelThemeSettings(ctx) {
      try {
        let slots = null
        if (ctx && ctx.slots) slots = ctx.slots
        if (!slots && ctx && typeof ctx.get === "function") slots = ctx.get("slots")
        if (!slots || typeof slots.inject !== "function" || typeof slots.register !== "function") return
        let models = null
        if (ctx && ctx.modelDirectories) models = ctx.modelDirectories
        if (!models && ctx && typeof ctx.get === "function") models = ctx.get("modelDirectories")
        slots.inject("settings.section", function () {
          return slots.register({
            name: "settings.section",
            id: "model-theme",
            order: 9999,
            label: "模型主题"
          }, function () { return React.createElement(ModelThemeSettings, { models: models }) })
        })
      } catch (e) {
        /* 设置入口失败不影响聊天主题 */
      }
    }

    const plugin = {

      inject: ["slots", "modelDirectories"],

      apply(ctx) {
        try {
          if (ctx && typeof ctx.inject === "function") {
            ctx.inject(["slots", "modelDirectories"], function (scope) {
              installModelThemeSettings(scope)
            })
          } else {
            installModelThemeSettings(ctx)
          }
        } catch (e) {
          installModelThemeSettings(ctx)
        }
        try {
          if (document.body) mount()
          else document.addEventListener("DOMContentLoaded", mount, { once: true })
        } catch (e) {
          /* ignore */
        }
      }
    }

    module.exports = plugin
    return module.exports
  }
})


