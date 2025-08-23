# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

knoteryはWXT + SolidJSを使用したブラウザ拡張機能です。WXTはクロスブラウザWebExtensions開発フレームワークで、ChromeとFirefoxの両方に対応しています。

## 開発コマンド

### 基本コマンド
- `bun dev` - Chrome向け開発サーバー起動（ホットリロード有効）
- `bun run dev:firefox` - Firefox向け開発サーバー起動
- `bun run build` - Chrome向け本番ビルド
- `bun run build:firefox` - Firefox向け本番ビルド
- `bun run zip` - Chrome向け配布用zipファイル作成
- `bun run zip:firefox` - Firefox向け配布用zipファイル作成
- `bun run compile` - TypeScript型チェック（実行のみ）

### セットアップ
- `bun install` - 依存関係インストール
- `bun run postinstall` - WXT設定の準備（自動実行される）

## アーキテクチャ

### エントリーポイント構造
- `entrypoints/background.ts` - バックグラウンドスクリプト（Service Worker）
- `entrypoints/content.ts` - コンテンツスクリプト（google.comページに注入）
- `entrypoints/popup/` - ポップアップUI（SolidJSアプリケーション）

### 技術スタック
- **フレームワーク**: WXT (v0.20.6) - WebExtensions開発フレームワーク
- **UI**: SolidJS (v1.9.6) - リアクティブUIライブラリ
- **言語**: TypeScript
- **パッケージマネージャー**: Bun

### 設定ファイル
- `wxt.config.ts` - WXT設定（マニフェスト、アイコン設定含む）
- `tsconfig.json` - TypeScript設定（SolidJS JSX設定済み）

### ファイル構造のポイント
- WXTは`entrypoints/`ディレクトリ内のファイルから自動的にマニフェストを生成
- ポップアップはSolidJSアプリとして`entrypoints/popup/`に配置
- アイコンは`public/icon/`に配置（16px, 48px, 128px）
- アセットは`assets/`に配置、`@/assets/`でアクセス可能

### 開発時の注意点
- 開発時は`.wxt/`ディレクトリが自動生成される
- マニフェストファイルは自動生成されるため手動編集不要
- Chrome/Firefox間の差異はWXTが自動処理