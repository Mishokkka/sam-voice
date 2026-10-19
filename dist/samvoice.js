//#region scripts/constants.js
var e = "sam-voice", t = ["sam", "piper", "silero", "qwen"], n = [
	"interrupt",
	"queue",
	"overlap"
], r = 1e3, i = 2e3, a = 4 * 1024 * 1024, o = 4e3, s = {
	pitch: {
		label: "Высота",
		shortLabel: "Pitch",
		category: "morph",
		icon: "fas fa-arrows-alt-v",
		description: "Сдвигает высоту голоса через скорость воспроизведения.",
		defaultStrength: 0,
		params: [v("semitones", "Полутона", -12, 12, 0, 1, "st")]
	},
	pace: {
		label: "Темп",
		shortLabel: "Pace",
		category: "morph",
		icon: "fas fa-forward",
		description: "Ускоряет или замедляет речь. В WebAudio это влияет и на высоту.",
		defaultStrength: 0,
		params: [v("percent", "Скорость", -45, 75, 0, 1, "%")]
	},
	formant: {
		label: "Тембр",
		shortLabel: "Formant",
		category: "morph",
		icon: "fas fa-user-astronaut",
		description: "Псевдо-формант: делает голос груднее, тоньше или носовее фильтрами.",
		defaultStrength: 0,
		params: [v("shift", "Сдвиг", -100, 100, 0, 1, "%"), v("nasal", "Нос", 0, 100, 0, 1, "%")]
	},
	demon: {
		label: "Демон",
		shortLabel: "Demon",
		category: "morph",
		icon: "fas fa-skull",
		description: "Низкий резонанс, сжатие полосы и грубая перегрузка.",
		defaultStrength: 85,
		params: [
			v("growl", "Рык", 0, 150, 85, 1, "%"),
			v("drive", "Грязь", 0, 150, 70, 1, "%"),
			v("depth", "Глубина", 0, 150, 80, 1, "%")
		]
	},
	equalizer: {
		label: "Эквалайзер",
		shortLabel: "EQ",
		category: "tone",
		icon: "fas fa-sliders-h",
		description: "Три быстрые полосы для ручной окраски голоса.",
		defaultStrength: 0,
		params: [
			v("bass", "Низ", -12, 12, 0, 1, "dB"),
			v("mid", "Середина", -12, 12, 0, 1, "dB"),
			v("air", "Воздух", -12, 12, 0, 1, "dB")
		]
	},
	radio: {
		label: "Радио",
		shortLabel: "Radio",
		category: "tone",
		icon: "fas fa-broadcast-tower",
		description: "Узкая полоса, лёгкая перегрузка и опциональный шум эфира.",
		defaultStrength: 85,
		params: [
			v("intensity", "Сжатие", 0, 150, 85, 1, "%"),
			v("bandwidth", "Полоса", 0, 100, 55, 1, "%"),
			v("static", "Шум", 0, 100, 18, 1, "%")
		]
	},
	telephone: {
		label: "Телефон",
		shortLabel: "Phone",
		category: "tone",
		icon: "fas fa-phone-alt",
		description: "Сухой телефонный диапазон с носовой серединой.",
		defaultStrength: 70,
		params: [v("intensity", "Сжатие", 0, 150, 70, 1, "%"), v("nasal", "Нос", 0, 100, 45, 1, "%")]
	},
	megaphone: {
		label: "Рупор",
		shortLabel: "Horn",
		category: "tone",
		icon: "fas fa-bullhorn",
		description: "Громкая режущая окраска для команд, толпы и боевых сцен.",
		defaultStrength: 70,
		params: [v("drive", "Напор", 0, 150, 70, 1, "%"), v("bite", "Резкость", 0, 100, 55, 1, "%")]
	},
	distortion: {
		label: "Перегруз",
		shortLabel: "Drive",
		category: "tone",
		icon: "fas fa-fire",
		description: "Параллельная сатурация: от тёплой грязи до рваного крика.",
		defaultStrength: 55,
		params: [
			v("drive", "Гейн", 0, 150, 55, 1, "%"),
			v("tone", "Тон", 0, 100, 55, 1, "%"),
			v("mix", "Смесь", 0, 100, 45, 1, "%")
		]
	},
	crusher: {
		label: "Разрядность",
		shortLabel: "Crusher",
		category: "tone",
		icon: "fas fa-microchip",
		description: "Грубое цифровое квантование амплитуды для роботов и древних устройств.",
		defaultStrength: 55,
		params: [
			v("bits", "Биты", 2, 12, 7, 1, "bit"),
			v("fold", "Ломка", 0, 100, 35, 1, "%"),
			v("mix", "Смесь", 0, 100, 55, 1, "%")
		]
	},
	tremolo: {
		label: "Тремоло",
		shortLabel: "Tremolo",
		category: "motion",
		icon: "fas fa-wave-square",
		description: "Ритмическая пульсация громкости.",
		defaultStrength: 50,
		params: [v("depth", "Глубина", 0, 100, 50, 1, "%"), v("rate", "Частота", .5, 20, 6, .1, "Hz")]
	},
	vibrato: {
		label: "Вибрато",
		shortLabel: "Vibrato",
		category: "motion",
		icon: "fas fa-water",
		description: "Дрожание высоты через модуляцию playbackRate.",
		defaultStrength: 30,
		params: [v("depth", "Глубина", 0, 90, 28, 1, "cent"), v("rate", "Частота", .2, 12, 4.5, .1, "Hz")]
	},
	robot: {
		label: "Робот",
		shortLabel: "Robot",
		category: "motion",
		icon: "fas fa-robot",
		description: "Кольцевая модуляция для механических и нечеловеческих голосов.",
		defaultStrength: 55,
		params: [
			v("mix", "Смесь", 0, 100, 55, 1, "%"),
			v("frequency", "Частота", 18, 180, 64, 1, "Hz"),
			v("metal", "Металл", 0, 100, 45, 1, "%")
		]
	},
	chorus: {
		label: "Хор",
		shortLabel: "Chorus",
		category: "motion",
		icon: "fas fa-users",
		description: "Короткие модулированные задержки дают ощущение нескольких голосов.",
		defaultStrength: 45,
		params: [
			v("mix", "Смесь", 0, 100, 45, 1, "%"),
			v("depth", "Дрейф", 0, 100, 40, 1, "%"),
			v("rate", "Частота", .05, 6, .8, .05, "Hz"),
			v("delay", "Задержка", 6, 45, 18, 1, "ms")
		]
	},
	echo: {
		label: "Эхо",
		shortLabel: "Echo",
		category: "space",
		icon: "fas fa-reply-all",
		description: "Настраиваемая задержка с обратной связью и тоном хвоста.",
		defaultStrength: 60,
		params: [
			v("mix", "Смесь", 0, 100, 42, 1, "%"),
			v("time", "Время", 60, 950, 260, 10, "ms"),
			v("feedback", "Повторы", 0, 82, 34, 1, "%"),
			v("tone", "Тон", 0, 100, 55, 1, "%")
		]
	},
	reverb: {
		label: "Реверб",
		shortLabel: "Reverb",
		category: "space",
		icon: "fas fa-landmark",
		description: "Процедурный импульс: комната, зал, шахта, храм.",
		defaultStrength: 55,
		params: [
			v("mix", "Смесь", 0, 100, 42, 1, "%"),
			v("size", "Размер", .2, 6, 1.8, .1, "s"),
			v("decay", "Спад", .5, 8, 2.2, .1, "x"),
			v("damping", "Глушение", 0, 100, 35, 1, "%")
		]
	},
	specter: {
		label: "Призрак",
		shortLabel: "Specter",
		category: "space",
		icon: "fas fa-ghost",
		description: "Холодный задержанный слой с дрейфом и длинным стеклянным хвостом.",
		defaultStrength: 55,
		params: [
			v("mix", "Смесь", 0, 100, 38, 1, "%"),
			v("delay", "Сдвиг", 20, 420, 130, 10, "ms"),
			v("drift", "Дрейф", 0, 100, 42, 1, "%"),
			v("shimmer", "Стекло", 0, 100, 45, 1, "%")
		]
	},
	noise: {
		label: "Шум",
		shortLabel: "Noise",
		category: "space",
		icon: "fas fa-wind",
		description: "Параллельная шумовая подложка: дыхание, помехи, ветер, артефакты.",
		defaultStrength: 20,
		params: [
			v("amount", "Уровень", 0, 100, 20, 1, "%"),
			v("tone", "Тон", 0, 100, 50, 1, "%"),
			v("crackle", "Треск", 0, 100, 25, 1, "%")
		]
	}
}, c = {
	none: {
		name: "Чистый голос",
		effects: l({})
	},
	oldRadio: {
		name: "Старое радио",
		effects: l({
			radio: y({
				intensity: 110,
				bandwidth: 72,
				static: 32
			}),
			distortion: y({
				drive: 22,
				tone: 48,
				mix: 18
			})
		})
	},
	fieldTelephone: {
		name: "Полевой телефон",
		effects: l({
			telephone: y({
				intensity: 95,
				nasal: 68
			}),
			noise: y({
				amount: 12,
				tone: 64,
				crackle: 38
			})
		})
	},
	commandHorn: {
		name: "Командный рупор",
		effects: l({
			megaphone: y({
				drive: 92,
				bite: 72
			}),
			equalizer: y({
				bass: 2,
				mid: 4,
				air: -3
			}),
			echo: y({
				mix: 16,
				time: 130,
				feedback: 12,
				tone: 62
			})
		})
	},
	machineSpirit: {
		name: "Машинный дух",
		effects: l({
			robot: y({
				mix: 64,
				frequency: 58,
				metal: 72
			}),
			crusher: y({
				bits: 6,
				fold: 38,
				mix: 35
			}),
			chorus: y({
				mix: 26,
				depth: 30,
				rate: .35,
				delay: 15
			})
		})
	},
	demon: {
		name: "Демон",
		effects: l({
			pitch: y({ semitones: -5 }),
			demon: y({
				growl: 112,
				drive: 90,
				depth: 118
			}),
			reverb: y({
				mix: 28,
				size: 2.6,
				decay: 3.4,
				damping: 48
			})
		})
	},
	abyss: {
		name: "Бездна",
		effects: l({
			pitch: y({ semitones: -8 }),
			pace: y({ percent: -18 }),
			demon: y({
				growl: 135,
				drive: 118,
				depth: 145
			}),
			echo: y({
				mix: 34,
				time: 480,
				feedback: 46,
				tone: 28
			}),
			reverb: y({
				mix: 52,
				size: 4.4,
				decay: 5.6,
				damping: 62
			})
		})
	},
	specter: {
		name: "Призрак",
		effects: l({
			pitch: y({ semitones: 2 }),
			formant: y({
				shift: 28,
				nasal: 8
			}),
			specter: y({
				mix: 58,
				delay: 160,
				drift: 70,
				shimmer: 62
			}),
			reverb: y({
				mix: 34,
				size: 3.6,
				decay: 4.8,
				damping: 18
			})
		})
	},
	swarm: {
		name: "Многоголосие",
		effects: l({
			chorus: y({
				mix: 64,
				depth: 72,
				rate: .55,
				delay: 22
			}),
			vibrato: y({
				depth: 18,
				rate: 5.8
			}),
			tremolo: y({
				depth: 18,
				rate: 7.2
			}),
			reverb: y({
				mix: 22,
				size: 2.2,
				decay: 2.7,
				damping: 35
			})
		})
	},
	brokenTerminal: {
		name: "Сломанный терминал",
		effects: l({
			pace: y({ percent: 8 }),
			robot: y({
				mix: 76,
				frequency: 92,
				metal: 88
			}),
			crusher: y({
				bits: 4,
				fold: 74,
				mix: 58
			}),
			radio: y({
				intensity: 72,
				bandwidth: 52,
				static: 26
			}),
			noise: y({
				amount: 14,
				tone: 76,
				crackle: 78
			})
		})
	},
	cathedral: {
		name: "Собор",
		effects: l({
			reverb: y({
				mix: 58,
				size: 5.2,
				decay: 6.6,
				damping: 22
			}),
			echo: y({
				mix: 18,
				time: 620,
				feedback: 26,
				tone: 42
			}),
			equalizer: y({
				bass: 3,
				mid: -2,
				air: 2
			})
		})
	},
	whisperWind: {
		name: "Шёпот ветра",
		effects: l({
			pace: y({ percent: -9 }),
			formant: y({
				shift: 42,
				nasal: 12
			}),
			noise: y({
				amount: 26,
				tone: 72,
				crackle: 10
			}),
			specter: y({
				mix: 28,
				delay: 90,
				drift: 58,
				shimmer: 38
			})
		})
	}
};
function l(e = {}) {
	let t = {};
	for (let [n, r] of Object.entries(s)) t[n] = m(n, e[n], r);
	return t;
}
function u(e = {}) {
	let t = {};
	for (let [n, r] of Object.entries(s)) t[n] = m(n, e?.[n], r);
	return t;
}
function d(e, t, n) {
	let r = f(e, t);
	return r ? b(Number(n), r.min, r.max, r.defaultValue) : Number(n) || 0;
}
function f(e, t) {
	return s[e]?.params?.find((e) => e.id === t) || null;
}
function p(e) {
	return e.params?.[0] || v("strength", "Сила", 0, 100, e.defaultStrength ?? 0, 1, "%");
}
function m(e, t, n = s[e]) {
	let r = h(t), i = {};
	for (let e of n.params || []) i[e.id] = b(g(t, e), e.min, e.max, e.defaultValue);
	let a = p(n);
	return {
		enabled: r,
		strength: i[a.id] ?? a.defaultValue,
		params: i
	};
}
function h(e) {
	return Array.isArray(e) ? !!e[0] : !e || typeof e != "object" ? !1 : !!e.enabled;
}
function g(e, t) {
	return Array.isArray(e) ? _(t, Number(e[1] ?? t.defaultValue)) : !e || typeof e != "object" ? t.defaultValue : e.params && Object.prototype.hasOwnProperty.call(e.params, t.id) ? Number(e.params[t.id]) : Object.prototype.hasOwnProperty.call(e, t.id) ? Number(e[t.id]) : ee(t.id) && Object.prototype.hasOwnProperty.call(e, "strength") ? _(t, Number(e.strength)) : t.defaultValue;
}
function _(e, t) {
	return Number.isFinite(t) ? e.id === "semitones" ? t / 150 * 7 : t : e.defaultValue;
}
function ee(e) {
	return [
		"amount",
		"intensity",
		"growl",
		"drive",
		"depth",
		"mix",
		"semitones",
		"percent",
		"shift",
		"bass",
		"bits"
	].includes(e);
}
function v(e, t, n, r, i, a = 1, o = "") {
	return {
		id: e,
		label: t,
		min: n,
		max: r,
		defaultValue: i,
		step: a,
		unit: o
	};
}
function y(e = {}) {
	return {
		enabled: !0,
		params: e
	};
}
function b(e, t, n, r = t) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : r;
}
//#endregion
//#region scripts/state/settingsRegistry.js
function te() {
	game.settings.register(e, "settingsSchemaVersion", {
		name: "Settings Schema Version",
		scope: "client",
		config: !1,
		type: Number,
		default: 0
	}), game.settings.register(e, "allowRemoteBackend", {
		name: "SAM Voice: Allow remote TTS backends",
		hint: "Disabled by default. Enable only when you trust the non-local Piper server URL.",
		scope: "client",
		config: !0,
		type: Boolean,
		default: !1,
		restricted: !0
	}), game.settings.register(e, "engine", {
		name: "Voice Engine",
		scope: "client",
		config: !1,
		type: String,
		default: "sam"
	}), game.settings.register(e, "piperServerUrl", {
		name: "Piper Server URL",
		scope: "client",
		config: !1,
		type: String,
		default: "http://127.0.0.1:5050"
	}), game.settings.register(e, "piperVoice", {
		name: "Piper Voice",
		scope: "client",
		config: !1,
		type: String,
		default: ""
	}), game.settings.register(e, "sileroServerUrl", {
		name: "Silero Server URL",
		scope: "client",
		config: !1,
		type: String,
		default: "http://127.0.0.1:5051"
	}), game.settings.register(e, "sileroVoice", {
        name: "Silero Voice", scope: "client", config: !1, type: String, default: "xenia"
    }), game.settings.register(e, "qwenServerUrl", {
        name: "Qwen3-TTS Server URL", scope: "client", config: !1, type: String, default: "http://127.0.0.1:8081"
    }), game.settings.register(e, "qwenVoice", {
        name: "Qwen3-TTS Voice", scope: "client", config: !1, type: String, default: "ryan"
    }), game.settings.register(e, "qwenInstructions", {
        name: "Qwen3-TTS Voice Instructions", scope: "client", config: !1, type: String, default: ""
    }), game.settings.register(e, "playbackMode", {
		name: "Playback Mode",
		scope: "client",
		config: !1,
		type: String,
		default: "interrupt"
	}), game.settings.register(e, "speakerPortraitEnabled", {
		name: "Speaker Portrait Enabled",
		scope: "client",
		config: !1,
		type: Boolean,
		default: !0
	}), game.settings.register(e, "speakerPortraitProfileId", {
		name: "Speaker Portrait Profile ID",
		scope: "client",
		config: !1,
		type: String,
		default: ""
	}), game.settings.register(e, "speakerPortraitImageId", {
		name: "Speaker Portrait Image ID",
		scope: "client",
		config: !1,
		type: String,
		default: ""
	});
	for (let [e, t] of Object.entries(s)) ne(e, !1, t.defaultStrength);
	game.settings.register(e, "effectState", {
		name: "Effect State",
		scope: "client",
		config: !1,
		type: String,
		default: "{}"
	}), game.settings.register(e, "effectUiState", {
		name: "Effect UI State",
		scope: "client",
		config: !1,
		type: String,
		default: "{}"
	}), game.settings.register(e, "customEffectPresets", {
		name: "Custom Effect Presets",
		scope: "client",
		config: !1,
		type: String,
		default: "{}"
	}), game.settings.register(e, "voiceProfiles", {
		name: "Voice Profiles",
		scope: "client",
		config: !1,
		type: String,
		default: "{}"
	}), game.settings.register(e, "pitch", {
		name: "Pitch",
		scope: "client",
		config: !1,
		type: Number,
		default: 64
	}), game.settings.register(e, "speed", {
		name: "Speed",
		scope: "client",
		config: !1,
		type: Number,
		default: 72
	}), game.settings.register(e, "mouth", {
		name: "Mouth",
		scope: "client",
		config: !1,
		type: Number,
		default: 128
	}), game.settings.register(e, "throat", {
		name: "Throat",
		scope: "client",
		config: !1,
		type: Number,
		default: 128
	}), game.settings.register(e, "phraseHistory", {
		name: "Phrase History",
		scope: "client",
		config: !1,
		type: String,
		default: "[]"
	});
}
function ne(t, n, r) {
	game.settings.register(e, `effect.${t}.enabled`, {
		name: `Effect ${t} Enabled`,
		scope: "client",
		config: !1,
		type: Boolean,
		default: n
	}), game.settings.register(e, `effect.${t}.strength`, {
		name: `Effect ${t} Strength`,
		scope: "client",
		config: !1,
		type: Number,
		default: r
	});
}
//#endregion
//#region scripts/core/errors.js
var x = Object.freeze({
	INVALID_REQUEST: "INVALID_REQUEST",
	UNSUPPORTED_ENGINE: "UNSUPPORTED_ENGINE",
	TEXT_EMPTY: "TEXT_EMPTY",
	TEXT_TOO_LONG: "TEXT_TOO_LONG",
	PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
	INVALID_AUDIO_DATA: "INVALID_AUDIO_DATA",
	UNSUPPORTED_AUDIO_MIME: "UNSUPPORTED_AUDIO_MIME",
	AUDIO_LOCKED: "AUDIO_LOCKED",
	AUDIO_UNSUPPORTED: "AUDIO_UNSUPPORTED",
	AUDIO_DECODE_FAILED: "AUDIO_DECODE_FAILED",
	QUEUE_FULL: "QUEUE_FULL",
	PLAYBACK_CANCELLED: "PLAYBACK_CANCELLED",
	PLAYBACK_FAILED: "PLAYBACK_FAILED",
	SOCKET_OFFLINE: "SOCKET_OFFLINE",
	SOCKET_TIMEOUT: "SOCKET_TIMEOUT",
	PERMISSION_DENIED: "PERMISSION_DENIED"
}), S = class extends Error {
	constructor(e, t, n = {}) {
		super(t), this.name = "SamVoiceError", this.code = e, this.details = n;
	}
};
function C(e, t = x.PLAYBACK_FAILED) {
	return {
		code: String(e?.code || t),
		message: String(e?.message || e || "Unknown SAM Voice error."),
		details: re(e?.details) ? e.details : {}
	};
}
function re(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
//#endregion
//#region scripts/core/backendUrl.js
function w(e, t = "") {
	let n = String(e || t).trim().replace(/\/+$/, "");
	try {
		let e = new URL(n);
		if (!["http:", "https:"].includes(e.protocol)) throw Error("Unsupported protocol");
		return e.toString().replace(/\/+$/, "");
	} catch {
		throw new S(x.INVALID_REQUEST, `Invalid TTS backend URL: ${n || "empty"}.`);
	}
}
function ie(e) {
	try {
		let t = new URL(String(e)).hostname.toLowerCase();
		return t === "localhost" || t === "127.0.0.1" || t === "::1" || t === "[::1]";
	} catch {
		return !1;
	}
}
function ae(e, t = !1) {
	let n = w(e);
	if (!t && !ie(n)) throw new S(x.PERMISSION_DENIED, "Non-local TTS backends are blocked. Enable remote backends in Module Settings only for a server you trust.", { url: n });
	return n;
}
//#endregion
//#region scripts/state/engineSettings.js
function oe() {
	return {
		engine: le(game.settings.get(e, "engine")),
		piperServerUrl: fe(game.settings.get(e, "piperServerUrl")),
		piperVoice: String(game.settings.get("sam-voice", "piperVoice") || ""),
		sileroServerUrl: samSileroUrl(game.settings.get(e, "sileroServerUrl")),
		sileroVoice: String(game.settings.get(e, "sileroVoice") || "xenia"),
		qwenServerUrl: samQwenUrl(game.settings.get(e, "qwenServerUrl")),
		qwenVoice: String(game.settings.get(e, "qwenVoice") || "ryan"),
		qwenInstructions: String(game.settings.get(e, "qwenInstructions") || ""),
		speakerPortraitEnabled: game.settings.get(e, "speakerPortraitEnabled"),
		speakerPortraitProfileId: game.settings.get(e, "speakerPortraitProfileId"),
		speakerPortraitImageId: game.settings.get(e, "speakerPortraitImageId"),
		allowRemoteBackend: !!game.settings.get(e, "allowRemoteBackend")
	};
}
function se() {
	return !!game.settings.get(e, "allowRemoteBackend");
}
async function ce(e) {
	let t = [T("engine", le(e.engine))];
	"piperServerUrl" in e && t.push(T("piperServerUrl", fe(e.piperServerUrl))), "piperVoice" in e && t.push(T("piperVoice", String(e.piperVoice || "").trim().slice(0, 160))), "sileroServerUrl" in e && t.push(T("sileroServerUrl", samSileroUrl(e.sileroServerUrl))), "sileroVoice" in e && t.push(T("sileroVoice", String(e.sileroVoice || "xenia").trim().slice(0, 160))), "qwenServerUrl" in e && t.push(T("qwenServerUrl", samQwenUrl(e.qwenServerUrl))), "qwenVoice" in e && t.push(T("qwenVoice", String(e.qwenVoice || "ryan").trim().slice(0, 160))), "qwenInstructions" in e && t.push(T("qwenInstructions", String(e.qwenInstructions || "").trim().slice(0, 600))), "speakerPortraitEnabled" in e && t.push(T("speakerPortraitEnabled", e.speakerPortraitEnabled !== !1)), "speakerPortraitProfileId" in e && t.push(T("speakerPortraitProfileId", String(e.speakerPortraitProfileId || "").slice(0, 160))), "speakerPortraitImageId" in e && t.push(T("speakerPortraitImageId", String(e.speakerPortraitImageId || "").slice(0, 160))), await Promise.all(t);
}
function le(e) {
	return t.includes(e) ? e : "sam";
}
function ue() {
	let t = game.settings.get(e, "playbackMode");
	return n.includes(t) ? t : "interrupt";
}
async function de(e) {
	await T("playbackMode", n.includes(e) ? e : "interrupt");
}
function fe(e) {
	try { return w(e, "http://127.0.0.1:5050"); }
	catch { return "http://127.0.0.1:5050"; }
}
function samSileroUrl(e) {
    try { return w(e, "http://127.0.0.1:5051"); }
    catch { return "http://127.0.0.1:5051"; }
}
function samQwenUrl(e) {
    try { return w(e, "http://127.0.0.1:8081"); }
    catch { return "http://127.0.0.1:8081"; }
}
async function T(t, n) {
	game.settings.get("sam-voice", t) !== n && await game.settings.set(e, t, n);
}
//#endregion
//#region scripts/state/profiles.js
var pe = 2, me = 120;
function E() {
	let t = game.settings.get(e, "voiceProfiles");
	try {
		let e = JSON.parse(t);
		if (!e || typeof e != "object" || Array.isArray(e)) return {};
		let n = {};
		for (let [t, r] of Object.entries(e)) if (!(!r || typeof r != "object" || Array.isArray(r))) try {
			let e = ye({
				...r,
				id: r.id || t
			});
			n[e.id] = e;
		} catch (e) {
			console.warn("SAM Voice: ignored malformed voice profile", t, e);
		}
		return n;
	} catch {
		return {};
	}
}
async function he(e, t) {
	let n = we(e), r = E(), i = ke();
	return r[i] = ye({
		...t,
		id: i,
		name: n,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}), await Ae(r), i;
}
async function ge(e) {
	let t = E();
	delete t[e], await Ae(t);
}
async function _e(e) {
	let t = be(e);
	if (!t.length) throw Error("No profiles found in imported file.");
	if (t.length > 100) throw Error(`Too many profiles in import: ${t.length}/100.`);
	let n = E(), r = 0;
	for (let e of t) {
		if (!e || typeof e != "object" || Array.isArray(e)) continue;
		let t = ke();
		n[t] = ye({
			...xe(e),
			id: t,
			name: e.name || `Imported Profile ${r + 1}`,
			importedAt: (/* @__PURE__ */ new Date()).toISOString()
		}, { allowRemote: !1 }), r += 1;
	}
	if (!r) throw Error("No valid profiles found in imported file.");
	return await Ae(n), r;
}
function ve(e) {
	return be(e).flatMap((e, t) => {
		let n = String(e?.name || `Profile ${t + 1}`), r = e?.piperServerUrl;
		let a = e?.sileroServerUrl, o = [];
		if (r && !ie(r)) o.push({ profile: n, field: "piperServerUrl", url: String(r) });
		if (a && !ie(a)) o.push({ profile: n, field: "sileroServerUrl", url: String(a) });
		if (e?.qwenServerUrl && !ie(e.qwenServerUrl)) o.push({ profile: n, field: "qwenServerUrl", url: String(e.qwenServerUrl) });
		return o;
	});
}
function ye(e = {}, t = {}) {
	return {
		schemaVersion: pe,
		id: Te(e.id) || ke(),
		name: we(e.name || "Unnamed Profile"),
		engine: le(e.engine),
		piperServerUrl: Se(e.piperServerUrl, t.allowRemote ?? se()),
		piperVoice: De(e.piperVoice, 160),
		sileroServerUrl: Se(e.sileroServerUrl, t.allowRemote ?? se(), "http://127.0.0.1:5051"),
		sileroVoice: De(e.sileroVoice || "xenia", 160),
		qwenServerUrl: Se(e.qwenServerUrl, t.allowRemote ?? se(), "http://127.0.0.1:8081"),
		qwenVoice: De(e.qwenVoice || "ryan", 160),
		qwenInstructions: De(e.qwenInstructions, 600),
		speakerPortraitEnabled: e.speakerPortraitEnabled !== !1,
		speakerPortraitProfileId: De(e.speakerPortraitProfileId, 160),
		speakerPortraitImageId: De(e.speakerPortraitImageId, 160),
		samVoiceSettings: Ce(e.samVoiceSettings),
		effects: u(e.effects),
		updatedAt: Ee(e.updatedAt),
		importedAt: e.importedAt ? Ee(e.importedAt) : null
	};
}
function be(e) {
	return e ? Array.isArray(e) ? e : Array.isArray(e.profiles) ? e.profiles : e.profiles && typeof e.profiles == "object" ? Object.values(e.profiles) : [] : [];
}
function xe(e = {}) {
	let t = { ...e };
	return t.piperServerUrl && !ie(t.piperServerUrl) && delete t.piperServerUrl, t.sileroServerUrl && !ie(t.sileroServerUrl) && delete t.sileroServerUrl, t.qwenServerUrl && !ie(t.qwenServerUrl) && delete t.qwenServerUrl, t;
}
function Se(e, t, r = "http://127.0.0.1:5050") {
	try { let n = w(e, r); return t || ie(n) ? n : r; }
	catch { return r; }
}
function Ce(e) {
	return {
		pitch: Oe(e?.pitch, 0, 255, 64),
		speed: Oe(e?.speed, 1, 255, 72),
		mouth: Oe(e?.mouth, 0, 255, 128),
		throat: Oe(e?.throat, 0, 255, 128)
	};
}
function we(e) {
	let t = De(e, me);
	if (!t.length) throw Error("Profile name is empty.");
	return t;
}
function Te(e) {
	let t = De(e, 128);
	return /^[A-Za-z0-9._:-]+$/.test(t) ? t : "";
}
function Ee(e) {
	let t = new Date(e || Date.now());
	return Number.isNaN(t.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : t.toISOString();
}
function De(e, t) {
	return String(e || "").trim().slice(0, t);
}
function Oe(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, Math.round(i))) : r;
}
function ke() {
	return globalThis.crypto?.randomUUID?.() || `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
async function Ae(t) {
	await game.settings.set(e, "voiceProfiles", JSON.stringify(t));
}
//#endregion
//#region scripts/state/migrations.js
async function je() {
	let t = Number(game.settings.get("sam-voice", "settingsSchemaVersion") || 0);
	t >= 2 || (t < 1 && await Me(), t < 2 && await Ne(), await game.settings.set(e, "settingsSchemaVersion", 2), console.info("SAM Voice: settings migrated to schema 2."));
}
async function Me() {
	let t = game.settings.get(e, "effectState");
	if (t && t !== "{}") return;
	let n = {}, r = Object.keys(s);
	for (let e of r) n[e] = {
		enabled: Pe(`effect.${e}.enabled`, !1),
		strength: Pe(`effect.${e}.strength`, 50)
	};
	await game.settings.set(e, "effectState", JSON.stringify(u(n)));
}
async function Ne() {
	let t = E();
	await game.settings.set(e, "voiceProfiles", JSON.stringify(t));
}
function Pe(t, n) {
	try {
		return game.settings.get(e, t);
	} catch {
		return n;
	}
}
//#endregion
//#region scripts/state/effectSettings.js
function Fe() {
	return u(Ie() || Le());
}
function Ie() {
	let t = game.settings.get(e, "effectState");
	if (!t || t === "{}") return null;
	try {
		let e = JSON.parse(t);
		return !e || typeof e != "object" || Array.isArray(e) ? null : e;
	} catch {
		return null;
	}
}
function Le() {
	let e = {};
	for (let t of Object.keys(s)) e[t] = {
		enabled: Re(`effect.${t}.enabled`, !1),
		strength: Re(`effect.${t}.strength`, s[t].defaultStrength)
	};
	return e;
}
function Re(t, n) {
	try {
		return game.settings.get(e, t);
	} catch {
		return n;
	}
}
async function ze(t) {
	let n = u(t), r = JSON.stringify(n);
	game.settings.get("sam-voice", "effectState") !== r && await game.settings.set(e, "effectState", r);
}
function Be() {
	let t = game.settings.get(e, "effectUiState");
	try {
		return He(JSON.parse(t));
	} catch {
		return He({});
	}
}
async function Ve(t = {}) {
	await game.settings.set(e, "effectUiState", JSON.stringify(He(t)));
}
function He(e = {}) {
	let t = Object.keys(s), n = /* @__PURE__ */ new Set(), r = [];
	for (let t of Array.isArray(e?.order) ? e.order : []) !s[t] || n.has(t) || (n.add(t), r.push(t));
	for (let e of t) n.has(e) || r.push(e);
	let i = Array.isArray(e?.hidden) ? Object.fromEntries(e.hidden.map((e) => [e, !0])) : e?.hidden || {}, a = {};
	for (let e of t) a[e] = !!i[e];
	return {
		order: r,
		hidden: a
	};
}
function D() {
	let t = game.settings.get(e, "customEffectPresets");
	try {
		let e = JSON.parse(t);
		return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
	} catch {
		return {};
	}
}
async function Ue(e, t) {
	let n = String(e || "").trim();
	if (!n.length) throw Error("Preset name is empty.");
	let r = D(), i = crypto.randomUUID();
	return r[i] = {
		id: i,
		name: n,
		effects: u(t)
	}, await Ke(r), i;
}
async function We(e, t = {}) {
	let n = D(), r = n[e];
	if (!r) throw Error("Preset does not exist.");
	let i = Object.prototype.hasOwnProperty.call(t, "name") ? String(t.name || "").trim() : r.name;
	if (!i.length) throw Error("Preset name is empty.");
	return n[e] = {
		...r,
		id: e,
		name: i,
		effects: t.effects ? u(t.effects) : u(r.effects)
	}, await Ke(n), e;
}
async function Ge(e) {
	let t = D();
	delete t[e], await Ke(t);
}
async function Ke(t) {
	await game.settings.set(e, "customEffectPresets", JSON.stringify(t));
}
//#endregion
//#region scripts/state/samVoiceSettings.js
function qe() {
	return {
		pitch: O(game.settings.get(e, "pitch"), 0, 255, 64),
		speed: O(game.settings.get(e, "speed"), 1, 255, 72),
		mouth: O(game.settings.get(e, "mouth"), 0, 255, 128),
		throat: O(game.settings.get(e, "throat"), 0, 255, 128)
	};
}
async function Je(t) {
	let n = {
		pitch: O(t.pitch, 0, 255, 64),
		speed: O(t.speed, 1, 255, 72),
		mouth: O(t.mouth, 0, 255, 128),
		throat: O(t.throat, 0, 255, 128)
	};
	await Promise.all(Object.entries(n).map(async ([t, n]) => {
		game.settings.get("sam-voice", t) !== n && await game.settings.set(e, t, n);
	}));
}
function O(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, Math.round(i))) : r;
}
//#endregion
//#region scripts/state/history.js
var Ye = 12;
function Xe() {
	let t = game.settings.get(e, "phraseHistory");
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
async function Ze(t) {
	let n = t.trim();
	if (!n.length) return;
	let r = [n, ...Xe().filter((e) => e !== n)].slice(0, Ye);
	await game.settings.set(e, "phraseHistory", JSON.stringify(r));
}
async function Qe() {
	await game.settings.set(e, "phraseHistory", "[]");
}
//#endregion
//#region scripts/translit.js
var $e = {
	а: "a",
	б: "b",
	в: "v",
	г: "g",
	д: "d",
	е: "e",
	ё: "yo",
	ж: "zh",
	з: "z",
	и: "i",
	й: "y",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "kh",
	ц: "ts",
	ч: "ch",
	ш: "sh",
	щ: "shch",
	ъ: "",
	ы: "y",
	ь: "",
	э: "e",
	ю: "yu",
	я: "ya"
};
function et(e) {
	return e.split("").map((e) => {
		let t = e.toLowerCase();
		return Object.prototype.hasOwnProperty.call($e, t) ? $e[t] : e;
	}).join("").toUpperCase();
}
//#endregion
//#region scripts/core/engineRegistry.js
var tt = /* @__PURE__ */ new Map();
function nt(e, t) {
	let n = String(e || "").trim().toLowerCase();
	if (!n || typeof t?.createAudioBuffer != "function") throw new S(x.INVALID_REQUEST, "Playback engine adapter is invalid.");
	return tt.set(n, t), () => tt.delete(n);
}
function rt(e) {
	let t = String(e || "").trim().toLowerCase(), n = tt.get(t);
	if (!n) throw new S(x.UNSUPPORTED_ENGINE, `Unsupported SAM Voice engine: ${t || "empty"}.`);
	return n;
}
//#endregion
//#region scripts/core/speechSchema.js
var it = /* @__PURE__ */ new Set([
	"audio/wav",
	"audio/wave",
	"audio/x-wav",
	"audio/vnd.wave",
	"audio/mpeg",
	"audio/ogg",
	"audio/webm",
	"audio/mp4",
	"audio/flac"
]);
function at(e, a = {}) {
	if (!re(e)) throw new S(x.INVALID_REQUEST, "Speech request must be an object.");
	let o = pt(e.engine || "sam", t, x.UNSUPPORTED_ENGINE, "engine"), s = n.includes(e.playbackMode) ? e.playbackMode : "interrupt", c = lt(e.text, o === "sam" ? 800 : r), l = ut(e.effects), u = {
		schemaVersion: 2,
		requestId: ht(e.requestId) || ct(),
		createdAt: gt(e.createdAt),
		scope: a.scope || mt(e.scope),
		engine: o,
		text: c,
		originalText: k(e.originalText, i),
		playbackMode: s,
		effects: l,
		profileId: k(e.profileId, 160),
		profileName: k(e.profileName, 160),
		speakerPortraitEnabled: e.speakerPortraitEnabled !== !1,
		speakerPortraitProfileId: k(e.speakerPortraitProfileId, 160),
		speakerPortraitImageId: k(e.speakerPortraitImageId, 160)
	};
	return o === "sam" ? Object.assign(u, dt(e)) : (o === "piper" || o === "silero" || o === "qwen") && Object.assign(u, ft(e)), u;
}
function ot(e, t = a) {
	let n = String(e || ""), r = n.match(/^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$/);
	if (!r) throw new S(x.INVALID_AUDIO_DATA, "Generated audio must be a valid base64 data URL.");
	let i = String(r[1] || "").toLowerCase();
	if (!it.has(i)) throw new S(x.UNSUPPORTED_AUDIO_MIME, `Unsupported generated audio MIME type: ${i || "unknown"}.`, { mimeType: i });
	let o = r[2], s = o.endsWith("==") ? 2 : +!!o.endsWith("="), c = Math.max(0, Math.floor(o.length * 3 / 4) - s);
	if (!c) throw new S(x.INVALID_AUDIO_DATA, "Generated audio payload is empty.");
	if (c > t) throw new S(x.PAYLOAD_TOO_LARGE, `Generated audio is too large: ${vt(c)} MB / ${vt(t)} MB.`, {
		sizeBytes: c,
		maxBytes: t,
		mimeType: i
	});
	return {
		dataUrl: n,
		mimeType: i,
		sizeBytes: c,
		base64: o
	};
}
function st(e, t = a) {
	let n = ot(e, t), r;
	try {
		r = globalThis.atob(n.base64);
	} catch (e) {
		throw new S(x.INVALID_AUDIO_DATA, "Generated audio contains invalid base64 data.", { cause: e?.message || String(e) });
	}
	let i = new Uint8Array(r.length);
	for (let e = 0; e < r.length; e += 1) i[e] = r.charCodeAt(e);
	return {
		arrayBuffer: i.buffer,
		mimeType: n.mimeType,
		sizeBytes: n.sizeBytes
	};
}
function ct() {
	return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `samvoice-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function lt(e, t) {
	let n = String(e || "").trim();
	if (!n.length) throw new S(x.TEXT_EMPTY, "Speech text is empty.");
	if (n.length > t) throw new S(x.TEXT_TOO_LONG, `Speech text is too long: ${n.length}/${t} characters.`, {
		length: n.length,
		maxChars: t
	});
	return n;
}
function ut(e) {
	if (e == null) return u({});
	if (!re(e)) throw new S(x.INVALID_REQUEST, "Effects payload must be an object.");
	let t;
	try {
		t = JSON.stringify(e);
	} catch {
		throw new S(x.INVALID_REQUEST, "Effects payload is not serializable.");
	}
	if (t.length > 65536) throw new S(x.PAYLOAD_TOO_LARGE, "Effects payload is too large.");
	return u(e);
}
function dt(e) {
	return {
		pitch: _t(e.pitch, 0, 255, 64),
		speed: _t(e.speed, 1, 255, 72),
		mouth: _t(e.mouth, 0, 255, 128),
		throat: _t(e.throat, 0, 255, 128)
	};
}
function ft(e) {
	let t = ot(e.audioDataUrl);
	return {
		voice: k(e.voice, 160),
		audioDataUrl: t.dataUrl,
		mimeType: t.mimeType,
		sizeBytes: t.sizeBytes
	};
}
function pt(e, t, n, r) {
	let i = String(e || "").trim().toLowerCase();
	if (!t.includes(i)) throw new S(n, `Unsupported ${r}: ${i || "empty"}.`, { value: i });
	return i;
}
function mt(e) {
	return e === "local" ? "local" : "everyone";
}
function ht(e) {
	let t = k(e, 128);
	if (!t) return "";
	if (!/^[A-Za-z0-9._:-]+$/.test(t)) throw new S(x.INVALID_REQUEST, "Speech request ID contains invalid characters.");
	return t;
}
function gt(e) {
	let t = Number(e);
	return Number.isFinite(t) && t > 0 ? t : Date.now();
}
function k(e, t) {
	return String(e || "").trim().slice(0, t);
}
function _t(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, Math.round(i))) : r;
}
function vt(e) {
	return (e / 1024 / 1024).toFixed(1);
}
//#endregion
//#region scripts/engines/generatedPlaybackEngine.js
var yt = {
	id: "piper",
	async createAudioBuffer({ request: e, audioContext: t, isCancelled: n }) {
		let { arrayBuffer: r } = st(e.audioDataUrl);
		if (n()) return null;
		try {
			return await t.decodeAudioData(r);
		} catch (t) {
			throw new S(x.AUDIO_DECODE_FAILED, "Generated audio could not be decoded by this browser.", {
				mimeType: e.mimeType,
				sizeBytes: e.sizeBytes,
				cause: t?.message || String(t)
			});
		}
	}
}, bt = (e, t) => (e & t) != 0, xt = (e) => {
	let t = new Uint8Array(e.length);
	return e.split("").forEach((e, n) => {
		t[n] = e.charCodeAt(0);
	}), t;
}, St = (e) => {
	var t = /* @__PURE__ */ new Uint8Array(4);
	return t[0] = e, t[1] = e >> 8, t[2] = e >> 16, t[3] = e >> 24, t;
}, Ct = (e) => {
	var t = /* @__PURE__ */ new Uint8Array(2);
	return t[0] = e, t[1] = e >> 8, t;
}, wt = null, Tt = (e) => {
	let t = new Uint8Array(44 + e.length), n = 0, r = (e) => {
		t.set(e, n), n += e.length;
	};
	return r(xt("RIFF")), r(St(e.length + 12 + 16 + 8 - 8)), r(xt("WAVE")), r(xt("fmt ")), r(St(16)), r(Ct(1)), r(Ct(1)), r(St(22050)), r(St(22050)), r(Ct(1)), r(Ct(8)), r(xt("data")), r(St(e.length)), r(e), t;
}, Et = {
	" ": 0,
	"!": 2,
	"\"": 2,
	"#": 2,
	$: 2,
	"%": 2,
	"&": 2,
	"'": 130,
	"(": 0,
	")": 0,
	"*": 2,
	"+": 2,
	",": 2,
	"-": 2,
	".": 2,
	"/": 2,
	0: 3,
	1: 3,
	2: 3,
	3: 3,
	4: 3,
	5: 3,
	6: 3,
	7: 3,
	8: 3,
	9: 3,
	":": 2,
	";": 2,
	"<": 2,
	"=": 2,
	">": 2,
	"?": 2,
	"@": 2,
	A: 192,
	B: 168,
	C: 176,
	D: 172,
	E: 192,
	F: 160,
	G: 184,
	H: 160,
	I: 192,
	J: 188,
	K: 160,
	L: 172,
	M: 168,
	N: 172,
	O: 192,
	P: 160,
	Q: 160,
	R: 172,
	S: 180,
	T: 164,
	U: 192,
	V: 168,
	W: 168,
	X: 176,
	Y: 192,
	Z: 188,
	"[": 0,
	"\\": 0,
	"]": 0,
	"^": 2,
	_: 0,
	"`": 32
}, A = 128, Dt = (e, t) => (Et[e] & t) != 0, j = (e, t, n) => Dt(e[t], n), M = (e, t) => t.indexOf(e) !== -1, Ot = (e) => {
	let t = e.split("="), n = t.pop(), r = t.join("=").split("("), i = r.pop().split(")"), a = r[0], o = i[0], s = i[1], c = [
		"T",
		"C",
		"S"
	], l = [
		"E",
		"I",
		"Y"
	], u = (e, t, r) => {
		if (e.startsWith(o, t) && ((e, t) => {
			for (let r = a.length - 1; -1 < r; r--) {
				var n = a[r];
				if (Dt(n, A)) {
					if (e[--t] !== n) return !1;
				} else if (!{
					" ": () => !j(e, --t, A),
					"#": () => j(e, --t, 64),
					".": () => j(e, --t, 8),
					"&": () => j(e, --t, 16) || M(e.substr(--t, 2), ["CH", "SH"]),
					"@": () => {
						var n;
						return !!j(e, --t, 4) || (n = e[t]) === "H" && !!M(n, c);
					},
					"^": () => j(e, --t, 32),
					"+": () => M(e[--t], l),
					":": () => {
						for (; 0 <= t && j(e, t - 1, 32);) t--;
						return !0;
					}
				}[n]()) return !1;
			}
			return !0;
		})(e, t) && ((e, t) => {
			for (let r = 0; r < s.length; r++) {
				var n = s[r];
				if (Dt(n, A)) {
					if (e[++t] !== n) return !1;
				} else if (!{
					" ": () => !j(e, ++t, A),
					"#": () => j(e, ++t, 64),
					".": () => j(e, ++t, 8),
					"&": () => j(e, ++t, 16) || M(e.substr(++t - 2, 2), ["HC", "HS"]),
					"@": () => {
						var n;
						return !!j(e, ++t, 4) || (n = e[t]) === "H" && !!M(n, c);
					},
					"^": () => j(e, ++t, 32),
					"+": () => M(e[++t], l),
					":": () => {
						for (; j(e, t + 1, 32);) t++;
						return !0;
					},
					"%": () => {
						if (e[t + 1] !== "E") return e.substr(t + 1, 3) === "ING" && (t += 3, !0);
						if (j(e, t + 2, A)) {
							if (!M(e[t + 2], [
								"R",
								"S",
								"D"
							])) return e[t + 2] === "L" ? e[t + 3] === "Y" && (t += 3, !0) : e.substr(t + 2, 3) === "FUL" && (t += 4, !0);
							t += 2;
						} else t++;
						return !0;
					}
				}[n]()) return !1;
			}
			return !0;
		})(e, t + (o.length - 1))) return r(n, o.length), !0;
	};
	return u.c = o[0], u;
}, kt = {}, At = (" (A.)=EH4Y. |(A) =AH| (ARE) =AAR| (AR)O=AXR|(AR)#=EH4R| ^(AS)#=EY4S|(A)WA=AX|(AW)=AO5| :(ANY)=EH4NIY|(A)^+#=EY5|#:(ALLY)=ULIY| (AL)#=UL|(AGAIN)=AXGEH4N|#:(AG)E=IHJ|(A)^%=EY|(A)^+:#=AE| :(A)^+ =EY4| (ARR)=AXR|(ARR)=AE4R| ^(AR) =AA5R|(AR)=AA5R|(AIR)=EH4R|(AI)=EY4|(AY)=EY5|(AU)=AO4|#:(AL) =UL|#:(ALS) =ULZ|(ALK)=AO4K|(AL)^=AOL| :(ABLE)=EY4BUL|(ABLE)=AXBUL|(A)VO=EY4|(ANG)+=EY4NJ|(ATARI)=AHTAA4RIY|(A)TOM=AE|(A)TTI=AE| (AT) =AET| (A)T=AH|(A)=AE| (B) =BIY4| (BE)^#=BIH|(BEING)=BIY4IHNX| (BOTH) =BOW4TH| (BUS)#=BIH4Z|(BREAK)=BREY5K|(BUIL)=BIH4L|(B)=B| (C) =SIY4| (CH)^=K|^E(CH)=K|(CHA)R#=KEH5|(CH)=CH| S(CI)#=SAY4|(CI)A=SH|(CI)O=SH|(CI)EN=SH|(CITY)=SIHTIY|(C)+=S|(CK)=K|(COMMODORE)=KAA4MAHDOHR|(COM)=KAHM|(CUIT)=KIHT|(CREA)=KRIYEY|(C)=K| (D) =DIY4| (DR.) =DAA4KTER|#:(DED) =DIHD|.E(D) =D|#:^E(D) =T| (DE)^#=DIH| (DO) =DUW| (DOES)=DAHZ|(DONE) =DAH5N|(DOING)=DUW4IHNX| (DOW)=DAW|#(DU)A=JUW|#(DU)^#=JAX|(D)=D| (E) =IYIY4|#:(E) =|':^(E) =| :(E) =IY|#(ED) =D|#:(E)D =|(EV)ER=EH4V|(E)^%=IY4|(ERI)#=IY4RIY|(ERI)=EH4RIH|#:(ER)#=ER|(ERROR)=EH4ROHR|(ERASE)=IHREY5S|(ER)#=EHR|(ER)=ER| (EVEN)=IYVEHN|#:(E)W=|@(EW)=UW|(EW)=YUW|(E)O=IY|#:&(ES) =IHZ|#:(E)S =|#:(ELY) =LIY|#:(EMENT)=MEHNT|(EFUL)=FUHL|(EE)=IY4|(EARN)=ER5N| (EAR)^=ER5|(EAD)=EHD|#:(EA) =IYAX|(EA)SU=EH5|(EA)=IY5|(EIGH)=EY4|(EI)=IY4| (EYE)=AY4|(EY)=IY|(EU)=YUW5|(EQUAL)=IY4KWUL|(E)=EH| (F) =EH4F|(FUL)=FUHL|(FRIEND)=FREH5ND|(FATHER)=FAA4DHER|(F)F=|(F)=F| (G) =JIY4|(GIV)=GIH5V| (G)I^=G|(GE)T=GEH5|SU(GGES)=GJEH4S|(GG)=G| B#(G)=G|(G)+=J|(GREAT)=GREY4T|(GON)E=GAO5N|#(GH)=| (GN)=N|(G)=G| (H) =EY4CH| (HAV)=/HAE6V| (HERE)=/HIYR| (HOUR)=AW5ER|(HOW)=/HAW|(H)#=/H|(H)=| (IN)=IHN| (I) =AY4|(I) =AY|(IN)D=AY5N|SEM(I)=IY| ANT(I)=AY|(IER)=IYER|#:R(IED) =IYD|(IED) =AY5D|(IEN)=IYEHN|(IE)T=AY4EH|(I')=AY5| :(I)^%=AY5| :(IE) =AY4|(I)%=IY|(IE)=IY4| (IDEA)=AYDIY5AH|(I)^+:#=IH|(IR)#=AYR|(IZ)%=AYZ|(IS)%=AYZ|I^(I)^#=IH|+^(I)^+=AY|#:^(I)^+=IH|(I)^+=AY|(IR)=ER|(IGH)=AY4|(ILD)=AY5LD| (IGN)=IHGN|(IGN) =AY4N|(IGN)^=AY4N|(IGN)%=AY4N|(ICRO)=AY4KROH|(IQUE)=IY4K|(I)=IH| (J) =JEY4|(J)=J| (K) =KEY4| (K)N=|(K)=K| (L) =EH4L|(LO)C#=LOW|L(L)=|#:^(L)%=UL|(LEAD)=LIYD| (LAUGH)=LAE4F|(L)=L| (M) =EH4M| (MR.) =MIH4STER| (MS.)=MIH5Z| (MRS.) =MIH4SIXZ|(MOV)=MUW4V|(MACHIN)=MAHSHIY5N|M(M)=|(M)=M| (N) =EH4N|E(NG)+=NJ|(NG)R=NXG|(NG)#=NXG|(NGL)%=NXGUL|(NG)=NX|(NK)=NXK| (NOW) =NAW4|N(N)=|(NON)E=NAH4N|(N)=N| (O) =OH4W|(OF) =AHV| (OH) =OW5|(OROUGH)=ER4OW|#:(OR) =ER|#:(ORS) =ERZ|(OR)=AOR| (ONE)=WAHN|#(ONE) =WAHN|(OW)=OW| (OVER)=OW5VER|PR(O)V=UW4|(OV)=AH4V|(O)^%=OW5|(O)^EN=OW|(O)^I#=OW5|(OL)D=OW4L|(OUGHT)=AO5T|(OUGH)=AH5F| (OU)=AW|H(OU)S#=AW4|(OUS)=AXS|(OUR)=OHR|(OULD)=UH5D|(OU)^L=AH5|(OUP)=UW5P|(OU)=AW|(OY)=OY|(OING)=OW4IHNX|(OI)=OY5|(OOR)=OH5R|(OOK)=UH5K|F(OOD)=UW5D|L(OOD)=AH5D|M(OOD)=UW5D|(OOD)=UH5D|F(OOT)=UH5T|(OO)=UW5|(O')=OH|(O)E=OW|(O) =OW|(OA)=OW4| (ONLY)=OW4NLIY| (ONCE)=WAH4NS|(ON'T)=OW4NT|C(O)N=AA|(O)NG=AO| :^(O)N=AH|I(ON)=UN|#:(ON)=UN|#^(ON)=UN|(O)ST=OW|(OF)^=AO4F|(OTHER)=AH5DHER|R(O)B=RAA|^R(O):#=OW5|(OSS) =AO5S|#:^(OM)=AHM|(O)=AA| (P) =PIY4|(PH)=F|(PEOPL)=PIY5PUL|(POW)=PAW4|(PUT) =PUHT|(P)P=|(P)S=|(P)N=|(PROF.)=PROHFEH4SER|(P)=P| (Q) =KYUW4|(QUAR)=KWOH5R|(QU)=KW|(Q)=K| (R) =AA5R| (RE)^#=RIY|(R)R=|(R)=R| (S) =EH4S|(SH)=SH|#(SION)=ZHUN|(SOME)=SAHM|#(SUR)#=ZHER|(SUR)#=SHER|#(SU)#=ZHUW|#(SSU)#=SHUW|#(SED)=ZD|#(S)#=Z|(SAID)=SEHD|^(SION)=SHUN|(S)S=|.(S) =Z|#:.E(S) =Z|#:^#(S) =S|U(S) =S| :#(S) =Z|##(S) =Z| (SCH)=SK|(S)C+=|#(SM)=ZUM|#(SN)'=ZUM|(STLE)=SUL|(S)=S| (T) =TIY4| (THE) #=DHIY| (THE) =DHAX|(TO) =TUX| (THAT)=DHAET| (THIS) =DHIHS| (THEY)=DHEY| (THERE)=DHEHR|(THER)=DHER|(THEIR)=DHEHR| (THAN) =DHAEN| (THEM) =DHAEN|(THESE) =DHIYZ| (THEN)=DHEHN|(THROUGH)=THRUW4|(THOSE)=DHOHZ|(THOUGH) =DHOW|(TODAY)=TUXDEY|(TOMO)RROW=TUMAA5|(TO)TAL=TOW5| (THUS)=DHAH4S|(TH)=TH|#:(TED)=TIXD|S(TI)#N=CH|(TI)O=SH|(TI)A=SH|(TIEN)=SHUN|(TUR)#=CHER|(TU)A=CHUW| (TWO)=TUW|&(T)EN =|(T)=T| (U) =YUW4| (UN)I=YUWN| (UN)=AHN| (UPON)=AXPAON|@(UR)#=UH4R|(UR)#=YUH4R|(UR)=ER|(U)^ =AH|(U)^^=AH5|(UY)=AY5| G(U)#=|G(U)%=|G(U)#=W|#N(U)=YUW|@(U)=UW|(U)=YUW| (V) =VIY4|(VIEW)=VYUW5|(V)=V| (W) =DAH4BULYUW| (WERE)=WER|(WA)SH=WAA|(WA)ST=WEY|(WA)S=WAH|(WA)T=WAA|(WHERE)=WHEHR|(WHAT)=WHAHT|(WHOL)=/HOWL|(WHO)=/HUW|(WH)=WH|(WAR)#=WEHR|(WAR)=WAOR|(WOR)^=WER|(WR)=R|(WOM)A=WUHM|(WOM)E=WIHM|(WEA)R=WEH|(WANT)=WAA5NT|ANS(WER)=ER|(W)=W| (X) =EH4KR| (X)=Z|(X)=KS| (Y) =WAY4|(YOUNG)=YAHNX| (YOUR)=YOHR| (YOU)=YUW| (YES)=YEHS| (Y)=Y|F(Y)=AY|PS(YCH)=AYK|#:^(Y)=IY|#:^(Y)I=IY| :(Y) =AY| :(Y)#=AY| :(Y)^+:#=IH| :(Y)^#=AY|(Y)=IH| (Z) =ZIY4|(Z)=Z".split("|").map((e) => {
	var t = (e = Ot(e)).c;
	kt[t] = kt[t] || [], kt[t].push(e);
}), "(A)=|(!)=.|(\") =-AH5NKWOWT-|(\")=KWOW4T-|(#)= NAH4MBER|($)= DAA4LER|(%)= PERSEH4NT|(&)= AEND|(')=|(*)= AE4STERIHSK|(+)= PLAH4S|(,)=,| (-) =-|(-)=|(.)= POYNT|(/)= SLAE4SH|(0)= ZIY4ROW| (1ST)=FER4ST| (10TH)=TEH4NTH|(1)= WAH4N| (2ND)=SEH4KUND|(2)= TUW4| (3RD)=THER4D|(3)= THRIY4|(4)= FOH4R| (5TH)=FIH4FTH|(5)= FAY4V| (64) =SIH4KSTIY FOHR|(6)= SIH4KS|(7)= SEH4VUN| (8TH)=EY4TH|(8)= EY4T|(9)= NAY4N|(:)=.|(;)=.|(<)= LEH4S DHAEN|(=)= IY4KWULZ|(>)= GREY4TER DHAEN|(?)=?|(@)= AE6T|(^)= KAE4RIXT".split("|").map(Ot)), jt = "*12345678".split(""), Mt = " *.*?*,*-*IYIHEHAEAAAHAOUHAXIXERUXOHRXLXWXYXWHR*L*W*Y*M*N*NXDXQ*S*SHF*TH/H/XZ*ZHV*DHCH**J*******EYAYOYAWOWUWB*****D*****G*****GX****P*****T*****K*****KX****ULUMUN".match(/.{1,2}/g), Nt = [
	32768,
	49408,
	49408,
	49408,
	49408,
	164,
	164,
	164,
	164,
	164,
	164,
	132,
	132,
	164,
	164,
	132,
	132,
	132,
	132,
	132,
	132,
	132,
	68,
	4164,
	4164,
	4164,
	4164,
	2124,
	3148,
	2124,
	1096,
	16460,
	9280,
	8256,
	8256,
	9280,
	64,
	64,
	9284,
	8260,
	8260,
	9284,
	8264,
	8256,
	76,
	8260,
	0,
	0,
	180,
	180,
	180,
	148,
	148,
	148,
	78,
	78,
	78,
	1102,
	1102,
	1102,
	78,
	78,
	78,
	78,
	78,
	78,
	75,
	75,
	75,
	1099,
	1099,
	1099,
	75,
	75,
	75,
	75,
	75,
	75,
	128,
	193,
	193
], Pt = [
	0,
	4626,
	4626,
	4626,
	2056,
	2824,
	2312,
	2824,
	3592,
	3851,
	2822,
	4108,
	3082,
	1541,
	1541,
	3595,
	3082,
	3594,
	3082,
	2825,
	2056,
	2055,
	2825,
	2567,
	2310,
	2056,
	2054,
	2055,
	2055,
	2055,
	770,
	1285,
	514,
	514,
	514,
	514,
	514,
	514,
	1542,
	1542,
	2055,
	1542,
	1542,
	514,
	2312,
	1027,
	513,
	286,
	3597,
	3852,
	3852,
	3852,
	3598,
	3593,
	2054,
	513,
	514,
	1797,
	513,
	257,
	1798,
	513,
	514,
	1798,
	513,
	514,
	2056,
	514,
	514,
	1540,
	514,
	514,
	1798,
	513,
	1028,
	1798,
	257,
	1028,
	1479,
	1535
], Ft = (e, t) => {
	var n = Mt.findIndex((n) => n === e + t && n[1] !== "*");
	return n !== -1 && n;
}, It = (e) => {
	var t = Mt.findIndex((t) => t === e + "*");
	return t !== -1 && t;
}, Lt = (e, t, n) => {
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = e[r + 1] || "", o;
		if (!1 !== (o = Ft(i, a))) r++, t(o);
		else if (!1 !== (o = It(i))) t(o);
		else {
			for (o = jt.length; i !== jt[o] && 0 < o;) --o;
			if (o === 0) throw Error();
			n(o);
		}
	}
}, N = (e, t) => bt(Nt[e], t), Rt = 23, zt = 57, Bt = 69, Vt = 1, Ht = 2, Ut = 8192, Wt = 4096, Gt = 2048, Kt = 1024, qt = 256, P = 128, Jt = 64, Yt = 32, Xt = 16, Zt = 8, Qt = 4, $t = 2, en = 1, tn = (e, t, n, r) => {
	let i = (i, a) => {
		switch (i) {
			case 53:
				N(n(a - 1), Kt) && t(a, 16);
				break;
			case 42:
				e(a + 1, 43, r(a));
				break;
			case 44: e(a + 1, 45, r(a));
		}
	}, a = (n, i) => {
		t(n, 13), e(n + 1, i, r(n));
	}, o = -1, s;
	for (; (s = n(++o)) !== null;) if (s !== 0) if (N(s, Xt)) e(o + 1, N(s, Yt) ? 21 : 20, r(o)), i(s, o);
	else if (s === 78) a(o, 24);
	else if (s === 79) a(o, 27);
	else if (s === 80) a(o, 28);
	else if (N(s, P) && r(o)) n(o + 1) === 0 && (s = n(o + 2)) !== null && N(s, P) && r(o + 2) && e(o + 2, 31, 0);
	else {
		var c, l = o === 0 ? null : n(o - 1);
		if (s === Rt) switch (l) {
			case Bt:
				t(o - 1, 42);
				break;
			case zt:
				t(o - 1, 44);
				break;
			default: N(l, P) && t(o, 18);
		}
		else s === 24 && N(l, P) ? t(o, 19) : l === 60 && s === 32 ? t(o, 38) : s === 60 ? (c = n(o + 1), N(c, Yt) || c === null || t(o, 63)) : (s === 72 && (c = n(o + 1), N(c, Yt) && c !== null || (t(o, 75), s = 75)), N(s, en) && l === 32 ? t(o, s - 12) : N(s, en) || i(s, o), s !== 69 && s !== 57 || 0 < o && N(n(o - 1), P) && ((s = n(o + 1)) === 0 && (s = n(o + 2)), N(s, P)) && !r(o + 1) && t(o, 30));
	}
}, nn = (e, t, n) => {
	for (let a = 0; e(a) !== null; a++) if (N(e(a), qt)) {
		for (var r, i = a; 1 < --a && !N(e(a), P););
		if (a === 0) break;
		for (; a < i; a++) N(e(a), Ut) && !N(e(a), Qt) || (r = n(a), t(a, (r >> 1) + r + 1));
	}
	let a = -1, o;
	for (; (o = e(++a)) !== null;) {
		let r = a, i, s, c;
		if (N(o, P)) o = e(++r), N(o, Jt) ? (i = o === null ? 65 : Nt[o], bt(i, Qt) ? (c = n(a), t(a, (c >> 2) + c + 1)) : bt(i, en) && (s = n(a), t(a, s - (s >> 3)))) : o !== 18 && o !== 19 || !N(e(++r), Jt) || t(a, n(a) - 1);
		else if (N(o, Gt)) (o = e(++r)) !== null && N(o, $t) && (t(r, 6), t(r - 1, 5));
		else if (N(o, $t)) {
			for (; (o = e(++r)) === 0;);
			o !== null && N(o, $t) && (t(r, 1 + (n(r) >> 1)), t(a, 1 + (n(a) >> 1)));
		} else 0 < r && N(o, Wt) && N(e(r - 1), $t) && t(r, n(r) - 2);
	}
}, rn = (e, t, n) => {
	let r = 0;
	for (var i; (i = e(r)) !== null;) N(i, Jt) && (i = e(r + 1)) !== null && N(i, P) && (i = t(r + 1)) !== 0 && i < 128 && n(r, i + 1), ++r;
}, an = (e, t, n) => {
	let r = 0;
	for (var i; (i = e(r)) !== null;) {
		var a = t(r);
		n(r, a === 0 || 127 < a ? 255 & Pt[i] : Pt[i] >> 8), r++;
	}
}, on = (e, t, n) => {
	let r = -1;
	for (var i; (i = e(++r)) !== null;) if (N(i, $t)) {
		if (N(i, en)) {
			let t, n = r;
			for (; (t = e(++n)) === 0;);
			if (t !== null && (N(t, Zt) || t === 36 || t === 37)) continue;
		}
		t(r + 1, i + 1, n(r), 255 & Pt[i + 1]), t(r + 2, i + 2, n(r), 255 & Pt[i + 2]), r += 2;
	}
}, sn = [
	24,
	26,
	23,
	23,
	23
], cn = [
	0,
	224,
	230,
	236,
	243,
	249,
	0,
	6,
	12,
	6
], ln = [
	0,
	31,
	31,
	31,
	31,
	2,
	2,
	2,
	2,
	2,
	2,
	2,
	2,
	2,
	5,
	5,
	2,
	10,
	2,
	8,
	5,
	5,
	11,
	10,
	9,
	8,
	8,
	160,
	8,
	8,
	23,
	31,
	18,
	18,
	18,
	18,
	30,
	30,
	20,
	20,
	20,
	20,
	23,
	23,
	26,
	26,
	29,
	29,
	2,
	2,
	2,
	2,
	2,
	2,
	26,
	29,
	27,
	26,
	29,
	27,
	26,
	29,
	27,
	26,
	29,
	27,
	23,
	29,
	23,
	23,
	29,
	23,
	23,
	29,
	23,
	23,
	29,
	23,
	23,
	23
], un = [
	0,
	2,
	2,
	2,
	2,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	3,
	2,
	4,
	4,
	2,
	2,
	2,
	2,
	2,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	1,
	0,
	1,
	0,
	1,
	0,
	5,
	5,
	5,
	5,
	5,
	4,
	4,
	2,
	0,
	1,
	2,
	0,
	1,
	2,
	0,
	1,
	2,
	0,
	1,
	2,
	0,
	2,
	2,
	0,
	1,
	3,
	0,
	2,
	3,
	0,
	2,
	160,
	160
], dn = [
	0,
	2,
	2,
	2,
	2,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	3,
	3,
	4,
	4,
	3,
	3,
	3,
	3,
	3,
	1,
	2,
	3,
	2,
	1,
	3,
	3,
	3,
	3,
	1,
	1,
	3,
	3,
	3,
	2,
	2,
	3,
	2,
	3,
	0,
	0,
	5,
	5,
	5,
	5,
	4,
	4,
	2,
	0,
	2,
	2,
	0,
	3,
	2,
	0,
	4,
	2,
	0,
	3,
	2,
	0,
	2,
	2,
	0,
	2,
	3,
	0,
	3,
	3,
	0,
	3,
	176,
	160
], fn = [
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	241,
	226,
	211,
	187,
	124,
	149,
	1,
	2,
	3,
	3,
	0,
	114,
	0,
	2,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	27,
	0,
	0,
	25,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0
], pn = [
	0,
	5980947,
	5980947,
	5980947,
	5980947,
	7230474,
	6113550,
	5980947,
	5783320,
	5842971,
	5712919,
	5775125,
	5383440,
	5844244,
	6113550,
	4075794,
	5383182,
	5774866,
	4076306,
	7218448,
	5250317,
	6112527,
	5904395,
	3944978,
	7216654,
	5904395,
	7230217,
	5320198,
	7943686,
	6641158,
	7943686,
	5980945,
	6506758,
	6967046,
	5315078,
	7946758,
	6113550,
	5383440,
	6107913,
	6767114,
	4990984,
	6106890,
	6639366,
	6639366,
	7946758,
	6639365,
	7958022,
	0,
	5916691,
	5777179,
	5775125,
	5778203,
	5774866,
	5382669,
	5315078,
	5315078,
	5315078,
	7946758,
	7946758,
	7946758,
	7368198,
	7237126,
	7237126,
	6181894,
	6181894,
	6181894,
	5315078,
	5315078,
	5315078,
	7946758,
	7946758,
	7946758,
	6647046,
	6641162,
	7367946,
	6181894,
	6181894,
	6181894,
	556844,
	98067
], mn = [
	0,
	0,
	0,
	0,
	0,
	526861,
	461581,
	527630,
	527887,
	68879,
	68623,
	3087,
	68367,
	2316,
	461581,
	330508,
	68623,
	3087,
	396301,
	67597,
	2061,
	461838,
	2061,
	330252,
	67597,
	2061,
	526861,
	780,
	2313,
	198153,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	779,
	66827,
	779,
	1035,
	0,
	0,
	1,
	66827,
	920064,
	66050,
	593422,
	68879,
	3087,
	68879,
	3087,
	2061,
	2,
	260,
	0,
	2,
	260,
	0,
	1,
	260,
	0,
	1,
	260,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	461324,
	0,
	0,
	330240,
	0,
	1245199,
	1048591
], hn = [
	56,
	132,
	107,
	25,
	198,
	99,
	24,
	134,
	115,
	152,
	198,
	177,
	28,
	202,
	49,
	140,
	199,
	49,
	136,
	194,
	48,
	152,
	70,
	49,
	24,
	198,
	53,
	12,
	202,
	49,
	12,
	198,
	33,
	16,
	36,
	105,
	18,
	194,
	49,
	20,
	196,
	113,
	8,
	74,
	34,
	73,
	171,
	106,
	168,
	172,
	73,
	81,
	50,
	213,
	82,
	136,
	147,
	108,
	148,
	34,
	21,
	84,
	210,
	37,
	150,
	212,
	80,
	165,
	70,
	33,
	8,
	133,
	107,
	24,
	196,
	99,
	16,
	206,
	107,
	24,
	140,
	113,
	25,
	140,
	99,
	53,
	12,
	198,
	51,
	153,
	204,
	108,
	181,
	78,
	162,
	153,
	70,
	33,
	40,
	130,
	149,
	46,
	227,
	48,
	156,
	197,
	48,
	156,
	162,
	177,
	156,
	103,
	49,
	136,
	102,
	89,
	44,
	83,
	24,
	132,
	103,
	80,
	202,
	227,
	10,
	172,
	171,
	48,
	172,
	98,
	48,
	140,
	99,
	16,
	148,
	98,
	177,
	140,
	130,
	40,
	150,
	51,
	152,
	214,
	181,
	76,
	98,
	41,
	165,
	74,
	181,
	156,
	198,
	49,
	20,
	214,
	56,
	156,
	75,
	180,
	134,
	101,
	24,
	174,
	103,
	28,
	166,
	99,
	25,
	150,
	35,
	25,
	132,
	19,
	8,
	166,
	82,
	172,
	202,
	34,
	137,
	110,
	171,
	25,
	140,
	98,
	52,
	196,
	98,
	25,
	134,
	99,
	24,
	196,
	35,
	88,
	214,
	163,
	80,
	66,
	84,
	74,
	173,
	74,
	37,
	17,
	107,
	100,
	137,
	74,
	99,
	57,
	138,
	35,
	49,
	42,
	234,
	162,
	169,
	68,
	197,
	18,
	205,
	66,
	52,
	140,
	98,
	24,
	140,
	99,
	17,
	72,
	102,
	49,
	157,
	68,
	51,
	29,
	70,
	49,
	156,
	198,
	177,
	12,
	205,
	50,
	136,
	196,
	115,
	24,
	134,
	115,
	8,
	214,
	99,
	88,
	7,
	129,
	224,
	240,
	60,
	7,
	135,
	144,
	60,
	124,
	15,
	199,
	192,
	192,
	240,
	124,
	30,
	7,
	128,
	128,
	0,
	28,
	120,
	112,
	241,
	199,
	31,
	192,
	12,
	254,
	28,
	31,
	31,
	14,
	10,
	122,
	192,
	113,
	242,
	131,
	143,
	3,
	15,
	15,
	12,
	0,
	121,
	248,
	97,
	224,
	67,
	15,
	131,
	231,
	24,
	249,
	193,
	19,
	218,
	233,
	99,
	143,
	15,
	131,
	131,
	135,
	195,
	31,
	60,
	112,
	240,
	225,
	225,
	227,
	135,
	184,
	113,
	14,
	32,
	227,
	141,
	72,
	120,
	28,
	147,
	135,
	48,
	225,
	193,
	193,
	228,
	120,
	33,
	131,
	131,
	195,
	135,
	6,
	57,
	229,
	195,
	135,
	7,
	14,
	28,
	28,
	112,
	244,
	113,
	156,
	96,
	54,
	50,
	195,
	30,
	60,
	243,
	143,
	14,
	60,
	112,
	227,
	199,
	143,
	15,
	15,
	14,
	60,
	120,
	240,
	227,
	135,
	6,
	240,
	227,
	7,
	193,
	153,
	135,
	15,
	24,
	120,
	112,
	112,
	252,
	243,
	16,
	177,
	140,
	140,
	49,
	124,
	112,
	225,
	134,
	60,
	100,
	108,
	176,
	225,
	227,
	15,
	35,
	143,
	15,
	30,
	62,
	56,
	60,
	56,
	123,
	143,
	7,
	14,
	60,
	244,
	23,
	30,
	60,
	120,
	242,
	158,
	114,
	73,
	227,
	37,
	54,
	56,
	88,
	57,
	226,
	222,
	60,
	120,
	120,
	225,
	199,
	97,
	225,
	225,
	176,
	240,
	240,
	195,
	199,
	14,
	56,
	192,
	240,
	206,
	115,
	115,
	24,
	52,
	176,
	225,
	199,
	142,
	28,
	60,
	248,
	56,
	240,
	225,
	193,
	139,
	134,
	143,
	28,
	120,
	112,
	240,
	120,
	172,
	177,
	143,
	57,
	49,
	219,
	56,
	97,
	195,
	14,
	14,
	56,
	120,
	115,
	23,
	30,
	57,
	30,
	56,
	100,
	225,
	241,
	193,
	78,
	15,
	64,
	162,
	2,
	197,
	143,
	129,
	161,
	252,
	18,
	8,
	100,
	224,
	60,
	34,
	224,
	69,
	7,
	142,
	12,
	50,
	144,
	240,
	31,
	32,
	73,
	224,
	248,
	12,
	96,
	240,
	23,
	26,
	65,
	170,
	164,
	208,
	141,
	18,
	130,
	30,
	30,
	3,
	248,
	62,
	3,
	12,
	115,
	128,
	112,
	68,
	38,
	3,
	36,
	225,
	62,
	4,
	78,
	4,
	28,
	193,
	9,
	204,
	158,
	144,
	33,
	7,
	144,
	67,
	100,
	192,
	15,
	198,
	144,
	156,
	193,
	91,
	3,
	226,
	29,
	129,
	224,
	94,
	29,
	3,
	132,
	184,
	44,
	15,
	128,
	177,
	131,
	224,
	48,
	65,
	30,
	67,
	137,
	131,
	80,
	252,
	36,
	46,
	19,
	131,
	241,
	124,
	76,
	44,
	201,
	13,
	131,
	176,
	181,
	130,
	228,
	232,
	6,
	156,
	7,
	160,
	153,
	29,
	7,
	62,
	130,
	143,
	112,
	48,
	116,
	64,
	202,
	16,
	228,
	232,
	15,
	146,
	20,
	63,
	6,
	248,
	132,
	136,
	67,
	129,
	10,
	52,
	57,
	65,
	198,
	227,
	28,
	71,
	3,
	176,
	184,
	19,
	10,
	194,
	100,
	248,
	24,
	249,
	96,
	179,
	192,
	101,
	32,
	96,
	166,
	140,
	195,
	129,
	32,
	48,
	38,
	30,
	28,
	56,
	211,
	1,
	176,
	38,
	64,
	244,
	11,
	195,
	66,
	31,
	133,
	50,
	38,
	96,
	64,
	201,
	203,
	1,
	236,
	17,
	40,
	64,
	250,
	4,
	52,
	224,
	112,
	76,
	140,
	29,
	7,
	105,
	3,
	22,
	200,
	4,
	35,
	232,
	198,
	154,
	11,
	26,
	3,
	224,
	118,
	6,
	5,
	207,
	30,
	188,
	88,
	49,
	113,
	102,
	0,
	248,
	63,
	4,
	252,
	12,
	116,
	39,
	138,
	128,
	113,
	194,
	58,
	38,
	6,
	192,
	31,
	5,
	15,
	152,
	64,
	174,
	1,
	127,
	192,
	7,
	255,
	0,
	14,
	254,
	0,
	3,
	223,
	128,
	3,
	239,
	128,
	27,
	241,
	194,
	0,
	231,
	224,
	24,
	252,
	224,
	33,
	252,
	128,
	60,
	252,
	64,
	14,
	126,
	0,
	63,
	62,
	0,
	15,
	254,
	0,
	31,
	255,
	0,
	62,
	240,
	7,
	252,
	0,
	126,
	16,
	63,
	255,
	0,
	63,
	56,
	14,
	124,
	1,
	135,
	12,
	252,
	199,
	0,
	62,
	4,
	15,
	62,
	31,
	15,
	15,
	31,
	15,
	2,
	131,
	135,
	207,
	3,
	135,
	15,
	63,
	192,
	7,
	158,
	96,
	63,
	192,
	3,
	254,
	0,
	63,
	224,
	119,
	225,
	192,
	254,
	224,
	195,
	224,
	1,
	223,
	248,
	3,
	7,
	0,
	126,
	112,
	0,
	124,
	56,
	24,
	254,
	12,
	30,
	120,
	28,
	124,
	62,
	14,
	31,
	30,
	30,
	62,
	0,
	127,
	131,
	7,
	219,
	135,
	131,
	7,
	199,
	7,
	16,
	113,
	255,
	0,
	63,
	226,
	1,
	224,
	193,
	195,
	225,
	0,
	127,
	192,
	5,
	240,
	32,
	248,
	240,
	112,
	254,
	120,
	121,
	248,
	2,
	63,
	12,
	143,
	3,
	15,
	159,
	224,
	193,
	199,
	135,
	3,
	195,
	195,
	176,
	225,
	225,
	193,
	227,
	224,
	113,
	240,
	0,
	252,
	112,
	124,
	12,
	62,
	56,
	14,
	28,
	112,
	195,
	199,
	3,
	129,
	193,
	199,
	231,
	0,
	15,
	199,
	135,
	25,
	9,
	239,
	196,
	51,
	224,
	193,
	252,
	248,
	112,
	240,
	120,
	248,
	240,
	97,
	199,
	0,
	31,
	248,
	1,
	124,
	248,
	240,
	120,
	112,
	60,
	124,
	206,
	14,
	33,
	131,
	207,
	8,
	7,
	143,
	8,
	193,
	135,
	143,
	128,
	199,
	227,
	0,
	7,
	248,
	224,
	239,
	0,
	57,
	247,
	128,
	14,
	248,
	225,
	227,
	248,
	33,
	159,
	192,
	255,
	3,
	248,
	7,
	192,
	31,
	248,
	196,
	4,
	252,
	196,
	193,
	188,
	135,
	240,
	15,
	192,
	127,
	5,
	224,
	37,
	236,
	192,
	62,
	132,
	71,
	240,
	142,
	3,
	248,
	3,
	251,
	192,
	25,
	248,
	7,
	156,
	12,
	23,
	248,
	7,
	224,
	31,
	161,
	252,
	15,
	252,
	1,
	240,
	63,
	0,
	254,
	3,
	240,
	31,
	0,
	253,
	0,
	255,
	136,
	13,
	249,
	1,
	255,
	0,
	112,
	7,
	192,
	62,
	66,
	243,
	13,
	196,
	127,
	128,
	252,
	7,
	240,
	94,
	192,
	63,
	0,
	120,
	63,
	129,
	255,
	1,
	248,
	1,
	195,
	232,
	12,
	228,
	100,
	143,
	228,
	15,
	240,
	7,
	240,
	194,
	31,
	0,
	127,
	192,
	111,
	128,
	126,
	3,
	248,
	7,
	240,
	63,
	192,
	120,
	15,
	130,
	7,
	254,
	34,
	119,
	112,
	2,
	118,
	3,
	254,
	0,
	254,
	103,
	0,
	124,
	199,
	241,
	142,
	198,
	59,
	224,
	63,
	132,
	243,
	25,
	216,
	3,
	153,
	252,
	9,
	184,
	15,
	248,
	0,
	157,
	36,
	97,
	249,
	13,
	0,
	253,
	3,
	240,
	31,
	144,
	63,
	1,
	248,
	31,
	208,
	15,
	248,
	55,
	1,
	248,
	7,
	240,
	15,
	192,
	63,
	0,
	254,
	3,
	248,
	15,
	192,
	63,
	0,
	250,
	3,
	240,
	15,
	128,
	255,
	1,
	184,
	7,
	240,
	1,
	252,
	1,
	188,
	128,
	19,
	30,
	0,
	127,
	225,
	64,
	127,
	160,
	127,
	176,
	0,
	63,
	192,
	31,
	192,
	56,
	15,
	240,
	31,
	128,
	255,
	1,
	252,
	3,
	241,
	126,
	1,
	254,
	1,
	240,
	255,
	0,
	127,
	192,
	29,
	7,
	240,
	15,
	192,
	126,
	6,
	224,
	7,
	224,
	15,
	248,
	6,
	193,
	254,
	1,
	252,
	3,
	224,
	15,
	0,
	252
], gn = (e, t) => {
	let n = (e, t) => (e * t >> 8 & 255) << 1, r = [
		[],
		[],
		[]
	];
	pn.map((e, t) => {
		r[0][t] = 255 & e, r[1][t] = e >> 8 & 255, r[2][t] = e >> 16 & 255;
	});
	for (let i = 5; i < 30; i++) r[0][i] = n(e, r[0][i]), r[1][i] = n(t, r[1][i]);
	for (let i = 48; i < 54; i++) r[0][i] = n(e, r[0][i]), r[1][i] = n(t, r[1][i]);
	return r;
}, _n = (e, t, n, r) => {
	let i = [
		e,
		t[0],
		t[1],
		t[2],
		n[0],
		n[1],
		n[2]
	], a = (e, t) => i[e][t], o = (e, t, n, r) => {
		let o = r < 0, s = Math.abs(r) % e, c = r / e | 0, l = 0, u = e;
		for (; 0 < --u;) {
			let r = a(t, n) + c;
			(l += s) >= e && (l -= e, o ? r-- : r && r++), i[t][++n] = r, r += c;
		}
	}, s, c, l = 0;
	for (let t = 0; t < r.length - 1; t++) {
		var u = r[t][0], d = r[t + 1][0], f = ln[d], p = ln[u], m = (c = p === f ? (s = un[u], un[d]) : p < f ? (s = dn[d], un[d]) : (s = un[u], dn[u]), (l += r[t][1]) + c), h = l - s, g = s + c;
		if (!(g - 2 & 128)) {
			o((p = r[t][1] >> 1) + (f = r[t + 1][1] >> 1), 0, h, e[l + f] - e[l - p]);
			for (let e = 1; e < 7; e++) {
				var _ = a(e, m) - a(e, h);
				o(g, e, h, _);
			}
		}
	}
	return l + r[r.length - 1][1];
}, vn = 255, yn = 1, bn = (e, t, n) => {
	let r = (e, t, n) => {
		var r = t;
		t < 30 ? t = 0 : t -= 30;
		let i;
		for (; (i = n[t]) === 127;) ++t;
		for (; t !== r;) for (i += e, n[t] = 255 & i; ++t !== r && n[t] === 255;);
	}, i = [], a = [
		[],
		[],
		[]
	], o = [
		[],
		[],
		[]
	], s = [], c = 0;
	for (let d = 0; d < t.length; d++) {
		var l = t[d][0], u = (l === Vt ? r(yn, c, i) : l === Ht && r(vn, c, i), cn[t[d][2]]);
		for (let r = t[d][1]; 0 < r; r--) a[0][c] = n[0][l], a[1][c] = n[1][l], a[2][c] = n[2][l], o[0][c] = 255 & mn[l], o[1][c] = mn[l] >> 8 & 255, o[2][c] = mn[l] >> 16 & 255, s[c] = fn[l], i[c] = e + u & 255, c++;
	}
	return [
		i,
		a,
		o,
		s
	];
}, xn = (e, t, n, r, i) => {
	var n = gn(n, r), [a, o, s, r] = bn(t, e, n), t = _n(a, o, s, e);
	if (!i) for (let e = 0; e < a.length; e++) a[e] -= o[0][e] >> 1;
	var c = [
		0,
		1,
		2,
		2,
		2,
		3,
		3,
		4,
		4,
		5,
		6,
		8,
		9,
		11,
		13,
		15
	];
	for (let e = s[0].length - 1; 0 <= e; e--) s[0][e] = c[s[0][e]], s[1][e] = c[s[1][e]], s[2][e] = c[s[2][e]];
	return [
		t,
		o,
		a,
		s,
		r
	];
}, Sn = (e) => {
	let t = new Uint8Array(e), n = 0, r = 0, i = (e, t) => {
		t = 16 * (15 & t), i.ary(e, [
			t,
			t,
			t,
			t,
			t
		]);
	};
	return i.ary = (e, i) => {
		if (((n += [
			[
				162,
				167,
				167,
				127,
				128
			],
			[
				226,
				60,
				60,
				0,
				0
			],
			[
				225,
				60,
				59,
				0,
				0
			],
			[
				200,
				0,
				0,
				54,
				55
			],
			[
				199,
				0,
				0,
				54,
				54
			]
		][r][e]) / 50 | 0) > t.length) throw Error();
		r = e;
		for (let e = 0; e < 5; e++) t[(n / 50 | 0) + e] = i[e];
	}, i.get = () => t.slice(0, n / 50 | 0), i;
}, Cn = (e, t, n, r) => {
	let i = (7 & n) - 1, a = 256 * i & 65535, o = 248 & n, s = (t, n, r, i) => {
		let s = 8, c = hn[a + o];
		for (; 128 & c ? e(t, n) : e(r, i), c <<= 1, --s;);
	};
	if (o === 0) {
		let e = r >> 4 ^ 255;
		for (o = 255 & t; s(3, 26, 4, 6), o++, o &= 255, 255 & ++e;);
		return o;
	}
	o ^= 255;
	for (var c = 255 & sn[i]; s(2, 5, 1, c), 255 & ++o;);
	return t;
}, wn = (e) => 127 * Math.sin(2 * Math.PI * (e / 256)) | 0, Tn = (e, t, n, r, i, a, o) => {
	let s = n, c = 0, l = 0, u = 0, d = 0, f = 0, p = i[0], m = .75 * p | 0;
	for (; t;) {
		var h = o[f];
		if (248 & h) d = Cn(e, d, h, i[255 & f]), f += 2, t -= 2, s = n;
		else {
			{
				let t = [], n = 256 * c, i = 256 * l, o = 256 * u;
				for (let e = 0; e < 5; e++) {
					var g = wn(255 & n >> 8), _ = wn(255 & i >> 8), ee = (255 & o >> 8) < 129 ? -112 : 112, g = (g * (15 & a[0][f]) + _ * (15 & a[1][f]) + ee * (15 & a[2][f])) / 32 + 128;
					t[e] = 0 | g, n += 256 * r[0][f] / 4, i += 256 * r[1][f] / 4, o += 256 * r[2][f] / 4;
				}
				e.ary(0, t);
			}
			if (--s == 0) {
				if (f++, --t == 0) return;
				s = n;
			}
			if (--p != 0) {
				if (--m != 0 || h === 0) {
					c += r[0][f], l += r[1][f], u += r[2][f];
					continue;
				}
				d = Cn(e, d, h, i[255 & f]);
			}
		}
		p = i[f], m = .75 * p | 0, c = 0, l = 0, u = 0;
	}
};
function En(e) {
	var t, n, r, i, a, o = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : {}, e = ((e) => {
		if (!e) return !1;
		let t = (e) => e === c.length ? null : c[e], n = (e, t, n, a) => {
			for (let t = c.length - 1; t >= e; t--) c[t + 1] = c[t], s[t + 1] = i(t), o[t + 1] = r(t);
			c[e] = t, s[e] = 0 | a, o[e] = n;
		}, r = (e) => 0 | o[e], i = (e) => 0 | s[e], a = (e, t) => {
			s[e] = t;
		}, o = [], s = [], c = [], l = 0;
		return Lt(e, (e) => {
			o[l] = 0, s[l] = 0, c[l++] = e;
		}, (e) => {
			o[l - 1] = e;
		}), tn(n, (e, t) => {
			c[e] = t;
		}, t, r), rn(t, r, (e, t) => {
			o[e] = t;
		}), an(t, r, a), nn(t, a, i), on(t, n, r), c.map((e, t) => e ? [
			e,
			0 | s[t],
			0 | o[t]
		] : null).filter((e) => e);
	})(e);
	return !1 !== e && (i = (i = o.pitch) === void 0 ? 64 : 255 & i, n = (n = o.mouth) === void 0 ? 128 : 255 & n, r = (r = o.throat) === void 0 ? 128 : 255 & r, t = 255 & (o.speed || 72), o = o.singmode || !1, i = xn(e, i, n, r, o), n = Sn(176.4 * e.reduce((e, t) => e + t[1], 0) * t | 0), [r, o, e, i, a] = i, Tn(n, r, t, o, e, i, a), n.get());
}
var Dn = (e) => {
	let t = " " + e.toUpperCase(), n = 0, r = "", i = (e, t) => {
		n += t, r += e;
	}, a = 0;
	for (; n < t.length && a++ < 1e4;) {
		var o = t[n];
		if (o !== "." || j(t, n + 1, 1)) if (Dt(o, 2)) At.some((e) => e(t, n, i));
		else if (Et[o] !== 0) {
			if (!Dt(o, A)) return !1;
			kt[o].some((e) => e(t, n, i));
		} else r += " ", n++;
		else r += ".", n++;
	}
	return r;
}, On = En, kn = (e, t) => {
	if (!1 === (e = En(e, t))) return !1;
	var n = e, r = new Float32Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = (n[e] - 128) / 256;
	return r;
};
function An(e) {
	let t = e || {}, n = (e, n) => n || t.phonetic ? e.toUpperCase() : Dn(e);
	this.buf8 = (e, r) => On(n(e, r), t), this.buf32 = (e, r) => kn(n(e, r), t), this.speak = (e, t) => {
		if (e = this.buf32(e, t), wt = wt === null ? new AudioContext() : wt) {
			var n = wt, r = e;
			let t, i = new Promise((e, i) => {
				let a = n.createBufferSource(), o = n.createBuffer(1, r.length, 22050), s = o.getChannelData(0);
				for (let e = 0; e < r.length; e++) s[e] = r[e];
				a.buffer = o, a.connect(n.destination), a.onended = () => {
					e(!0);
				}, t = (e) => {
					a.disconnect(), i(e);
				}, a.start(0);
			});
			return i.abort = t, i;
		}
		throw Error();
	}, this.download = (e, t) => {
		var n, e = this.buf8(e, t), t = new Blob([Tt(e)], { type: "audio/vnd.wave" }), t = (e = window.URL || window.webkitURL).createObjectURL(t);
		(n = document.createElement("a")).href = t, n.target = "_blank", n.download = "sam.wav", document.body.appendChild(n), n.click(), document.body.removeChild(n), e.revokeObjectURL(t);
	}, this.wav = (e, t) => Tt(this.buf8(e, t));
}
An.buf8 = On, An.buf32 = kn, An.convert = Dn;
//#endregion
//#region scripts/engines/samPlaybackEngine.js
var jn = 15e3, F = null, Mn = !1, Nn = /* @__PURE__ */ new Map(), Pn = {
	id: "sam",
	async createAudioBuffer({ request: e, audioContext: t, isCancelled: n }) {
		let r = {
			pitch: e.pitch,
			speed: e.speed,
			mouth: e.mouth,
			throat: e.throat
		}, i = await Fn(e.text, r);
		if (n()) return null;
		let a = t.createBuffer(1, i.length, 22050);
		return a.copyToChannel(i, 0), a;
	}
};
async function Fn(e, t) {
	if (In()) try {
		return await Rn(e, t);
	} catch (e) {
		console.warn("SAM Voice: worker synthesis failed, using main-thread fallback", e), Vn();
	}
	return new An(t).buf32(e);
}
function In() {
	return !Mn && typeof globalThis.Worker == "function";
}
function Ln() {
	return F || (F = new Worker(new URL(
		/* @vite-ignore */
		"" + new URL("assets/samWorker-CX52Kgt8.js", import.meta.url).href,
		"" + import.meta.url
	), {
		type: "module",
		name: "sam-voice-synthesis"
	}), F.addEventListener("message", zn), F.addEventListener("error", Bn), F.addEventListener("messageerror", Bn), F);
}
function Rn(e, t) {
	let n = ct(), r = Ln();
	return new Promise((i, a) => {
		let o = globalThis.setTimeout(() => {
			Nn.delete(n), a(/* @__PURE__ */ Error("SAM synthesis worker timed out."));
		}, jn);
		Nn.set(n, {
			resolve: i,
			reject: a,
			timeoutId: o
		}), r.postMessage({
			id: n,
			text: e,
			settings: t
		});
	});
}
function zn(e) {
	let { id: t, ok: n, samples: r, error: i } = e.data || {}, a = Nn.get(t);
	if (a) {
		if (Nn.delete(t), globalThis.clearTimeout(a.timeoutId), !n || !(r instanceof Float32Array)) {
			a.reject(Error(i || "SAM synthesis worker returned invalid samples."));
			return;
		}
		a.resolve(r);
	}
}
function Bn(e) {
	let t = Error(e?.message || "SAM synthesis worker failed.");
	for (let e of Nn.values()) globalThis.clearTimeout(e.timeoutId), e.reject(t);
	Nn.clear(), Vn();
}
function Vn() {
	Mn = !0, F &&= (F.removeEventListener("message", zn), F.removeEventListener("error", Bn), F.removeEventListener("messageerror", Bn), F.terminate(), null);
}
//#endregion
//#region scripts/audio/effects.js
function Hn(e) {
	return u(e);
}
function Un(e) {
	let t = u(e), n = mr(t, "pitch", "semitones", 0), r = mr(t, "pace", "percent", 0), i = mr(t, "demon", "depth", 0) / 100, a = 2 ** (n / 12), o = 1 + r / 100, s = 1 - .08 * R(i, 0, 1.5);
	return R(a * o * s, .35, 2.25);
}
function Wn(e) {
	let t = u(e), n = 0;
	if (t.echo.enabled) {
		let e = I(t, "echo", "time") / 1e3, r = I(t, "echo", "feedback") / 100;
		n = Math.max(n, e * (2.5 + r * 10));
	}
	if (t.reverb.enabled) {
		let e = I(t, "reverb", "size"), r = I(t, "reverb", "decay");
		n = Math.max(n, Math.min(e + r * .65, 11));
	}
	if (t.specter.enabled) {
		let e = I(t, "specter", "delay") / 1e3, r = I(t, "specter", "drift") / 100;
		n = Math.max(n, 1.4 + e + r * 4.5);
	}
	return t.chorus.enabled && (n = Math.max(n, .35)), R(n, 0, 12);
}
function Gn({ audioContext: e, source: t, effects: n, noiseDuration: r = 0, trackNode: i, masterGain: a }) {
	let o = u(n);
	Kn(e, t, o, i);
	let s = t;
	o.formant.enabled && (s = qn(e, s, o.formant, i)), o.equalizer.enabled && (s = Jn(e, s, o.equalizer, i)), o.radio.enabled && (s = Yn(e, s, o.radio, i)), o.telephone.enabled && (s = Xn(e, s, o.telephone, i)), o.megaphone.enabled && (s = Zn(e, s, o.megaphone, i)), o.demon.enabled && (s = Qn(e, s, o.demon, i)), o.distortion.enabled && (s = $n(e, s, o.distortion, i)), o.crusher.enabled && (s = er(e, s, o.crusher, i)), o.robot.enabled && (s = tr(e, s, o.robot, i)), o.tremolo.enabled && (s = nr(e, s, o.tremolo, i)), s.connect(a), o.chorus.enabled && rr(e, s, o.chorus, i, a), o.echo.enabled && ir(e, s, o.echo, i, a), o.reverb.enabled && ar(e, s, o.reverb, i, a), o.specter.enabled && or(e, s, o.specter, i, a), sr(e, o, r, i, a);
}
function Kn(e, t, n, r) {
	if (!n.vibrato.enabled) return;
	let i = I(n, "vibrato", "depth"), a = I(n, "vibrato", "rate"), o = r(e.createOscillator()), s = r(e.createGain());
	o.type = "sine", o.frequency.value = R(a, .1, 20), s.gain.value = R(2 ** (i / 1200) - 1, 0, .08), o.connect(s).connect(t.playbackRate), o.start();
}
function qn(e, t, n, r) {
	let i = L(n, "shift") / 100, a = L(n, "nasal") / 100, o = r(e.createBiquadFilter());
	o.type = "lowshelf", o.frequency.value = 220, o.gain.value = R(-i * 7, -10, 10);
	let s = r(e.createBiquadFilter());
	s.type = "peaking", s.frequency.value = 850 + a * 850 + Math.max(0, i) * 450, s.Q.value = .7 + a * 2.4, s.gain.value = R(i * 5 + a * 7, -8, 11);
	let c = r(e.createBiquadFilter());
	return c.type = "highshelf", c.frequency.value = 3600, c.gain.value = R(i * 6 - Math.max(0, a - .35) * 5, -8, 9), t.connect(o).connect(s).connect(c), c;
}
function Jn(e, t, n, r) {
	let i = r(e.createBiquadFilter());
	i.type = "lowshelf", i.frequency.value = 180, i.gain.value = L(n, "bass");
	let a = r(e.createBiquadFilter());
	a.type = "peaking", a.frequency.value = 1050, a.Q.value = .9, a.gain.value = L(n, "mid");
	let o = r(e.createBiquadFilter());
	return o.type = "highshelf", o.frequency.value = 5200, o.gain.value = L(n, "air"), t.connect(i).connect(a).connect(o), o;
}
function Yn(e, t, n, r) {
	let i = L(n, "intensity") / 100, a = L(n, "bandwidth") / 100, o = r(e.createBiquadFilter());
	o.type = "highpass", o.frequency.value = 120 + 720 * a + 180 * i;
	let s = r(e.createBiquadFilter());
	s.type = "lowpass", s.frequency.value = 7200 - 4200 * a - 900 * Math.min(i, 1.5);
	let c = r(e.createBiquadFilter());
	c.type = "peaking", c.frequency.value = 1400, c.Q.value = 1.3 + a * 2.2, c.gain.value = 1 + i * 3.5;
	let l = r(e.createWaveShaper());
	l.curve = fr(6 + 46 * i), l.oversample = "2x";
	let u = r(e.createGain());
	return u.gain.value = R(.98 - .14 * Math.min(i, 1.5), .72, 1.02), t.connect(o).connect(s).connect(c).connect(l).connect(u), u;
}
function Xn(e, t, n, r) {
	let i = L(n, "intensity") / 100, a = L(n, "nasal") / 100, o = r(e.createBiquadFilter());
	o.type = "highpass", o.frequency.value = 280 + 250 * i;
	let s = r(e.createBiquadFilter());
	s.type = "lowpass", s.frequency.value = 3600 - 900 * Math.min(i, 1.5);
	let c = r(e.createBiquadFilter());
	c.type = "peaking", c.frequency.value = 1150 + a * 850, c.Q.value = 1.5 + a * 2.5, c.gain.value = 3 + a * 7;
	let l = r(e.createGain());
	return l.gain.value = .92, t.connect(o).connect(s).connect(c).connect(l), l;
}
function Zn(e, t, n, r) {
	let i = L(n, "drive") / 100, a = L(n, "bite") / 100, o = r(e.createBiquadFilter());
	o.type = "highpass", o.frequency.value = 180 + a * 360;
	let s = r(e.createBiquadFilter());
	s.type = "peaking", s.frequency.value = 1600 + a * 1300, s.Q.value = .8 + a * 2.4, s.gain.value = 4 + a * 8;
	let c = r(e.createWaveShaper());
	c.curve = fr(12 + i * 82), c.oversample = "2x";
	let l = r(e.createBiquadFilter());
	l.type = "lowpass", l.frequency.value = 5200 - a * 1700;
	let u = r(e.createGain());
	return u.gain.value = R(.86 - i * .08, .68, .95), t.connect(o).connect(s).connect(c).connect(l).connect(u), u;
}
function Qn(e, t, n, r) {
	let i = L(n, "growl") / 100, a = L(n, "drive") / 100, o = L(n, "depth") / 100, s = r(e.createBiquadFilter());
	s.type = "lowpass", s.frequency.value = R(3800 - 1900 * Math.min(o, 1.5), 900, 4200);
	let c = r(e.createBiquadFilter());
	c.type = "lowshelf", c.frequency.value = 260, c.gain.value = 3 + 7 * i;
	let l = r(e.createBiquadFilter());
	l.type = "peaking", l.frequency.value = 160 + 120 * (1 - Math.min(o, 1)), l.Q.value = .9, l.gain.value = 2 + 8 * o;
	let u = r(e.createWaveShaper());
	u.curve = fr(24 + a * 115), u.oversample = "4x";
	let d = r(e.createGain());
	return d.gain.value = R(.94 - .2 * Math.min(a, 1.5), .62, .95), t.connect(s).connect(c).connect(l).connect(u).connect(d), d;
}
function $n(e, t, n, r) {
	let i = L(n, "drive") / 100, a = L(n, "tone") / 100;
	return lr(e, t, r, L(n, "mix") / 100, (t) => {
		let n = r(e.createWaveShaper());
		n.curve = fr(10 + i * 140), n.oversample = "4x";
		let o = r(e.createBiquadFilter());
		return o.type = "lowpass", o.frequency.value = 1800 + a * 6200, t.connect(n).connect(o), o;
	}, .92);
}
function er(e, t, n, r) {
	let i = L(n, "bits"), a = L(n, "fold") / 100;
	return lr(e, t, r, L(n, "mix") / 100, (t) => {
		let n = r(e.createWaveShaper());
		n.curve = pr(i, a), n.oversample = "none";
		let o = r(e.createBiquadFilter());
		return o.type = "lowpass", o.frequency.value = 7600 - a * 3900, t.connect(n).connect(o), o;
	}, .96);
}
function tr(e, t, n, r) {
	let i = L(n, "mix") / 100, a = L(n, "frequency"), o = L(n, "metal") / 100;
	return lr(e, t, r, i, (t) => {
		let n = r(e.createOscillator()), i = r(e.createGain()), s = r(e.createGain());
		n.type = o > .55 ? "square" : "sine", n.frequency.value = a, i.gain.value = .28 + o * .55, s.gain.value = .45, n.connect(i).connect(s.gain), t.connect(s), n.start();
		let c = r(e.createBiquadFilter());
		return c.type = "bandpass", c.frequency.value = 900 + o * 1200, c.Q.value = .6 + o * 1.7, s.connect(c), c;
	}, .96);
}
function nr(e, t, n, r) {
	let i = R(L(n, "depth") / 100, 0, .96), a = R(L(n, "rate"), .1, 30), o = r(e.createGain()), s = r(e.createOscillator()), c = r(e.createGain());
	return o.gain.value = 1 - i / 2, s.frequency.value = a, s.type = "sine", c.gain.value = i / 2, s.connect(c).connect(o.gain), t.connect(o), s.start(), o;
}
function rr(e, t, n, r, i) {
	let a = L(n, "mix") / 100, o = L(n, "depth") / 100, s = L(n, "rate"), c = L(n, "delay"), l = r(e.createGain());
	l.gain.value = R(a * .42, 0, .55);
	let u = ur(e, r, c / 1e3, o * .006, s), d = ur(e, r, (c + 11) / 1e3, o * .008, s * .71);
	t.connect(u.input), t.connect(d.input), u.output.connect(l), d.output.connect(l), l.connect(i);
}
function ir(e, t, n, r, i) {
	let a = r(e.createDelay(1.25));
	a.delayTime.value = L(n, "time") / 1e3;
	let o = r(e.createGain());
	o.gain.value = R(L(n, "feedback") / 100, 0, .86);
	let s = r(e.createBiquadFilter());
	s.type = "lowpass", s.frequency.value = 900 + L(n, "tone") / 100 * 6900;
	let c = r(e.createGain());
	c.gain.value = R(L(n, "mix") / 100 * .72, 0, .82), t.connect(a), a.connect(s).connect(c).connect(i), a.connect(o).connect(a);
}
function ar(e, t, n, r, i) {
	let a = r(e.createConvolver());
	a.buffer = dr(e, L(n, "size"), L(n, "decay"));
	let o = r(e.createBiquadFilter());
	o.type = "lowpass", o.frequency.value = 1200 + (1 - L(n, "damping") / 100) * 7600;
	let s = r(e.createGain());
	s.gain.value = R(L(n, "mix") / 100 * .72, 0, .86), t.connect(a).connect(o).connect(s).connect(i);
}
function or(e, t, n, r, i) {
	let a = L(n, "mix") / 100, o = L(n, "delay"), s = L(n, "drift") / 100, c = L(n, "shimmer") / 100, l = ur(e, r, o / 1e3, .004 + s * .018, .12 + s * 1.4), u = r(e.createBiquadFilter());
	u.type = "highpass", u.frequency.value = 520 + c * 1400;
	let d = r(e.createBiquadFilter());
	d.type = "peaking", d.frequency.value = 2200 + c * 2200, d.Q.value = 1.4 + c * 2.2, d.gain.value = 2 + c * 8;
	let f = r(e.createConvolver());
	f.buffer = dr(e, 1.2 + c * 3.2, 1.8 + s * 3.2);
	let p = r(e.createGain());
	p.gain.value = R(a * .58, 0, .7), t.connect(l.input), l.output.connect(u).connect(d).connect(f).connect(p).connect(i);
}
function sr(e, t, n, r, i) {
	let a = R(n || .25, .15, 18);
	if (t.radio.enabled) {
		let n = I(t, "radio", "static") / 100;
		n > 0 && cr(e, {
			amount: n * .09,
			tone: .62,
			crackle: .35,
			duration: a
		}, r, i);
	}
	t.noise.enabled && cr(e, {
		amount: I(t, "noise", "amount") / 100 * .18,
		tone: I(t, "noise", "tone") / 100,
		crackle: I(t, "noise", "crackle") / 100,
		duration: a
	}, r, i);
}
function cr(e, t, n, r) {
	let i = R(t.duration, .1, 20), a = e.sampleRate, o = Math.max(1, Math.floor(a * i)), s = e.createBuffer(1, o, a), c = s.getChannelData(0), l = 0;
	for (let e = 0; e < o; e++) {
		let n = Math.random() * 2 - 1, r = Math.random() < t.crackle * .018 ? (Math.random() * 2 - 1) * (.7 + t.crackle * 1.7) : 0;
		l = l * (.92 - t.tone * .42) + n * (.08 + t.tone * .42), c[e] = R(l + r, -1, 1);
	}
	let u = n(e.createBufferSource());
	u.buffer = s;
	let d = n(e.createBiquadFilter());
	d.type = "highpass", d.frequency.value = 120 + t.tone * 900;
	let f = n(e.createBiquadFilter());
	f.type = "lowpass", f.frequency.value = 1800 + t.tone * 8200;
	let p = n(e.createGain()), m = R(t.amount, 0, .24), h = e.currentTime, g = h + i, _ = Math.min(.08, i / 4);
	p.gain.value = m, p.gain.setValueAtTime(m, h), p.gain.setValueAtTime(m, Math.max(h, g - _)), p.gain.linearRampToValueAtTime(0, g), u.connect(d).connect(f).connect(p).connect(r), u.start(), u.stop(e.currentTime + i);
}
function lr(e, t, n, r, i, a = 1) {
	let o = n(e.createGain()), s = n(e.createGain()), c = n(e.createGain());
	s.gain.value = R(1 - r * .72, .18, 1), c.gain.value = R(r * a, 0, 1);
	let l = i(t);
	return t.connect(s).connect(o), l.connect(c).connect(o), o;
}
function ur(e, t, n, r, i) {
	let a = t(e.createGain()), o = t(e.createDelay(1)), s = t(e.createOscillator()), c = t(e.createGain());
	return o.delayTime.value = R(n, .001, .95), s.type = "sine", s.frequency.value = R(i, .01, 20), c.gain.value = R(r, 0, .08), s.connect(c).connect(o.delayTime), a.connect(o), s.start(), {
		input: a,
		output: o
	};
}
function dr(e, t, n) {
	let r = e.sampleRate, i = R(t, .08, 8), a = R(n, .4, 10), o = Math.max(1, Math.floor(r * i)), s = e.createBuffer(2, o, r);
	for (let e = 0; e < 2; e++) {
		let t = s.getChannelData(e), n = 0;
		for (let e = 0; e < o; e++) {
			let r = e / o, i = Math.random() * 2 - 1;
			n = n * .35 + i * .65, t[e] = n * (1 - r) ** a;
		}
	}
	return s;
}
function fr(e) {
	let t = 44100, n = new Float32Array(t), r = Math.PI / 180;
	for (let i = 0; i < t; i++) {
		let a = i * 2 / t - 1;
		n[i] = (3 + e) * a * 20 * r / (Math.PI + e * Math.abs(a));
	}
	return n;
}
function pr(e, t) {
	let n = 4096, r = new Float32Array(n), i = Math.max(2, 2 ** Math.round(e) / 2);
	for (let e = 0; e < n; e++) {
		let a = e * 2 / (n - 1) - 1, o = Math.sin(a * (1 + t * 5) * Math.PI / 2), s = a * (1 - t) + o * t;
		r[e] = Math.round(s * i) / i;
	}
	return r;
}
function mr(e, t, n, r = 0) {
	let i = e?.[t];
	return i?.enabled ? L(i, n, r) : r;
}
function I(e, t, n, r = 0) {
	return L(e?.[t], n, r);
}
function L(e, t, n = 0) {
	let r = Number(e?.params?.[t]);
	return Number.isFinite(r) ? r : n;
}
function R(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region scripts/audio/audio.js
var z = globalThis.AudioContext || globalThis.webkitAudioContext;
nt("sam", Pn), nt("piper", yt), nt("silero", yt), nt("qwen", yt);
var B, hr, V, gr = null, _r = !1, vr = !1, yr = null, br = null, xr = null, H = /* @__PURE__ */ new Set(), U = [], Sr = !1, W = 0;
function Cr() {
	if (wr(), B && B.state !== "closed") return B;
	if (!z) throw new S(x.AUDIO_UNSUPPORTED, "WebAudio AudioContext is not supported in this browser.");
	return B = new z(), hr = B.createGain(), hr.gain.value = 1, V = B.createDynamicsCompressor(), V.threshold.value = -14, V.knee.value = 18, V.ratio.value = 10, V.attack.value = .003, V.release.value = .18, hr.connect(V).connect(B.destination), B;
}
function wr() {
	if (_r || !globalThis.document) return;
	_r = !0;
	let e = () => {
		Tr();
	};
	document.addEventListener("pointerdown", e, { passive: !0 }), document.addEventListener("keydown", e, { passive: !0 });
}
async function Tr() {
	if (!(vr || !z || B?.state === "running")) {
		vr = !0;
		try {
			await Lr(), gr = Date.now();
		} catch (e) {
			console.debug("SAM Voice: audio unlock gesture did not start WebAudio yet", e);
		} finally {
			vr = !1;
		}
	}
}
async function Er() {
	return await Lr(), gr = Date.now(), Or();
}
async function Dr(e) {
	let t;
	try {
		t = at(e);
	} catch (t) {
		return Hr(e, t, "rejected");
	}
	globalThis.Hooks?.callAll?.("samVoice.speechStarted", t), globalThis.Hooks?.callAll?.("samVoice.speechReceived", {
		requestId: t.requestId,
		engine: t.engine,
		scope: t.scope
	});
	let n = Wr(t.playbackMode);
	try {
		if (n === "interrupt") return kr(), (await Pr(t)).result;
		if (n === "queue") {
			if (U.length >= 20) throw new S(x.QUEUE_FULL, "Playback queue is full (20 entries).");
			return U.push(t), Nr(), Vr(t, "queued", { queuedCount: U.length });
		}
		return (await Pr(t)).result;
	} catch (e) {
		return Ir(e, t), console.error("SAM Voice: playback failed", e), Hr(t, e, "failed");
	}
}
function Or() {
	let e = B?.state || "not-created";
	return {
		ready: !!(z && B?.state === "running"),
		supported: !!z,
		state: z ? e : "unsupported",
		activeCount: H.size,
		queuedCount: U.length,
		queueLimit: 20,
		queueRunning: Sr,
		lastUnlockGestureAt: gr,
		lastPlaybackAt: yr,
		lastRequestId: xr,
		lastError: br
	};
}
function kr() {
	W += 1, U.length = 0, Ar();
}
function Ar() {
	for (let e of Array.from(H)) Br(e);
	H.clear();
}
async function jr(e = {}) {
	let t = !!e?.hard;
	if (W += 1, U.length = 0, Ar(), globalThis.Hooks?.callAll?.("samVoice.speechStopped", { hard: t }), !t) return Ur(!1);
	let n = B;
	if (B = null, hr = null, V = null, n && n.state !== "closed") try {
		await n.close();
	} catch (e) {
		console.warn("SAM Voice: failed to close AudioContext", e);
	}
	return Ur(!0);
}
async function Mr() {
	return await jr({ hard: !0 });
}
async function Nr() {
	if (!Sr) {
		Sr = !0;
		try {
			for (; U.length > 0;) {
				let e = U.shift(), t = W;
				try {
					await (await Pr(e)).completion;
				} catch (t) {
					Ir(t, e), globalThis.Hooks?.callAll?.("samVoice.playbackFailed", {
						requestId: e.requestId,
						engine: e.engine,
						error: C(t)
					});
				}
				if (t !== W) {
					U.length = 0;
					break;
				}
			}
		} finally {
			Sr = !1;
		}
	}
}
async function Pr(e) {
	let t = W;
	if (await Lr(), t !== W) throw new S(x.PLAYBACK_CANCELLED, "Playback was cancelled before synthesis.");
	let n = await rt(e.engine).createAudioBuffer({
		request: e,
		audioContext: B,
		isCancelled: () => t !== W
	});
	if (!n || t !== W) throw new S(x.PLAYBACK_CANCELLED, "Playback was cancelled before start.");
	return Rr(n, e, t);
}
function Fr(e) {
	yr = Date.now(), br = null, xr = e.requestId;
}
function Ir(e, t = {}) {
	xr = t?.requestId || xr, br = {
		at: Date.now(),
		...C(e),
		engine: String(t?.engine || "unknown"),
		requestId: String(t?.requestId || ""),
		mimeType: String(t?.mimeType || ""),
		sizeBytes: Number(t?.sizeBytes || 0)
	};
}
async function Lr() {
	if ((!B || B.state === "closed") && Cr(), B.state === "suspended") try {
		await B.resume();
	} catch (e) {
		throw new S(x.AUDIO_LOCKED, "Browser audio is locked. Click Unlock on this client before shared playback.", { cause: e?.message || String(e) });
	}
	if (B.state !== "running") throw new S(x.AUDIO_LOCKED, `Browser audio is not running (${B.state}). Click Unlock on this client.`, { state: B.state });
	return B;
}
function Rr(e, t, n) {
	if (n !== W) throw new S(x.PLAYBACK_CANCELLED, "Playback was cancelled before start.");
	let r = B.createBufferSource(), i = Hn(t.effects), a, o = new Promise((e) => {
		a = e;
	}), s = {
		source: r,
		nodes: [],
		cleanupTimer: null,
		resolved: !1,
		resolve: a,
		requestId: t.requestId
	};
	H.add(s), r.buffer = e;
	let c = Un(i);
	r.playbackRate.value = c;
	let l = Wn(i), u = e.duration / c, d = u + l, f = (e) => (s.nodes.push(e), e);
	try {
		Gn({
			audioContext: B,
			source: r,
			effects: i,
			noiseDuration: d,
			trackNode: f,
			masterGain: hr
		}), r.onended = () => {
			if (l > 0) {
				s.cleanupTimer = globalThis.setTimeout(() => {
					Br(s), H.delete(s), zr(t);
				}, l * 1e3);
				return;
			}
			Br(s), H.delete(s), zr(t);
		}, r.start(), Fr(t), globalThis.Hooks?.callAll?.("samVoice.playbackStarted", {
			requestId: t.requestId,
			engine: t.engine,
			duration: u,
			scope: t.scope,
			profileId: t.profileId,
			profileName: t.profileName,
			speakerPortraitEnabled: t.speakerPortraitEnabled,
			speakerPortraitProfileId: t.speakerPortraitProfileId,
			speakerPortraitImageId: t.speakerPortraitImageId
		});
	} catch (e) {
		throw Br(s), H.delete(s), e;
	}
	return {
		result: Vr(t, "started", {
			duration: u,
			tailSeconds: l
		}),
		completion: o
	};
}
function zr(e) {
	globalThis.Hooks?.callAll?.("samVoice.playbackEnded", {
		requestId: e.requestId,
		engine: e.engine,
		scope: e.scope
	});
}
function Br(e) {
	e.cleanupTimer &&= (globalThis.clearTimeout(e.cleanupTimer), null);
	try {
		e.source.onended = null, e.source.stop();
	} catch {}
	try {
		e.source.disconnect();
	} catch {}
	for (let t of e.nodes) {
		try {
			typeof t.stop == "function" && t.stop();
		} catch {}
		try {
			t.gain && (t.gain.value = 0), t.disconnect();
		} catch {}
	}
	e.resolved || (e.resolved = !0, e.resolve?.());
}
function Vr(e, t, n = {}) {
	return {
		ok: !0,
		stage: t,
		requestId: e.requestId,
		engine: e.engine,
		userId: globalThis.game?.user?.id || "",
		at: Date.now(),
		...n
	};
}
function Hr(e, t, n) {
	return {
		ok: !1,
		stage: n,
		requestId: String(e?.requestId || ""),
		engine: String(e?.engine || "unknown"),
		userId: globalThis.game?.user?.id || "",
		at: Date.now(),
		error: C(t)
	};
}
function Ur(e) {
	return {
		ok: !0,
		stage: e ? "reset" : "stopped",
		userId: globalThis.game?.user?.id || "",
		at: Date.now()
	};
}
function Wr(e) {
	return n.includes(e) ? e : "interrupt";
}
//#endregion
//#region scripts/core/SpeechOrchestrator.js
var Gr = class {
	constructor({ getSocket: e, isSocketReady: t, playLocal: n = Dr, stopLocal: r = jr, getLocalStatus: i = Or }) {
		this.getSocket = e, this.isSocketReady = t, this.playLocal = n, this.stopLocal = r, this.getLocalStatus = i;
	}
	async preview(e) {
		let t = at(e, { scope: "local" });
		globalThis.Hooks?.callAll?.("samVoice.requestCreated", {
			...t,
			scope: "local"
		});
		let n = await this.playLocal(t);
		return this.#i(t, {
			local: n,
			remote: []
		}, "local"), {
			ok: !!n?.ok,
			requestId: t.requestId,
			scope: "local",
			local: n,
			remote: [],
			failures: n?.ok ? [] : [n]
		};
	}
	async speak(e) {
		this.#r(), this.#n();
		let t = at(e, { scope: "everyone" }), n = this.getSocket();
		globalThis.Hooks?.callAll?.("samVoice.requestCreated", {
			...t,
			scope: "everyone"
		}), globalThis.Hooks?.callAll?.("samVoice.dispatchStarted", {
			requestId: t.requestId,
			engine: t.engine,
			scope: "everyone"
		});
		let r = this.playLocal(t), i = this.#t(n, "playVoice", t), [a, o] = await Promise.allSettled([r, i]), s = a.status === "fulfilled" ? a.value : qr(t, a.reason, "local"), c = o.status === "fulfilled" ? Kr(o.value) : [qr(t, o.reason, "remote")], l = [s, ...c].filter((e) => e && e.ok === !1), u = {
			ok: !!s?.ok && l.length === 0,
			requestId: t.requestId,
			scope: "everyone",
			local: s,
			remote: c,
			failures: l
		};
		return this.#i(t, u, "everyone"), u;
	}
	async stop({ hard: e = !1 } = {}) {
		let t = this.stopLocal({ hard: e }), n = this.getSocket(), r = this.isSocketReady() && n ? this.#t(n, "stopAllAudio", { hard: e }) : Promise.resolve([]), [i, a] = await Promise.allSettled([t, r]);
		return {
			ok: i.status === "fulfilled" && a.status === "fulfilled",
			local: i.status === "fulfilled" ? i.value : C(i.reason),
			remote: a.status === "fulfilled" ? a.value : C(a.reason)
		};
	}
	async collectClientAudioStatuses() {
		let e = Array.from(game.users || []).filter((e) => e.active);
		return (await Promise.allSettled(e.map((e) => this.#e(e)))).map((t, n) => {
			if (t.status === "fulfilled") return t.value;
			let r = e[n];
			return Jr(r, !1, {
				ready: !1,
				state: t.reason?.code === x.SOCKET_TIMEOUT ? "timeout" : "no-response",
				supported: !1,
				error: t.reason?.message || String(t.reason)
			});
		});
	}
	getStatus() {
		return {
			socketReady: !!this.isSocketReady(),
			audio: this.getLocalStatus()
		};
	}
	async #e(e) {
		return e.id === game.user.id ? Jr(e, !0, this.getLocalStatus()) : (this.#n(), Jr(e, !1, await Yr(this.getSocket().executeAsUser("getClientAudioStatus", e.id), o, `Audio status timed out for ${e.name}.`)));
	}
	async #t(e, t, n) {
		return typeof e.executeForOthers == "function" ? await e.executeForOthers(t, n) : await e.executeForEveryone(t, n);
	}
	#n() {
		if (!this.isSocketReady() || !this.getSocket()) throw new S(x.SOCKET_OFFLINE, "SAM Voice socket is not ready yet.");
	}
	#r() {
		if (!game.user?.isGM) throw new S(x.PERMISSION_DENIED, "SAM Voice shared playback is GM-only.");
	}
	#i(e, t, n) {
		globalThis.Hooks?.callAll?.("samVoice.dispatchFinished", {
			requestId: e.requestId,
			engine: e.engine,
			scope: n,
			ok: t.ok,
			failures: t.failures || []
		});
	}
};
function Kr(e) {
	return Array.isArray(e) ? e.flatMap((e) => Kr(e)) : e && typeof e == "object" ? Object.prototype.hasOwnProperty.call(e, "ok") ? [e] : Object.values(e).flatMap((e) => Kr(e)) : [];
}
function qr(e, t, n) {
	return {
		ok: !1,
		stage: "transport-failed",
		requestId: e.requestId,
		engine: e.engine,
		target: n,
		error: C(t, x.SOCKET_OFFLINE)
	};
}
function Jr(e, t, n) {
	return {
		userId: e.id,
		name: e.name,
		isGM: e.isGM,
		self: t,
		status: n
	};
}
function Yr(e, t, n) {
	let r, i = new Promise((e, i) => {
		r = globalThis.setTimeout(() => {
			i(new S(x.SOCKET_TIMEOUT, n));
		}, t);
	});
	return Promise.race([Promise.resolve(e), i]).finally(() => globalThis.clearTimeout(r));
}
//#endregion
//#region scripts/ui/dom.js
var Xr = /* @__PURE__ */ new WeakMap();
function Zr(e) {
	return e instanceof Qr ? e : e instanceof Element || e === document || e === window ? new Qr([e]) : Array.isArray(e) || e instanceof NodeList ? new Qr(Array.from(e).filter(Boolean)) : new Qr([]);
}
var Qr = class e {
	constructor(e) {
		this.elements = Array.from(e || []).filter(Boolean);
	}
	get length() {
		return this.elements.length;
	}
	get first() {
		return this.elements[0] || null;
	}
	[Symbol.iterator]() {
		return this.elements[Symbol.iterator]();
	}
	find(t) {
		let n = [];
		for (let e of this.elements) e?.querySelectorAll && n.push(...e.querySelectorAll(t));
		return new e(n);
	}
	closest(t) {
		let n = [];
		for (let e of this.elements) {
			let r = e?.closest?.(t);
			r && !n.includes(r) && n.push(r);
		}
		return new e(n);
	}
	on(e, t) {
		for (let n of ti(e)) for (let e of this.elements) {
			let r = (n) => t.call(e, n);
			e.addEventListener(n.type, r), ei(e, n, r);
		}
		return this;
	}
	off(e = "") {
		let t = ti(e);
		for (let e of this.elements) {
			let n = Xr.get(e);
			if (n) for (let r of t.length ? t : [{
				type: "",
				namespace: ""
			}]) for (let [t, i] of Array.from(n.entries())) {
				let [a, o] = t.split("|"), s = !r.type || r.type === a, c = !r.namespace || r.namespace === o;
				if (!(!s || !c)) {
					for (let t of i) e.removeEventListener(a, t);
					n.delete(t);
				}
			}
		}
		return this;
	}
	click(e) {
		return this.off("click").on("click", e);
	}
	attr(e, t) {
		if (arguments.length === 1) return this.first?.getAttribute?.(e);
		for (let n of this.elements) n?.setAttribute && (t == null ? n.removeAttribute(e) : n.setAttribute(e, String(t)));
		return this;
	}
	toArray() {
		return Array.from(this.elements);
	}
	each(e) {
		return typeof e == "function" && this.elements.forEach((t, n) => {
			e.call(t, n, t);
		}), this;
	}
	val(e) {
		if (arguments.length === 0) return this.first?.value;
		for (let t of this.elements) "value" in t && (t.value = e);
		return this;
	}
	text(e) {
		if (arguments.length === 0) return this.first?.textContent || "";
		for (let t of this.elements) t.textContent = e;
		return this;
	}
	html(e) {
		if (arguments.length === 0) return this.first?.innerHTML || "";
		for (let t of this.elements) t.innerHTML = e;
		return this;
	}
	append(e) {
		let t = $r(e);
		for (let n of this.elements) {
			if (typeof e == "string") {
				n.insertAdjacentHTML("beforeend", e);
				continue;
			}
			for (let e of t) n.append(e);
		}
		return this;
	}
	before(e) {
		let t = $r(e);
		for (let n of this.elements) {
			if (typeof e == "string") {
				n.insertAdjacentHTML("beforebegin", e);
				continue;
			}
			for (let e of t) n.before(e);
		}
		return this;
	}
	after(e) {
		let t = $r(e);
		for (let n of this.elements) {
			if (typeof e == "string") {
				n.insertAdjacentHTML("afterend", e);
				continue;
			}
			for (let e of t) n.after(e);
		}
		return this;
	}
	prop(e, t) {
		if (arguments.length === 1) return this.first?.[e];
		for (let n of this.elements) n[e] = t;
		return this;
	}
	toggle(e) {
		let t = arguments.length === 0 ? null : !!e;
		for (let e of this.elements) {
			let n = t ?? e.style.display === "none";
			e.style.display = n ? "" : "none";
		}
		return this;
	}
	addClass(e) {
		let t = ni(e);
		for (let e of this.elements) e.classList.add(...t);
		return this;
	}
	removeClass(e) {
		let t = ni(e);
		for (let e of this.elements) e.classList.remove(...t);
		return this;
	}
	toggleClass(e, t) {
		for (let n of this.elements) arguments.length >= 2 ? n.classList.toggle(e, !!t) : n.classList.toggle(e);
		return this;
	}
	hasClass(e) {
		return !!this.first?.classList?.contains(e);
	}
	css(e = {}) {
		for (let t of this.elements) Object.assign(t.style, e);
		return this;
	}
	data(e) {
		return this.first?.dataset?.[e];
	}
};
function $r(e) {
	return e instanceof Qr ? e.toArray() : e instanceof Node ? [e] : Array.isArray(e) || e instanceof NodeList ? Array.from(e).filter((e) => e instanceof Node) : [];
}
function ei(e, t, n) {
	let r = Xr.get(e);
	r || (r = /* @__PURE__ */ new Map(), Xr.set(e, r));
	let i = `${t.type}|${t.namespace}`, a = r.get(i) || /* @__PURE__ */ new Set();
	a.add(n), r.set(i, a);
}
function ti(e) {
	return String(e || "").split(/\s+/).map((e) => e.trim()).filter(Boolean).map((e) => {
		let [t, n = ""] = e.split(".");
		return {
			type: t,
			namespace: n
		};
	});
}
function ni(e) {
	return String(e || "").split(/\s+/).map((e) => e.trim()).filter(Boolean);
}
//#endregion
//#region scripts/ttsGeneration.js
var ri = 0, ii = null, ai = !1;
function oi() {
	return si(), ri += 1, ii = new AbortController(), ai = !0, {
		token: ri,
		signal: ii.signal
	};
}
function si() {
	ri += 1, ii &&= (ii.abort(new DOMException("Speech generation was cancelled.", "AbortError")), null), ai = !1;
}
function ci(e) {
	return e === ri;
}
function li(e) {
	e === ri && (ii = null, ai = !1);
}
function di() {
	return ai;
}
function fi(e) {
	return e?.name === "AbortError" || e?.name === "TimeoutError";
}
//#endregion
//#region scripts/ui/html.js
function G(e) {
	return String(e).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
function K(e) {
	return window.CSS?.escape ? window.CSS.escape(e) : String(e).replaceAll("\"", "\\\"");
}
function pi(e, t) {
	let n = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = e, i.click(), URL.revokeObjectURL(r);
}
//#endregion
//#region scripts/ui/profiles.js
function mi() {
	return `
        <section class="samvoice-profile-panel" aria-label="Voice Profile">
            <label class="samvoice-profile-select-wrap" for="sam-voice-profile-select">
                <span>Профиль</span>
                <select id="sam-voice-profile-select" class="samvoice-profile-select">
                    ${gi()}
                </select>
            </label>

            <div class="samvoice-profile-buttons" aria-label="Profile quick actions">
                <button type="button" id="sam-voice-profile-apply" class="samvoice-mini-button samvoice-button-ghost" title="Apply selected profile">
                    <i class="fas fa-check"></i>
                    <span>Apply</span>
                </button>

                <button type="button" id="sam-voice-profile-save" class="samvoice-mini-button samvoice-button-ghost" title="Save current setup as profile">
                    <i class="fas fa-save"></i>
                    <span>Save</span>
                </button>

                <button type="button" id="sam-voice-profile-delete" class="samvoice-mini-button samvoice-button-ghost samvoice-button-danger-soft" title="Delete selected profile">
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </button>
            </div>

            <div class="samvoice-profile-manage-row">
                <input
                    type="text"
                    id="sam-voice-profile-name"
                    placeholder="Имя нового профиля"
                >

                <button type="button" id="sam-voice-profile-export" class="samvoice-mini-button">
                    Export
                </button>

                <button type="button" id="sam-voice-profile-import" class="samvoice-mini-button">
                    Import
                </button>
            </div>
        </section>
    `;
}
function hi(e, t) {
	e.find("#sam-voice-profile-apply").click(() => {
		vi(e, t);
	}), e.find("#sam-voice-profile-save").click(async () => {
		await _i(e, t);
	}), e.find("#sam-voice-profile-delete").click(async () => {
		await yi(e);
	}), e.find("#sam-voice-profile-export").click(() => {
		xi();
	}), e.find("#sam-voice-profile-import").click(async () => {
		await Si(e);
	});
}
function gi(e = "") {
	let t = E();
	return `
        <option value="">Select profile...</option>
        ${Object.entries(t).sort((e, t) => String(e[1].name).localeCompare(String(t[1].name))).map(([t, n]) => `
            <option value="${G(t)}" ${e === t ? "selected" : ""}>
                ${G(n.name)}
            </option>
        `).join("")}
    `;
}
async function _i(e, t) {
	let n = e.find("#sam-voice-profile-name").val().trim();
	if (!n.length) {
		ui.notifications.warn("Enter profile name first.");
		return;
	}
	try {
		bi(e, await he(n, t.getProfileData())), e.find("#sam-voice-profile-name").val(""), ui.notifications.info(`Saved voice profile: ${n}`);
	} catch (e) {
		console.error(e), ui.notifications.error("Failed to save voice profile.");
	}
}
function vi(e, t) {
	let n = String(e.find("#sam-voice-profile-select").val() || "");
	if (!n.length) {
		ui.notifications.warn("Select a voice profile first.");
		return;
	}
	let r = E()[n];
	if (!r) {
		ui.notifications.warn("Selected profile was not found.");
		return;
	}
	t.applyProfile(r);
}
async function yi(e) {
	let t = String(e.find("#sam-voice-profile-select").val() || "");
	if (!t.length) {
		ui.notifications.warn("Select a voice profile first.");
		return;
	}
	let n = E()[t];
	(globalThis.confirm?.(`Удалить профиль «${n?.name || "Без имени"}»?`) ?? !1) && (await ge(t), bi(e, ""), ui.notifications.info("Deleted voice profile."));
}
function bi(e, t = "") {
	e.find("#sam-voice-profile-select").html(gi(t));
}
function xi() {
	let e = E(), t = {
		type: "sam-voice-profiles",
		version: 2,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		profiles: Object.values(e)
	};
	pi(`sam-voice-profiles-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, t);
}
async function Si(e) {
	let t = document.createElement("input");
	t.type = "file", t.accept = ".json,application/json", t.addEventListener("change", async () => {
		let n = t.files?.[0];
		if (n) try {
			if (n.size > 524288) throw Error(`Profile import is too large: ${Math.round(n.size / 1024)} KB.`);
			let t = await n.text(), r = JSON.parse(t), i = ve(r);
			i.length && ui.notifications.warn(Ci(i));
			let a = await _e(r);
			bi(e, ""), ui.notifications.info(`Imported voice profiles: ${a}`);
		} catch (e) {
			console.error(e), ui.notifications.error(e?.message || "Failed to import voice profiles.");
		}
	}), t.click();
}
function Ci(e) {
	return `Ignored non-local TTS backend URLs from imported profiles: ${e.slice(0, 3).map((e) => `${e.profile}: ${e.url}`).join("; ")}${e.length > 3 ? `; +${e.length - 3} more` : ""}`;
}
//#endregion
//#region scripts/ui/effectsPanel.js
var wi = null;
function Ti(e) {
	let t = u(e), n = Be();
	return `
        <details class="samvoice-details samvoice-effects-details" data-samvoice-panel="effects" open>
            <summary>
                <i class="fas fa-magic"></i>
                <span>Эффекты</span>
                <small>настраиваемая постобработка</small>
            </summary>

            <div class="samvoice-effect-toolbar">
                <div class="samvoice-effect-preset-row">
                    <select id="sam-effect-preset-select">
                        ${Ki()}
                    </select>

                    <button type="button" id="sam-effect-preset-apply" class="samvoice-mini-button">
                        Применить
                    </button>
                </div>

                <div class="samvoice-effect-preset-save-row">
                    <input
                        type="text"
                        id="sam-effect-preset-name"
                        placeholder="Название пресета"
                    >

                    <button type="button" id="sam-effect-preset-save" class="samvoice-mini-button">
                        Сохранить
                    </button>

                    <button type="button" id="sam-effect-preset-update" class="samvoice-mini-button">
                        Обновить
                    </button>

                    <button type="button" id="sam-effect-preset-delete" class="samvoice-mini-button samvoice-button-danger-soft">
                        Удалить
                    </button>
                </div>

                <div class="samvoice-effect-utility-row">
                    <button type="button" id="sam-effect-reset" class="samvoice-mini-button">
                        Чисто
                    </button>

                    <button type="button" id="sam-effect-randomize" class="samvoice-mini-button">
                        Случайный сет
                    </button>

                    <button type="button" id="sam-effect-show-all" class="samvoice-mini-button">
                        Показать все
                    </button>

                    <button type="button" id="sam-effect-reset-order" class="samvoice-mini-button">
                        Сброс порядка
                    </button>
                </div>
            </div>

            <div class="samvoice-effect-board">
                <div class="samvoice-effect-card-grid" data-effect-grid>
                    ${ki(t, n)}
                </div>

                <div class="samvoice-hidden-effects" data-hidden-effects ${Bi(n) ? "" : "hidden"}>
                    <span>Скрытые:</span>
                    <div class="samvoice-hidden-effect-chip-row" data-hidden-effect-chips>
                        ${zi(n)}
                    </div>
                </div>
            </div>
        </details>
    `;
}
function Ei(e) {
	Mi(e), Ni(e), $i(e), e.find("#sam-effect-preset-select").off("change").on("change", () => {
		$i(e);
	}), e.find("#sam-effect-preset-apply").click(async () => {
		await qi(e);
	}), e.find("#sam-effect-preset-save").click(async () => {
		await Yi(e);
	}), e.find("#sam-effect-preset-update").click(async () => {
		await Xi(e);
	}), e.find("#sam-effect-preset-delete").click(async () => {
		await Zi(e);
	}), e.find("#sam-effect-reset").click(async () => {
		await Ji(e, l({}));
	}), e.find("#sam-effect-randomize").click(async () => {
		await Ji(e, ea());
	});
}
function q(e) {
	let t = {};
	for (let n of Object.keys(s)) t[n] = Hi(e, n);
	return u(t);
}
function Di(e, t) {
	let n = u(t);
	for (let [t, r] of Object.entries(s)) {
		let i = n[t], a = J(e, t);
		if (a.length) {
			a.toggleClass("active", i.enabled), a.find(".sam-effect-toggle").attr("aria-pressed", i.enabled ? "true" : "false");
			for (let n of r.params || []) {
				let r = i.params[n.id];
				Ui(e, t, n.id, r);
			}
			Wi(e, t);
		}
	}
}
function Oi(e) {
	wi && clearTimeout(wi), wi = setTimeout(async () => {
		wi = null;
		try {
			await ze(q(e));
		} catch (e) {
			console.warn("SAM Voice: failed to persist effect settings", e);
		}
	}, 250);
}
function ki(e, t) {
	return Vi(t).map((n) => Ai(n, s[n], e[n], t.hidden?.[n])).join("");
}
function Ai(e, t, n, r) {
	let i = n.enabled ? "active" : "", a = r ? "is-hidden" : "", o = [t.label, t.description].filter(Boolean).join(". ");
	return `
        <div
            class="samvoice-effect-card ${i} ${a}"
            data-effect-id="${G(e)}"
            title="${G(o)}"
        >
            <div class="sam-effect-card-head">
                <button
                    type="button"
                    class="sam-effect-drag-handle"
                    data-effect-id="${G(e)}"
                    draggable="true"
                    title="Перетащить эффект"
                    aria-label="Перетащить эффект"
                >
                    <i class="fas fa-grip-vertical"></i>
                </button>

                <button
                    type="button"
                    class="sam-effect-toggle"
                    data-effect-id="${G(e)}"
                    aria-pressed="${n.enabled ? "true" : "false"}"
                    title="${G(t.label)}"
                >
                    <i class="${G(t.icon)}"></i>
                    <span>${G(t.label)}</span>
                    <small class="sam-effect-primary-value">${G(Gi(t, n))}</small>
                </button>

                <button
                    type="button"
                    class="sam-effect-hide"
                    data-effect-id="${G(e)}"
                    title="Скрыть эффект"
                    aria-label="Скрыть эффект"
                >
                    <i class="fas fa-eye-slash"></i>
                </button>
            </div>

            <div class="sam-effect-param-stack">
                ${(t.params || []).map((t) => ji(e, t, n.params[t.id])).join("")}
            </div>
        </div>
    `;
}
function ji(e, t, n) {
	let r = G(e), i = G(t.id), a = na(n);
	return `
        <label class="sam-effect-param-row" data-effect-id="${r}" data-param-id="${i}">
            <span class="sam-effect-param-label">${G(t.label)}</span>

            <input
                type="range"
                class="sam-effect-param-range"
                data-effect-id="${r}"
                data-param-id="${i}"
                min="${t.min}"
                max="${t.max}"
                step="${t.step}"
                value="${a}"
            >

            <span class="sam-effect-param-value-wrap">
                <input
                    type="number"
                    class="sam-effect-param-number"
                    data-effect-id="${r}"
                    data-param-id="${i}"
                    min="${t.min}"
                    max="${t.max}"
                    step="${t.step}"
                    value="${a}"
                >
                <small>${G(t.unit || "")}</small>
            </span>
        </label>
    `;
}
function Mi(e) {
	e.find(".sam-effect-toggle").off("click").on("click", function() {
		let t = this.dataset.effectId, n = J(e, t), r = !n.hasClass("active");
		n.toggleClass("active", r), n.find(".sam-effect-toggle").attr("aria-pressed", r ? "true" : "false"), Wi(e, t), Oi(e);
	}), e.find(".sam-effect-param-range, .sam-effect-param-number").off("input").on("input", function() {
		let t = this.dataset.effectId, n = this.dataset.paramId;
		Ui(e, t, n, d(t, n, this.value)), Wi(e, t), Oi(e);
	});
}
function Ni(e) {
	Fi(e), Pi(e), e.find("#sam-effect-show-all").off("click").on("click", async () => {
		e.find(".samvoice-effect-card.is-hidden").removeClass("is-hidden"), Ri(e), await Ve(Li(e));
	}), e.find("#sam-effect-reset-order").off("click").on("click", async () => {
		let t = e.find("[data-effect-grid]");
		for (let n of Object.keys(s)) {
			let r = J(e, n);
			r.length && t.append(r);
		}
		await Ve(Li(e));
	});
}
function Pi(e) {
	e.find(".sam-effect-hide").off("click").on("click", async function() {
		let t = this.dataset.effectId;
		J(e, t).addClass("is-hidden").removeClass("drag-before drag-after is-dragging"), Ri(e), await Ve(Li(e));
	}), e.find("[data-hidden-effect-chips]").off("click").on("click", async function(t) {
		let n = t.target?.closest?.(".samvoice-hidden-effect-chip");
		if (!n || !this.contains(n)) return;
		let r = n.dataset.effectId;
		J(e, r).removeClass("is-hidden"), Ri(e), await Ve(Li(e));
	});
}
function Fi(e) {
	let t = null;
	e.find(".sam-effect-drag-handle").off("dragstart dragend"), e.find(".sam-effect-drag-handle").on("dragstart", function(n) {
		t = this.dataset.effectId;
		let r = n.originalEvent || n;
		J(e, t).addClass("is-dragging"), r?.dataTransfer && (r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", t));
	}), e.find(".sam-effect-drag-handle").on("dragend", () => {
		t = null, e.find(".samvoice-effect-card").removeClass("is-dragging drag-before drag-after");
	}), e.find(".samvoice-effect-card").off("dragover dragleave drop"), e.find(".samvoice-effect-card").on("dragover", function(n) {
		if (!t || this.dataset.effectId === t || this.classList.contains("is-hidden")) return;
		n.preventDefault();
		let r = Ii(n, this);
		e.find(".samvoice-effect-card").removeClass("drag-before drag-after"), this.classList.toggle("drag-before", !r), this.classList.toggle("drag-after", r);
	}), e.find(".samvoice-effect-card").on("dragleave", function() {
		this.classList.remove("drag-before", "drag-after");
	}), e.find(".samvoice-effect-card").on("drop", async function(n) {
		if (!t || this.dataset.effectId === t || this.classList.contains("is-hidden")) return;
		n.preventDefault();
		let r = J(e, t), i = Zr(this);
		Ii(n, this) ? i.after(r) : i.before(r), e.find(".samvoice-effect-card").removeClass("is-dragging drag-before drag-after"), await Ve(Li(e));
	});
}
function Ii(e, t) {
	let n = e.originalEvent || e, r = t.getBoundingClientRect();
	return Math.abs(n.clientY - (r.top + r.height / 2)) <= r.height / 2 ? n.clientX > r.left + r.width / 2 : n.clientY > r.top + r.height / 2;
}
function Li(e) {
	let t = e.find(".samvoice-effect-card").toArray().map((e) => e.dataset.effectId).filter((e) => s[e]), n = {};
	return e.find(".samvoice-effect-card").each(function() {
		let e = this.dataset.effectId;
		s[e] && (n[e] = this.classList.contains("is-hidden"));
	}), {
		order: t,
		hidden: n
	};
}
function Ri(e) {
	let t = Li(e), n = e.find("[data-hidden-effects]");
	e.find("[data-hidden-effect-chips]").html(zi(t)), n.prop("hidden", !Bi(t));
}
function zi(e) {
	return Vi(e).filter((t) => e.hidden?.[t]).map((e) => `
            <button
                type="button"
                class="samvoice-hidden-effect-chip"
                data-effect-id="${G(e)}"
                title="Показать эффект"
            >
                <i class="${G(s[e].icon)}"></i>
                <span>${G(s[e].label)}</span>
            </button>
        `).join("");
}
function Bi(e) {
	return Vi(e).some((t) => e.hidden?.[t]);
}
function Vi(e = {}) {
	let t = Object.keys(s), n = /* @__PURE__ */ new Set(), r = [];
	for (let t of Array.isArray(e?.order) ? e.order : []) s[t] && !n.has(t) && (n.add(t), r.push(t));
	for (let e of t) n.has(e) || r.push(e);
	return r;
}
function Hi(e, t) {
	let n = s[t], r = J(e, t), i = {};
	for (let r of n.params || []) {
		let n = e.find(`.sam-effect-param-number[data-effect-id="${K(t)}"][data-param-id="${K(r.id)}"]`).val();
		i[r.id] = d(t, r.id, n);
	}
	return {
		enabled: r.hasClass("active"),
		params: i
	};
}
function Ui(e, t, n, r) {
	let i = K(t), a = K(n), o = na(r);
	e.find(`.sam-effect-param-range[data-effect-id="${i}"][data-param-id="${a}"]`).val(o), e.find(`.sam-effect-param-number[data-effect-id="${i}"][data-param-id="${a}"]`).val(o);
}
function Wi(e, t) {
	let n = s[t], r = Hi(e, t);
	J(e, t).find(".sam-effect-primary-value").text(Gi(n, r));
}
function Gi(e, t) {
	if (!t?.enabled) return "выкл";
	let n = e.params?.[0];
	if (!n) return "вкл";
	let r = t.params?.[n.id] ?? n.defaultValue;
	return `${n.label}: ${na(r)}${n.unit || ""}`;
}
function Ki(e = "") {
	let t = D();
	return `
        <optgroup label="Встроенные">
            ${Object.entries(c).map(([t, n]) => `
                <option value="builtin:${G(t)}" ${e === `builtin:${t}` ? "selected" : ""}>
                    ${G(n.name)}
                </option>
            `).join("")}
        </optgroup>

        <optgroup label="Сохранённые">
            ${Object.entries(t).map(([t, n]) => `
                <option value="custom:${G(t)}" ${e === `custom:${t}` ? "selected" : ""}>
                    ${G(n.name)}
                </option>
            `).join("")}
        </optgroup>
    `;
}
async function qi(e) {
	let t = String(e.find("#sam-effect-preset-select").val() || ""), n = null;
	if (t.startsWith("builtin:") && (n = c[t.replace("builtin:", "")]?.effects || null), t.startsWith("custom:")) {
		let e = t.replace("custom:", "");
		n = D()[e]?.effects || null;
	}
	if (!n) {
		ui.notifications.warn("Пресет эффектов не найден.");
		return;
	}
	await Ji(e, n);
}
async function Ji(e, t) {
	Di(e, t), await ze(q(e));
}
async function Yi(e) {
	let t = e.find("#sam-effect-preset-name").val().trim();
	if (!t.length) {
		ui.notifications.warn("Сначала введи название пресета.");
		return;
	}
	let n = q(e);
	try {
		Qi(e, `custom:${await Ue(t, n)}`), $i(e), ui.notifications.info(`Пресет эффектов сохранён: ${t}`);
	} catch (e) {
		console.error(e), ui.notifications.error("Не удалось сохранить пресет эффектов.");
	}
}
async function Xi(e) {
	let t = String(e.find("#sam-effect-preset-select").val() || "");
	if (!t.startsWith("custom:")) {
		ui.notifications.warn("Обновлять можно только сохранённые пресеты.");
		return;
	}
	let n = t.replace("custom:", ""), r = e.find("#sam-effect-preset-name").val().trim(), i = q(e);
	try {
		await We(n, {
			name: r || D()[n]?.name,
			effects: i
		}), Qi(e, `custom:${n}`), $i(e), ui.notifications.info("Пресет эффектов обновлён.");
	} catch (e) {
		console.error(e), ui.notifications.error("Не удалось обновить пресет эффектов.");
	}
}
async function Zi(e) {
	let t = String(e.find("#sam-effect-preset-select").val() || "");
	if (!t.startsWith("custom:")) {
		ui.notifications.warn("Удалять можно только сохранённые пресеты.");
		return;
	}
	await Ge(t.replace("custom:", "")), Qi(e, "builtin:none"), $i(e), ui.notifications.info("Пресет эффектов удалён.");
}
function Qi(e, t = "") {
	e.find("#sam-effect-preset-select").html(Ki(t));
}
function $i(e) {
	let t = String(e.find("#sam-effect-preset-select").val() || ""), n = e.find("#sam-effect-preset-name");
	if (!t.startsWith("custom:")) {
		n.val("");
		return;
	}
	let r = t.replace("custom:", ""), i = D()[r];
	n.val(i?.name || "");
}
function ea() {
	let e = l({}), t = Object.keys(s).map((e) => [Math.random(), e]).sort((e, t) => e[0] - t[0]).map(([, e]) => e), n = 3 + Math.floor(Math.random() * 4);
	for (let r of t.slice(0, n)) {
		let t = s[r];
		e[r].enabled = !0;
		for (let n of t.params || []) e[r].params[n.id] = ta(n);
	}
	return e;
}
function ta(e) {
	let t = e.max - e.min, n = e.min + Math.random() * t, r = Number(e.step || 1), i = Math.round(n / r) * r, a = Math.min(Math.max(i, e.min), e.max);
	return Number.isInteger(r) ? Math.round(a) : Math.round(a * 100) / 100;
}
function J(e, t) {
	return e.find(`.samvoice-effect-card[data-effect-id="${K(t)}"]`);
}
function na(e) {
	let t = Number(e);
	return Number.isFinite(t) ? String(Number.isInteger(t) ? t : Math.round(t * 10) / 10) : "0";
}
//#endregion
//#region scripts/ui/historyPanel.js
function ra() {
	return `
        <details class="samvoice-details samvoice-history-details" data-samvoice-panel="history">
            <summary>
                <i class="fas fa-clock"></i>
                <span>История</span>
                <small>быстро вернуть прошлую реплику</small>
            </summary>

            <div id="sam-history-list" class="samvoice-history">
                ${oa(Xe())}
            </div>

            <div class="samvoice-history-controls">
                <button type="button" id="sam-clear-history" class="samvoice-mini-button samvoice-button-danger-soft" title="Clear History">
                    <i class="fas fa-trash"></i>
                    Clear
                </button>
            </div>
        </details>
    `;
}
function ia(e, t) {
	e.find(".sam-history-item").off("click").on("click", function() {
		let e = Number(this.dataset.historyIndex), n = Xe()[e];
		n && t.onSelectPhrase(n);
	}), e.find("#sam-clear-history").off("click").on("click", async () => {
		await Qe(), aa(e, t);
	});
}
function aa(e, t) {
	e.find("#sam-history-list").html(oa(Xe())), ia(e, t);
}
function oa(e) {
	return e.length ? e.map((e, t) => `
        <button
            type="button"
            class="sam-history-item"
            data-history-index="${t}"
            title="${G(e)}"
        >
            ${G(e)}
        </button>
    `).join("") : "<div class=\"samvoice-empty-history\">No phrases yet.</div>";
}
//#endregion
//#region scripts/net.js
var sa = 45e3, ca = a, la = /* @__PURE__ */ new Map([
	["audio/wave", "audio/wav"],
	["audio/x-wav", "audio/wav"],
	["audio/vnd.wave", "audio/wav"]
]);
function ua(e, t = "") {
	return String(e || t).trim().replace(/\/+$/, "");
}
function da(e) {
	return new Promise((t, n) => {
		let r = new FileReader();
		r.onloadend = () => t(r.result), r.onerror = () => n(r.error), r.readAsDataURL(e);
	});
}
async function fa(e, t = "") {
	ha(e);
	let n = await ga(e, t);
	return {
		audioDataUrl: await da(e.type === n ? e : new Blob([e], { type: n })),
		mimeType: n,
		sizeBytes: e.size
	};
}
async function pa(e, t = 500) {
	try {
		return (await e.text()).slice(0, t);
	} catch {
		return "";
	}
}
function ma({ signal: e = null, timeoutMs: t = sa } = {}) {
	let n = new AbortController(), r = null, i = () => n.abort(e.reason);
	return e?.aborted ? n.abort(e.reason) : e && e.addEventListener("abort", i, { once: !0 }), t > 0 && (r = globalThis.setTimeout(() => {
		n.abort(new DOMException("TTS backend request timed out.", "TimeoutError"));
	}, t)), {
		signal: n.signal,
		cleanup: () => {
			r && globalThis.clearTimeout(r), e && e.removeEventListener("abort", i);
		}
	};
}
function ha(e, t = ca) {
	if (!e?.size) throw new S(x.INVALID_AUDIO_DATA, "TTS backend returned an empty audio response.");
	if (e.size <= t) return;
	let n = (e.size / 1024 / 1024).toFixed(1), r = (t / 1024 / 1024).toFixed(1);
	throw new S(x.PAYLOAD_TOO_LARGE, `Generated audio is too large: ${n} MB / ${r} MB.`, {
		sizeBytes: e.size,
		maxBytes: t
	});
}
async function ga(e, t) {
	let n = va(t), r = va(e?.type);
	for (let e of [n, r]) if (e.startsWith("audio/")) return la.get(e) || e;
	let i = await _a(e);
	if (i) return i;
	throw new S(x.UNSUPPORTED_AUDIO_MIME, `TTS backend did not return recognizable audio data (${n || r || "unknown MIME"}).`);
}
async function _a(e) {
	let t = new Uint8Array(await e.slice(0, 16).arrayBuffer()), n = String.fromCharCode(...t);
	return n.startsWith("RIFF") && n.slice(8, 12) === "WAVE" ? "audio/wav" : n.startsWith("OggS") ? "audio/ogg" : n.startsWith("fLaC") ? "audio/flac" : n.startsWith("ID3") || t[0] === 255 && (t[1] & 224) == 224 ? "audio/mpeg" : t[0] === 26 && t[1] === 69 && t[2] === 223 && t[3] === 163 ? "audio/webm" : n.slice(4, 8) === "ftyp" ? "audio/mp4" : "";
}
function va(e) {
	return String(e || "").split(";", 1)[0].trim().toLowerCase();
}
//#endregion
//#region scripts/piper.js
var ya = "http://127.0.0.1:5050", ba = 7500, xa = /* @__PURE__ */ new Map(), Sa = /* @__PURE__ */ new Map();
async function Ca(e, t, n, i = {}) {
	let a = String(e || "").trim();
	if (!a.length) throw new S(x.TEXT_EMPTY, "Piper text is empty.");
	if (a.length > 1e3) throw new S(x.TEXT_TOO_LONG, `Piper text is too long: ${a.length}/${r} characters.`);
	let o = ae(ua(t, ya), se()), { signal: s, cleanup: c } = ma(i), l = { text: a };
	n && (l.voice = n);
	try {
		let e = await fetch(o, {
			method: "POST",
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify(l),
			signal: s
		});
		if (!e.ok) {
			let t = await pa(e);
			throw Error(`Piper request failed: ${e.status} ${e.statusText}${t ? ` - ${t}` : ""}`);
		}
		return await fa(await e.blob(), e.headers.get("content-type"));
	} finally {
		c();
	}
}
async function wa(e, t = {}) {
	let n = ae(ua(e, ya), se()), { signal: r, cleanup: i } = ma(t);
	try {
		let e = await fetch(`${n}/voices`, {
			method: "GET",
			signal: r
		});
		if (!e.ok) {
			let t = await pa(e);
			throw Error(`Piper voices request failed: ${e.status} ${e.statusText}${t ? ` - ${t}` : ""}`);
		}
		let t = await e.json();
		return t && typeof t == "object" ? t : {};
	} finally {
		i();
	}
}
async function Ta(e, t = {}) {
	let n = ua(e, ya), r = xa.get(n);
	if (!t.force && r && Date.now() - r.at < ba) return r.value;
	if (!t.force && Sa.has(n)) return await Sa.get(n);
	let i = (async () => {
		let r = {
			ok: !0,
			voices: await wa(e, t)
		};
		return xa.set(n, {
			at: Date.now(),
			value: r
		}), r;
	})();
	Sa.set(n, i);
	try {
		return await i;
	} finally {
		Sa.delete(n);
	}
}
//#endregion
//#region scripts/ui/remoteEnginePanel.js
function Ea(e) {
	let { id: t, title: n, iconClass: r = "fas fa-volume-up", summaryLabel: i = "Движок", summaryHint: a = "Параметры синтезатора и подключения.", detailsClass: o = "samvoice-details samvoice-engine-details", settingsClass: s = "samvoice-engine-settings-grid", voiceRowClass: c = "samvoice-engine-settings-grid", defaultServerUrl: l, defaultVoice: u = "", defaultVoiceLabel: d = "Default voice", urlLabel: f = "URL", voiceLabel: p = "Voice", urlPlaceholder: m = l, checkTitle: h, checkingText: g, okText: _, errorText: ee, checkServer: v, extractVoices: y, normalizeVoiceValue: b = Oa, renderExtraFieldsHtml: te = () => "", bindExtraFields: ne = () => {}, readExtraFieldsFromDialog: x = () => ({}), applyExtraFieldsToDialog: S = () => {}, getServerUrlFromSettings: C, getVoiceFromSettings: re } = e;
	Da(e);
	let w = {
		details: `sam-${t}-engine-details`,
		settings: `sam-${t}-settings`,
		url: `sam-${t}-url`,
		check: `sam-check-${t}`,
		voiceRow: `sam-${t}-voice-row`,
		voice: `sam-${t}-voice`,
		status: `sam-${t}-status`
	};
	function ie(e = {}) {
		let d = C?.(e) || l, g = b(re?.(e) ?? u), _ = e.engine === t ? "open" : "";
		return `
            <details id="${w.details}" class="${G(o)}" data-samvoice-panel="${G(t)}" ${_}>
                <summary>
                    <i class="${G(r)}"></i>
                    <span>${G(i || n)}</span>
                    <small>${G(a)}</small>
                </summary>

                <div id="${w.settings}" class="${G(s)}">
                    <label for="${w.url}">${G(f)}</label>

                    <input
                        type="text"
                        id="${w.url}"
                        value="${G(d)}"
                        placeholder="${G(m || l)}"
                    >

                    <button type="button" id="${w.check}" title="${G(h || `Check ${n}`)}" class="samvoice-mini-button">
                        Check
                    </button>
                </div>

                <div id="${w.voiceRow}" class="${G(c)}">
                    <label for="${w.voice}">${G(p)}</label>

                    <select id="${w.voice}">
                        ${de([], g)}
                    </select>

                    <span></span>
                </div>

                ${te(e)}

                <div id="${w.status}" class="samvoice-${t}-status"></div>
            </details>
        `;
	}
	function ae(e, t = {}) {
		e.find(`#${w.voice}`).off("change.samvoiceRemote").on("change.samvoiceRemote", () => {
			t.updateTextPreview?.(), t.refreshSessionReady?.();
		}), ne(e, t), e.find(`#${w.check}`).off("click.samvoiceRemote").on("click.samvoiceRemote", async () => {
			await oe(e, t);
		});
	}
	async function oe(e, r = {}) {
		let i = se(e), a = e.find(`#${w.status}`), o = e.find(`#${w.voice}`), s = i[`${t}Voice`];
		a.removeClass("samvoice-status-ok samvoice-status-error").text(g || `Checking ${n}...`);
		try {
			let c = await v(i[`${t}ServerUrl`]), l = y(c);
			o.html(de(l, s));
			let u = se(e);
			await ce({
				engine: e.find("#sam-engine").val(),
				...u
			}), a.addClass("samvoice-status-ok").text(typeof _ == "function" ? _(l, c) : `${n} OK. Voices: ${l.length}`), r.updateTextPreview?.(), r.refreshSessionReady?.();
		} catch (e) {
			console.error(e), a.addClass("samvoice-status-error").text(typeof ee == "function" ? ee(e) : `${n} unavailable.`);
		}
	}
	function se(e) {
		return {
			[`${t}ServerUrl`]: e.find(`#${w.url}`).val()?.trim() || l,
			[`${t}Voice`]: b(e.find(`#${w.voice}`).val()) || u,
			...x(e)
		};
	}
	function le(e, n = {}) {
		e.find(`#${w.url}`).val(n[`${t}ServerUrl`] || l), ue(e, n[`${t}Voice`] || u), S(e, n);
	}
	function ue(e, t) {
		let n = e.find(`#${w.voice}`), r = b(t) || u;
		r && !n.find(`option[value="${K(r)}"]`).length && n.append(`<option value="${G(r)}">${G(r)}</option>`), n.val(r);
	}
	function de(e, t) {
		let n = ka(e, b), r = b(t) || u, i = [];
		if (d !== null) {
			let e = r ? "" : "selected";
			i.push(`<option value="" ${e}>${G(d)}</option>`);
		}
		r && !n.includes(r) && i.push(`<option value="${G(r)}" selected>${G(r)}</option>`);
		for (let e of n) {
			let t = e === r ? "selected" : "";
			i.push(`<option value="${G(e)}" ${t}>${G(e)}</option>`);
		}
		return i.join("");
	}
	return {
		render: ie,
		bind: ae,
		checkFromDialog: oe,
		readSettingsFromDialog: se,
		applySettingsToDialog: le,
		setVoiceValue: ue,
		renderVoiceOptions: de
	};
}
function Da(e) {
	for (let t of [
		"id",
		"title",
		"defaultServerUrl",
		"checkServer",
		"extractVoices"
	]) if (!e[t]) throw Error(`createRemoteEnginePanel missing required config key: ${t}`);
}
function Oa(e) {
	return String(e || "").trim();
}
function ka(e, t) {
	return Array.from(e || []).map((e) => t(e)).filter(Boolean);
}
//#endregion
//#region scripts/ui/piperPanel.js
var Aa = "http://127.0.0.1:5050", ja = Ea({
	id: "piper",
	title: "Piper",
	iconClass: "fas fa-volume-up",
	summaryLabel: "Движок",
	summaryHint: "Параметры синтезатора и подключения.",
	settingsClass: "samvoice-piper-settings",
	voiceRowClass: "samvoice-piper-voice-row",
	defaultServerUrl: Aa,
	defaultVoice: "",
	defaultVoiceLabel: "Default voice",
	urlLabel: "Piper URL",
	voiceLabel: "Voice",
	urlPlaceholder: Aa,
	checkTitle: "Check Piper",
	checkingText: "Checking Piper...",
	okText: (e) => `Piper OK. Voices: ${e.length}`,
	errorText: (e) => e?.message || "Piper unavailable. Check start-piper.bat.",
	checkServer: (e) => Ta(e, { force: !0 }),
	extractVoices: (e) => Object.keys(e.voices || {}),
	normalizeVoiceValue: Ra,
	getServerUrlFromSettings: (e) => e.piperServerUrl,
	getVoiceFromSettings: (e) => e.piperVoice
});
function Ma(e) {
	return ja.render(e);
}
function Na(e, t) {
	ja.bind(e, t);
}
async function Pa({ text: e, piperServerUrl: t, piperVoice: n, effects: r, signal: i }) {
	return {
		engine: "piper",
		text: e,
		voice: n,
		...await Ca(e, t, n, { signal: i }),
		effects: r
	};
}
async function Fa(e, t = {}) {
	await ja.checkFromDialog(e, t);
}
function Ia(e) {
	return ja.readSettingsFromDialog(e);
}
function La(e, t = {}) {
	ja.applySettingsToDialog(e, t);
}
function Ra(e) {
	return e ? String(e).trim() : "";
}
//#endregion
//#region scripts/ui/sileroPanel.js
var samSileroPanel = Ea({
	id: "silero", title: "Silero", iconClass: "fas fa-language",
	summaryLabel: "Silero TTS", summaryHint: "Локальный русский TTS на CPU.",
	defaultServerUrl: "http://127.0.0.1:5051",
	defaultVoice: "xenia", defaultVoiceLabel: null,
	urlLabel: "Silero URL", voiceLabel: "Voice",
	checkTitle: "Check Silero", checkingText: "Checking Silero...",
	okText: (e) => `Silero OK. Voices: ${e.length}`,
	errorText: (e) => e?.message || "Silero unavailable. Start silero_server.py.",
	checkServer: (e) => Ta(e, { force: !0 }),
	extractVoices: (e) => Object.keys(e.voices || {}),
	getServerUrlFromSettings: (e) => e.sileroServerUrl,
	getVoiceFromSettings: (e) => e.sileroVoice
});
function samRenderSilero(e) { return samSileroPanel.render(e); }
function samBindSilero(e, t) { samSileroPanel.bind(e, t); }
function samCheckSilero(e, t) { return samSileroPanel.checkFromDialog(e, t); }
function samReadSilero(e) { return samSileroPanel.readSettingsFromDialog(e); }
function samApplySilero(e, t) { return samSileroPanel.applySettingsToDialog(e, t); }
async function samGenerateSilero({ text, sileroServerUrl, sileroVoice, effects, signal }) {
	return {
		engine: "silero", text, voice: sileroVoice,
		...await Ca(text, sileroServerUrl, sileroVoice, { signal }), effects
	};
}
//#endregion
//#region scripts/ui/qwenPanel.js
var samQwenVoices = ["aiden", "dylan", "eric", "ono_anna", "ryan", "serena", "sohee", "uncle_fu", "vivian"];
async function samQwenFetchInfo(url, { signal } = {}) {
    let base = ae(ua(url, "http://127.0.0.1:8081"), se());
    let controller = ma({ signal, timeoutMs: 15000 });
    try {
        let response = await fetch(base + "/v1/models", { signal: controller.signal });
        if (!response.ok) throw Error(`Qwen server check failed: ${response.status} ${await pa(response)}`);
        let json = await response.json();
        let loaded = Array.isArray(json?.data) ? json.data : [];
        let active = loaded.find((item) =>
            /qwen3[-_ ]?tts/i.test(String(item?.id || "")) ||
            /qwen3[-_ ]?tts/i.test(String(item?.speech?.name || ""))
        );
        if (!active) throw Error("No Qwen3-TTS synthesis model is loaded on this server.");
        return { ok: true, model: String(active.id || ""),
            voices: Object.fromEntries(samQwenVoices.map((voice) => [voice, { name: voice }])) };
    } finally {
        controller.cleanup();
    }
}
async function samQwenGenerate({ text, qwenServerUrl, qwenVoice, qwenInstructions, effects, signal }) {
    let server = ae(ua(qwenServerUrl, "http://127.0.0.1:8081"), se());
    let voice = samQwenVoices.includes(qwenVoice) ? qwenVoice : "ryan";
    let instructions = String(qwenInstructions || "").trim().slice(0, 600);
    if (instructions) {
        let info = await samQwenFetchInfo(server, { signal });
        if (!/1[._-]?7[bB]/.test(info.model)) {
            throw Error("Voice Instructions require Qwen3-TTS 1.7B. Clear the instruction or start speech.cpp with 1.7B.");
        }
    }
    let body = { input: text, voice, language: "ru", response_format: "wav" };
    if (instructions) body.instructions = instructions;
    let controller = ma({ signal, timeoutMs: 120000 });
    try {
        let response = await fetch(server + "/v1/audio/speech", {
            method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(body), signal: controller.signal
        });
        if (!response.ok) throw Error(`Qwen speech failed: ${response.status} ${await pa(response)}`);
        return { engine: "qwen", text, voice,
            ...await fa(await response.blob(), response.headers.get("content-type")), effects };
    } finally {
        controller.cleanup();
    }
}
var samQwenPanel = Ea({
    id: "qwen", title: "Qwen3-TTS", iconClass: "fas fa-microphone-alt",
    summaryLabel: "Qwen3-TTS", summaryHint: "Нейронная озвучка с интонационными инструкциями (1.7B).",
    defaultServerUrl: "http://127.0.0.1:8081", defaultVoice: "ryan", defaultVoiceLabel: null,
    urlLabel: "Qwen Server URL", voiceLabel: "Voice",
    checkTitle: "Check Qwen3-TTS", checkingText: "Checking Qwen3-TTS...",
    okText: (list, response) => `Qwen онлайн: ${response.model} (${list.length} голосов)`,
    errorText: (error) => error?.message || "Qwen offline. Run speech.cpp serve.",
    checkServer: (url) => samQwenFetchInfo(url), extractVoices: (response) => Object.keys(response.voices || {}),
    renderExtraFieldsHtml: (settings) => `
        <div class="samvoice-engine-settings-grid samvoice-qwen-instructions-row">
            <label for="sam-qwen-instructions">Voice Instructions</label>
            <textarea id="sam-qwen-instructions" rows="3" maxlength="600"
                placeholder="Speak softly, with a tired and raspy voice."
                title="Английская инструкция о характере речи. Поддерживается моделью 1.7B.">${G(settings.qwenInstructions || "")}</textarea>
            <small>Только 1.7B. Сервер держит одну TTS-модель одновременно.</small>
        </div>
    `,
    readExtraFieldsFromDialog: (dialog) => ({
        qwenInstructions: String(dialog.find("#sam-qwen-instructions").val() || "").trim().slice(0, 600)
    }),
    applyExtraFieldsToDialog: (dialog, settings) => {
        dialog.find("#sam-qwen-instructions").val(String(settings.qwenInstructions || "").slice(0, 600));
    },
    getServerUrlFromSettings: (settings) => settings.qwenServerUrl,
    getVoiceFromSettings: (settings) => settings.qwenVoice
});
function samRenderQwen(settings) { return samQwenPanel.render(settings); }
function samBindQwen(dialog, callbacks) { samQwenPanel.bind(dialog, callbacks); }
function samCheckQwen(dialog, callbacks) { return samQwenPanel.checkFromDialog(dialog, callbacks); }
function samReadQwen(dialog) { return samQwenPanel.readSettingsFromDialog(dialog); }
function samApplyQwen(dialog, settings) { return samQwenPanel.applySettingsToDialog(dialog, settings); }
//#endregion
//#region scripts/ui/sessionPanel.js
var za = 0;
function Ba() {
	return "\n        <footer class=\"samvoice-session-bar\" aria-label=\"Session readiness\">\n            <div class=\"samvoice-session-chips\">\n                <div class=\"samvoice-session-chip\">\n                    <span class=\"samvoice-session-dot\" aria-hidden=\"true\"></span>\n                    <span id=\"sam-session-audio\" class=\"samvoice-session-pill\">Audio</span>\n                </div>\n\n                <div class=\"samvoice-session-chip\">\n                    <span class=\"samvoice-session-dot\" aria-hidden=\"true\"></span>\n                    <span id=\"sam-session-tts\" class=\"samvoice-session-pill\">TTS</span>\n                </div>\n\n                <div class=\"samvoice-session-chip\">\n                    <i class=\"fas fa-users\"></i>\n                    <span id=\"sam-session-players\" class=\"samvoice-session-pill\">Players</span>\n                </div>\n\n                <div class=\"samvoice-session-chip samvoice-session-chip-muted\">\n                    <i class=\"fas fa-microchip\"></i>\n                    <span id=\"sam-session-socket\" class=\"samvoice-session-pill\">Socket</span>\n                </div>\n\n                <div class=\"samvoice-session-chip samvoice-session-chip-wide\">\n                    <i class=\"fas fa-comment-dots\"></i>\n                    <span id=\"sam-session-voice\" class=\"samvoice-session-pill\">Voice</span>\n                </div>\n            </div>\n\n            <div id=\"sam-session-clients\" class=\"samvoice-session-clients\"></div>\n        </footer>\n    ";
}
function Va(e, t) {
	e.find("#sam-session-refresh").off("click").on("click", async () => {
		await Y(e, t);
	}), e.find("#sam-session-unlock").off("click").on("click", async () => {
		try {
			await Er(), await Y(e, t);
		} catch (e) {
			console.error(e), ui.notifications.error(e?.message || "Audio unlock failed.");
		}
	}), e.find("#sam-session-test-everyone").off("click").on("click", async () => {
		Xa(e, !0);
		try {
			await t.testEveryone(), await Y(e, t);
		} catch (e) {
			console.error(e), ui.notifications.error("Session test failed.");
		} finally {
			Xa(e, !1);
		}
	}), Y(e, t);
}
async function Y(e, t = {}) {
	let n = ++za;
	Ha(e), Ua(e, t), Wa(e), await Promise.all([Ga(e, t, n), Ja(e, n)]);
}
function Ha(e) {
	let t = Array.from(game.users || []).filter((e) => !e.isGM), n = t.filter((e) => e.active);
	X(e, "#sam-session-players", `Игроки: ${n.length}/${t.length}`, n.length > 0 || t.length === 0 ? "ok" : "warn");
}
function Ua(e, t) {
	let n = !!t.isSocketReady?.();
	X(e, "#sam-session-socket", n ? "Socket" : "Socket offline", n ? "ok" : "error");
}
function Wa(e) {
	let t = Or(), n = t.ready;
	X(e, "#sam-session-audio", n ? "Ready" : t.state, n ? "ok" : "warn");
}
async function Ga(e, t, n) {
	if (typeof t.collectClientAudioStatuses != "function") return;
	let r = e.find("#sam-session-clients");
	r.removeClass("samvoice-session-ok samvoice-session-warn samvoice-session-error").text("Checking clients...");
	try {
		let i = await t.collectClientAudioStatuses();
		if (n !== za) return;
		if (!i.length) {
			r.text("No active clients.");
			return;
		}
		let a = i.filter((e) => e.status?.ready).length, o = i.some((e) => e.status?.error || e.status?.lastError || e.status?.state === "no-response" || e.status?.state === "unsupported"), s = i.some((e) => !e.status?.ready), c = o ? "error" : s ? "warn" : "ok";
		X(e, "#sam-session-audio", `Audio: ${a}/${i.length}`, c), r.removeClass("samvoice-session-ok samvoice-session-warn samvoice-session-error").addClass(`samvoice-session-${c}`).html(Ka(i));
	} catch (e) {
		if (n !== za) return;
		console.error(e), r.removeClass("samvoice-session-ok samvoice-session-warn samvoice-session-error").addClass("samvoice-session-error").text("Client audio check failed.");
	}
}
function Ka(e) {
	return e.map((e) => {
		let t = e.status || {}, n = t.lastError || null, r = t.error || n?.message || "", i = t.ready && !n ? "ok" : r ? "error" : "warn", a = e.self ? "local" : e.isGM ? "GM" : "player", o = t.lastUnlockGestureAt ? new Date(t.lastUnlockGestureAt).toLocaleTimeString() : "no gesture", s = t.lastPlaybackAt ? new Date(t.lastPlaybackAt).toLocaleTimeString() : "no playback", c = n ? `; playback error: ${n.message}; engine: ${n.engine || "unknown"}; mime: ${n.mimeType || "unknown"}; size: ${qa(n.sizeBytes)}` : "", l = r ? `${r}${c}` : `state: ${t.state}; unlock: ${o}; last playback: ${s}`, u = r ? `${t.state || "unknown"} · error` : t.state || "unknown";
		return `
            <span class="samvoice-client-status samvoice-session-${i}" title="${G(l)}">
                <strong>${G(e.name)}</strong>
                <small>${G(a)} · ${G(u)}</small>
            </span>
        `;
	}).join("");
}
function qa(e) {
	let t = Number(e || 0);
	return t ? t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "unknown";
}
async function Ja(e, t) {
	if (e.find("#sam-engine").val() === "sam") {
		X(e, "#sam-session-tts", "SAM", "ok"), X(e, "#sam-session-voice", "SAM", "ok");
		return;
	}
	await Ya(e, t);
}
async function Ya(e, t) {
    let engine = e.find("#sam-engine").val(), qwen = engine === "qwen";
    let id = qwen ? "qwen" : engine === "silero" ? "silero" : "piper";
    let defaults = { qwen: "http://127.0.0.1:8081", silero: "http://127.0.0.1:5051", piper: "http://127.0.0.1:5050" };
    let url = e.find(`#sam-${id}-url`).val()?.trim() || defaults[id];
    let voice = Ra(e.find(`#sam-${id}-voice`).val());
    let label = qwen ? "Qwen" : id === "silero" ? "Silero" : "Piper";
    X(e, "#sam-session-tts", `${label}...`, "warn");
    X(e, "#sam-session-voice", voice || "Default", "warn");
    try {
        let result = qwen ? await samQwenFetchInfo(url) : await Ta(url);
        if (t !== za) return;
        X(e, "#sam-session-tts",
            qwen ? `Qwen онлайн: ${result.model}` : `${label} онлайн (${Object.keys(result.voices || {}).length})`, "ok");
        X(e, "#sam-session-voice", voice || "Default", voice ? "ok" : "warn");
    } catch {
        if (t !== za) return;
        X(e, "#sam-session-tts", `${label} offline`, "error");
        X(e, "#sam-session-voice", voice || "Default", "warn");
    }
}
function Xa(e, t) {
	let n = e.find("#sam-session-test-everyone");
	n.prop("disabled", t), n.find("span").text(t ? "Testing..." : "Test"), n.first?.setAttribute?.("title", t ? "Testing..." : "Test audio for everyone");
}
function X(e, t, n, r) {
	let i = e.find(t);
	i.removeClass("samvoice-session-ok samvoice-session-warn samvoice-session-error").addClass(`samvoice-session-${r}`).text(n), i.closest(".samvoice-session-chip").removeClass("samvoice-session-ok samvoice-session-warn samvoice-session-error").addClass(`samvoice-session-${r}`);
}
//#endregion
//#region scripts/data/samPresets.js
var Za = {
	default: {
		name: "Default",
		pitch: 64,
		speed: 72,
		mouth: 128,
		throat: 128
	},
	small: {
		name: "Small",
		pitch: 40,
		speed: 72,
		mouth: 180,
		throat: 160
	},
	robot: {
		name: "Robot",
		pitch: 64,
		speed: 60,
		mouth: 128,
		throat: 128
	},
	deep: {
		name: "Deep",
		pitch: 90,
		speed: 80,
		mouth: 80,
		throat: 80
	},
	fast: {
		name: "Fast",
		pitch: 64,
		speed: 40,
		mouth: 128,
		throat: 128
	},
	slow: {
		name: "Slow",
		pitch: 64,
		speed: 120,
		mouth: 128,
		throat: 128
	}
};
//#endregion
//#region scripts/ui/samPanel.js
function Qa(e) {
	return `
        <details id="sam-presets-details" class="samvoice-details" data-samvoice-panel="sam-presets" open>
            <summary>
                <i class="fas fa-sliders-h"></i>
                <span>SAM-пресеты</span>
                <small>быстрые варианты голоса</small>
            </summary>

            <div id="sam-presets" class="samvoice-presets">
                ${Object.entries(Za).map(([e, t]) => `
                    <button
                        type="button"
                        class="sam-preset"
                        data-preset="${e}"
                    >
                        ${t.name}
                    </button>
                `).join("")}
            </div>
        </details>

        <details id="sam-voice-settings-details" class="samvoice-details" data-samvoice-panel="sam-settings" open>
            <summary>
                <i class="fas fa-cogs"></i>
                <span>SAM-параметры</span>
                <small>pitch, speed, mouth, throat</small>
            </summary>

            <div class="samvoice-slider-row">
                <label>
                    <span>Pitch</span>
                    <span id="pitch-value">${e.pitch}</span>
                </label>
                <input type="range" id="sam-pitch" min="0" max="255" value="${e.pitch}">
            </div>

            <div class="samvoice-slider-row">
                <label>
                    <span>Speed</span>
                    <span id="speed-value">${e.speed}</span>
                </label>
                <input type="range" id="sam-speed" min="20" max="255" value="${e.speed}">
            </div>

            <div class="samvoice-slider-row">
                <label>
                    <span>Mouth</span>
                    <span id="mouth-value">${e.mouth}</span>
                </label>
                <input type="range" id="sam-mouth" min="0" max="255" value="${e.mouth}">
            </div>

            <div class="samvoice-slider-row">
                <label>
                    <span>Throat</span>
                    <span id="throat-value">${e.throat}</span>
                </label>
                <input type="range" id="sam-throat" min="0" max="255" value="${e.throat}">
            </div>
        </details>
    `;
}
function $a(e) {
	no(e, "#sam-pitch", "#pitch-value"), no(e, "#sam-speed", "#speed-value"), no(e, "#sam-mouth", "#mouth-value"), no(e, "#sam-throat", "#throat-value"), e.find(".sam-preset").click(function() {
		let t = Za[this.dataset.preset];
		to(e, t);
	});
}
function eo(e) {
	return {
		pitch: Number(e.find("#sam-pitch").val()),
		speed: Number(e.find("#sam-speed").val()),
		mouth: Number(e.find("#sam-mouth").val()),
		throat: Number(e.find("#sam-throat").val())
	};
}
function to(e, t = {}) {
	let n = Number(t.pitch ?? 64), r = Number(t.speed ?? 72), i = Number(t.mouth ?? 128), a = Number(t.throat ?? 128);
	e.find("#sam-pitch").val(n), e.find("#sam-speed").val(r), e.find("#sam-mouth").val(i), e.find("#sam-throat").val(a), e.find("#pitch-value").text(n), e.find("#speed-value").text(r), e.find("#mouth-value").text(i), e.find("#throat-value").text(a);
}
function no(e, t, n) {
	e.find(t).on("input", function() {
		e.find(n).text(this.value);
	});
}
//#endregion
//#region scripts/ui/speakerPortraitPanel.js
function ro() {
	return game.modules.get("sam-speaker-portraits")?.api || window.SAMSpeakerPortraits || null;
}
function io() {
	let e = ro();
	if (!e?.getProfiles) return {};
	try {
		return e.getProfiles() || {};
	} catch (e) {
		return console.warn("SAM Voice: failed to read Speaker Portraits profiles", e), {};
	}
}
function ao(e = {}) {
	let t = io(), n = !!ro(), r = String(e.speakerPortraitProfileId || ""), i = String(e.speakerPortraitImageId || ""), a = e.speakerPortraitEnabled !== !1, o = mo(t, r, i);
	return `
        <details class="samvoice-speaker-link-panel ${n ? "" : "disabled"}" aria-label="Portrait link" open>
            <summary class="samvoice-speaker-link-summary">
                <span>Portrait</span>
                <small>${a ? "показывать при речи" : "не показывать при речи"}</small>
                <div class="samvoice-speaker-link-actions">
                    <button type="button" id="sam-speaker-portrait-refresh" class="samvoice-mini-icon-button" title="Refresh portrait profiles" ${n ? "" : "disabled"}>
                        <i class="fas fa-rotate"></i>
                    </button>
                    <button type="button" id="sam-speaker-portrait-preview" class="samvoice-mini-icon-button" title="Preview selected portrait" ${n ? "" : "disabled"}>
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" id="sam-speaker-portrait-hide" class="samvoice-mini-icon-button" title="Hide portrait" ${n ? "" : "disabled"}>
                        <i class="fas fa-eye-slash"></i>
                    </button>
                </div>
            </summary>

            <div class="samvoice-speaker-body">
                <label class="samvoice-speaker-toggle" title="Если выключено, выбранный портрет сохраняется, но не отправляется при озвучке.">
                    <input
                        type="checkbox"
                        id="sam-speaker-portrait-enabled"
                        ${a ? "checked" : ""}
                        ${n ? "" : "disabled"}
                    >
                    <span>Показывать портрет при речи</span>
                </label>

                <select id="sam-speaker-portrait-profile" ${n ? "" : "disabled"}>
                    ${fo(t, r)}
                </select>

                <input
                    type="hidden"
                    id="sam-speaker-portrait-image"
                    value="${G(o)}"
                >

                <div id="sam-speaker-portrait-grid" class="samvoice-speaker-thumb-grid">
                    ${po(t, r, o)}
                </div>

                <div id="sam-speaker-portrait-status" class="samvoice-speaker-link-status ${n ? "" : "offline"}">
                    ${n ? ho(t, r, o, a) : "Speaker Portraits module not active."}
                </div>
            </div>
        </details>
    `;
}
function oo(e) {
	let t = (t = null, n = null) => {
		let r = io(), i = t ?? String(e.find("#sam-speaker-portrait-profile").val() || ""), a = mo(r, i, n ?? String(e.find("#sam-speaker-portrait-image").val() || "")), o = !!e.find("#sam-speaker-portrait-enabled").prop("checked");
		e.find("#sam-speaker-portrait-image").val(a), e.find("#sam-speaker-portrait-grid").html(po(r, i, a)), e.find("#sam-speaker-portrait-status").text(ho(r, i, a, o)), go(e, o), uo(e);
	};
	e.find("#sam-speaker-portrait-profile").on("change", function() {
		t(String(this.value || ""), "");
	}), e.find("#sam-speaker-portrait-enabled").on("change", function() {
		let t = io(), n = String(e.find("#sam-speaker-portrait-profile").val() || ""), r = String(e.find("#sam-speaker-portrait-image").val() || ""), i = !!this.checked;
		e.find("#sam-speaker-portrait-status").text(ho(t, n, r, i)), go(e, i);
	}), e.find("#sam-speaker-portrait-refresh").on("click", (n) => {
		n.preventDefault(), n.stopPropagation();
		let r = io(), i = String(e.find("#sam-speaker-portrait-profile").val() || ""), a = String(e.find("#sam-speaker-portrait-image").val() || "");
		e.find("#sam-speaker-portrait-profile").html(fo(r, i)), t(i, a);
	}), e.find("#sam-speaker-portrait-preview").on("click", (t) => {
		t.preventDefault(), t.stopPropagation();
		let n = ro();
		if (!n?.previewImage) {
			ui.notifications.warn("Speaker Portraits preview API is not available.");
			return;
		}
		let r = so(e);
		if (!r.speakerPortraitProfileId || !r.speakerPortraitImageId) {
			ui.notifications.warn("Select a portrait and emotion first.");
			return;
		}
		n.previewImage(r.speakerPortraitProfileId, r.speakerPortraitImageId);
	}), e.find("#sam-speaker-portrait-hide").on("click", (e) => {
		e.preventDefault(), e.stopPropagation(), ro()?.hide?.();
	}), uo(e);
}
function so(e) {
	return {
		speakerPortraitEnabled: !!e.find("#sam-speaker-portrait-enabled").prop("checked"),
		speakerPortraitProfileId: String(e.find("#sam-speaker-portrait-profile").val() || ""),
		speakerPortraitImageId: String(e.find("#sam-speaker-portrait-image").val() || "")
	};
}
function co(e = {}) {
	return e.speakerPortraitEnabled === !1 ? {
		speakerPortraitEnabled: !1,
		speakerPortraitProfileId: "",
		speakerPortraitImageId: ""
	} : {
		speakerPortraitEnabled: !0,
		speakerPortraitProfileId: String(e.speakerPortraitProfileId || ""),
		speakerPortraitImageId: String(e.speakerPortraitImageId || "")
	};
}
function lo(e, t = {}) {
	let n = io(), r = String(t.speakerPortraitProfileId || ""), i = String(t.speakerPortraitImageId || ""), a = t.speakerPortraitEnabled !== !1, o = mo(n, r, i);
	e.find("#sam-speaker-portrait-enabled").prop("checked", a), e.find("#sam-speaker-portrait-profile").html(fo(n, r)), e.find("#sam-speaker-portrait-image").val(o), e.find("#sam-speaker-portrait-grid").html(po(n, r, o)), e.find("#sam-speaker-portrait-status").text(ho(n, r, o, a)), go(e, a), uo(e);
}
function uo(e) {
	e.find(".samvoice-speaker-thumb").off("click").on("click", function() {
		let t = String(this.dataset.imageId || "");
		e.find("#sam-speaker-portrait-image").val(t), e.find(".samvoice-speaker-thumb").removeClass("active"), this.classList.add("active");
		let n = io(), r = String(e.find("#sam-speaker-portrait-profile").val() || ""), i = !!e.find("#sam-speaker-portrait-enabled").prop("checked");
		e.find("#sam-speaker-portrait-status").text(ho(n, r, t, i));
	});
}
function fo(e, t = "") {
	return `
        <option value="">No portrait</option>
        ${Object.entries(e).sort((e, t) => String(e[1].name).localeCompare(String(t[1].name))).map(([e, n]) => `
            <option value="${G(e)}" ${e === t ? "selected" : ""}>${G(n.name)}</option>
        `).join("")}
    `;
}
function po(e, t = "", n = "") {
	let r = e?.[t], i = Array.isArray(r?.images) ? r.images : [];
	if (!i.length) return "<div class=\"samvoice-speaker-no-thumbs\">No emotions.</div>";
	let a = mo(e, t, n);
	return i.map((e) => {
		let t = e.label || "(unnamed)";
		return `
            <button
                type="button"
                class="samvoice-speaker-thumb ${e.id === a ? "active" : ""}"
                data-image-id="${G(e.id)}"
                title="${G(t)}"
            >
                ${e.path ? `
                    <img src="${G(e.path)}" alt="${G(t)}">
                ` : "\n                    <i class=\"fas fa-image\"></i>\n                "}
                <span>${G(t)}</span>
            </button>
        `;
	}).join("");
}
function mo(e, t = "", n = "") {
	let r = e?.[t], i = Array.isArray(r?.images) ? r.images : [], a = String(n || "");
	return i.some((e) => e.id === a) ? a : i.some((e) => e.id === r?.activeImageId) ? String(r.activeImageId) : String(i[0]?.id || "");
}
function ho(e, t = "", n = "", r = !0) {
	let i = Object.keys(e || {}).length;
	if (!i) return "No portrait profiles found.";
	if (!t || !e[t]) return `Profiles: ${i}`;
	let a = e[t], o = (Array.isArray(a.images) ? a.images : []).find((r) => r.id === mo(e, t, n)), s = o?.label || o?.path || "none", c = r ? "" : " · disabled for playback";
	return `${a.name}: ${s}${c}`;
}
function go(e, t) {
	let n = e.find(".samvoice-speaker-link-summary small");
	n.length && n.text(t ? "показывать при речи" : "не показывать при речи");
}
//#endregion
//#region scripts/ui/textPreview.js
function _o({ engine: e, text: t, piperVoice: n }) {
	return e === "sam" || e === "piper" && yo(n, t) ? et(t) : t;
}
function vo(e) {
	let t = e.find("#sam-engine").val(), n = e.find("#sam-text").val(), r = _o({
		engine: t,
		text: n,
		piperVoice: Ra(e.find("#sam-piper-voice").val())
	}), i = !!n && r !== n;
	e.find("#sam-translit-preview").toggle(i).text(r);
}
function yo(e, t) {
	return bo(t) ? String(e || "").startsWith("en_") : !1;
}
function bo(e) {
	return /[А-Яа-яЁё]/.test(e);
}
//#endregion
//#region scripts/ui/samVoiceController.js
var xo, So, Co, wo = () => !1, To = async () => [];
function Eo(e = {}) {
	xo = e.speakToEveryone, So = e.previewOnly, Co = e.stopEveryone, wo = e.isSocketReady || (() => !1), To = e.collectClientAudioStatuses || (async () => []);
}
function Do() {
	let e = oe(), t = Fe(), n = qe(), r = ue();
	return `
        <div class="samvoice-app" data-samvoice-app>
            <div class="samvoice-main-scroll">
                <div class="samvoice-topbar" aria-label="SAM Voice control header">
                    <div class="samvoice-profile-slot">
                    ${mi()}
                    </div>

                    <div class="samvoice-mode-strip" aria-label="Engine and playback mode">
                    <label class="samvoice-field-chip" for="sam-engine">
                        <span>Движок</span>
                        <select id="sam-engine">
                            <option value="sam" ${e.engine === "sam" ? "selected" : ""}>SAM</option>
                            <option value="piper" ${e.engine === "piper" ? "selected" : ""}>Piper</option>
                            <option value="silero" ${e.engine === "silero" ? "selected" : ""}>Silero</option>
                            <option value="qwen" ${e.engine === "qwen" ? "selected" : ""}>Qwen3-TTS</option>
                        </select>
                    </label>

                    <label class="samvoice-field-chip" for="sam-playback-mode">
                        <span>Режим</span>
                        <select id="sam-playback-mode" title="Как новая речь взаимодействует с уже играющим звуком.">
                            <option value="interrupt" ${r === "interrupt" ? "selected" : ""}>Interrupt</option>
                            <option value="queue" ${r === "queue" ? "selected" : ""}>Queue</option>
                            <option value="overlap" ${r === "overlap" ? "selected" : ""}>Overlap</option>
                        </select>
                    </label>
                    </div>
                </div>

                <div class="samvoice-workbench">
                <main class="samvoice-composer" aria-label="Speech composer">
                    <div class="samvoice-composer-head">
                        <div>
                            <strong>Текст реплики</strong>
                            <span>генерация, предпрослушивание и отправка игрокам</span>
                        </div>
                        <div class="samvoice-composer-meter" id="sam-text-counter">0</div>
                    </div>

                    <textarea
                        id="sam-text"
                        class="samvoice-textarea"
                        placeholder="Введите реплику для озвучки..."
                        title="Ctrl+Enter: всем, Alt+Enter: preview"
                        spellcheck="true"
                    ></textarea>

                    <div class="samvoice-preview-row">
                        <span class="samvoice-preview-label">Preview</span>
                        <div id="sam-translit-preview" class="samvoice-preview">Translit в одну строку...</div>
                    </div>

                    <div class="samvoice-action-dock" aria-label="Playback actions">
                        <button type="button" id="sam-stop-audio" class="samvoice-button samvoice-button-danger samvoice-action-stop">
                            <i class="fas fa-square"></i>
                            <span>Стоп</span>
                        </button>

                        <button type="button" id="sam-preview-only" class="samvoice-button samvoice-button-secondary samvoice-action-preview">
                            <i class="fas fa-headphones"></i>
                            <span>Preview</span>
                        </button>

                        <button type="button" id="sam-play-everyone" class="samvoice-button samvoice-button-primary samvoice-action-play">
                            <i class="fas fa-play"></i>
                            <span>Play for All</span>
                        </button>
                    </div>
                </main>

                <aside class="samvoice-inspector" aria-label="Speaker and quick engine controls">
                    ${ao(e)}

                    <div class="samvoice-engine-drawer">
                        ${Ma(e)}
                        ${samRenderSilero(e)}
                        ${samRenderQwen(e)}
                        ${Qa(n)}
                    </div>
                </aside>
                </div>

                <section class="samvoice-lower-grid" aria-label="Secondary voice controls">
                    ${Ti(t)}
                    ${ra()}
                </section>
            </div>

            ${Ba()}
        </div>
    `;
}
function Oo(e) {
	let t = Zr(e);
	Va(t, No(t)), hi(t, {
		getProfileData: () => ko(t),
		applyProfile: (e) => Ao(t, e)
	}), Ei(t), oo(t), Na(t, jo(t)), samBindSilero(t, jo(t)), samBindQwen(t, jo(t)), $a(t), ia(t, Mo(t)), t.find("#sam-text").on("input", function() {
		vo(t), Bo(t);
	}).on("keydown", function(e) {
		if (e.key === "Enter") {
			if (e.altKey) {
				e.preventDefault(), t.find("#sam-preview-only").first?.click?.();
				return;
			}
			(e.ctrlKey || e.metaKey) && (e.preventDefault(), t.find("#sam-play-everyone").first?.click?.());
		}
	}), t.find("#sam-engine").on("change", function() {
		Uo(t), vo(t), Bo(t), t.find("#sam-engine").val() === "piper" && Fa(t, jo(t)), t.find("#sam-engine").val() === "silero" && samCheckSilero(t, jo(t)), t.find("#sam-engine").val() === "qwen" && samCheckQwen(t, jo(t)), Y(t, No(t));
	}), t.find("#sam-playback-mode").on("change", async function() {
		await de(this.value);
	}), t.find("#sam-stop-audio").off("click").on("click", async () => {
		si(), Ho(t, !1), typeof Co == "function" && await Co();
	}), t.find("#sam-preview-only").off("click").on("click", async () => {
		if (!di()) {
			Ho(t, !0, "Generating...");
			try {
				let e = await Fo(t, { saveToHistory: !1 });
				if (!e) return;
				Vo(await So(e), "Preview failed.");
			} catch (e) {
				console.error(e), ui.notifications.error(e?.message || "Preview failed.");
			} finally {
				Ho(t, !1);
			}
		}
	}), t.find("#sam-play-everyone").off("click").on("click", async () => {
		if (!wo()) {
			ui.notifications.error("SAM Voice socket is not ready yet.");
			return;
		}
		if (!di()) {
			Ho(t, !0, "Generating...");
			try {
				let e = await Fo(t, { saveToHistory: !0 });
				if (!e) return;
				Vo(await xo(e), "Shared playback failed."), aa(t, Mo(t));
			} catch (e) {
				console.error(e), ui.notifications.error(e?.message || "Shared playback failed.");
			} finally {
				Ho(t, !1);
			}
		}
	}), Uo(t), vo(t), Bo(t), Ho(t, !1), t.find("#sam-engine").val() === "piper" && Fa(t, jo(t)), t.find("#sam-engine").val() === "silero" && samCheckSilero(t, jo(t)), t.find("#sam-engine").val() === "qwen" && samCheckQwen(t, jo(t));
}
function ko(e) {
	let t = Ia(e);
	return {
		engine: e.find("#sam-engine").val(),
		piperServerUrl: t.piperServerUrl,
		piperVoice: t.piperVoice,
		...samReadSilero(e),
		...samReadQwen(e),
		...so(e),
		samVoiceSettings: eo(e),
		effects: q(e)
	};
}
function Ao(e, t) {
	e.find("#sam-engine").val(t.engine || "sam"), La(e, {
		piperServerUrl: t.piperServerUrl,
		piperVoice: t.piperVoice
	}), samApplySilero(e, t), samApplyQwen(e, t), lo(e, t), Di(e, t.effects), to(e, t.samVoiceSettings), Uo(e), vo(e), e.find("#sam-engine").val() === "piper" && Fa(e, jo(e)), e.find("#sam-engine").val() === "silero" && samCheckSilero(e, jo(e)), e.find("#sam-engine").val() === "qwen" && samCheckQwen(e, jo(e)), Y(e, No(e)), ui.notifications.info(`Applied voice profile: ${t.name}`);
}
function jo(e) {
	return {
		updateTextPreview: () => vo(e),
		refreshSessionReady: () => Y(e, No(e))
	};
}
function Mo(e) {
	return { onSelectPhrase: (t) => {
		e.find("#sam-text").val(t), vo(e), Bo(e);
	} };
}
function No(e) {
	return {
		isSocketReady: () => !!(xo && Co && wo()),
		collectClientAudioStatuses: To,
		testEveryone: async () => {
			let t = await Po(e);
			if (!t) return;
			let n = await xo(t);
			return Vo(n, "Session test failed."), n;
		}
	};
}
async function Po(e) {
	let t = e.find("#sam-engine").val(), n = Ia(e).piperVoice || "";
	return await Io(e, t === "silero" || t === "qwen" || t === "piper" && !n.startsWith("en_") ? "Тест голоса" : "Voice test", {
		saveToHistory: !1,
		notification: "Generating test voice..."
	});
}
async function Fo(e, t = {}) {
	let n = e.find("#sam-text").val().trim();
	return n.length ? await Io(e, n, t) : null;
}
async function Io(e, t, n = {}) {
    let engine = e.find("#sam-engine").val(), effects = q(e);
    let piper = Ia(e), silero = samReadSilero(e), qwen = samReadQwen(e);
    let portrait = so(e), portraitSettings = co(portrait), playbackMode = zo(e), profile = Ro(e);
    await de(playbackMode);
    await ce({
        engine, piperServerUrl: piper.piperServerUrl, piperVoice: piper.piperVoice,
        sileroServerUrl: silero.sileroServerUrl, sileroVoice: silero.sileroVoice,
        qwenServerUrl: qwen.qwenServerUrl, qwenVoice: qwen.qwenVoice,
        qwenInstructions: qwen.qwenInstructions, ...portrait
    });
    await ze(effects);
    if (n.saveToHistory) await Ze(t);
    if (engine === "piper" || engine === "silero" || engine === "qwen") {
        let speechText = engine === "piper" ? _o({ engine, text: t, piperVoice: piper.piperVoice }) : t;
        let label = engine === "qwen" ? "Qwen" : engine === "silero" ? "Silero" : "Piper";
        return await Lo({
            notification: n.notification || `Generating ${label} voice...`,
            cancelLog: `SAM Voice: ${label} generation cancelled.`,
            errorFallback: `${label} generation failed. Check local TTS server.`,
            originalText: t, playbackMode, speakerPortraitPlaybackSettings: portraitSettings,
            profileLink: profile,
            generateFn: (signal) => engine === "qwen"
                ? samQwenGenerate({ text: speechText, ...qwen, effects, signal })
                : engine === "silero"
                ? samGenerateSilero({ text: speechText, ...silero, effects, signal })
                : Pa({ text: speechText, ...piper, effects, signal })
        });
    }
    let sam = eo(e);
    await Je(sam);
    return { engine: "sam", text: et(t), effects, playbackMode, ...sam, ...portraitSettings, ...profile };
}
async function Lo({ notification: e, cancelLog: t, errorFallback: n, originalText: r, playbackMode: i, speakerPortraitPlaybackSettings: a, profileLink: o, generateFn: s }) {
	ui.notifications.info(e);
	let c = oi();
	try {
		let e = await s(c.signal);
		return ci(c.token) ? {
			...e,
			originalText: r,
			playbackMode: i,
			...a,
			...o
		} : null;
	} catch (e) {
		return fi(e) ? (console.info(t), null) : (console.error(e), ui.notifications.error(e?.message || n), null);
	} finally {
		li(c.token);
	}
}
function Ro(e) {
	let t = e.find("#sam-voice-profile-select").first, n = String(t?.value || ""), r = String(t?.selectedOptions?.[0]?.textContent || "").trim();
	return {
		profileId: n,
		profileName: n ? r : ""
	};
}
function zo(e) {
	let t = e.find("#sam-playback-mode").val();
	return n.includes(t) ? t : "interrupt";
}
function Bo(e) {
	let t = String(e.find("#sam-text").val() || ""), n = e.find("#sam-engine").val(), i = n === "sam" ? et(t) : t, a = n === "sam" ? 800 : r, o = e.find("#sam-text-counter");
	o.length && (o.text(`${i.length}/${a}`), o.toggleClass("samvoice-count-warn", i.length > a * .8), o.toggleClass("samvoice-count-danger", i.length > a), o.first?.setAttribute?.("title", n === "sam" ? "После транслитерации" : "Лимит текста движка"));
}
function Vo(e, t) {
	if (!e || e.ok !== !1) return;
	let n = Array.isArray(e.failures) ? e.failures : [e.local || e], r = n.find(Boolean)?.error?.message || t, i = n.filter(Boolean).length;
	ui.notifications.warn(i > 1 ? `${r} (${i} failures)` : r);
}
function Ho(e, t, n = "Generating...") {
	let r = e.find("#sam-stop-audio"), i = e.find("#sam-preview-only"), a = e.find("#sam-play-everyone");
	r.prop("disabled", !1), i.prop("disabled", t), a.prop("disabled", t || !wo()), i.find("span").text(t ? n : "Preview"), a.find("span").text(t ? n : "Play for All");
}
function Uo(e) {
	let t = e.find("#sam-engine").val(), n = t === "piper", r = t === "sam", silero = t === "silero", qwen = t === "qwen";
	e.find("#sam-qwen-engine-details").toggle(qwen), e.find("#sam-qwen-settings").toggle(qwen), e.find("#sam-qwen-voice-row").toggle(qwen), e.find("#sam-qwen-status").toggle(qwen), e.find(".samvoice-qwen-instructions-row").toggle(qwen);
	e.find("#sam-silero-engine-details").toggle(silero), e.find("#sam-silero-settings").toggle(silero), e.find("#sam-silero-voice-row").toggle(silero), e.find("#sam-silero-status").toggle(silero);
	e.find("#sam-piper-engine-details").toggle(n), e.find("#sam-piper-settings").toggle(n), e.find("#sam-piper-voice-row").toggle(n), e.find("#sam-piper-status").toggle(n), e.find("#sam-presets-details").toggle(r), e.find("#sam-voice-settings-details").toggle(r);
}
//#endregion
//#region scripts/ui/SamVoiceApp.js
var Wo = foundry?.applications?.api?.ApplicationV2, Go = class extends Wo {
	static DEFAULT_OPTIONS = {
		id: "sam-voice-dialog",
		classes: ["samvoice-window", "samvoice-window-v2"],
		window: {
			title: "SAM Voice",
			resizable: !0
		},
		position: {
			width: 820,
			height: 660
		}
	};
	async _renderHTML(e, t) {
		return Do();
	}
	_replaceHTML(e, t, n) {
		t.innerHTML = e;
	}
	async _onRender(e, t) {
		await super._onRender(e, t), Jo(this.element), Oo(this.element);
	}
	async _onClose(e) {
		Z = null, await super._onClose(e);
	}
}, Z = null;
function Ko() {
	return !!Wo;
}
function qo() {
	if (!Ko()) throw Error("ApplicationV2 is not available in this Foundry version.");
	return Z?.rendered ? (Z.bringToFront?.(), Z) : (Z = new Go(), Z.render(!0), Z);
}
function Jo(e) {
	let t = e?.querySelector?.(".window-header");
	if (!t || t.querySelector(".samvoice-header-actions")) return;
	let n = Yo(t), r = document.createElement("div");
	r.className = "samvoice-header-actions", r.innerHTML = "\n        <button type=\"button\" id=\"sam-session-unlock\" class=\"samvoice-header-icon-button\" title=\"Разблокировать звук\">\n            <i class=\"fas fa-volume-up\" aria-hidden=\"true\"></i>\n            <span>Unlock</span>\n        </button>\n        <button type=\"button\" id=\"sam-session-refresh\" class=\"samvoice-header-icon-button\" title=\"Обновить диагностику\">\n            <i class=\"fas fa-sync-alt\" aria-hidden=\"true\"></i>\n            <span>Refresh</span>\n        </button>\n        <button type=\"button\" id=\"sam-session-test-everyone\" class=\"samvoice-header-icon-button\" title=\"Проверить звук у всех\">\n            <i class=\"fas fa-flask\" aria-hidden=\"true\"></i>\n            <span>Test</span>\n        </button>\n    ", n ? t.insertBefore(r, n) : t.append(r);
}
function Yo(e) {
	return e.querySelector(".close, [data-action='close'], .header-control:last-child");
}
//#endregion
//#region scripts/ui/dialog.js
var Xo = !1, Zo = null;
function Qo(e = Zo) {
	if (!game.user?.isGM) return;
	e && (Zo = e, Eo(e));
	let t = document.querySelector("#chat-controls");
	if (!t || document.querySelector("#samvoice-open")) return;
	let n = t.querySelector(".control-buttons") || t, r = document.createElement("button");
	r.type = "button", r.id = "samvoice-open", r.classList.add("ui-control"), r.title = "SAM Voice", r.setAttribute("aria-label", "Открыть SAM Voice"), r.innerHTML = "<i class=\"fas fa-robot\" aria-hidden=\"true\"></i>", r.addEventListener("click", () => {
		try {
			qo();
		} catch (e) {
			console.error(e), ui.notifications.error(e?.message || "SAM Voice ApplicationV2 failed to open.");
		}
	}), n.prepend(r);
}
function $o(e) {
	if (Zo = e, !(Xo || !game.user?.isGM)) {
		Xo = !0;
		for (let e of [
			"renderChatLog",
			"renderSidebarTab",
			"changeSidebarTab"
		]) Hooks.on(e, () => Qo(Zo));
	}
}
//#endregion
//#region scripts/samvoice.js
var Q = null, es = !1, $ = new Gr({
	getSocket: () => Q,
	isSocketReady: () => es && !!Q
});
Hooks.once("init", () => {
	te();
}), Hooks.once("socketlib.ready", () => {
	Q = socketlib.registerModule(e), Q.register("playVoice", Dr), Q.register("stopAllAudio", jr), Q.register("getClientAudioStatus", Or), Q.register("unlockAudioContext", Er), es = !0, console.info("SAM Voice: socketlib registered.");
}), Hooks.once("ready", async () => {
	wr();
	try {
		await je();
	} catch (e) {
		console.error("SAM Voice: settings migration failed", e), ui.notifications.error("SAM Voice settings migration failed. Check the console.");
	}
	is();
	let e = ts();
	Qo(e), $o(e);
}), Hooks.on("chatMessage", (e, t) => {
	if (!t.startsWith("/sam ")) return;
	if (!game.user.isGM) return !1;
	let n = t.replace("/sam ", "").trim();
	return n.length && ns(n), !1;
});
function ts() {
	return {
		isSocketReady: () => es && !!Q,
		speakToEveryone: (e) => $.speak(e),
		previewOnly: (e) => $.preview(e),
		stopEveryone: (e) => $.stop(e),
		collectClientAudioStatuses: () => $.collectClientAudioStatuses()
	};
}
async function ns(e) {
	try {
		let t = rs(e);
		os(await $.speak(t));
	} catch (e) {
		console.error(e), ui.notifications.error(e?.message || "SAM Voice playback failed.");
	}
}
function rs(e) {
	return {
		engine: "sam",
		text: et(String(e || "")),
		originalText: String(e || ""),
		effects: Fe(),
		playbackMode: ue(),
		profileId: "",
		profileName: "",
		...qe()
	};
}
function is() {
	let t = game.modules.get(e);
	if (!t) return;
	let n = {
		open: (e = {}) => qo(e),
		speak: async (e) => $.speak(as(e)),
		preview: async (e) => $.preview(as(e)),
		stop: async (e = {}) => $.stop(e),
		resetAudio: async () => Mr(),
		getStatus: () => $.getStatus(),
		getClientStatuses: () => $.collectClientAudioStatuses(),
		registerEngine: (e, t) => nt(e, t)
	};
	t.api = {
		v2: n,
		open: n.open,
		stop: n.stop,
		getAudioStatus: () => Or(),
		play: n.speak,
		preview: n.preview
	};
}
function as(e) {
	if (!game.user?.isGM) throw Error("SAM Voice shared API is GM-only.");
	return typeof e == "string" ? rs(e) : e;
}
function os(e) {
	if (!e?.failures?.length) return;
	let t = e.failures[0]?.error?.message || "A client failed to start SAM Voice playback.";
	ui.notifications.warn(e.failures.length > 1 ? `${t} (${e.failures.length} failures)` : t);
}
//#endregion
