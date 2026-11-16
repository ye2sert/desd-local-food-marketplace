# SD source: run  python3 SD_source.py  to regenerate SD.svg (classic i* notation, Use Case 2).
# Needs only Python 3. Edit text, positions or dependencies below, then run again.
import math, html
GREEN, GSTROKE = "#e3f2e6", "#2d5a4a"
ACT, ASTROKE = "#d6ebf5", "#1d3b4f"
LINE = "#5b6b75"
def esc(s): return html.escape(s, quote=True)

def wrap(text, maxc):
    out, cur = [], ""
    for w in text.split():
        if len(cur) + len(w) + (1 if cur else 0) <= maxc: cur = (cur + " " + w).strip()
        else: out.append(cur); cur = w
    if cur: out.append(cur)
    return out


def wavy(x, y, hw, hh, N=28, amp=0.11):
    import math
    pts = []
    for i in range(N):
        a = 2 * math.pi * i / N
        rr = 1 + amp * math.sin(a * 7)
        pts.append((x + hw * rr * math.cos(a), y + hh * rr * math.sin(a)))
    P = pts + pts[:3]
    d = f"M{P[1][0]:.1f},{P[1][1]:.1f}"
    for i in range(1, N + 1):
        p0, p1, p2, p3 = P[i-1], P[i], P[i+1], P[i+2]
        c1 = (p1[0] + (p2[0]-p0[0])/6, p1[1] + (p2[1]-p0[1])/6)
        c2 = (p2[0] - (p3[0]-p1[0])/6, p2[1] - (p3[1]-p1[1])/6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d

class Diagram:
    def __init__(s, w, h, title):
        s.w, s.h, s.title = w, h, title
        s.back, s.mid, s.front, s.nodes = [], [], [], {}
    # ---------------------------------------------------------- nodes
    def actor(s, id, text, x, y, r=62, fs=15):
        s.nodes[id] = dict(kind="actor", x=x, y=y, r=r, w=2*r, h=2*r)
        s.front.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{ACT}" stroke="{ASTROKE}" stroke-width="2"/>'
                       f'<line x1="{x-r*0.87:.0f}" y1="{y-r*0.5:.0f}" x2="{x+r*0.87:.0f}" y2="{y-r*0.5:.0f}" stroke="{ASTROKE}" stroke-width="1"/>'
                       + s.text(text.split("\n"), x, y + 8, fs, bold=True))
    def text(s, lines, x, y, fs=14, bold=False):
        n = len(lines); y0 = y - (n - 1) * fs * 0.6
        t = "".join(f'<tspan x="{x}" y="{y0 + i*fs*1.2:.0f}">{esc(l)}</tspan>' for i, l in enumerate(lines))
        return f'<text text-anchor="middle" dominant-baseline="middle" font-family="Helvetica,Arial,sans-serif" font-size="{fs}" font-weight="{"700" if bold else "400"}" fill="#142a36">{t}</text>'
    def el(s, id, kind, text, x, y, w=170, h=62, fs=14, mc=None, tag=None):
        s.nodes[id] = dict(kind=kind, x=x, y=y, w=w, h=h)
        mc = mc or max(8, int(w / (fs * 0.56)))
        lines = wrap(text, mc)
        hw, hh = w / 2, h / 2
        if kind == "goal":
            sh = f'<rect x="{x-hw}" y="{y-hh}" width="{w}" height="{h}" rx="{hh}" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>'
        elif kind == "task":
            k = min(26, hh)
            sh = f'<polygon points="{x-hw},{y} {x-hw+k},{y-hh} {x+hw-k},{y-hh} {x+hw},{y} {x+hw-k},{y+hh} {x-hw+k},{y+hh}" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>'
        elif kind == "resource":
            sh = f'<rect x="{x-hw}" y="{y-hh}" width="{w}" height="{h}" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>'
        elif kind == "soft":
            d = wavy(x, y, hw, hh)
            sh = f'<path d="{d} Z" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>'
        s.front.append(sh + s.text(lines, x, y, fs))
        if tag:
            s.front.append(f'<text x="{x+hw-4}" y="{y-hh-4}" font-family="Helvetica,Arial,sans-serif" font-size="12" font-weight="700" fill="#b4521b">{esc(tag)}</text>')
    # ---------------------------------------------------------- geometry
    def edge(s, id, tx, ty):
        n = s.nodes[id]; dx, dy = tx - n["x"], ty - n["y"]
        d = math.hypot(dx, dy) or 1
        if n["kind"] == "actor": t = n["r"] / d
        else:
            t = min((n["w"]/2) / abs(dx) if dx else 1e9, (n["h"]/2) / abs(dy) if dy else 1e9)
            t = min(t, 1.0)
        return n["x"] + dx * t, n["y"] + dy * t
    def dmark(s, x, y, ang):
        return (f'<path d="M0,-11 A11,11 0 0 1 0,11 Z" transform="translate({x:.1f},{y:.1f}) rotate({math.degrees(ang):.1f})" '
                f'fill="#fff" stroke="#222" stroke-width="1.6"/>')
    def seg(s, a, b, dep=True, pa=None, pb=None, curve=0):
        ax, ay = pa or (s.nodes[a]["x"], s.nodes[a]["y"]); bx, by = pb or (s.nodes[b]["x"], s.nodes[b]["y"])
        x0, y0 = s.edge(a, bx, by); x1, y1 = s.edge(b, ax, ay)
        s.back.append(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{LINE}" stroke-width="2"/>')
        if dep:
            ang = math.atan2(y1 - y0, x1 - x0)
            s.mid.append(s.dmark((x0 + x1) / 2, (y0 + y1) / 2, ang))
    def dependency(s, depender, dependum, dependee):
        s.seg(depender, dependum, True); s.seg(dependum, dependee, True)
    def decomp(s, child, parent):
        cx, cy = s.nodes[child]["x"], s.nodes[child]["y"]; px, py = s.nodes[parent]["x"], s.nodes[parent]["y"]
        x0, y0 = s.edge(child, px, py); x1, y1 = s.edge(parent, cx, cy)
        s.back.append(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="#222" stroke-width="2"/>')
        L = math.hypot(x1-x0, y1-y0) or 1; ux, uy = (x1-x0)/L, (y1-y0)/L
        bx, by = x1 - ux * 22, y1 - uy * 22; nx, ny = -uy, ux
        s.mid.append(f'<line x1="{bx-nx*9:.1f}" y1="{by-ny*9:.1f}" x2="{bx+nx*9:.1f}" y2="{by+ny*9:.1f}" stroke="#222" stroke-width="2.6"/>')
    def arrow(s, a, b, label=None, color="#222", lab_off=(0, -10)):
        ax, ay = s.nodes[a]["x"], s.nodes[a]["y"]; bx, by = s.nodes[b]["x"], s.nodes[b]["y"]
        x0, y0 = s.edge(a, bx, by); x1, y1 = s.edge(b, ax, ay)
        ang = math.atan2(y1 - y0, x1 - x0)
        s.back.append(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{color}" stroke-width="2"/>')
        s.mid.append(f'<polygon points="0,0 -15,-6 -15,6" transform="translate({x1:.1f},{y1:.1f}) rotate({math.degrees(ang):.1f})" fill="{color}"/>')
        if label:
            s.mid.append(f'<text x="{(x0+x1)/2+lab_off[0]:.0f}" y="{(y0+y1)/2+lab_off[1]:.0f}" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#7a1f1f">{esc(label)}</text>')
    def raw(s, svg, layer="back"): getattr(s, layer).append(svg)
    def key(s, x, y, sr=False, extra=""):
        H = 560 if sr else 330
        g = [f'<rect x="{x}" y="{y}" width="360" height="{H}" fill="#fff" stroke="#8a98a0" stroke-width="1.5" rx="6"/>',
             f'<text x="{x+14}" y="{y+26}" font-family="Helvetica,Arial,sans-serif" font-size="17" font-weight="700" fill="#142a36">Key</text>']
        s.front.append("".join(g))
        yy = y + 62
        def lab(t, yy2): return f'<text x="{x+120}" y="{yy2+5}" font-family="Helvetica,Arial,sans-serif" font-size="14" fill="#142a36">{esc(t)}</text>'
        s.front.append(f'<circle cx="{x+50}" cy="{yy}" r="20" fill="{ACT}" stroke="{ASTROKE}" stroke-width="2"/>' + lab("Actor", yy)); yy += 44
        s.front.append(f'<rect x="{x+22}" y="{yy-14}" width="56" height="28" rx="14" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>' + lab("Hard goal", yy)); yy += 40
        s.front.append(f'<polygon points="{x+18},{yy} {x+32},{yy-14} {x+68},{yy-14} {x+82},{yy} {x+68},{yy+14} {x+32},{yy+14}" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>' + lab("Task", yy)); yy += 40
        s.front.append(f'<rect x="{x+22}" y="{yy-14}" width="56" height="28" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>' + lab("Resource", yy)); yy += 40
        s.front.append(f'<path d="{wavy(x+50, yy, 30, 14, N=20)} Z" fill="{GREEN}" stroke="{GSTROKE}" stroke-width="2"/>' + lab("Softgoal", yy)); yy += 40
        s.front.append(f'<line x1="{x+14}" y1="{yy}" x2="{x+90}" y2="{yy}" stroke="{LINE}" stroke-width="2"/>' + s.dmark(x + 52, yy, 0) + lab("Dependency (points to dependee)", yy)); yy += 44
        if sr:
            s.front.append(f'<line x1="{x+20}" y1="{yy+14}" x2="{x+90}" y2="{yy-14}" stroke="#222" stroke-width="2"/><line x1="{x+72}" y1="{yy-6}" x2="{x+84}" y2="{yy-20}" stroke="#222" stroke-width="2.6"/>' + lab("Task decomposition: all parts required", yy)); yy += 44
            s.front.append(f'<line x1="{x+20}" y1="{yy}" x2="{x+86}" y2="{yy}" stroke="#222" stroke-width="2"/><polygon points="{x+90},{yy} {x+75},{yy-6} {x+75},{yy+6}" fill="#222"/>' + lab("Means-end: means points to end", yy)); yy += 44
            s.front.append(f'<line x1="{x+20}" y1="{yy}" x2="{x+86}" y2="{yy}" stroke="#222" stroke-width="2"/><polygon points="{x+90},{yy} {x+75},{yy-6} {x+75},{yy+6}" fill="#222"/><text x="{x+50}" y="{yy-8}" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="13" font-weight="700" fill="#7a1f1f">Make</text>' + lab("Contribution: Make (+) or Hurt (-)", yy)); yy += 44
            s.front.append(f'<rect x="{x+18}" y="{yy-16}" width="64" height="32" rx="12" fill="#eceff1" stroke="#7f8c93" stroke-width="2" stroke-dasharray="6 4"/>' + lab("Actor boundary (SR only)", yy)); yy += 40
            s.front.append(f'<text x="{x+20}" y="{yy+4}" font-family="Helvetica,Arial,sans-serif" font-size="13" font-weight="700" fill="#b4521b">A1</text>' + lab("Assumption to validate", yy))
        return yy
    def svg(s):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{s.w}" height="{s.h}" viewBox="0 0 {s.w} {s.h}">'
                f'<rect width="{s.w}" height="{s.h}" fill="#fff"/>'
                f'<text x="30" y="42" font-family="Helvetica,Arial,sans-serif" font-size="26" font-weight="700" fill="#142a36">{esc(s.title)}</text>'
                + "".join(s.back) + "".join(s.mid) + "".join(s.front) + "</svg>")


d = Diagram(1900, 1200, "SD")
d.actor("C", "Customer", 220, 560); d.actor("M", "Local Food\nMarketplace", 880, 560, r=78)
d.actor("G", "Payment gateway\n(sandbox)", 1680, 260, r=80, fs=14); d.actor("P", "Producer\n(one of 40 SMEs)", 1680, 880, r=80, fs=14)
W, H = 190, 60
deps = [  # id, depender, dependee, text, kind, x, y
 ("d1", "C", "M", "Stock availability confirmed", "goal", 550, 300),
 ("d2", "C", "M", "Order confirmed", "goal", 550, 430),
 ("d3", "C", "M", "Delivery or collection time", "resource", 550, 700),
 ("d4", "M", "C", "Payment details", "resource", 550, 830),
 ("d5", "M", "G", "Payment decision made", "goal", 1160, 150),
 ("d6", "M", "G", "Payment status", "resource", 1290, 270),
 ("d7", "G", "M", "Payment request", "resource", 1230, 420),
 ("d8", "M", "P", "Order prepared for handover", "goal", 1200, 820),
 ("d9", "M", "P", "Hand over order to customer", "task", 1060, 940),
 ("d10", "P", "M", "Order details", "resource", 1260, 690),
 ("d11", "P", "M", "Adequate notice (48 hours)", "soft", 1330, 545),
]
for i, a, b, t, k, x, y in deps:
    d.el(i, k, t, x, y, w=210 if k != "soft" else 230, h=64 if k != "soft" else 74, mc=24 if k != "soft" else 22)
    d.dependency(a, i, b)
d.key(30, 840)
d.raw('<text x="30" y="1185" font-family="Helvetica,Arial,sans-serif" font-size="15" fill="#4a5a64">Classic i* notation as in the Week 12 lecture. Each dependency reads: depender depends on dependee for dependum. SD hides each actor\'s internal reasoning (see the SR model).</text>', "front")
open("SD.svg", "w").write(d.svg())
