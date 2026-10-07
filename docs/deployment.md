# AIGC Infra 门户部署与维护

门户用于展示研发逻辑、文档和平台跳转。它不承担训练、数据管理、在线评分或实际项目 dashboard 的后端功能。Node.js 服务读取本项目生成的静态文件；浏览器不依赖 CDN 或公网字体。部署内容限于公司内部可分享的设计与参考界面。

## 运行方式

需要 Node.js 22 或更新版本，本项目的 Docker 镜像使用 Node.js 24。将整个 `AIGC-infra` 目录复制到部署机器，在该目录运行：

```sh
npm start
```

Windows PowerShell 若限制 npm 的 `.ps1` 执行，可直接使用 `npm.cmd start`；也可运行 `node scripts/start.mjs`。没有额外 npm 依赖需要下载。该命令构建文档及界面快照后启动服务，默认监听 `0.0.0.0:8080`，终端会输出本机及各网卡的访问地址。保持进程运行才能访问。

| 配置 | 默认值 | 用途 |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | 监听所有 IPv4 网卡，让其他机器可以连接 |
| `PORT` | `8080` | 服务端口 |
| `BASE_PATH` | `/` | 反向代理下的路径前缀，例如 `/aigc-infra/` |
| `ALGORITHM_TEMPLATE_DIR` | 相邻的 `../algorithm-template` | 构建时读取当前模板；不存在时使用本仓库内的精选快照 |

