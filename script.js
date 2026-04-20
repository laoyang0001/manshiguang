// ===== 分享功能 =====
let shareData = {};

function shareItem(url, title, type) {
  shareData = { url, title, type };
  const modal = document.getElementById('share-modal');
  modal.classList.add('active');
  // 生成二维码
  generateQR(shareData.url || window.location.href);
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('active');
}

// 生成二维码（使用开源 qrcode.js CDN，无需 API key）
function generateQR(text) {
  const box = document.getElementById('qr-container');
  box.innerHTML = '';
  // 获取完整 URL（相对路径补全）
  const fullUrl = new URL(text, window.location.href).href;
  // 用 Google Chart API 生成二维码图片
  const img = document.createElement('img');
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(fullUrl)}`;
  img.alt = '二维码';
  img.style.cssText = 'width:160px;height:160px;border-radius:8px;margin:0.5rem auto;display:block;';
  box.appendChild(img);
}

// 浏览器原生分享（手机端弹出系统分享菜单，可选微信/抖音/QQ等）
function shareNative() {
  const url = shareData.url || window.location.href;
  const title = shareData.title || document.title;
  const fullUrl = new URL(url, window.location.href).href;

  if (navigator.share) {
    navigator.share({
      title: title,
      text: `「${title}」- 慢时光的影子`,
      url: fullUrl
    }).catch(() => {});
  }
  closeShareModal();
}

// 复制链接
function copyLink() {
  const url = shareData.url || window.location.href;
  const fullUrl = new URL(url, window.location.href).href;
  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast('✅ 链接已复制！');
  }).catch(() => {
    prompt('复制链接：', fullUrl);
  });
  closeShareModal();
}

// 微信/抖音分享提示
function shareWechatGuide() {
  showToast('📱 扫描上方二维码 → 用微信/抖音扫一扫即可分享');
}

// 显示轻提示
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#3d3a36;color:#fff;padding:0.6rem 1.5rem;border-radius:2rem;font-size:0.9rem;z-index:9999;animation:fadeUp 2s forwards';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
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
      const active = document.querySelector(`.share-icon.nav-item[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});
