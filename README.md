# 慢时光的影子 — 个人创作小站

## 网站效果
温暖文艺风格，包含图片、视频、音乐三个板块。
微信/抖音分享出去会显示封面图 + 标题 + 描述，一目了然。

---

## 如何部署（超简单，5分钟搞定）

### 第一步：上传到 GitHub

1. 打开 https://github.com ，登录 laoyang0001
2. 点右上角 **+** → **New repository**
3. Repository name 填：`manshiguang.github.io`
4. 选择 **Public** → 点 **Create repository**

5. 在新仓库页面，点 **uploading an existing file**
6. 把本文件夹里的 **所有文件**（index.html、style.css、script.js、images/、music/）全部拖进去
7. 点 **Commit changes**

8. 等待 1-2 分钟，打开 https://laoyang0001.github.io 就能看到网站了！

---

### 第二步：个性化配置

#### 1. 封面图
把 `images/cover.jpg` 换成你自己的横图（建议 1920×1080 以上）

#### 2. 添加图片
把图片放进 `images/` 文件夹，然后编辑 `index.html`，参考格式：

```html
<div class="photo-card">
  <img src="images/你的图片名.jpg" alt="图片标题" loading="lazy">
  <div class="card-caption">图片标题</div>
</div>
```

#### 3. 添加视频（推荐 B站）
1. 把视频上传到 B站（电脑端或手机 App）
2. 打开视频页面，右上角点 **分享** → **嵌入代码**
3. 复制 BV 号（比如 `BV1xx411c7mD`）
4. 编辑 `index.html`：

```html
<!-- 替换下面这个 src 里的 BV号 为你的 -->
<iframe src="https://player.bilibili.com/player.html?bvid=你的BV号"></iframe>
```

#### 4. 添加音乐
把 MP3 文件放进 `music/` 文件夹，编辑 `index.html`：

```html
<div class="music-item">
  <div class="music-info">
    <div class="music-title">歌曲名称</div>
    <div class="music-desc">2024</div>
  </div>
  <audio controls preload="none">
    <source src="music/你的歌曲.mp3" type="audio/mpeg">
  </audio>
</div>
```

---

## 文件夹结构

```
├── index.html      ← 网站主页面
├── style.css       ← 样式文件
├── script.js       ← 交互脚本
├── images/         ← 放图片（封面 + 作品图）
└── music/          ← 放 MP3 音乐文件
```

---

## 常见问题

**Q: 微信里打开显示"非官方域名"？**
A: GitHub Pages 在国内微信可能被拦截，可以用 [Gitee Pages](https://gitee.com) 同步一份，域名换成 gitee.io 后缀，国内微信完全正常。

**Q: 视频太大放不上去？**
A: 视频建议上传 B站/抖音，网站只嵌入播放链接，这样访问速度快又不占空间。

**Q: 想换域名？**
A: 在 GitHub 仓库 Settings → Pages → Custom domain 填入你的域名即可。

---

有问题随时找我 😊
# manshiguang.github.io
