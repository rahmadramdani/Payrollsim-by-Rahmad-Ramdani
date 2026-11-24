/* Generator PDF "Laporan Perhitungan Payroll" (A4) — memakai jsPDF, digambar manual mengikuti template. */
(function (root) {
  'use strict';
  const C = { yellow: [255, 201, 60], yellow2: [255, 217, 102], pale: [255, 246, 214], band: [255, 231, 150], line: [236, 229, 208],
    ink: [31, 35, 48], mut: [96, 102, 120], grey: [243, 243, 246], border: [255, 214, 100], white: [255, 255, 255] };
  const SHORT = { tJkk: 'Premi BPJS Kes, JKK, JKM Perush.' };
  const rpf = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  function build(d, JsPDF) {
    const doc = new JsPDF({ unit: 'mm', format: 'a4', compress: true });
    const W = 210, M = 12, CW = W - 2 * M;
    const fill = c => doc.setFillColor(c[0], c[1], c[2]), stroke = c => doc.setDrawColor(c[0], c[1], c[2]);
    const font = (size, style, c) => { doc.setFont('helvetica', style || 'normal'); doc.setFontSize(size); const k = c || C.ink; doc.setTextColor(k[0], k[1], k[2]); };
    const T = (s, x, y, align) => doc.text(String(s), x, y, align ? { align } : undefined);
    const poly = (pts, c) => { fill(c); doc.lines(pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]), pts[0][0], pts[0][1], [1, 1], 'F', true); };
    const fit = (t, max, size, style) => { doc.setFont('helvetica', style); doc.setFontSize(size); while (doc.getTextWidth(t) > max && size > 6) { size -= .5; doc.setFontSize(size); } return size; };

    // ---------- ikon ----------
    const icon = (name, cx, cy, k, hole) => {
      const x = v => cx + v * k, y = v => cy + v * k;
      fill(C.ink); stroke(C.ink); doc.setLineWidth(.5 * k);
      if (name === 'user') { doc.circle(x(0), y(-1.1), 1.2 * k, 'F'); doc.ellipse(x(0), y(1.9), 2.1 * k, 1.3 * k, 'F'); }
      else if (name === 'shield') {
        poly([[x(-1.9), y(-2.2)], [x(1.9), y(-2.2)], [x(1.9), y(.4)], [x(0), y(2.4)], [x(-1.9), y(.4)]], C.ink);
        stroke(hole); doc.setLineWidth(.45 * k); doc.lines([[.8 * k, .8 * k], [1.4 * k, -1.4 * k]], x(-.9), y(0), [1, 1], 'S');
      } else if (name === 'bag') {
        doc.circle(x(0), y(.8), 2.1 * k, 'F'); poly([[x(-1), y(-2.2)], [x(1), y(-2.2)], [x(.7), y(-.9)], [x(-.7), y(-.9)]], C.ink);
        font(5 * k, 'bold', hole); T('$', x(0), y(1.8), 'center');
      } else if (name === 'scissors') {
        doc.circle(x(-1.7), y(1.6), .9 * k, 'S'); doc.circle(x(1.7), y(1.6), .9 * k, 'S');
        doc.line(x(-1.2), y(.9), x(2), y(-2.3)); doc.line(x(1.2), y(.9), x(-2), y(-2.3));
      } else if (name === 'build') {
        doc.rect(x(-1.9), y(-2.4), 3.8 * k, 4.8 * k, 'F'); fill(hole);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) doc.rect(x(-1.1 + c * 1.3), y(-1.7 + r * 1.3), .8 * k, .8 * k, 'F');
      } else if (name === 'wallet') {
        doc.roundedRect(x(-2.4), y(-1.4), 4.8 * k, 3.6 * k, .6 * k, .6 * k, 'F'); doc.rect(x(-1.9), y(-2.2), 3.2 * k, 1 * k, 'F');
        fill(hole); doc.roundedRect(x(.8), y(-.2), 1.6 * k, 1.2 * k, .3 * k, .3 * k, 'F');
      } else if (name === 'calc') {
        doc.setLineWidth(.7 * k); doc.roundedRect(x(-2.6), y(-3.4), 5.2 * k, 6.8 * k, .8 * k, .8 * k, 'S');
        doc.rect(x(-1.8), y(-2.6), 3.6 * k, 1.5 * k, 'F');
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) doc.rect(x(-1.8 + c * 1.4), y(-.4 + r * 1.2), .8 * k, .7 * k, 'F');
      }
    };
    const badge = (cx, cy, name) => { fill(C.yellow2); doc.circle(cx, cy, 3.6, 'F'); icon(name, cx, cy, 1, C.yellow2); };

    // ---------- header ----------
    poly([[174, 0], [186, 0], [178, 33], [166, 33]], [255, 240, 185]);
    poly([[188, 0], [203, 0], [195, 33], [180, 33]], C.yellow2);
    poly([[205, 0], [225, 0], [217, 33], [197, 33]], C.yellow);
    fill(C.yellow); doc.roundedRect(M, 9, 17, 17, 4, 4, 'F'); icon('calc', M + 8.5, 17.5, 1.05, C.yellow);
    font(21, 'bold'); T('PayrollSim', 33, 19); font(8.5, 'bold'); T('by Rahmad Ramdani', 33.3, 25);
    stroke([205, 205, 212]); doc.setLineWidth(.3); doc.line(80, 11, 80, 26);
    const ts = fit('Laporan Perhitungan Payroll', 76, 14, 'bold'); font(ts, 'bold'); T('Laporan Perhitungan Payroll', 86, 18.5);
    font(8, 'normal', C.mut); T('Simulasi Perhitungan Gaji, Potongan, dan Tunjangan', 86, 24.3);
    stroke(C.yellow); doc.setLineWidth(.7); doc.line(M, 33, 166, 33);

    // ---------- helper kartu & tabel ----------
    const card = (x, y, w, h, title, ic) => {
      fill(C.white); stroke(C.border); doc.setLineWidth(.35); doc.roundedRect(x, y, w, h, 2.5, 2.5, 'FD');
      fill(C.band); doc.roundedRect(x + .2, y + .2, w - .4, 9, 2.4, 2.4, 'F'); doc.rect(x + .2, y + 5, w - .4, 4.2, 'F');
      doc.roundedRect(x, y, w, h, 2.5, 2.5, 'S'); badge(x + 6.5, y + 4.7, ic);
      font(10.5, 'bold'); T(title, x + 12.5, y + 6.2);
    };
    const cell = (t, cx, by, c) => { if (c.a === 'r') T(t, cx + c.w - 3, by, 'right'); else if (c.a === 'c') T(t, cx + c.w / 2, by, 'center'); else T(t, cx + 3, by); };
    const table = (x, y, cols, head, rows, rh) => {
      const w = cols.reduce((s, c) => s + c.w, 0), hh = 6.4;
      fill(C.pale); doc.rect(x, y, w, hh, 'F'); font(8.2, 'bold');
      let cx = x; cols.forEach((c, i) => { cell(head[i], cx, y + hh - 2.1, c); cx += c.w; });
      let yy = y + hh; stroke(C.line); doc.setLineWidth(.2);
      rows.forEach(r => {
        doc.line(x, yy, x + w, yy); font(8.2, r.style || 'normal', r.color);
        cx = x; r.cells.forEach((t, i) => { cell(t, cx, yy + rh - 1.7, cols[i]); cx += cols[i].w; }); yy += rh;
      });
      doc.line(x, yy, x + w, yy); cx = x;
      for (let i = 0; i < cols.length - 1; i++) { cx += cols[i].w; doc.line(cx, y, cx, yy); }
      return yy;
    };
    const totalRow = (x, y, w, label, val) => {
      fill(C.band); doc.roundedRect(x + .8, y, w - 1.6, 7, 1.2, 1.2, 'F');
      font(9, 'bold'); T(label, x + 3.8, y + 4.8); T(val, x + w - 3.8, y + 4.8, 'right');
    };

    // ---------- Data Karyawan ----------
    let y = 40; const dh = 34;
    card(M, y, CW, dh, 'Data Karyawan', 'user');
    const split = M + 102; stroke(C.line); doc.setLineWidth(.3); doc.line(split, y + 12, split, y + dh - 3);
    const pill = (x, yy, w, t) => { fill(C.grey); doc.roundedRect(x, yy - 3.6, w, 5, 2.5, 2.5, 'F'); font(8.2); T(t, x + 3, yy); };
    const radio = (x, yy, on) => { stroke(C.mut); doc.setLineWidth(.3); fill(C.white); doc.circle(x, yy - 1.2, 1.4, 'FD'); if (on) { fill(C.yellow); doc.circle(x, yy - 1.2, .8, 'F'); } };
    const ry = y + 17, lx = M + 5, rx = split + 5;
    const lab = (t, x, yy, colon) => { font(8.2, 'bold'); T(t, x, yy); T(':', colon, yy); };
    lab('Status Karyawan', lx, ry, M + 36); radio(M + 41, ry, d.grossUp); font(7.7); T('Gross Up (Pajak ditanggung perusahaan)', M + 44, ry);
    radio(M + 41, ry + 5.2, !d.grossUp); font(7.7); T('Gross (Pajak ditanggung karyawan)', M + 44, ry + 5.2);
    lab('PTKP', lx, ry + 12, M + 36); pill(M + 40, ry + 12, 60, d.status + '  (' + rpf(d.ptkp) + '/tahun)');
    const pw = 198 - 3 - (rx + 35);
    lab('Status Perkawinan', rx, ry, rx + 31); pill(rx + 35, ry, pw, d.kawin);
    lab('Jumlah Tanggungan', rx, ry + 6, rx + 31); pill(rx + 35, ry + 6, pw, d.tgg);
    lab('Masa Pajak', rx, ry + 12, rx + 31); pill(rx + 35, ry + 12, pw, d.masa);
    y += dh + 4;

    // ---------- Batas Upah & Tarif BPJS ----------
    const bh = 9 + 6.4 + d.bpjs.length * 5 + 1.5;
    card(M, y, CW, bh, 'Batas Upah & Tarif BPJS', 'shield');
    table(M + .3, y + 9, [{ w: 58 }, { w: 40, a: 'c' }, { w: 40, a: 'c' }, { w: 47.4, a: 'c' }],
      ['Komponen', 'Tarif Karyawan', 'Tarif Perusahaan', 'Batas Upah'], d.bpjs.map(r => ({ cells: r })), 5);
    y += bh + 4;

    // ---------- Penghasilan & Potongan ----------
    const earn = d.earn.filter(e => ['gapok', 'tTetap', 'tTdk'].includes(e[0]) || e[2] > 0);
    const nMax = Math.max(earn.length, d.potongan.length);
    const note = d.grossUp ? 4.5 : 0, ehFix = 9 + 6.4 + d.beban.length * 5 + 1 + 8.5;
    const rh = Math.max(4.2, Math.min(5.8, (277 - 22 - 8 - y - ehFix - (9 + 6.4 + note + 1 + 8.5)) / nMax));
    const hh2 = 9 + 6.4 + nMax * rh + note + 1 + 8.5, hw = 91;
    card(M, y, hw, hh2, 'Penghasilan', 'bag'); card(M + CW - hw, y, hw, hh2, 'Rincian Potongan Karyawan', 'scissors');
    table(M + .3, y + 9, [{ w: 55 }, { w: 35.4, a: 'r' }], ['Komponen', 'Nominal'], earn.map(e => ({ cells: [SHORT[e[0]] || e[1], rpf(e[2])] })), rh);
    table(M + CW - hw + .3, y + 9, [{ w: 55 }, { w: 35.4, a: 'r' }], ['Komponen', 'Nominal'],
      d.potongan.map(p => p.info ? { cells: [p.l, rpf(p.v) + ' *'], color: C.mut, style: 'italic' } : { cells: [p.l, rpf(p.v)] }), rh);
    if (d.grossUp) { font(6.8, 'italic', C.mut); T('* PPh 21 ditanggung perusahaan (Gross Up), tidak mengurangi THP.', M + CW - hw + 3, y + 9 + 6.4 + d.potongan.length * rh + 3.6); }
    totalRow(M, y + hh2 - 8.5, hw, 'Penghasilan Bruto', rpf(d.bruto));
    totalRow(M + CW - hw, y + hh2 - 8.5, hw, 'Total Potongan Karyawan', rpf(d.totPot));
    y += hh2 + 4;

    // ---------- Beban Perusahaan ----------
    const eh = ehFix;
    card(M, y, CW, eh, 'Rincian Beban Perusahaan', 'build');
    table(M + .3, y + 9, [{ w: 140 }, { w: 45.4, a: 'r' }], ['Komponen', 'Nominal'], d.beban.map(b => ({ cells: [b.l, rpf(b.v)] })), 5);
    totalRow(M, y + eh - 8.5, CW, 'Total Beban Perusahaan (termasuk JSHK)', rpf(d.totBeban));
    y += eh + 4;

    // ---------- Ringkasan ----------
    const box = (x, w, bg, bd, ic, title, val, sub) => {
      fill(bg); stroke(bd); doc.setLineWidth(.4); doc.roundedRect(x, y, w, 22, 3, 3, 'FD'); icon(ic, x + 13, y + 11, 2.6, bg);
      font(10, 'bold'); T(title, x + 27, y + 6.5); const s = fit(val, w - 31, 19, 'bold'); font(s, 'bold'); T(val, x + 27, y + 14.5);
      font(7.5, 'italic', C.mut); T(sub, x + 27, y + 19);
    };
    const bw = (CW - 4) / 2;
    box(M, bw, C.pale, C.border, 'wallet', 'Take Home Pay (THP)', rpf(d.thp), 'Gaji bersih yang diterima karyawan');
    box(M + bw + 4, bw, C.grey, [220, 220, 226], 'build', 'Total Biaya Perusahaan', rpf(d.cost), 'Total pengeluaran perusahaan');

    // ---------- Footer ----------
    poly([[0, 297], [0, 281], [16, 297]], C.yellow); poly([[0, 275], [0, 279], [18, 297], [13, 297]], [255, 236, 170]);
    stroke(C.yellow); doc.setLineWidth(.7); doc.line(M, 279, 198, 279);
    fill(C.yellow); doc.circle(26, 285.2, 2.6, 'F'); font(8.5, 'bold'); T('i', 26, 286.3, 'center');
    font(9, 'bold'); T('Dasar Perhitungan', 31, 284.2);
    font(7.2, 'normal', C.ink);
    doc.splitTextToSize('PPh 21 Januari–November memakai Tarif Efektif Rata-Rata (TER) sesuai PMK 168/2023 dan Desember memakai tarif progresif Pasal 17. Hasil ini merupakan simulasi, bukan pengganti perhitungan resmi.', 116)
      .forEach((l, i) => T(l, 31, 288.2 + i * 3.4));
    font(8, 'bold'); T('PayrollSim by Rahmad Ramdani', 198, 284.2, 'right');
    font(7.5, 'italic', C.mut); T('Jakarta, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 198, 288.4, 'right');
    return doc;
  }

  const fileName = () => 'PayrollSim_Laporan_Payroll_' + new Date().toISOString().slice(0, 10) + '.pdf';
  const api = { build, fileName };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.PayrollPdf = api;
})(typeof window !== 'undefined' ? window : globalThis);
