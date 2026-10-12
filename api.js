const https = require('https');
const dns = require('dns');
const {
    SCHEDULE_DAILY_API,
    NOW_PLAYING_API,
    TIMEZONE_OFFSET_MINUTES,
    DEFAULT_ICON,
    SLUG_ICONS,
    SLUG_LABELS,
    FALLBACK_PROGRAM
} = require('./config');

try {
    dns.setDefaultResultOrder('ipv4first');
} catch (e) {
    // Older Node versions without this API: handled by `family: 4` below.
}

const MINUTES_PER_DAY = 24 * 60;
const REQUEST_TIMEOUT_MS = 8000;

const RELAYS = [
    url => `https://r.jina.ai/${url}`,
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

let scheduleCache = { day: null, data: null };

function capitalize(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function httpGetText(urlString) {
    const target = new URL(urlString);

    return new Promise((resolve, reject) => {
        const request = https.get({
            hostname: target.hostname,
            family: 4,
            path: target.pathname + target.search,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 400) {
                    const error = new Error(`HTTP ${res.statusCode}`);
                    error.code = `HTTP ${res.statusCode}`;
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });

        request.on('error', (error) => {
            if (!error.code) error.code = 'NET';
            reject(error);
        });
        request.setTimeout(REQUEST_TIMEOUT_MS, () => {
            const error = new Error('timeout');
            error.code = 'TIMEOUT';
            request.destroy(error);
        });
    });
}

function parseJsonLoose(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
        const iArr = text.indexOf('[');
        const iObj = text.indexOf('{');
        let start = iArr;
        if (iArr === -1) start = iObj;
        else if (iObj !== -1) start = Math.min(iArr, iObj);

        if (start === -1) {
            const error = new Error('Invalid JSON');
            error.code = text.trimStart().startsWith('<') ? 'HTML' : 'JSON';
            throw error;
        }
        return JSON.parse(text.slice(start));
    }
}

async function fetchJson(urlString) {
    let directError;

    try {
        return parseJsonLoose(await httpGetText(urlString));
    } catch (e) {
        directError = e;
    }

    for (const buildRelay of RELAYS) {
        try {
            const parsed = parseJsonLoose(await httpGetText(buildRelay(urlString)));
            console.error(`[RadioUAS] Directo falló (${directError.code || directError.message}); usando relay.`);
            return parsed;
        } catch (e) {
            console.error(`[RadioUAS] Relay falló: ${e.code || e.message}`);
        }
    }

    throw directError;
}

async function fetchDailySchedule(day) {
    if (scheduleCache.day === day && scheduleCache.data) {
        return scheduleCache.data;
    }

    const url = `${SCHEDULE_DAILY_API}?day=${day}`;

    try {
        const parsed = await fetchJson(url);
        const data = Array.isArray(parsed) ? parsed : [];
        if (data.length > 0) {
            scheduleCache = { day, data };
        }
        return data;
    } catch (error) {
        console.error(`[RadioUAS] No se pudo obtener la parrilla (day=${day}): ${error.code || error.message}`);
        throw error;
    }
}

async function fetchNowProgram() {
    return fetchJson(NOW_PLAYING_API);
}

function parseTime(value) {
    if (!value) return null;
    const [h, m] = String(value).split(':').map(Number);
    if (Number.isNaN(h)) return null;
    return h * 60 + (Number.isNaN(m) ? 0 : m);
}

function minutesToTime(total) {
    const m = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function getLocalDayAndMinutes() {
    const local = new Date(Date.now() + TIMEZONE_OFFSET_MINUTES * 60 * 1000);
    const day = ((local.getUTCDay() + 6) % 7) + 1;
    const minutes = local.getUTCHours() * 60 + local.getUTCMinutes();
    return { day, minutes };
}

function normalize(program) {
    if (!program) return null;

    const start = parseTime(program.startTime || program.horaInicio);
    let end = parseTime(program.endTime);

    if (end == null && program.durationMinutes) {
        end = (start == null ? 0 : start) + Number(program.durationMinutes);
    }

    let s = start;
    let e = end;
    if (start != null) {
        if (e == null) e = s + 60;
        if (e <= s) e = MINUTES_PER_DAY;
    }

    const slug = program.slug || '';

    return {
        name: program.name || program.programa || '',
        producer: program.producer || program.produccion || '',
        host: program.host || program.conduccion || '',
        image: program.image || '',
        slug,
        icon: slug ? (SLUG_ICONS[slug] || DEFAULT_ICON) : DEFAULT_ICON,
        category: slug ? (SLUG_LABELS[slug] || capitalize(slug)) : '',
        start: start == null ? null : s,
        end: start == null ? null : e
    };
}

function toDisplay(program) {
    return {
        name: program.name,
        producer: program.producer,
        host: program.host,
        image: program.image,
        slug: program.slug,
        icon: program.icon,
        category: program.category,
        startTime: program.start == null ? '' : minutesToTime(program.start),
        endTime: program.end == null ? '' : minutesToTime(program.end)
    };
}

function fallbackEntry() {
    return toDisplay(normalize(FALLBACK_PROGRAM));
}

function fallbackSnapshot() {
    return { now: fallbackEntry(), upNext: [] };
}

function fallbackSegment(start, end) {
    return { ...normalize(FALLBACK_PROGRAM), start, end };
}

function buildSegments(normalized) {
    const segments = [];
    let cursor = 0;

    for (const program of normalized) {
        const start = Math.max(program.start, cursor);
        if (start > cursor) {
            segments.push(fallbackSegment(cursor, start));
        }
        segments.push(program);
        cursor = Math.max(cursor, program.end);
    }

    if (cursor < MINUTES_PER_DAY) {
        segments.push(fallbackSegment(cursor, MINUTES_PER_DAY));
    }

    return segments;
}

function getNowAndNext(programs, nowMinutes) {
    const normalized = (programs || []).map(normalize).filter(Boolean).sort((a, b) => a.start - b.start);

    if (normalized.length === 0) {
        return fallbackSnapshot();
    }

    const segments = buildSegments(normalized);
    let index = segments.findIndex(segment => nowMinutes >= segment.start && nowMinutes < segment.end);

    if (index === -1) {
        index = segments.length - 1;
    }

    const now = segments[index];
    const upNext = segments.slice(index + 1, index + 3);

    return { now: toDisplay(now), upNext: upNext.map(toDisplay) };
}

async function fetchScheduleSnapshot() {
    const { day, minutes } = getLocalDayAndMinutes();
    let lastError = '';

    try {
        const schedule = await fetchDailySchedule(day);
        if (schedule.length > 0) {
            return { ...getNowAndNext(schedule, minutes), online: true };
        }
        lastError = 'EMPTY';
        console.error(`[RadioUAS] Parrilla vacía (day=${day}).`);
    } catch (e) {
        lastError = e.code || e.message || 'ERROR';
    }

    try {
        const current = await fetchNowProgram();
        const now = normalize(current);
        if (now && now.name) {
            const entry = toDisplay(now);
            const mock = toDisplay(normalize(FALLBACK_PROGRAM));
            const upNext = mock.name && mock.name !== entry.name ? [mock] : [];
            console.error('[RadioUAS] Usando endpoint "now" como respaldo.');
            return { now: entry, upNext, online: true };
        }
    } catch (e) {
        lastError = e.code || e.message || lastError;
        console.error(`[RadioUAS] Respaldo "now" falló: ${lastError}`);
    }

    return {
        ...fallbackSnapshot(),
        online: false,
        errorText: `SIN CONEXIÓN · ${lastError || 'ERROR'}`
    };
}

module.exports = {
    fetchDailySchedule,
    fetchScheduleSnapshot,
    getNowAndNext,
    getLocalDayAndMinutes,
    normalize,
    minutesToTime
};
