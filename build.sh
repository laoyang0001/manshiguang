#!/bin/bash
# 慢时光的影子 - 自动构建脚本
# 用法: ./build.sh

set -e

cd "$(dirname "$0")"

echo "📖 读取 data.json..."
DATA="data.json"

# 检查文件是否存在
if [ ! -f "$DATA" ]; then
  echo "❌ 错误：找不到 data.json，请确认文件存在"
  exit 1
fi

# 用 Python 读取 JSON 并生成 HTML
python3 << 'PYEOF'
import json, sys, os

with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

site = data["site"]

def escape(s):
    if not s: return ""
    return (str(s)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;"))

# 生成图片卡片
def photo_card(p):
    desc_html = f'<div class="item-desc">{escape(p.get("description",""))}</div>' if p.get("description") else ""
    return f'''
        <div class="photo-card">
          <div class="photo-img-wrap" onclick="openLightbox('{escape(p["src"])}', '{escape(p["title"])}', '{escape(p.get("description",""))}')">
            <img src="{escape(p["src"])}" alt="{escape(p["title"])}" loading="lazy">
            <div class="share-btn" onclick="event.stopPropagation(); shareItem('{escape(p["src"])}', '{escape(p["title"])}', 'photo')" title="分享">📤</div>
          </div>
          <div class="card-caption">
            <div class="item-title">{escape(p["title"])}</div>
            {desc_html}
          </div>
        </div>'''

# 生成视频卡片
def video_card(v):
    desc_html = f'<div class="item-desc">{escape(v.get("description",""))}</div>' if v.get("description") else ""
    return f'''
        <div class="video-card">
          <div class="video-wrap">
            <iframe src="{escape(v["embedUrl"])}" scrolling="no" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="card-caption">
            <div class="item-title">{escape(v["title"])}</div>
            {desc_html}
            <div class="share-btn" onclick="shareItem('{escape(v["embedUrl"])}', '{escape(v["title"])}', 'video')" title="分享">📤 分享</div>
          </div>
        </div>'''

# 生成歌曲卡片
def music_card(m, idx):
    lyrics_html = ""
    if m.get("lyrics"):
        lyrics_html = f'<details class="lyrics-toggle"><summary>🎤 查看歌词</summary><div class="lyrics-content">{m["lyrics"]}</div></details>'
    return f'''
        <div class="music-item">
          <div class="music-info">
            <div class="item-title">{escape(m["title"])}</div>
            <div class="music-meta">{escape(m.get("artist",""))} {escape(m.get("year",""))}</div>
            {lyrics_html}
          </div>
          <div class="music-controls">
            <audio controls preload="none">
              <source src="{escape(m["src"])}" type="audio/mpeg">
              您的浏览器不支持音频播放
            </audio>
            <div class="share-btn" onclick="shareItem('{escape(m["src"])}', '{escape(m["title"])}', 'music')" title="分享">📤 分享</div>
          </div>
        </div>'''

photos_html = "\n".join(photo_card(p) for p in data.get("photos", []))
videos_html = "\n".join(video_card(v) for v in data.get("videos", []))
music_html = "\n".join(music_card(m, i) for i, m in enumerate(data.get("music", [])))

html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:title" content="{escape(site["title"])}">
  <meta property="og:description" content="{escape(site.get("description",""))}">
  <meta property="og:image" content="{escape(site.get("cover",""))}">
  <meta property="og:url" content="https://laoyang0001.github.io/manshiguang/">
  <meta property="og:type" content="website">
  <title>{escape(site["title"])}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- 顶部封面 -->
  <header class="hero">
    <div class="hero-overlay">
      <h1>{escape(site["title"])}</h1>
      <p>{escape(site.get("tagline",""))}</p>
    </div>
  </header>

  <!-- 导航 -->
  <nav class="nav">
    <a href="#music" class="nav-item active">🎵 音乐</a>
    <a href="#videos" class="nav-item">🎬 视频</a>
    <a href="#photos" class="nav-item">📷 影像</a>
  </nav>

  <main>

    <!-- 音乐区 -->
    <section id="music" class="section">
      <h2 class="section-title">🎵 音乐</h2>
      <div class="music-list">
        {music_html or '<div class="empty-tip">🎵 音乐区正在等待作品上线...</div>'}
      </div>
    </section>

    <!-- 视频区 -->
    <section id="videos" class="section">
      <h2 class="section-title">🎬 视频</h2>
      <div class="video-grid">
        {videos_html or '<div class="empty-tip">🎬 视频区正在等待作品上线...</div>'}
      </div>
    </section>

    <!-- 图片区 -->
    <section id="photos" class="section">
      <h2 class="section-title">📷 影像</h2>
      <div class="photo-grid">
        {photos_html or '<div class="empty-tip">📷 影像区正在等待作品上线...</div>'}
      </div>
    </section>

  </main>

  <!-- 图片灯箱 -->
  <div id="lightbox" class="lightbox" onclick="closeLightbox()">
    <div class="lightbox-content" onclick="event.stopPropagation()">
      <span class="lightbox-close" onclick="closeLightbox()">×</span>
      <img id="lightbox-img" src="" alt="">
      <div class="lightbox-caption">
        <div id="lightbox-title" class="lightbox-title"></div>
        <div id="lightbox-desc" class="lightbox-desc"></div>
        <div class="lightbox-share" id="lightbox-share-btn"></div>
      </div>
    </div>
  </div>

  <!-- 分享弹窗 -->
  <div id="share-modal" class="lightbox" onclick="closeShareModal()">
    <div class="share-panel" onclick="event.stopPropagation()">
      <div class="share-title">分享到</div>
      <div class="share-icons">
        <div class="share-icon" onclick="shareNative('wechat')">💬<span>微信</span></div>
        <div class="share-icon" onclick="shareNative('douyin')">🎵<span>抖音</span></div>
        <div class="share-icon" onclick="shareNative('weibo')">🔺<span>微博</span></div>
        <div class="share-icon" onclick="shareNative('qq')">🐧<span>QQ</span></div>
        <div class="share-icon" onclick="copyLink()">🔗<span>复制链接</span></div>
      </div>
      <div class="share-close" onclick="closeShareModal()">取消</div>
    </div>
  </div>

  <footer class="footer">
    <p>© {escape(site["title"])} · 用心记录每一刻</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>'''

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ index.html 生成成功！")
print(f"📷 图片: {len(data.get('photos', []))} 张")
print(f"🎬 视频: {len(data.get('videos', []))} 个")
print(f"🎵 音乐: {len(data.get('music', []))} 首")
PYEOF

# Git 自动提交推送
echo ""
echo "🚀 推送到 GitHub..."
git add .
git commit -m "更新网站 $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "（没有新变化）"
git push origin main 2>/dev/null && echo "✅ 推送成功！" || echo "⚠️ 推送失败（请确认已登录 gh 或令牌有效）"