`0.0.0.0` 是监听配置，浏览器应使用部署机器的实际 IP 或域名。[Node.js 网络文档](https://nodejs.org/api/net.html#serverlistenport-host-backlog-callback)说明了监听地址的含义。修改源文档或平台地址后重新启动，或先 `npm run build` 再 `npm run serve`。`dist/` 是构建结果，不直接编辑。

更新 Git 代码后，使用 `npm start` 重新构建并启动；`npm run serve` 只读取已有的 `dist/`，单独重启它不会生成新页面。构建会给入口脚本、依赖模块、样式和内容请求加入同一版本参数，重新打开页面时会加载本次构建。视频技术入口为 `http://localhost:8080/#/video-generation`；其他电脑使用部署机器的实际地址。

## 办公电脑：让同事从公司内网访问

1. 在部署电脑运行 `npm.cmd start`。
2. 从启动日志选择公司网卡地址，也可运行 `ipconfig` 查找对应 IPv4。不要选择 `127.0.0.1`、VPN 不可共享网卡或虚拟机网卡。
3. 在另一台公司电脑打开 `http://办公电脑内网IP:8080/`。
4. 如本机可访问而其他电脑无法访问，检查 Windows 防火墙及公司网络是否允许该端口。需要网络管理员放行时提供部署机器 IP、TCP 端口和允许访问的公司网段。

以下是管理员按公司网段创建 Windows 入站规则的示例，按实际策略填写网段后执行；不要直接复制示例网段：

```powershell
# 示例：将 10.20.0.0/16 替换为实际允许访问的公司网段。
New-NetFirewallRule -DisplayName "AIGC Infra 8080" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080 -Profile Domain,Private -RemoteAddress 10.20.0.0/16
```

保持电脑开机、关闭自动休眠，并使用稳定内网 IP 或公司 DNS 名称。常驻时可以通过公司的服务管理工具或 Windows 任务计划程序启动 `node.exe`，参数为 `C:\project\AIGC-infra\scripts\start.mjs`，工作目录为 `C:\project\AIGC-infra`。按实际安装位置设置 Node 路径和任务运行账户，并启用失败后重启。网页服务不会自动修改防火墙或注册系统任务。

## 云服务器或 DSW：先确认公司网络能到达实例

DSW 中启动服务不等于公司内网已经可以访问。必须具备公司网络到实例所在 VPC 的路由，例如企业 VPN、专线或公司网关，并允许实例安全组 / 主机防火墙接收对应网段的 TCP 8080。访问地址使用实例的可达内网 IP 或公司内网域名。

```sh
cd /opt/AIGC-infra
HOST=0.0.0.0 PORT=8080 npm start
```

DSW 自带的端口预览可用于个人检查，最终分享给同事的入口需由公司网络方案决定；不要把只对当前账号有效的控制台预览地址当作全公司的入口。若公司选择通过公网连接云服务，需要按网络策略配置网关或代理、HTTPS 及访问控制；阿里云的[DSW 自定义服务访问说明](https://help.aliyun.com/zh/pai/custom-services-access-configurations)介绍了相应的安全组、NAT 与 EIP 条件。

实例停止或回收后网页会不可用。DSW 内可以由已有进程管理工具维持 Node 进程；普通 Linux 服务器可以使用下面的 systemd 示例。是否支持 systemd 取决于 DSW 的实际环境。

```sh
# 先构建；再按实际目录和 Node 路径调整 deploy/aigc-infra.service。
npm run build
sudo cp deploy/aigc-infra.service /etc/systemd/system/aigc-infra.service
sudo systemctl daemon-reload
sudo systemctl enable --now aigc-infra
```

查看日志使用 `journalctl -u aigc-infra -f`。修改文档或配置后，在部署目录执行 `npm run build` 并重启服务。仅修改前端静态内容时构建即可，但统一重启更便于确认配置生效。

## Docker 方式

仓库提供 `Dockerfile`，运行时无需安装依赖。构建镜像时需要可访问 Node 基础镜像源：

```sh
docker build -t aigc-infra .
docker run -d --name aigc-infra --restart unless-stopped -p 8080:8080 aigc-infra
```

平台的本机配置可在构建前放入 `web/config.local.json`；该文件未被 `.dockerignore` 排除，将参与构建。它只应包含平台入口地址，不存放密码、访问令牌或用户信息。Docker 主机仍需满足公司网络、端口与访问控制条件。

## 反向代理和访问控制

如通过公司网关发布在 `https://公司域名/aigc-infra/`，启动时设置 `BASE_PATH=/aigc-infra/`。本项目的 hash 路由及资源均支持这个前缀。参考[反向代理配置](../deploy/nginx.conf)，代理会保留路径前缀，后端据此处理请求。

```sh
HOST=127.0.0.1 PORT=8080 BASE_PATH=/aigc-infra/ npm start
```

此时后端只允许本机代理连接；同事通过代理域名访问。HTTPS 证书和公司 SSO / 网关认证由部署环境配置。直接 Node 服务没有登录系统，适合已受访问控制的公司内网；需要认证时在网关完成，不把登录令牌写入页面配置。

门户使用新标签页打开真实平台。已有平台的认证与权限由平台管理；跨域或 `X-Frame-Options` 限制不会影响跳转。本站 iframe 展示的是保存的只读快照，不尝试嵌入受限制的真实平台。

## 配置真实的平台入口

已有地址：Prim Eval、avproc-ray 代码仓库，以及两个 Jira 需求。PASS、训练平台、推理服务、反馈平台和算法组 dashboard 的入口尚待提供。没有地址时只展示方案或协议。

创建不入库的 `web/config.local.json`，只列出需要覆盖的配置：

```json
{
  "platforms": {
    "pass": { "url": "https://实际的PASS地址/" },
    "training": { "url": "https://实际的训练平台地址/" },
    "algorithm-template": { "url": "https://实际的模板仓库地址/" },
    "group-dashboard": { "url": "https://实际的算法组dashboard地址/" }
  }
}
```

以上是填写示例，不能原样用于构建。URL 仅允许不含账户密码的 HTTP / HTTPS 地址。配置入口不会把需求方案自动认定为已完成，也不会生成假的项目状态。Dashboard 未配置时保持“正在开发”，展示项目登记、协议读取、目标与证据汇总、变更刷新等计划。真实项目目标通过各项目仓库维护；门户内不直接编辑。

## 内容维护与来源

- `README.md` 和 `docs/`：实际方案来源。新增模块设计文档后，重新构建会自动收录到对应页面、目录与搜索中。
- `web/catalog.mjs`：模块概要、六阶段关系、工具归属、开发状态与计划说明。
- `web/config.json`：可共享的平台默认入口。`web/config.local.json`：部署机器覆盖值。
- `web/reference-docs/algorithm-template/`：独立部署使用的精选模板快照。构建优先读取当前模板目录，部署包仍能独立阅读；更新协议时同步快照。
- `web/client/previews/prim-eval/`、`web/client/images/`：用户提供的界面与需求图片。需要重新导入时，在有原始 `../asset` 的开发电脑上使用 Python 3 执行 `python scripts/import-references.py --assets ../asset`。日常启动不需要 Python 或原始资料目录。
- `web/THIRD_PARTY.md`：Marked 许可及资料来源。

门户只服务 `dist/`，不提供原始 MHTML、仓库文件、`.env`、本地配置文件或目录浏览。网页中的方案正文是构建时的快照，平台运行事实应在其真实入口查看。

## 验证与排查

```sh
npm test
# 默认运行地址的健康检查；反向代理时加上 BASE_PATH。
curl http://127.0.0.1:8080/api/health
```

浏览器检查可执行 `npm run test:browser`，需要本机已有 Chrome / Chromium，可通过 `CHROME_PATH` 指定可执行文件；截图写入被忽略的 `.preview/`。该检查会自动启动和关闭自己的临时服务与浏览器。

| 现象 | 处理 |
| --- | --- |
| 本机正常，其他电脑超时 | 确认使用实际内网 IP；检查主机防火墙、云安全组、VPN / 路由和公司网段策略 |
| 端口已被占用 | 改用其他 `PORT`，同步防火墙和代理端口 |
| 更新文档后仍看到旧内容 | 重新构建并刷新浏览器；不要直接编辑 `dist/` |
| 反向代理下资源 404 | 确认 `BASE_PATH`、带尾部斜线的入口及代理保留前缀一致 |
| Prim Eval 跳转失败 | 分别检查门户与 Prim Eval 的网络可达性；快照不代表平台实时状态 |
| 源资料显示灰色标记 | 原资料不在部署包内；阅读已收录方案，或在公司资料系统查找源文档 |

交付检查需要在另一台公司电脑实际访问入口并打开模块、方案与平台链接；本机健康检查只能验证服务进程，不能代替跨机器验证。
