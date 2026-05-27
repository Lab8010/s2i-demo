# s2i-demo

OpenShift Local での **Source-to-Image (S2I)** デモ用 Spring Boot アプリケーションです。

## プロジェクト構成

```
s2i-demo/
├── pom.xml                             # Maven ビルド定義
├── src/
│   └── main/
│       ├── java/com/example/demo/
│       │   ├── DemoApplication.java    # Spring Boot エントリーポイント
│       │   └── HelloController.java    # REST エンドポイント
│       └── resources/
│           └── application.properties
└── demo-steps/
    └── DEMO_PROCEDURE.md               # デモ手順書（コピペ用コマンド付き）
```

## エンドポイント

| PATH | 説明 |
|------|------|
| `GET /` | Pod名・タイムスタンプ入りの挨拶メッセージ |
| `GET /health` | ヘルスチェック |
| `GET /actuator/health` | Spring Actuator ヘルス |

## ローカル動作確認（任意）

```bash
mvn spring-boot:run
curl http://localhost:8080/
```

## デモ手順

→ `demo-steps/DEMO_PROCEDURE.md` を参照
