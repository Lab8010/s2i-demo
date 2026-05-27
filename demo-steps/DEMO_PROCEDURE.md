# OpenShift Local × S2I デモ手順書
## Java (Spring Boot) → Route公開まで

---

## 前提条件

| 項目 | 内容 |
|------|------|
| 環境 | OpenShift Local (CRC) 起動済み |
| CLIツール | `oc` コマンド使用可能 |
| ソース | このリポジトリ（またはGitHub URL） |

---

## STEP 1 — OpenShift Local へのログイン

```bash
# CRC が起動していることを確認
crc status

# developer ユーザーでログイン
oc login -u developer -p developer https://api.crc.testing:6443

# ログイン確認
oc whoami
```

> **ポイント**: `developer` は OpenShift Local の組み込みユーザー。
> 本番では SSO / LDAP 連携になる部分です。

---

## STEP 2 — プロジェクト（Namespace）の作成

```bash
oc new-project s2i-demo

# 確認
oc project
```

> **ポイント**: OpenShift の Project は Kubernetes の Namespace に相当します。
> RBAC・NetworkPolicy・ResourceQuota の境界になります。

---

## STEP 3 — S2I ビルド＆デプロイ (`oc new-app`)

### 3-A. ローカルソースから（ファイルをそのまま使う場合）

```bash
# カレントディレクトリのソースを S2I でビルド
oc new-app java:17~. \
  --name=s2i-demo \
  --labels=app=s2i-demo

# ビルドログをリアルタイム確認
oc logs -f buildconfig/s2i-demo
```

### 3-B. GitHub リポジトリから（推奨）

```bash
# GitHub にプッシュ済みの場合
oc new-app java:17~https://github.com/<YOUR_USER>/s2i-demo.git \
  --name=s2i-demo \
  --labels=app=s2i-demo

oc logs -f buildconfig/s2i-demo
```

> **ポイント（S2I の仕組み）**:
> 1. Builder Image (`java:17`) をベースに Assemble スクリプトが実行される
> 2. Maven ビルド (`mvn package`) が自動で走る
> 3. 成果物 JAR が実行可能なコンテナイメージとしてパッケージされる
> 4. **Dockerfile 不要**、これが S2I の最大のメリット

---

## STEP 4 — デプロイ状態の確認

```bash
# Pod の起動を確認
oc get pods -w

# DeploymentConfig / Deployment の確認
oc get deployment s2i-demo

# サービスの確認
oc get svc
```

期待する出力イメージ:
```
NAME        READY   STATUS    RESTARTS   AGE
s2i-demo-1-xxxxx   1/1     Running   0          1m
```

---

## STEP 5 — Route の公開

```bash
# Route を作成（HTTP）
oc expose svc/s2i-demo

# Route URL を確認
oc get route s2i-demo
```

期待する出力イメージ:
```
NAME       HOST/PORT                                    PATH   SERVICES   PORT
s2i-demo   s2i-demo-s2i-demo.apps-crc.testing          ...    s2i-demo   8080-tcp
```

---

## STEP 6 — ブラウザ / curl で動作確認

```bash
# URL を変数に格納
ROUTE_URL=$(oc get route s2i-demo -o jsonpath='{.spec.host}')

# curl で確認
curl http://$ROUTE_URL/

# ヘルスチェックエンドポイント
curl http://$ROUTE_URL/health
```

期待するレスポンス:
```json
{
  "message": "Hello from OpenShift S2I Demo!",
  "hostname": "s2i-demo-1-xxxxx",
  "timestamp": "2025-xx-xxTxx:xx:xx",
  "version": "1.0.0"
}
```

> **ポイント**: `hostname` にPod名が入っている → コンテナで動いていることの証拠

---

## STEP 7 — (オプション) Web コンソールで確認

```bash
# Web コンソールを開く
crc console
```

- **Topology ビュー** → S2I フローが視覚的に確認できる
- **Build → Builds** → ビルドログの履歴
- **Networking → Routes** → Route の詳細

---

## クリーンアップ

```bash
# プロジェクトごと削除
oc delete project s2i-demo
```

---

## S2I の仕組み（補足説明スライド用メモ）

```
[ソースコード]
     ↓
[Builder Image: java:17]
     ↓ assemble スクリプト
[mvn package 実行]
     ↓
[実行可能コンテナイメージ生成]
     ↓ push
[ImageStream]
     ↓ トリガー
[Deployment → Pod 起動]
     ↓
[Service → Route → 外部公開]
```

**Dockerfile を書かなくていい理由**:
S2I の Builder Image にビルド手順が内包されているため、
開発者はアプリのコードだけに集中できます。

---

*作成: OpenShift Local S2I デモ用 / Java 17 + Spring Boot 3.2*
