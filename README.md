# Material You for Thunderbird

面向 Thunderbird 128 及更新版本的 Material 3 风格主题。提供浅色和深色配色，
使用层次化表面色、圆角控件和清晰的选中状态。
邮件列表标题只显示文件夹名称，不显示邮件总数；左侧文件夹的未读数仍保留。

## 构建

```sh
python3 build.py
```

安装包位于 `dist/material-you-thunderbird-<版本号>.xpi`。

## 安装

在 Thunderbird 打开「附加组件和主题」，在工具菜单选择「从文件安装附加组件」，
然后选择 XPI。如未自动启用，在「主题」页面启用它。

邮件置顶功能使用独立的 `Material Pin` 扩展。运行 `python3 pin-addon/build.py`，
再安装生成的 `dist/material-pin-thunderbird-<版本号>.xpi`。
在邮件列表中右键邮件，选择「📌 固定到顶部」；再次右键可取消固定。
阅读邮件时也可使用邮件标题栏的「固定」按钮。
固定的邮件排在最上方，两组邮件内仍按日期从新到旧排列。固定状态存为
Thunderbird 邮件标签 `📌 Pinned`，不会占用现有的星标。

`Material Pin` 使用 Thunderbird 的实验接口注册自定义排序列。
因此安装时 Thunderbird 会显示“完全、不受限制地访问”权限提示。
该扩展不发送网络请求，也不读取或修改邮件正文。可随时在附加组件页面停用它。

## 修改配色

编辑 `manifest.json` 中的 `theme.colors` 和 `dark_theme.colors`。
`md3_*` 颜色供 `material.css` 使用，Thunderbird 标准颜色键负责工具栏、标签页、
搜索栏、文件夹树和弹出菜单。修改后重新构建并安装 XPI。
`build.py` 会检查关键文字与背景的对比度。

## 范围

这是 Thunderbird WebExtension 主题。它改变应用界面，不修改邮件本身的 HTML。
`theme_experiment` 把 14px 圆角属性传递到嵌入式邮件列表。
未来版本更新时，部分选择器可能需要跟进。
系统高对比度与减少动态效果的设置优先。

设计与开发参考：[Material 3](https://m3.material.io/)、
[Thunderbird 主题指南](https://developer.thunderbird.net/add-ons/web-extension-themes)、
[Thunderbird 主题 API](https://webextension-api.thunderbird.net/en/mv3/theme.html)。
