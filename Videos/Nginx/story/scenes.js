/* Nginx: "Opening Night at Hotel Nginx". Story scenes against story_engine.js + story_lib.js. */
(function () {
  const { tx, mono, A, B, End, GY, ui, wd, em, uem, chip, line, draw, fly, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, ring, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, mk, tw, hide, pop, T, rect, circ, Em } = H;

  world(3800, { sky: '#0b1233', skyMid: '#34406f', skyLow: '#d08a5a' });
  bld('bM', 300, '#4c1d95', 'MARTA · MANAGER (master)', '🧠'); bld('bL', 950, '#0f766e', 'NGINX · FRONT DESK', '🛎️'); bld('bS', 1450, '#7c2d12', 'BEA · SIGNS', '🪧');
  bld('bO', 2100, '#1d4ed8', 'OZ · ORDERS (upstream)', '🧾'); bld('bC', 2800, '#9d174d', 'CHIP · CHAT (upstream)', '💬'); bld('bT', 3450, '#4d7c0f', 'STATIC PANTRY', '📁');
  const CFG = {
    marta: { who: 'MARTA', skin: '#c98d5b', shirt: '#6d28d9', pants: '#1e1b4b', hair2: 'long', glasses: 1, hold: '📋', w: 96, name: 'Marta', ring: '#a78bfa' },
    rudy: { who: 'RUDY', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Rudy', ring: '#4ade80' },
    wes: { who: 'WES', skin: '#e8b48a', shirt: '#0d9488', pants: '#334155', hat: 'cap', hatColor: '#115e59', hold: '🔔', w: 108, name: 'Wes', ring: '#2dd4bf' },
    bea: { who: 'BEA', skin: '#f1c9a5', shirt: '#c2410c', pants: '#2a2540', hat: 'cap', hatColor: '#9a3412', hair2: 'long', hold: '🪧', w: 90, name: 'Bea', ring: '#fb923c' },
    oz: { who: 'OZ', skin: '#9b6a47', shirt: '#2563eb', pants: '#1e3a8a', hair: '#222', hold: '🧾', w: 108, name: 'Oz', ring: '#60a5fa' },
    chip: { who: 'CHIP', skin: '#e0ac82', shirt: '#be185d', pants: '#2a2540', hair: '#3a2a1a', hold: '📞', w: 100, name: 'Chip', ring: '#f472b6' },
  };
  cast(CFG, { marta: [380], rudy: [270], wes: [980], bea: [1470], oz: [2120], chip: [2820] });
  views({ hq: { x: 560, y: 520, s: 0.95 }, wide: { x: 1900, y: 470, s: 0.46 }, lobby: { x: 1050, y: 520, s: 0.95 }, signs: { x: 1450, y: 520, s: 0.95 }, orders: { x: 2100, y: 520, s: 0.95 }, chat: { x: 2800, y: 520, s: 0.95 }, mid: { x: 1500, y: 500, s: 0.62 } });
  camTw(0, 0.001, { x: 560, y: 520, s: 0.95 });
  const stamp = board('OPENING NIGHT', [['🧠', 'workers'], ['🪧', 'signs'], ['⚖️', 'balance'], ['⏱️', 'timeouts'], ['🔐', 'TLS'], ['🚦', 'rate limit'], ['🔌', 'websocket']], 1500, 560, B('l2', 0.5));

  /* S1: opening night, the C10K problem */
  blk('l1', 'l8', () => {
    cam(B('l1', -0.2), 1.0, 'wide');
    for (let i = 0; i < 40; i++) { em('g' + i, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 56, 80 + (i % 20) * 40, 790 + Math.floor(i / 20) * 26); pop('g' + i, A('l1', 'ten', 0) + i * 0.04); }
    wl('c10', '10,000 guests · slow phones · requests trickle in', '#ffd166', 1900, 250, A('l1', 'ten', -0.2), 70);
    wl('bad', '✗ one receptionist per guest: gigabytes of stacks · endless context switching', '#ff7b7b', 1900, 330, A('l1', 'receptionist', 0), 52);
    hide('bad', B('l4', 0), 0.4);
    ev('th', 'thread-per-connection', ['one OS thread + a stack (megabytes) per open connection', '10,000 slow clients = the C10K problem', 'gigabytes of stacks · brutal context switching', 'most of it spent on idle connections ✗'], 330, 90, 1100, '#ff7b7b', [A('l4', 'thread', 0), A('l4', 'ten', 0), A('l4', 'gigabytes', 0), A('l4', 'idle', 0)], B('l5', 0));
    ev('ev', 'nginx: a small fixed number of workers', ['often one worker per CPU core', 'each handles tens of thousands of connections', 'non-blocking event loop · an idle connection = a small struct ✓'], 330, 90, 1100, '#3ddc84', [A('l5', 'small', 0), A('l5', 'tens', 0), A('l5', 'idle', 0)], B('l6', 0));
    cam(B('l6', -0.3), 1.6, 'lobby');
    [['web server: answers HTTP requests', 'web', '#7ee0ff'], ['reverse proxy: forwards to your real app', 'reverse', '#c084fc'], ['upstream / backend: where nginx forwards', 'upstream', '#ffd166'], ['event loop: serve whoever is ready next', 'event', '#3ddc84'], ['timeout · load balancer', 'timeout', '#ff9f6b']].forEach((w, i) => C('wd' + i, w[0], 1450, 170 + i * 68, w[2], 'l6', w[1], 760, 0));
    ['wd0', 'wd1', 'wd2', 'wd3', 'wd4'].forEach((i) => hide(i, B('l7', -0.2), 0.4));
    C('rc', 'a receptionist: easy answers (static files) → direct · the rest → the right department (backends)', 1450, 260, '#ffd166', 'l7', 'receptionist', 1300, -0.3);
  });

  /* S2: master and workers */
  blk('l8', 'l14', () => {
    cam(B('l8', -0.3), 1.8, 'lobby');
    wl('mn', '🧠 MASTER never serves a guest · reads config · opens doors · hires + watches workers', '#a78bfa', 800, 280, A('l8', 'never', -0.2), 36);
    hide('mn', B('l9', 0), 0.4);
    uem('bell', '🔔', 140, 1500, 330); pop('bell', A('l9', 'bells', -0.2)); for (let i = 0; i < 6; i++) { uem('bl' + i, '🔔', 70, 1300 + i * 90, 470); pop('bl' + i, A('l9', 'bells', 0) + i * 0.3); }
    C('ep', 'epoll: the kernel says which sockets are READY · one thread, many connections', 1100, 160, '#2dd4bf', 'l10', 'epoll', 1100, -0.2);
    C('wp', 'worker_processes auto (1 per core) × worker_connections = the ceiling', 1100, 230, '#ffd166', 'l11', 'two', 1000, -0.2);
    pulse('wes', A('l12', 'reload', 0)); wl('rl', '🔄 nginx -s reload: NEW workers start · OLD ones finish their guests, then leave', '#3ddc84', 1000, 330, A('l12', 'reload', 0.3), 36);
    C('rm', 'one master (never touches traffic) · N workers · each juggles many connections', 1100, 420, '#7ee0ff', 'l13', 'picture', 1100, -0.2);
    stamp(0, A('l13', 'never', 0.3), true, ' ');
  });

  /* S3: the floor plan */
  blk('l14', 'l18', () => {
    cam(B('l14', -0.3), 1.6, 'hq');
    ev('cf', 'http → server → location', ['http {            ← settings every site shares: logging, gzip, upstreams', '  server {        ← one website: listen + server_name', '    location /orders/ { proxy_pass http://orders_backend; }   ← one URL pattern', '    location /static/ { root /var/www; }', '  }', '}'], 360, 90, 1350, '#7ee0ff', [A('l14', 'outer', 0), A('l15', 'folder', 0), A('l15', 'index', 0), A('l15', 'proxy', 0.6), A('l16', 'path', 0), A('l17', 'flow', 0)], End('l17', 0.5));
    C('ex', 'api.example.com/orders/42 → ONE server block → ONE location', 1100, 780, '#ffd166', 'l16', 'takes', 900, 0);
    C('ow', '✗ outer settings silently apply to every server + location unless overridden', 1100, 860, '#ff9f6b', 'l17', 'silently', 1100, -0.2);
  });

  /* S4: location matching */
  blk('l18', 'l24', () => {
    cam(B('l18', -0.3), 1.8, 'signs');
    [['1  = /exact', 'equals', '#3ddc84', 400], ['2  ^~ /prefix', 'caret', '#7ee0ff', 770], ['3  ~ regex (first match in file order)', 'regex', '#ffd166', 1140], ['4  /prefix (longest plain match)', 'plain', '#ff9f6b', 1510]].forEach((s, i) => { wl('sg' + i, '🪧 ' + s[0], s[2], 1450, 250 + i * 70, A(i < 2 ? 'l19' : 'l20', s[1], 0), 44); });
    walk('rudy', B('l21', 0.2), 1.0, 1300); em('guest', '🖼️', 70, 1250, 560); wl('gl', 'GET /images/logo.png', '#fff', 1250, 500, A('l21', 'logo', 0), 36); pop('guest', A('l21', 'logo', 0));
    C('rg', '→ the REGEX wins · any regex outranks a plain prefix', 1450, 700, '#ff9f6b', 'l22', 'regex', 700, -0.2);
    C('mi', '✗ not an if / else-if chain · file order only breaks a tie between two regexes', 1450, 780, '#ff7b7b', 'l23', 'mistake', 1000, -0.2);
    stamp(1, A('l23', 'tilde', 0.5), true, ' ');
  });

  /* S5: upstream and balancing */
  blk('l24', 'l30', () => {
    cam(B('l24', -0.3), 2.0, 'orders');
    ['10.0.1.11:8080', '10.0.1.12:8080', '10.0.1.13:8080 (backup)'].forEach((a, i) => { em('dk' + i, '🖥️', 70, 1900 + i * 200, 560); wl('dkl' + i, a, '#cdd6e6', 1900 + i * 200, 640, A('l25', ['three', 'three', 'backup'][i], 0), 22); pop('dk' + i, A('l25', 'three', 0) + i * 0.3); });
    ask('pp', 'proxy_pass http://orders_backend', '#60a5fa', 1050, 420, 2100, 420, A('l24', 'proxy', 0), 1.6);
    ev('xf', 'X-Forwarded-For: append, never overwrite', ['$proxy_add_x_forwarded_for appends the client’s IP', 'a backend trusts only as many hops as it controls'], 330, 90, 1100, '#7ee0ff', [A('l26', 'appends', 0), A('l26', 'backend', 0)], B('l27', 0));
    ev('lb', 'balancing methods (per upstream)', ['round robin (default) · weighted: server … weight=3', 'least_conn: the fewest open connections', 'ip_hash: same client IP → same server (sticky, maybe uneven)', 'hash $request_uri consistent: minimal remapping'], 330, 90, 1250, '#3ddc84', [A('l27', 'round', 0), A('l27', 'least', 0), A('l27', 'hash', 0), A('l27', 'generic', 0)], B('l28', 0));
    ev('hc', 'health checks', ['passive (open source): max_fails within fail_timeout → down for a while', 'the first real requests during an outage still hit the bad server', 'active probing on a timer = NGINX Plus · or an orchestrator probe'], 330, 90, 1300, '#ffb066', [A('l28', 'passive', 0), A('l28', 'first', 0), A('l29', 'active', 0)], End('l29', 0.4));
    stamp(2, A('l29', 'orchestrator', 0.5), true, ' ');
  });

  /* S6: the crisis, timeouts */
  blk('l30', 'l38', () => {
    cam(B('l30', -0.3), 2.0, 'mid');
    wl('al', '🚨 11:30 · some guests get 504 · the health check is fine', '#ff7b7b', 1500, 300, B('l30', 0.4), 56); hide('al', B('l31', 0), 0.4);
    ev('tm', 'three clocks', ['proxy_connect_timeout 5s    time to OPEN the connection', 'proxy_send_timeout    30s   time between successive WRITES', 'proxy_read_timeout    30s   time between successive READS (default 60 s)'], 330, 90, 1300, '#ffd166', [A('l31', 'connect', 0), A('l31', 'send', 0), A('l31', 'read', 0)], B('l32', 0));
    ev('rs', 'read timeout RESETS on every chunk', ['a few bytes every 20 s for 5 minutes → never trips a 30 s timeout', 'fully silent for 31 s → trips it'], 330, 90, 1300, '#3ddc84', [A('l32', 'resets', 0), A('l33', 'silent', 0)], B('l34', 0));
    ring('rt', 2100, 300, 80, '#ff5d5d', '30 s', A('l34', 'slow', -0.3), 6);
    ask('rq', 'GET /orders/42', '#60a5fa', 1050, 560, 2100, 560, A('l34', 'slow', 0), 1.4);
    wl('sl', '🐢 slow query: first byte at 45 s', '#ffb066', 2100, 420, A('l34', 'forty', 0), 40);
    ev('fo', '30 s pass with no data', ['nginx → client:  504 Gateway Timeout', 'the backend answers at 45 s · nginx already closed that side · discarded', 'refused / reset connection → 502 instead'], 330, 90, 1300, '#ff5d5d', [A('l35', 'nginx', 0), A('l35', 'forty', 0.5), A('l35', 'refused', 0)], B('l36', 0));
    C('fx', 'fix: a per-route timeout (or the slow query) · not a global increase', 1500, 780, '#3ddc84', 'l36', 'fix', 940, -0.2);
    ev('bf', 'proxy_buffering', ['on: read the response (up to the limits) → forward to a slow client → free the upstream fast', 'off: real-time streaming (server-sent events) so each chunk reaches the client at once'], 330, 90, 1500, '#7ee0ff', [A('l37', 'buffering', 0), A('l37', 'off', 0)], End('l37', 0.4));
    stamp(3, A('l37', 'real', 0.5), true, ' ');
  });

  /* S7: TLS front door */
  blk('l38', 'l40', () => {
    cam(B('l38', -0.3), 1.6, 'lobby');
    ev('tl', 'the front door', ['listen 443 ssl;   http2 on;', 'ssl_certificate  cert.pem · ssl_certificate_key  key.pem', 'ssl_protocols TLSv1.3 TLSv1.2;   (1.3 preferred)', 'Strict-Transport-Security: max-age=31536000 → HTTPS only, for a year'], 330, 90, 1300, '#a78bfa', [A('l38', 'listens', 0), A('l38', 'certificate', 0), A('l38', 'prefers', 0), A('l39', 'strict', 0)], End('l39', 0.4));
    stamp(4, A('l39', 'year', 0.3), true, ' ');
  });

  /* S8: static files and micro-caching */
  blk('l40', 'l44', () => {
    cam(B('l40', -0.3), 2.0, 'wide');
    ev('st', 'location /static/', ['root /var/www;   gzip_static on;  (serve a pre-compressed .gz sibling)', 'expires 30d;  → Cache-Control: max-age=2592000'], 330, 90, 1350, '#4d7c0f', [A('l40', 'root', 0), A('l40', 'expires', 0)], B('l41', 0));
    ev('mc', 'micro-cache', ['proxy_cache_valid 200 5s;   proxy_cache_use_stale updating error timeout;', '1000s of identical requests / s → a handful upstream'], 330, 90, 1350, '#3ddc84', [A('l41', 'valid', 0), A('l41', 'thousands', 0)], B('l43', 0));
    for (let i = 0; i < 30; i++) { em('mq' + i, '✉️', 40, 800 + (i % 10) * 36, 700 + Math.floor(i / 10) * 30); pop('mq' + i, A('l41', 'thousands', 0) + i * 0.03); }
    ask('mu', '1 request upstream', '#60a5fa', 1050, 600, 2100, 600, A('l41', 'handful', 0), 1.6);
    C('cd', 'same idea as a CDN’s request collapsing, at one reverse proxy', 1400, 780, '#c084fc', 'l42', 'request', 760, -0.2);
    ev('sf', 'safe only for public, non-personalised responses', ['per-user data cached even 5 s = the CDN private-data leak ✗', 'the cache key must include EVERY dimension the response varies on'], 330, 90, 1350, '#ff7b7b', [A('l43', 'safety', 0), A('l43', 'key', 0)], End('l43', 0.4));
  });

  /* S9: rate limiting */
  blk('l44', 'l49', () => {
    cam(B('l44', -0.3), 2.0, 'lobby');
    uem('bkt', '🪣', 160, 1560, 350); pop('bkt', A('l44', 'bucket', -0.2)); for (let i = 0; i < 4; i++) { uem('dr' + i, '💧', 50, 1560, 220); fly('dr' + i, A('l44', 'water', 0) + i * 0.5, [[1560, 220], [1560, 330]], 0.6, {}); hide('dr' + i, A('l44', 'water', 0.6) + i * 0.5, 0.2); }
    C('lk', 'leaky bucket = limit_req · overflow = rejected requests', 1100, 180, '#7ee0ff', 'l44', 'leaky', 800, -0.2);
    ev('lr', 'limit_req_zone … rate=10r/s;  limit_req … burst=20 nodelay;', ['rate: requests drain at 10 / s per client IP', 'burst: a short spike queues instead of being rejected', 'nodelay: burst served at once, not spaced to the steady rate', 'past both → 503 by default'], 330, 480, 1300, '#ffd166', [A('l45', 'drain', 0), A('l45', 'burst', 0), A('l45', 'delay', 0), A('l45', 'past', 0)], B('l46', 0));
    ev('ex2', '25 requests in the same instant', ['first 20 → served immediately (the burst, nodelay) ✓', 'remaining 5 → rejected with 503 ✗', 'without nodelay: the 20 would be spaced to 10 / s'], 330, 480, 1300, '#3ddc84', [A('l46', 'first', 0), A('l46', 'remaining', 0), A('l46', 'throttled', 0)], B('l47', 0));
    ev('lc', 'limit_conn: SIMULTANEOUS connections per key', ['1 request a minute over 50 open connections trips limit_conn, not limit_req', 'defends against many slow, long-lived connections'], 330, 480, 1300, '#c084fc', [A('l47', 'caps', 0), A('l47', 'different', 0.5)], B('l48', 0));
    C('nt', '✗ users behind one corporate NAT share ONE bucket → key on a user ID or API key', 1100, 800, '#ff7b7b', 'l48', 'corporate', 1100, -0.2);
    stamp(5, A('l48', 'key', 0.5), true, ' ');
  });

  /* S10: WebSocket */
  blk('l49', 'l52', () => {
    cam(B('l49', -0.3), 2.0, 'chat');
    line('ws', 1050, 640, 2800, 640, '#f472b6', 14); draw('ws', A('l50', 'upgrade', -0.3), 1.4); wl('wsl', 'Upgrade: websocket → a raw, long-lived, two-way pipe', '#f472b6', 1900, 560, A('l50', 'raw', -0.2), 36);
    ev('wc', 'location /ws/', ['proxy_http_version 1.1;', 'proxy_set_header Upgrade $http_upgrade;', 'proxy_set_header Connection "upgrade";', 'proxy_read_timeout 3600s;   (the default 60 s would drop idle chats)'], 330, 90, 1200, '#f472b6', [A('l50', 'one', 0), A('l50', 'upgrade', 0.3), A('l50', 'connection', 0), A('l51', 'thirty', 0)], End('l51', 0.4));
    ring('r60', 1900, 330, 70, '#ff7b7b', '60 s', A('l51', 'sixty', -0.2), 4); 
    stamp(6, A('l51', 'drop', 0.5), true, ' ');
  });

  /* S11: the complete config */
  blk('l52', 'l56', () => {
    cam(B('l52', -0.3), 1.4, 'hq');
    const LN = ['upstream orders_backend {', '    least_conn;', '    server 10.0.1.11:8080 max_fails=3 fail_timeout=10s;', '    server 10.0.1.12:8080 max_fails=3 fail_timeout=10s;', '    keepalive 32;                       # reuse TCP connections to the backend', '}', 'limit_req_zone $binary_remote_addr zone=orders_rl:10m rate=20r/s;', 'server { listen 443 ssl; http2 on; server_name api.example.com;  # + cert, protocols, HSTS', '    location /orders/ {', '        limit_req zone=orders_rl burst=40 nodelay;', '        proxy_pass http://orders_backend;', '        proxy_http_version 1.1;  proxy_set_header Connection "";   # keepalive not defeated', '        proxy_set_header Host $host;  X-Real-IP $remote_addr;  X-Forwarded-For $proxy_add_x_forwarded_for;', '        proxy_connect_timeout 5s;  proxy_read_timeout 30s;', '    }', '    location /static/ { root /var/www;  expires 30d; }', '}'];
    const cp = S.codePanel('code', LN, { x: 80, y: 60, w: 1760, fs: 24, title: 'nginx.conf (http block, condensed)', t0: B('l52', 0.3), times: LN.map((x, i) => A('l52', 'rule', 0.3) + i * 0.35) });
    cp.hl(1, A('l52', 'least', 0)); cp.hl(4, A('l52', 'keepalive', 0)); cp.hl(6, A('l53', 'zone', 0)); cp.hl(9, A('l54', 'limit', 0)); cp.hl(11, A('l54', 'one', 0)); cp.hl(13, A('l54', 'connect', 0)); cp.out(End('l55', 0.4));
    C('kt', '✗ upstream keepalive needs proxy_http_version 1.1 AND a cleared Connection header', 960, 1000, '#ff7b7b', 'l55', 'trap', 1100, -0.2);
  });

  /* S12: other proxies, trade-offs */
  blk('l56', 't1', () => {
    cam(B('l56', -0.3), 1.6, 'wide');
    [['HAProxy', 'h a proxy', 400, '#f59e0b'], ['Envoy', 'envoy', 1100, '#a78bfa'], ['Caddy', 'caddy', 1800, '#22d3ee'], ['Traefik', 'traefik', 2500, '#4ade80']].forEach((h) => wl('hh' + h[1], '🏨 ' + h[0], h[3], h[2], 300, A('l56', h[1], -0.2), 54));
    ev('ot', 'the hotels next door', ['HAProxy: lowest overhead · best-in-class L4/L7 balancing · stats page', 'Envoy: dynamic config (xDS) · service-mesh data plane · API gateway', 'Caddy: automatic HTTPS · Traefik: routes discovered from Docker/Kubernetes labels'], 330, 90, 1350, '#7ee0ff', [A('l56', 'h a proxy', 0), A('l56', 'envoy', 0), A('l56', 'caddy', 0)], B('l57', 0));
    ev('ig', '⚠ ingress-nginx is retired', ['announced Nov 2025 · no releases or security updates since March 2026', 'new Kubernetes ingress → the Gateway API'], 330, 90, 1350, '#ff7b7b', [A('l57', 'warning', 0), A('l57', 'gateway', 0)], B('l58', 0));
    ev('to', 'trade-offs', ['simpler than an L4 balancer / mesh: no active checks, no retry budgets, no circuit breaking', 'one event loop per worker: great for I/O-bound proxying · not for one CPU-heavy request', 'static config: a reload is graceful but still a file change · Envoy for dynamic config'], 330, 90, 1350, '#ffb066', [A('l58', 'simpler', 0), A('l58', 'event', 0), A('l58', 'config', 0)], End('l58', 0.4));
  });

  /* S13: failures and monitoring */
  blk('t1', 'd1', () => {
    cam(B('t1', -0.3), 1.6, 'mid');
    ev('f1', 'production failures → fixes', ['502s after a deploy → passive checks are slow: remove the instance from DNS / discovery too', '504s on one slow endpoint → give THAT route its own read timeout', 'WebSockets drop at exactly 60 s → raise that location’s read timeout', 'upstream keepalive not reused → proxy_http_version 1.1 + a cleared Connection header', 'limit_req hits legit users behind a NAT → key on a user / API key'], 90, 90, 1400, '#ff7b7b', [A('t1', 'five', 0), A('t1', 'fours', 0), A('t1', 'sockets', 0), A('t2', 'keepalive', 0), A('t2', 'limit', 0)], A('t3', 'monitor', -0.3));
    ev('mo', 'what to monitor', ['4xx / 5xx split by UPSTREAM ($upstream_status ≠ nginx’s own code)', '$upstream_response_time vs total request time', 'active / reading / writing connections (stub_status)', 'rate-limit rejections · worker connection saturation'], 90, 90, 1400, '#3ddc84', [A('t3', 'split', 0), A('t3', 'response', 0), A('t3', 'active', 0), A('t3', 'rate', 0)], End('t3', 0.4));
  });

  /* S14: deep dive */
  blk('d1', 'q0', () => {
    ev('d1', 'epoll vs select / poll', ['select / poll: the kernel rescans ALL watched fds on every call · O(n)', 'epoll: the set stays registered · only READY ones return · O(ready)'], 90, 90, 1400, '#2dd4bf', [A('d1', 'select', 0), A('d1', 'epoll', 0.5)], B('d2', 0));
    ev('d2', 'worker_processes auto', ['one worker per core: no under-use, no needless context switching', 'on a box running other CPU-heavy processes you may use fewer'], 90, 90, 1400, '#ffd166', [A('d2', 'one', 0), A('d2', 'machine', 0)], B('d3', 0));
    ev('d3', 'why upstream keepalive needs HTTP/1.1', ['HTTP/1.0 has no persistent connections by default', 'without proxy_http_version 1.1 the backend connection cannot stay open'], 90, 90, 1400, '#c084fc', [A('d3', 'one', 0), A('d3', 'without', 0)], B('d4', 0));
    ev('d4', 'micro-caching’s narrow safety window', ['safe for public responses · per-user data → the key must include every dimension', 'same rule as a CDN, a smaller blast radius'], 90, 90, 1400, '#ff7b7b', [A('d4', 'safe', 0), A('d4', 'same', 0)], End('d4', 0.4));
  });

  /* S15: interview, Rudy asks, Marta answers */
  blk('q0', 'f1', () => {
    qa([['Why can ONE worker serve thousands of connections?', 'a non-blocking event loop on epoll: the kernel says which sockets are ready · it never blocks on one slow client', 'q1', 'one'], ['/images/ then ~* \\.(jpg|png)$ : who serves logo.png?', 'the regex · exact → ^~ prefix → first regex in file order → plain prefix', 'q3', 'trap'], ['Intermittent 504s, but the health check is fine?', 'proxy_read_timeout vs that endpoint’s real p99 · a health check does trivial work · per-route timeout', 'q5', 'proxied'], ['Passive vs active health checks?', 'passive: down only after real traffic fails (first requests still hit it) · active: probes on a timer = NGINX Plus', 'q7', 'passive'], ['Why does WebSocket proxying need extra config?', 'it upgrades to a raw long-lived pipe: Upgrade + Connection: upgrade, HTTP/1.1, a longer read timeout', 'q9', 'why'], ['What does limit_req burst=20 nodelay do?', 'rate = the steady leak · burst lets 20 queue above it · nodelay serves them at once · beyond → 503', 'q11', 'what']], '#a78bfa');
  });

  /* S16: doors open, summary, next */
  blk('f1', 'f3', () => {
    cam(B('f1', -0.3), 2.0, 'wide');
    for (let i = 0; i < 60; i++) { em('fg' + i, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 50, 90 + (i % 30) * 36, 780 + Math.floor(i / 30) * 26); pop('fg' + i, A('f1', 'ten', 0) + i * 0.03); }
    ev('fin', '🕛 midnight · the doors open', ['10,000 guests · 3 receptionists · 1 manager', 'no queue · no crash ✓'], 330, 90, 900, '#3ddc84', [A('f1', 'ten', 0), A('f1', 'crash', -0.3)], End('f2', 0.5));
  });
  blk('f3', 'rn1', () => {
    summary('OPENING NIGHT · SUMMARY', [['one master never touches traffic · N workers, single-threaded event loops on epoll · workers × connections = the ceiling', 'f3', '#a78bfa'], ['http → server → location · precedence: exact → ^~ prefix → first regex → plain prefix', 'f4', '#fb923c'], ['upstream + proxy_pass · least_conn, ip_hash, consistent hash · active health checks are NGINX Plus', 'f5', '#60a5fa'], ['connect / send / read timeouts: silent upstream = 504 · refused or reset = 502 · keepalive needs 1.1 + cleared Connection', 'f6', '#ffd166'], ['limit_req = rate · limit_conn = simultaneous · WebSockets: Upgrade + longer read timeout · reload = zero downtime', 'f7', '#f472b6'], ['a few workers juggle many connections, route each request to files or backends', 'f8', '#3ddc84']]);
  });
  blk('rn1', 'e1', () => { readNext('rn1', [['📘 note: Nginx', 'open', '#7ee0ff'], ['⬅ before: Forward and Reverse Proxies · HTTP Fundamentals', 'before', '#ffd166'], ['➡ after: TLS and HTTPS · What Happens When You Type a URL', 'after', '#3ddc84'], ['↔ compare: Load Balancing · Rate Limiting · CDN and Edge', 'compare', '#c084fc']]); });
  cam(B('e1', -0.4), 1.4, 'hq'); wave('rudy', B('e1', 0.5));
  endTitle('Nginx', 'a cheap front door: few workers, many connections', 'e2');
})();
