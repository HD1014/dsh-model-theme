#requires -Version 5.1
<#
  给 dsh-pet 打“只挂当前模型桌宠”补丁。

  背景：dsh-pet 0.4.7 会把所有 display=web 的桌宠都挂载，每张卡都会消费
  台词与语音，导致切到 A 模型时 B/C/D 的桌宠也在说话。dsh-model-theme 会
  广播 dsh-pet-only 事件并写入 window.__dshPetOnlyId，本补丁让 dsh-pet 按
  这个 id 过滤，只挂载一只。

  用法：
    powershell -ExecutionPolicy Bypass -File .\tools\patch-dsh-pet.ps1
    powershell -ExecutionPolicy Bypass -File .\tools\patch-dsh-pet.ps1 -ClientPath "C:\...\dsh-pet\lib\client.js"
#>
param(
  [string]$ClientPath = ""
)

$ErrorActionPreference = "Stop"

if (-not $ClientPath) {
  $ClientPath = Join-Path $env:USERPROFILE ".dsh\profiles\desktop\node_modules\dsh-pet\lib\client.js"
}

if (-not (Test-Path -LiteralPath $ClientPath)) {
  Write-Host "[x] 找不到 dsh-pet：$ClientPath"
  Write-Host "    请先安装 dsh-pet，或用 -ClientPath 指定 lib/client.js。"
  exit 1
}

$text = [System.IO.File]::ReadAllText($ClientPath)

if ($text.Contains('__dshPetOnlyId')) {
  Write-Host "[ok] 已经是补丁版，无需重复修改：$ClientPath"
  exit 0
}

$old = '		const visiblePets = pets.filter((p) => isWebVisible(p.display));'
$new = @'
		// 只挂当前模型对应的那一只桌宠（由 dsh-model-theme 通过 dsh-pet-only 事件写入）：
		// 未挂载的 PetCard 不会消费 say 叶子，也不会触发 TTS/气泡，避免多模型台词串台。
		const [onlyPetId, setOnlyPetId] = useState(() => {
			try { return typeof window.__dshPetOnlyId === "string" ? window.__dshPetOnlyId : ""; } catch { return ""; }
		});
		useEffect(() => {
			const onOnlyPet = (event) => {
				const id = event && event.detail && typeof event.detail.id === "string" ? event.detail.id : "";
				setOnlyPetId(id);
				try { window.__dshPetOnlyId = id; } catch { /* ignore */ }
			};
			window.addEventListener("dsh-pet-only", onOnlyPet);
			try {
				if (typeof window.__dshPetOnlyId === "string" && window.__dshPetOnlyId) setOnlyPetId(window.__dshPetOnlyId);
			} catch { /* ignore */ }
			return () => window.removeEventListener("dsh-pet-only", onOnlyPet);
		}, []);
		const visiblePets = pets.filter((p) => isWebVisible(p.display) && (!onlyPetId || p.id === onlyPetId));
'@

if (-not $text.Contains($old)) {
  Write-Host "[x] 当前 dsh-pet 版本结构与 0.4.7 不一致，未找到目标行。"
  Write-Host "    请把 lib/client.js 发给作者，或手动按 docs/注意事项.md 处理。"
  exit 2
}

$backup = $ClientPath + ".bak-onlypet-" + (Get-Date -Format "yyyyMMdd-HHmmss")
Copy-Item -LiteralPath $ClientPath -Destination $backup -Force
[System.IO.File]::WriteAllText($ClientPath, $text.Replace($old, $new), (New-Object System.Text.UTF8Encoding($false)))

Write-Host "[ok] 已打补丁：$ClientPath"
Write-Host "     备份：$backup"

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  & node --check $ClientPath
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[x] node --check 失败，正在回滚。"
    Copy-Item -LiteralPath $backup -Destination $ClientPath -Force
    exit 3
  }
  Write-Host "[ok] node --check 通过"
} else {
  Write-Host "[!] 未找到 node，跳过语法检查。"
}

Write-Host "[i] 重启 DSH 后生效。升级/重装 dsh-pet 会覆盖补丁，需要重新运行本脚本。"
