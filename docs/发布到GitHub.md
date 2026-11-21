# 发布到 GitHub

## 0. 发布前检查

- [ ] `lib/client.js` 与本地运行版本一致（SHA256 对比）
- [ ] `node --check lib/client.js` 通过
- [ ] `tools/patch-dsh-pet.ps1` 在干净副本上测试通过
- [ ] `dist/Dsh-Model-Theme-1.1.0-source.zip` 不含桌宠大包
- [ ] `dist/Dsh-Model-Theme-1.1.0-Full.zip` 含 `assets/dsh-model-pets.zip`
- [ ] 截图已裁剪，不含个人聊天列表、账号名

## 1. 初始化仓库

```powershell
cd C:\Users\Administrator\Doubao\chats\2026-11-12\new-chat\Dsh-Model-Theme
git init
git branch -M main
git add .
git commit -m "release: DSH Model Theme 1.1.0"
```

> `assets/*.zip`、`dist/` 已在 `.gitignore` 中排除；不要 `git add -f` 把 134 MB 的桌宠包塞进普通提交。

## 2. 建远程仓库并推送

在 GitHub 账号 `HD1014` 下新建仓库 `dsh-model-theme`（Public，不要勾选自动生成 README）。

```powershell
git remote add origin https://github.com/HD1014/dsh-model-theme.git
git push -u origin main
```

如果仓库名不同，记得同步修改 `package.json` 的 `repository` / `bugs` 与 README 里的链接。

## 3. 打标签

```powershell
git tag -a v1.1.0 -m "DSH Model Theme 1.1.0"
git push origin v1.1.0
```

## 4. 创建 Release

在 GitHub 仓库页 `Releases → Draft a new release`：

1. 选择标签 `v1.1.0`。
2. 标题：`DSH Model Theme 1.1.0`。
3. 说明可直接用 `CHANGELOG.md` 的 1.1.0 段落。
4. 上传资产：
   - `dist/Dsh-Model-Theme-1.1.0-source.zip`（源码包，约 4 MB）
   - `dist/Dsh-Model-Theme-1.1.0-Full.zip`（完整包，约 140 MB）
   - `dist/dsh-model-pets.zip`（桌宠素材包，约 135 MB，供单独下载）
5. 勾选 `Set as the latest release`，发布。

> GitHub 单个 Release 资产上限 2 GB，以上三个都远低于限制；普通 Git 仓库单文件上限 100 MB，所以大包只能走 Release。

## 5. 发布后核对

```powershell
git status
git log --oneline -3
git ls-files | Select-String -Pattern '\.zip$'
```

确认：

- `git ls-files` 没有列出任何 `.zip`。
- Release 页三个资产都能下载。
- 下载源码包后，运行 `tools/patch-dsh-pet.ps1` 与 `pnpm install` 能正常安装。

## 6. 后续更新

1. 改 `lib/client.template.js`，重新构建 `lib/client.js`。
2. 升 `package.json` 与 `CHANGELOG.md` 版本号。
3. 重新打 source / Full 包。
4. `git commit`、`git tag v1.0.1`、push，再新建一个 Release。
