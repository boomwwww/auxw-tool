# 贡献指南

感谢你愿意抽出宝贵时间为 AuxW_Tool 做出贡献！

## 技术栈

- AuxW_Tool 由 TypeScript 全栈开发，我们期望贡献者对 TypeScript 有一定的了解

- 请确保自己的设备已安装 [Node.js](https://nodejs.org/) ，版本 22 或更高（暂时不建议使用 Node.js 的替代品）

- 请使用 [pnpm](https://pnpm.io/) 作为包管理器，版本 10 或更高

## VSCode

- 推荐使用 [VSCode](https://code.visualstudio.com/) 作为编辑器

- 推荐安装以下插件
  - Prettier - Code formatter
  - ESLint
  - Code Spell Checker
  - Vue (Official)

## 流程

- fork 本仓库后拉取到本地

- 安装依赖

  ```bash
  pnpm i
  ```

- 开发

  ```bash
  pnpm dev
  ```

- 构建（构建产物在 `releases` 目录下）

  ```bash
  pnpm build
  ```

- 提交代码时，请不要使用 `git commit` ，而是使用 `pnpm commit` ，以便形成规范的提交信息。

  ```bash
  git add .
  pnpm commit
  ```

- 提交代码时，lint检测会自动运行，如果检测出错误，请按照错误提示修改代码并重新提交。

## 项目架构

### 目录结构

（待完善）
