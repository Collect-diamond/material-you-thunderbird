# Thunderbird Add-ons listing draft

This draft is for the **theme** in the repository root. `Material Pin` is a
separate, unpublished extension and is not included in the theme package.

## English

**Name:** Material You for Thunderbird

**Summary:** A Material 3 inspired Thunderbird theme with light and dark colors, rounded message cards, and a calmer mail interface.

**Description:**

Give Thunderbird a Material 3 inspired look while keeping its familiar layout.

- Light and dark color palettes with layered surfaces and clear selection states.
- Rounded controls, search field, folder rows, and message cards.
- A simpler message list header without the total mail count. Folder unread counts remain visible.
- Respects the system's high contrast and reduced motion preferences.

The theme changes Thunderbird's interface only. It does not read messages,
collect data, or make network requests. Message pinning is a separate extension
and is not part of this theme.

**Homepage and support site:** https://github.com/wpv-chan/material-you-thunderbird

**Version notes (0.1.4):** Initial public release. Includes light and dark
palettes, rounded message cards, and a simplified message list header.

**Notes for reviewers:** This is a manifest v3 Thunderbird theme. The package
contains only `manifest.json`, `material.css`, and `icon.svg`. The CSS is loaded
through Thunderbird's documented `theme_experiment.stylesheet` key and styles
Thunderbird's own interface. Source and build instructions are available at the
homepage. Tested in Thunderbird 156 on macOS.

## 简体中文

**名称：** Material You for Thunderbird

**简介：** 一款受 Material 3 启发的 Thunderbird 主题，提供浅色与深色配色、圆角邮件卡片和更简洁的邮件界面。

**详细介绍：**

为 Thunderbird 添加 Material 3 风格，同时保留熟悉的邮件布局。

- 浅色和深色配色，层次分明的界面背景与清晰的选中状态。
- 圆角按钮、搜索框、文件夹项目和邮件卡片。
- 隐藏邮件列表标题中的邮件总数，保留文件夹未读数。
- 尊重系统的高对比度和减少动态效果设置。

主题只改变 Thunderbird 的界面，不读取邮件、不收集数据，也不发起网络请求。
邮件置顶由另一个独立扩展提供，不包含在此主题中。

**0.1.4 版本说明：** 首个公开版本，包含浅色和深色配色、圆角邮件卡片以及更简洁的邮件列表标题。
