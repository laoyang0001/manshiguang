// ===== 分享功能 =====
let shareData = {};

function shareItem(url, title, type) {
  shareData = { url: window.location.href, title, type };
  document.getElementById('share-modal').classList.add('active');
  generateQR(shareData.url);
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('active');
  const box = document.getElementById('qr-container');
  if (box) box.innerHTML = '';
}

function generateQR(text) {
  const box = document.getElementById('qr-container');
  box.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    new QRCode(box, {
      text: text,
      width: 160,
      height: 160,
      colorDark: '#3d3a36',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    box.innerHTML = '<span style="color:#999;font-size:0.8rem">二维码加载中…</span>';
    setTimeout(() => generateQR(text), 1000);
  }
}

function shareNative() {
  const url = shareData.url || window.location.href;
  const title = shareData.title || document.title;
  if (navigator.share) {
    navigator.share({
      title: title,
      text: '「' + title + '」- 慢时光的影子',
      url: url
    }).catch(() => {});
  }
  closeShareModal();
}

function copyLink() {
  const url = shareData.url || window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast('✅ 链接已复制！');
  }).catch(() => {
    prompt('复制链接：', url);
  });
  closeShareModal();
}

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
    '<span class="share-btn" onclick="shareItem(\'' + src + '\', \'' + title + '\', \'photo\')">📤 分享</span>';
  lb.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

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
      const active = document.querySelector('.nav-item[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});
