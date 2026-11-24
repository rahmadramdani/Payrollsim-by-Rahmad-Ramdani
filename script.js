/* Simulasi Gaji — PPh 21 mengikuti PP 58/2023 & PMK 168/2023 (TER Jan–Nov, Pasal 17 untuk Desember) */

// Tabel TER bulanan [batas atas penghasilan bruto (juta Rp), tarif %]
const TER = {
  A: [[5.4,0],[5.65,.25],[5.95,.5],[6.3,.75],[6.75,1],[7.5,1.25],[8.55,1.5],[9.65,1.75],[10.05,2],[10.35,2.25],[10.7,2.5],[11.05,3],[11.6,3.5],[12.5,4],[13.75,5],[15.1,6],[16.95,7],[19.75,8],[24.15,9],[26.45,10],[28,11],[30.05,12],[32.4,13],[35.4,14],[39.1,15],[43.85,16],[47.8,17],[51.4,18],[56.3,19],[62.2,20],[68.6,21],[77.5,22],[89,23],[103,24],[125,25],[157,26],[206,27],[337,28],[454,29],[550,30],[695,31],[910,32],[1400,33],[Infinity,34]],
  B: [[6.2,0],[6.5,.25],[6.85,.5],[7.3,.75],[9.2,1],[10.75,1.5],[11.25,2],[11.6,2.5],[12.6,3],[13.6,4],[14.95,5],[16.4,6],[18.45,7],[21.85,8],[26,9],[27.7,10],[29.6,11],[31.7,12],[33.95,13],[37.1,14],[41.1,15],[45.8,16],[49.5,17],[53.8,18],[58.5,19],[64,20],[71,21],[80,22],[93,23],[109,24],[129,25],[163,26],[211,27],[374,28],[459,29],[555,30],[704,31],[957,32],[1405,33],[Infinity,34]],
  C: [[6.6,0],[6.95,.25],[7.35,.5],[7.8,.75],[8.85,1],[9.8,1.25],[10.95,1.5],[11.2,1.75],[12.05,2],[12.95,3],[14.15,4],[15.55,5],[17.05,6],[19.9,7],[24.3,8],[26.6,9],[28.25,10],[30.2,11],[32.55,12],[35.55,13],[39.25,14],[43.95,15],[47.95,16],[51.55,17],[56.45,18],[62.35,19],[68.75,20],[77.65,21],[89.15,22],[103.15,23],[125.15,24],[157.15,25],[206.15,26],[337.15,27],[454.15,28],[550.15,29],[695.15,30],[910.15,31],[1400.15,32],[Infinity,33]]
};
// Pasal 17 UU PPh (UU HPP): [batas atas PKP, tarif]
const PASAL17 = [[60e6,.05],[250e6,.15],[500e6,.25],[5e9,.30],[Infinity,.35]];
let LAST = null; // hasil perhitungan terakhir, dipakai oleh Export to PDF
const PTKP_DASAR = 54e6, PTKP_TAMBAHAN = 4.5e6;

const EARN = [
  ['gapok','Gaji Pokok',0],['tTetap','Tunjangan Tetap',0],['tTdk','Tunjangan Tidak Tetap',0],
  ['natura','Natura & Kenikmatan',0],['lembur','Lembur',0],['bonus','Bonus',0],['thr','THR',0],
  ['tPph','Tunjangan PPh21',0]
];

const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('id-ID');
const rp = n => (n < 0 ? '-' : '') + 'Rp ' + fmt(Math.abs(n));
const num = id => parseInt(($(id).value || '').replace(/\D/g, '')) || 0;
const pct = id => parseFloat(($(id).value || '0').replace(',', '.')) || 0;

// Bangun baris penghasilan
$('earnings').innerHTML = EARN.map(([id, label, v]) =>
  `<div><span>${label}</span><span>Rp</span><input class="rp" id="${id}" value="${fmt(v)}" inputmode="numeric" autocomplete="off"></div>`).join('');

