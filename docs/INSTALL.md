# 安装说明

## 环境

- Windows 10 / 11
- DeepSeek Harness 桌面版
- `dsh-pet`（模型桌宠依赖），当前适配 0.4.7

## 一、安装插件

1. 关闭 DSH。
2. 将仓库里的 `Dsh-Model-Theme` 文件夹重命名为 `dsh-model-theme`，放到：

   ```text
   %USERPROFILE%\.dsh\local-plugins\dsh-model-theme
   ```

   最终应能看到：

   ```text
   %USERPROFILE%\.dsh\local-plugins\dsh-model-theme\package.json
   %USERPROFILE%\.dsh\local-plugins\dsh-model-theme\lib\client.js
   ```

3. 打开 `%USERPROFILE%\.dsh\profiles\desktop\package.json`，先备份一份。

4. 在 `dependencies` 中加入（把 `<用户名>` 换成实际用户名）：

   ```json
   "dsh-model-theme": "file:C:/Users/<用户名>/.dsh/local-plugins/dsh-model-theme"
   ```

5. 在 `dsh.profile.bundles` 数组末尾加入：

   ```json
   "dsh-model-theme"
   ```

6. 在 `%USERPROFILE%\.dsh\profiles\desktop` 目录打开 PowerShell：

   ```powershell
   pnpm install
   ```

7. **给 dsh-pet 打串台补丁（重要）**：不用停留在 `profiles/desktop`，直接运行插件目录里的脚本：

   ```powershell
   powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.dsh\local-plugins\dsh-model-theme\tools\patch-dsh-pet.ps1"
   ```

   脚本会备份、替换过滤逻辑并做 `node --check`；如果 `dsh-pet` 版本结构变化，会明确报错而不是强行改。

8. 启动 DSH，在 `设置` 左侧导航最底部看到「模型主题」即安装成功。

## 二、安装桌宠素材包

1. 打开 `设置 → 模型主题`，在「模型桌宠」卡片点「下载模型桌宠包」。
2. 把 `dsh-model-pets.zip` 解压到任意目录。
3. 右键 `install-model-pets.ps1` → 使用 PowerShell 运行；或在解压目录执行：

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\install-model-pets.ps1
   ```

4. 脚本会把 16 套素材复制到：

   ```text
   %USERPROFILE%\.dsh\dsh-pet\pet
   ```

   并统一设置 `display=web`、`balanceEnabled=true`、`fixedEnabled=false`。

5. 重启 DSH，在 `设置 → 模型主题 → 模型桌宠` 里给每个模型选桌宠并保存。

## 三、卸载

1. 关闭 DSH。
2. 从 `profiles/desktop/package.json` 的 `dependencies` 和 `bundles` 里删掉 `dsh-model-theme`。
3. 删除 `local-plugins/dsh-model-theme`。
4. 可选：删除 `dsh-pet/pet` 里对应素材。
5. 在 `profiles/desktop` 执行 `pnpm install`，重启 DSH。

## 四、故障排查

| 现象 | 处理 |
| --- | --- |
| 设置里没有「模型主题」 | 检查 `dependencies`、`bundles` 是否都加了，`pnpm install` 是否成功 |
| 主题背景不换 | 检查当前模型能否被识别；在「模型自检」点重新检测 |
| 桌宠不显示 | 确认 `dsh-pet` 已安装、素材已复制、模型桌宠开关已启用，并点保存 |
| 多个桌宠同时说话 | 没跑 `tools/patch-dsh-pet.ps1`，或升级 `dsh-pet` 后补丁被覆盖；重跑脚本并重启 |
| 桌宠跑到屏幕外 | 插件会在显示时把出界桌宠拉回右下角；仍异常就重新保存映射 |
| 下拉错位 | 确认使用的是本插件构建产物 `lib/client.js`，不是旧版缓存 |
| 设置页样式乱了 | DSH 升级改了 class hash；提 issue 并附截图 |
