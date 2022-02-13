# docutil-deploy-hook

一个 webhook 服务，用于在 git push 事件后部署网站到服务器。

## 部署

### 启动服务

```sh
node index.js -c docutil-deploy.config.yml
```

### 配置 webhook

打开 github -> 项目 Settings -> Webhooks，增加一个 webhook。

payload url: `<domain>/docutil-deploy/deploy?site=SiteName&token=SOME_TOKEN_FOR_AUTH`，其他选择默认。

## LICENSE

[MIT](LICENSE)
