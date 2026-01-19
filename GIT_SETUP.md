# 🚀 Git 初始化和 GitHub 推送指南

## ✅ 已完成

Git 仓库已初始化，初始提交已完成。

## 📋 推送到 GitHub 的步骤

由于系统没有安装 GitHub CLI (gh)，请按照以下步骤手动创建 GitHub 仓库并推送代码：

### 方法一：通过 GitHub 网站创建（推荐）

1. **访问 GitHub**
   - 打开 https://github.com/new

2. **创建新仓库**
   - Repository name: `doudizhu` (或您喜欢的名称)
   - Description: `Web-based Dou Dizhu (斗地主) game`
   - Public/Private: 根据需要选择
   - **不要勾选** "Initialize this repository with a README"
   - **不要勾选** "Add .gitignore"
   - **不要勾选** "Choose a license"
   - 点击 "Create repository"

3. **推送代码到 GitHub**
   在项目目录下运行以下命令（替换 `YOUR_USERNAME` 为您的 GitHub 用户名）：

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/doudizhu.git
   git branch -M main
   git push -u origin main
   ```

### 方法二：使用 GitHub CLI（如果安装后）

如果您想使用 GitHub CLI，可以先安装它：

**Windows (使用 Chocolatey):**

```bash
choco install gh
gh auth login
```

**Windows (使用 Scoop):**

```bash
scoop install gh
gh auth login
```

然后运行：

```bash
gh repo create doudizhu --public --source=. --remote=origin --push
```

### 方法三：使用 GitHub Desktop

1. 下载并安装 GitHub Desktop
2. 打开 GitHub Desktop
3. File → Add Local Repository → 选择项目目录
4. Repository → Push to GitHub

## 🔧 常用 Git 命令

```bash
# 查看当前状态
git status

# 查看提交历史
git log

# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/USERNAME/REPO.git

# 推送到远程仓库
git push -u origin main

# 从远程仓库拉取
git pull origin main

# 查看分支
git branch

# 创建并切换分支
git checkout -b feature-name

# 合并分支
git merge feature-name

# 删除分支
git branch -d feature-name
```

## 📝 提交消息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）：**

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例：**

```
feat(game): add AI player logic

Implement basic AI decision making for single-player mode
including card selection and play strategy.

Closes #123
```

## 🎯 下一步建议

1. **推送到 GitHub**
   - 按照上述步骤创建远程仓库
   - 推送代码

2. **设置分支保护**
   - 在 GitHub 仓库设置中启用分支保护
   - 要求 PR 审查才能合并到 main

3. **设置 CI/CD**
   - 配置 GitHub Actions
   - 自动运行测试和构建

4. **添加贡献指南**
   - 创建 CONTRIBUTING.md
   - 说明如何参与开发

## 💡 提示

- 在推送前，确保 `.gitignore` 文件已正确配置
- 提交前先 `git status` 查看将要提交的文件
- 定期 `git pull` 获取远程更新
- 使用有意义的提交消息
- 考虑使用 `.editorconfig` 统一代码格式

## 🔐 安全提示

- 不要将 `.env` 文件提交到 git
- 不要将敏感信息（API密钥、密码等）提交到代码
- 使用 GitHub Secrets 存储敏感配置
- 定期更新依赖包以修复安全漏洞

## 📚 参考资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方文档](https://docs.github.com/)
- [GitHub CLI 文档](https://cli.github.com/)
