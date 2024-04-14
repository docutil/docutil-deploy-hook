# docutil-deploy-hook

简单的 webhook 服务，用于接收 git push 事件后部署网站到服务器。

## 部署

需要 [bun v1.1+](https://bun.sh)。

### 启动服务

```sh
bun run build
bun run --smol dist/index.js -c docutil-deploy.config.json
```

### 配置 webhook

打开 github -> 项目 Settings -> Webhooks，增加一个 webhook。

payload url: `<domain>/docutil-deploy/deploy?site=SiteName&token=SOME_TOKEN_FOR_AUTH`，其他选择默认。

### 配置

- `port` 端口
- `host` 监听的 IP，一般可以用 127.0.0.1。推荐在 docutil-deploy 前增加 nginx/caddy 用于处理 SSL 证书
- `sites` 是一个站点配置 **数组**。站点配置字段如下：
  - `id` 唯一标识
  - `repo_url` GIT 仓库地址。
  - `auth_token` Web Hook 鉴权，一般使用随机生成的字符串
  - `install_dir` 站点部署目录

可以参考 [docutil-deploy.config.json](./docutil-deploy.config.json)

## LICENSE

[MIT](LICENSE)