function terRate(cat, bruto) {
  return TER[cat].find(([max]) => bruto <= Math.round(max * 1e6))[1];
}
function pasal17(pkp) {
  let sisa = pkp, prev = 0, pajak = 0;
  for (const [max, r] of PASAL17) {
    const bagian = Math.min(sisa, max - prev);
    if (bagian <= 0) break;
    pajak += bagian * r; sisa -= bagian; prev = max;
  }
  return Math.floor(pajak);
}

function calc() {
  const grossUp = $('gu').checked;
  const kawin = $('kawin').value === 'K', tgg = +$('tanggungan').value;
  const status = (kawin ? 'K/' : 'TK/') + tgg;
  const ptkp = PTKP_DASAR + (kawin ? PTKP_TAMBAHAN : 0) + tgg * PTKP_TAMBAHAN;
  const cat = status === 'K/3' ? 'C' : ['TK/2', 'TK/3', 'K/1', 'K/2'].includes(status) ? 'B' : 'A';
  $('ptkp').value = `${status} · Rp ${fmt(ptkp)}/tahun`;

  // Upah dasar BPJS (ubah di sini bila kebijakan perusahaan berbeda)
  const upahBpjs = num('gapok') + num('tTetap') + num('tTdk');
  const kesBase = Math.min(upahBpjs, num('maxKes') || Infinity), jpBase = Math.min(upahBpjs, num('maxJp') || Infinity); // kolom batas 0/kosong = tanpa batas
  const r = (b, id) => Math.round(b * pct(id) / 100);
  const emp = { kes: r(kesBase, 'kesK'), jht: r(upahBpjs, 'jhtK'), jp: r(jpBase, 'jpK') };
  const co = { kes: r(kesBase, 'kesP'), jht: r(upahBpjs, 'jhtP'), jp: r(jpBase, 'jpP'), jshk: r(upahBpjs, 'jshk'), jkk: r(upahBpjs, 'jkk'), jkm: r(upahBpjs, 'jkm') };
  const jkkJkm = co.kes + co.jkk + co.jkm; // premi BPJS Kes + JKK + JKM ditanggung perusahaan, tetap objek PPh 21 (PMK 168/2023)

  const nonCash = jkkJkm;
  const brutoTanpaT = EARN.reduce((s, [id]) => id === 'tPph' ? s : s + num(id), 0) + jkkJkm;

  const pph = b => {
    if ($('masa').value === 'ter') return Math.floor(b * terRate(cat, b) / 100);
    const tahun = b * 12, biayaJabatan = Math.min(tahun * .05, 6e6);
    const neto = tahun - biayaJabatan - (emp.jht + emp.jp) * 12;
    const pkp = Math.max(0, Math.floor((neto - ptkp) / 1000) * 1000);
    const terDibayar = Math.floor(b * terRate(cat, b) / 100) * 11; // asumsi penghasilan Jan–Nov sama
    return Math.max(0, pasal17(pkp) - terDibayar);
  };

  // Gross up: cari tunjangan PPh21 T sehingga T = pajak(bruto + T)
  let T = 0;
  if (grossUp) {
    for (let i = 0; i < 500; i++) { const n = pph(brutoTanpaT + T); if (n <= T) break; T = n; } // konvergen naik karena pph tidak turun
  }
  const bruto = brutoTanpaT + T;
  const pajak = pph(bruto);
  $('tPph').value = fmt(T); $('tPph').disabled = true;

  const metode = $('masa').value === 'ter' ? `TER kategori ${cat} (${terRate(cat, bruto).toString().replace('.', ',')}%)` : 'Pasal 17 (Desember)';
  const potongan = [
    [`BPJS Kesehatan (${$('kesK').value}%)`, emp.kes],
    [`BPJS Ketenagakerjaan (JHT ${$('jhtK').value}%)`, emp.jht],
    [`BPJS Ketenagakerjaan (JP ${$('jpK').value}%)`, emp.jp],
    [`PPh 21<small>${metode}${grossUp ? ' · ditanggung perusahaan' : ''}</small>`, pajak, grossUp]
  ];
  $('potongan').innerHTML = potongan.map(([l, v, info]) => `<li><span>${l}</span><b>${rp(v)}${info ? ' *' : ''}</b></li>`).join('');
  const totPot = emp.kes + emp.jht + emp.jp + (grossUp ? 0 : pajak);
  const beban = [
    [`BPJS Kesehatan (${$('kesP').value}%)`, co.kes], [`BPJS Ketenagakerjaan (JHT ${$('jhtP').value}%)`, co.jht],
    [`BPJS Ketenagakerjaan (JP ${$('jpP').value}%)`, co.jp],
    [`BPJS Ketenagakerjaan (JKK ${$('jkk').value}%)`, co.jkk], [`BPJS Ketenagakerjaan (JKM ${$('jkm').value}%)`, co.jkm], [`JSHK DKI Jakarta (${$('jshk').value}%)`, co.jshk]
  ];
  $('beban').innerHTML = beban.map(([l, v]) => `<li><span>${l}</span><b>${rp(v)}</b></li>`).join('');
  const totBeban = co.kes + co.jht + co.jp + co.jkk + co.jkm + co.jshk;

  const thp = bruto - nonCash - totPot - (grossUp ? T : 0), cost = bruto - nonCash + totBeban;
  $('bruto').textContent = rp(bruto);
  $('jkkNote').textContent = jkkJkm ? `Sudah termasuk premi BPJS Kesehatan + JKK + JKM perusahaan ${rp(jkkJkm)} (objek PPh 21, bukan diterima tunai).` : '';
  $('totPot').textContent = rp(totPot);
  $('totBeban').textContent = rp(totBeban);
  $('thp').textContent = rp(thp);
  $('cost').textContent = rp(cost);

  // Data untuk laporan PDF
  const ter = $('masa').value === 'ter', lim = id => num(id) ? 'Rp ' + fmt(num(id)) : '-';
  LAST = {
    grossUp, status, ptkp, kawin: kawin ? 'Kawin' : 'Belum Kawin', tgg: tgg + ' Orang',
    masa: ter ? 'Jan – Nov 2026 (TER)' : 'Des 2026 (Pasal 17)',
    bpjs: [
      ['BPJS Kesehatan', $('kesK').value + '%', $('kesP').value + '%', lim('maxKes')],
      ['JHT', $('jhtK').value + '%', $('jhtP').value + '%', '-'],
      ['JP', $('jpK').value + '%', $('jpP').value + '%', lim('maxJp')],
      ['JKK', '-', $('jkk').value + '%', '-'],
      ['JKM', '-', $('jkm').value + '%', '-'],
      ['JSHK DKI Jakarta', '-', $('jshk').value + '%', '-']
    ],
    earn: [...EARN.map(([id, label]) => [id, label, id === 'tPph' ? T : num(id)]), ['tJkk', 'Premi BPJS Kes, JKK & JKM Perusahaan', jkkJkm]],
    bruto, totPot, totBeban, thp, cost,
    potongan: [
      { l: `BPJS Kesehatan (${$('kesK').value}%)`, v: emp.kes }, { l: `JHT (${$('jhtK').value}%)`, v: emp.jht }, { l: `JP (${$('jpK').value}%)`, v: emp.jp },
      { l: ter ? `PPh 21 (TER ${cat} ${terRate(cat, bruto).toString().replace('.', ',')}%)` : 'PPh 21 (Pasal 17)', v: pajak, info: grossUp }
    ],
    beban: [
      { l: `BPJS Kesehatan (${$('kesP').value}%)`, v: co.kes }, { l: `JHT (${$('jhtP').value}%)`, v: co.jht },
      { l: `JP (${$('jpP').value}%)`, v: co.jp },
      { l: `JKK (${$('jkk').value}%)`, v: co.jkk }, { l: `JKM (${$('jkm').value}%)`, v: co.jkm }, { l: `JSHK DKI Jakarta (${$('jshk').value}%)`, v: co.jshk }
    ]
  };
  $('btnPdf').disabled = bruto === 0; // tombol aktif setelah ada penghasilan
}

