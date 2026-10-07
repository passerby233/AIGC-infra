# 随网页分发的参考与依赖

- `client/vendor/marked.esm.js`：Marked 11.2.0，MIT License，许可见同目录 `marked-LICENSE.md`。项目地址：https://github.com/markedjs/marked 。Markdown 的 HTML 输出经过本站允许列表清理后展示。
- `client/previews/prim-eval/`：用户提供的 `asset/Prim Eval.mhtml` 所保存的界面。离线转换为只读参考，移除脚本、外部请求与交互表单；真实操作通过原平台入口完成。
- `client/images/eval-*.png`：用户提供的 TCLOUD-12853 需求中的报表与评分展示参考，代表需求方案。
- `reference-docs/algorithm-template/`：同工作区 algorithm-template 的精选模板快照（2026-10-06），用于门户独立部署时阅读协议；不是实际项目数据。构建时优先读取相邻 algorithm-template 或 `ALGORITHM_TEMPLATE_DIR` 指向的模板目录。

门户与界面参考供公司内部使用。原始 MHTML 不在网页服务目录中分发。
