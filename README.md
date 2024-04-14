# docutil-deploy-hook

简单的 webhook 服务，用于接收 git push 事件后部署网站到服务器。

## 部署

需要 [bun v1.1+](https://bun.sh)。

### 启动服务

```sh
bun index.js -c docutil-deploy.config.json
```

### 配置 webhook

打开 github -> 项目 Settings -> Webhooks，增加一个 webhook。

payload url: `<domain>/docutil-deploy/deploy?site=SiteName&token=SOME_TOKEN_FOR_AUTH`，其他选择默认。

## LICENSE

[MIT](LICENSE)