// Dropdown kustom (menggantikan <select> bawaan browser yang jelek di HP)
const closeAll = () => document.querySelectorAll('.dd.open').forEach(d => d._close());
document.querySelectorAll('select').forEach(sel => {
  sel.classList.add('native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
  const dd = document.createElement('div'); dd.className = 'dd';
  dd.innerHTML = '<button type="button" class="dd-btn" aria-haspopup="listbox" aria-expanded="false"><span></span><i></i></button><ul class="dd-list" role="listbox"></ul>';
  sel.after(dd);
  const btn = dd.firstChild, list = dd.lastChild, text = btn.firstChild;
  list.innerHTML = [...sel.options].map(o => `<li role="option" data-v="${o.value}">${o.text}</li>`).join('');
  const sync = () => {
    text.textContent = sel.selectedOptions[0].text;
    [...list.children].forEach(li => li.setAttribute('aria-selected', li.dataset.v === sel.value));
  };
  const close = () => { dd.classList.remove('open', 'up'); btn.setAttribute('aria-expanded', 'false'); [...list.children].forEach(li => li.classList.remove('act')); };
  const open = () => {
    closeAll(); dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    const r = btn.getBoundingClientRect(), h = list.offsetHeight;
    if (innerHeight - r.bottom < h + 16 && r.top > h + 16) dd.classList.add('up'); // buka ke atas bila ruang bawah kurang
    const cur = list.querySelector('[aria-selected=true]'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
  };
  const pick = v => { sel.value = v; sync(); close(); sel.dispatchEvent(new Event('input', { bubbles: true })); btn.focus(); };
  btn.onclick = () => dd.classList.contains('open') ? close() : open();
  list.onclick = e => { const li = e.target.closest('li'); if (li) pick(li.dataset.v); };
  btn.onkeydown = e => {
    const items = [...list.children], isOpen = dd.classList.contains('open');
    let i = items.findIndex(li => li.classList.contains('act'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) { open(); i = items.findIndex(li => li.dataset.v === sel.value); } else i += e.key === 'ArrowDown' ? 1 : -1;
      i = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(li => li.classList.remove('act')); items[i].classList.add('act');
      if (items[i].scrollIntoView) items[i].scrollIntoView({ block: 'nearest' });
    } else if ((e.key === 'Enter' || e.key === ' ') && isOpen) {
      e.preventDefault(); const a = list.querySelector('.act'); a ? pick(a.dataset.v) : close();
    } else if (e.key === 'Escape') close();
  };
  sel._sync = sync; dd._close = close; sync();
});
document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeAll(); });

