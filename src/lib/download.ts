/** Client-side file downloads (CSV exports, printable reports). */

export function downloadFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function toCsv(rows: Record<string, string | number>[]) {
  if (!rows.length) return "";
  const head = Object.keys(rows[0]);
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [head.map(esc).join(","), ...rows.map((r) => head.map((h) => esc(r[h] ?? "")).join(","))].join("\n");
}

/** Printable HTML report (alert, incident, CVE…) — opens in any browser and can be "Saved as PDF". */
export function reportHtml(title: string, fields: [string, string][]) {
  const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const rows = fields.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font-family:"Geist Mono",ui-monospace,monospace;color:#111;max-width:560px;margin:40px auto;padding:0 20px}
h1{font-size:20px}.brand{color:#e12632;font-weight:700;font-size:18px;letter-spacing:.02em}
table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:10px 0;border-bottom:1px solid #e6e6e6;vertical-align:top}
td:first-child{color:#777;padding-right:16px}td:last-child{text-align:right;font-weight:500}</style></head>
<body><div class="brand">Bhishtam Tech</div><h1>${esc(title)}</h1><table>${rows}</table>
<p style="color:#777;font-size:12px;margin-top:24px">Generated ${new Date().toLocaleString()}</p></body></html>`;
}
