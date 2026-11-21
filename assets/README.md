# 桌宠素材包

`dsh-model-pets.zip` 约 134 MB，超过 GitHub 单文件 100 MB 限制，因此不放进 Git 仓库。

获取方式：

1. 在 DSH 内打开 `设置 → 模型主题 → 模型桌宠`，点「下载模型桌宠包」；
2. 或从 GitHub Release 资产下载 `dsh-model-pets.zip`；
3. 下载后放到本目录：`assets/dsh-model-pets.zip`，插件设置页的下载按钮即可正常返回。

安装：

```powershell
Expand-Archive .\dsh-model-pets.zip -DestinationPath .\dsh-model-pets
powershell -ExecutionPolicy Bypass -File .\dsh-model-pets\install-model-pets.ps1
```