// Simpan nilai awal untuk tombol Reset
const DEFAULTS = [...document.querySelectorAll('input:not([readonly]),select')].map(el => [el, el.type === 'radio' ? el.checked : el.value]);

// Pilih kelas risiko JKK -> isi tarif JKK (tarif tetap bisa diubah manual)
document.addEventListener('input', e => { if (e.target.id === 'jkkKelas') $('jkk').value = e.target.value; });

// Format ribuan saat mengetik
document.addEventListener('input', e => {
  if (e.target.classList.contains('rp')) e.target.value = fmt(num(e.target.id));
  if (e.target.matches('input,select')) calc();
});
document.addEventListener('change', e => { if (e.target.name === 'mode') calc(); });
$('btnReset').onclick = () => {
  DEFAULTS.forEach(([el, v]) => { if (el.type === 'radio') el.checked = v; else el.value = v; });
  document.querySelectorAll('.rp').forEach(el => el.value = fmt(num(el.id)));
  document.querySelectorAll('select').forEach(s => s._sync());
  calc();
};
$('btnPdf').onclick = () => {
  if (!LAST) return;
  if (!window.jspdf || !window.PayrollPdf) { alert('Pustaka PDF belum termuat. Periksa koneksi internet lalu muat ulang halaman.'); return; }
  PayrollPdf.build(LAST, window.jspdf.jsPDF).save(PayrollPdf.fileName());
};
document.querySelectorAll('.rp').forEach(el => el.value = fmt(num(el.id)));
calc();
