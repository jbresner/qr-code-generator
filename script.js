const input = document.getElementById('urlInput');
const genBtn = document.getElementById('genBtn');
const errMsg = document.getElementById('errMsg');
const placeholder = document.getElementById('placeholder');
const previewWrap = document.getElementById('previewWrap');
const qrSvgWrap = document.getElementById('qrSvgWrap');
const dlBtn = document.getElementById('dlBtn');
const checkerBg = document.getElementById('checkerBg');
const transparentToggle = document.getElementById('transparentToggle');
const colorPicker = document.getElementById('colorPicker');

let lastMatrix = null;
let lastModuleCount = 0;

input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
genBtn.addEventListener('click', generate);
transparentToggle.addEventListener('change', onOptionsChange);
colorPicker.addEventListener('input', onOptionsChange);
dlBtn.addEventListener('click', download);

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Use qrcode-generator library to get the raw module matrix directly
function getQrMatrix(url) {
  const qr = qrcode(0, 'H');
  qr.addData(url);
  qr.make();

  const count = qr.getModuleCount();
  const matrix = [];
  for (let r = 0; r < count; r++) {
    const row = [];
    for (let c = 0; c < count; c++) {
      row.push(qr.isDark(r, c));
    }
    matrix.push(row);
  }
  return { matrix, moduleCount: count };
}

function buildSvg(matrix, moduleCount, transparent, color, displaySize) {
  const n = moduleCount;
  const rects = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        rects.push(`<rect x="${c}" y="${r}" width="1" height="1"/>`);
      }
    }
  }
  const bg = transparent ? '' : `<rect width="${n}" height="${n}" fill="#fff"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" width="${displaySize}" height="${displaySize}" shape-rendering="crispEdges">${bg}<g fill="${color}">${rects.join('')}</g></svg>`;
}

function renderQr() {
  if (!lastMatrix) return;
  const transparent = transparentToggle.checked;
  const color = colorPicker.value;
  qrSvgWrap.innerHTML = buildSvg(lastMatrix, lastModuleCount, transparent, color, 280);
  checkerBg.style.display = transparent ? 'block' : 'none';
}

function onOptionsChange() {
  if (lastMatrix) renderQr();
}

function generate() {
  const raw = input.value.trim();
  if (!raw) {
    errMsg.textContent = 'Please enter a URL.';
    return;
  }

  let url = raw;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  if (!isValidUrl(url)) {
    errMsg.textContent = 'Enter a valid URL (e.g. https://example.com).';
    return;
  }

  errMsg.textContent = '';

  try {
    const data = getQrMatrix(url);
    lastMatrix = data.matrix;
    lastModuleCount = data.moduleCount;
    renderQr();
    placeholder.style.display = 'none';
    previewWrap.style.display = 'inline-block';
    dlBtn.style.display = 'inline-block';
  } catch (e) {
    errMsg.textContent = 'Failed to generate. Try a shorter URL.';
  }
}

function download() {
  const transparent = transparentToggle.checked;
  const color = colorPicker.value;
  const n = lastModuleCount;
  const svgStr = buildSvg(lastMatrix, n, transparent, color, n * 4);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'qrcode.svg';
  a.click();
  URL.revokeObjectURL(a.href);
}
