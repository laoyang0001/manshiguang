// ===== 分享功能 =====
let shareData = {};

function shareItem(url, title, type) {
  shareData = { url, title, type };
  document.getElementById('share-modal').classList.add('active');
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('active');
}

// 浏览器原生分享（手机端弹出系统分享菜单）
function shareNative(platform) {
  const url = shareData.url || window.location.href;
  const title = shareData.title || document.title;
  const desc = document.querySelector('meta[name="description"]')?.content || '';

  // Web Share API（手机浏览器）
  if (navigator.share) {
    navigator.share({ title, text: desc, url }).catch(() => {});
    closeShareModal();
    return;
  }

  // 桌面端：平台跳转分享链接
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareUrls = {
    wechat:  null, // 微信需要扫码，单独处理
    douyin:  `https://www.douyin.com/share/video/${encodeURIComponent(url)}`,
    weibo:   `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
    qq:      `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`,
  };

  if (platform === 'wechat') {
    // 微信：提示用浏览器打开后在微信内分享
    alert('📱 请用手机浏览器打开此页面，点击分享按钮 → 选择微信\n\n电脑端：复制链接后打开手机微信粘贴分享');
    copyLink();
  } else if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=500');
  }
  closeShareModal();
}

// 复制链接
function copyLink() {
  const url = shareData.url || window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    // 显示复制成功提示
    const toast = document.createElement('div');
    toast.textContent = '🔗 链接已复制！';
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#3d3a36;color:#fff;padding:0.6rem 1.5rem;border-radius:2rem;font-size:0.9rem;z-index:9999;animation:fadeUp 2s forwards';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }).catch(() => {
    prompt('复制链接：', url);
  });
  closeShareModal();
}

// ===== 灯箱（大图预览）=====
function openLightbox(src, title, desc) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-title').textContent = title;
  document.getElementById('lightbox-desc').textContent = desc || '';
  document.getElementById('lightbox-share-btn').innerHTML =
    `<span class="share-btn" onclick="shareItem('${src}', '${title}', 'photo')">📤 分享</span>`;
  lb.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

// ESC 关闭弹窗
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeShareModal();
  }
});

// ===== 导航高亮 =====
const sections = ['music', 'videos', 'photos'];
const navLinks = document.querySelectorAll('.nav-item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});
