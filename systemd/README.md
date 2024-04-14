# 后台服务

docutil-deploy.service 是 systemd 服务配置文件。可以安装到 /etc/systemd/system。

执行下面的命令，启动 docutil-deploy 服务。

```sh
systemctl daemon-reload
systemctl start docutil-deploy
systemctl status docutil-deploy
```
