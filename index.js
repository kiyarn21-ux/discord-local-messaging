(function(U, r, L, q, f, g, be) {
    "use strict";
    const X = "Messaging.localMessages.v1"
      , A = "Messaging.settings.v1"
      , T = "Messaging.persistedMessagesJSON.v1"
      , D = "__messagingLocal"
      , B = Y("ChannelStore")
      , ye = pe()
      , O = Ie();
    Y("ReadStateStore");
    let u = {
        byChannelId: {}
    }
      , E = null
      , _ = null
      , P = BigInt(Math.floor(Math.random() * 4096))
      , x = null;
    function Y(e) {
        try {
            return L.findByStoreName(e)
        } catch {
            return null
        }
    }
    function pe() {
        try {
            return L.findByProps("getUser", "getCurrentUser")
        } catch {
            return null
        }
    }
    function Ie() {
        try {
            return L.findByProps("getMessages", "getMessage")
        } catch {
            return null
        }
    }
    function d(...e) {
        try {
            console.error("[Messaging]", ...e)
        } catch {}
    }
    function R(...e) {
        try {
            console.warn("[Messaging]", ...e)
        } catch {}
    }
    function Q(e) {
        if (!Array.isArray(e))
            return [];
        const t = [];
        for (const n of e) {
            if (!n || typeof n != "object")
                continue;
            const i = `${n.id ?? ""}`.trim()
              , a = `${n.channelId ?? n.channel_id ?? ""}`.trim()
              , o = `${n.userId ?? n.user_id ?? ""}`.trim();
            !i || !a || !o || t.push({
                id: i,
                channelId: a,
                text: typeof n.text == "string" ? n.text : typeof n.content == "string" ? n.content : void 0,
                embedTitle: typeof n.embedTitle == "string" ? n.embedTitle : typeof n.embed?.title == "string" ? n.embed.title : void 0,
                embedDescription: typeof n.embedDescription == "string" ? n.embedDescription : typeof n.embed?.description == "string" ? n.embed.description : void 0,
                embedThumbnail: typeof n.embedThumbnail == "string" ? n.embedThumbnail : typeof n.embed?.thumbnail?.url == "string" ? n.embed.thumbnail.url : void 0,
                embedImage: typeof n.embedImage == "string" ? n.embedImage : typeof n.embed?.image?.url == "string" ? n.embed.image.url : void 0,
                userId: o,
                timestamp: Te(n.timestamp),
                avatarDecoration: typeof n.avatarDecoration == "string" ? n.avatarDecoration : void 0
            })
        }
        return t
    }
    function Te(e) {
        if (typeof e == "number" && Number.isFinite(e))
            return e;
        if (typeof e == "string") {
            const t = Date.parse(e);
            if (Number.isFinite(t))
                return t
        }
        return e instanceof Date && Number.isFinite(e.getTime()) ? e.getTime() : Date.now()
    }
    function Ee() {
        try {
            const e = f.storage[T];
            if (typeof e == "string") {
                const t = JSON.parse(e)
                  , n = Q(t);
                return Array.isArray(t) || (f.storage[T] = "[]"),
                n
            }
            if (e === void 0)
                return f.storage[T] = "[]",
                [];
            if (Array.isArray(e) || e && typeof e == "object") {
                const t = Q(e);
                return f.storage[T] = JSON.stringify(t),
                t
            }
            return f.storage[T] = "[]",
            []
        } catch (e) {
            return d("Failed to parse stored messages", e),
            f.storage[T] = "[]",
            []
        }
    }
    function j() {
        return x || (x = Ee()),
        x
    }
    function z() {
        return j().slice()
    }
    function V(e) {
        try {
            const t = e.slice();
            f.storage[T] = JSON.stringify(t),
            x = t
        } catch (t) {
            d("Failed to save stored messages", t)
        }
    }
    function Se(e) {
        const t = j().filter(function(n) {
            return n.id !== e.id
        }).concat(e);
        t.sort(function(n, i) {
            return n.timestamp - i.timestamp
        }),
        V(t)
    }
    function Z(e) {
        if (!e)
            return;
        const t = j()
          , n = t.filter(function(i) {
            return i.id !== e
        });
        n.length !== t.length && V(n)
    }
    function Ce() {
        V([])
    }
    function Ae() {
        try {
            const e = f.storage[X]
              , t = {};
            if (e && typeof e == "object" && e.byChannelId && typeof e.byChannelId == "object")
                for (const [n,i] of Object.entries(e.byChannelId)) {
                    if (typeof n != "string" || !Array.isArray(i))
                        continue;
                    const a = i.map(function(o) {
                        return ee(o, n)
                    }).filter(Boolean);
                    a.length && (a.sort(function(o, l) {
                        return new Date(o.timestamp).getTime() - new Date(l.timestamp).getTime()
                    }),
                    t[n] = a.slice(-200))
                }
            u = {
                byChannelId: t
            }
        } catch (e) {
            d("Failed to load cache", e),
            u = {
                byChannelId: {}
            }
        }
    }
    function G() {
        try {
            f.storage[X] = u
        } catch (e) {
            d("Failed to save cache", e)
        }
    }
    function ee(e, t) {
        if (!e || typeof e != "object")
            return null;
        const n = `${e.channel_id ?? e.channelId ?? t ?? ""}`.trim();
        if (!n)
            return null;
        const i = `${e.content ?? ""}`;
        if (!i.trim())
            return null;
        const a = te(e.timestamp)
          , o = `${e.id ?? ""}`.trim() || ie()
          , l = ne(e.author ?? {}, e.author?.id ?? e.user_id ?? e.userId ?? e.senderId ?? "0");
        return {
            id: o,
            type: typeof e.type == "number" ? e.type : 0,
            channel_id: n,
            guild_id: e.guild_id ?? e.guildId ?? null,
            content: i,
            author: l,
            timestamp: a,
            embeds: Array.isArray(e.embeds) ? e.embeds : [],
            edited_timestamp: e.edited_timestamp ?? null,
            mentions: Array.isArray(e.mentions) ? e.mentions : [],
            mention_roles: Array.isArray(e.mention_roles) ? e.mention_roles : [],
            mention_everyone: Boolean(e.mention_everyone),
            mention_channels: Array.isArray(e.mention_channels) ? e.mention_channels : [],
            pinned: Boolean(e.pinned),
            attachments: Array.isArray(e.attachments) ? e.attachments : [],
            reactions: Array.isArray(e.reactions) ? e.reactions : [],
            sticker_items: Array.isArray(e.sticker_items) ? e.sticker_items : [],
            components: Array.isArray(e.components) ? e.components : [],
            flags: typeof e.flags == "number" ? e.flags : 0,
            state: e.state ?? "SENT",
            nonce: `${e.nonce ?? `local-${o}`}`,
            [D]: !0
        }
    }
    function te(e) {
        if (typeof e == "string") {
            const t = Date.parse(e);
            if (Number.isFinite(t))
                return new Date(t).toISOString()
        }
        return typeof e == "number" && Number.isFinite(e) ? new Date(e).toISOString() : e instanceof Date && Number.isFinite(e.getTime()) ? e.toISOString() : new Date().toISOString()
    }
    function De(e) {
        if (!e)
            return [];
        if (Array.isArray(e._array))
            return e._array.slice();
        if (typeof e.toArray == "function") {
            const t = e.toArray();
            return Array.isArray(t) ? t.slice() : []
        }
        return Array.isArray(e) ? e.slice() : []
    }
    function _e(e, t) {
        if (e?.clone) {
            const n = e.clone();
            if (n && typeof n == "object")
                return n._array = t,
                typeof n.toArray == "function" && (n.toArray = function() {
                    return t
                }
                ),
                n
        }
        return {
            ...e,
            _array: t,
            toArray: function() {
                return t
            }
        }
    }
    function Re(e, t) {
        if (!t.length)
            return e;
        const n = new Map;
        for (const a of e)
            a?.id && n.set(a.id, a);
        for (const a of t)
            n.set(a.id, a);
        const i = Array.from(n.values());
        return i.sort(function(a, o) {
            const l = new Date(a?.timestamp ?? 0).getTime()
              , p = new Date(o?.timestamp ?? 0).getTime();
            return l - p
        }),
        i
    }
    function ne(e, t) {
        const n = `${e?.id ?? t ?? ""}`.trim() || "0"
          , i = `${e?.username ?? e?.global_name ?? e?.display_name ?? t ?? "Unknown User"}`.trim() || "Unknown User"
          , a = e?.global_name ?? e?.globalName ?? e?.display_name ?? e?.displayName ?? null
          , o = ve(e?.discriminator);
        return {
            id: n,
            username: i,
            global_name: a,
            display_name: a,
            discriminator: o,
            avatar: e?.avatar ?? null,
            bot: Boolean(e?.bot),
            public_flags: Number(e?.public_flags ?? e?.publicFlags ?? 0)
        }
    }
    function ve(e) {
        if (e == null)
            return "0";
        const t = `${e}`.replace(/\D/g, "");
        return t ? t.length <= 4 ? t.padStart(4, "0") : t.slice(-4) : "0"
    }
    function ie() {
        try {
            const e = 1420070400000n
              , t = BigInt(Date.now()) - e << 22n;
            return P = P + 1n & 0xfffn,
            (t | P).toString()
        } catch {
            return `${Date.now()}${Math.floor(Math.random() * 1e3)}`
        }
    }
    function we(e) {
        return u.byChannelId[e] || (u.byChannelId[e] = []),
        u.byChannelId[e]
    }
    function W(e) {
        const t = we(e.channel_id)
          , n = t.findIndex(function(i) {
            return i.id === e.id
        });
        n !== -1 && t.splice(n, 1),
        t.push(e),
        t.sort(function(i, a) {
            return new Date(i.timestamp).getTime() - new Date(a.timestamp).getTime()
        }),
        t.length > 200 && t.splice(0, t.length - 200),
        G(),
        setTimeout(function() {
            K(e.channel_id, e.id)
        }, 100)
    }
    function M(e, t) {
        const n = u.byChannelId[e];
        if (!Array.isArray(n))
            return;
        const i = n.findIndex(function(a) {
            return a.id === t
        });
        i !== -1 && (n.splice(i, 1),
        n.length || delete u.byChannelId[e],
        G(),
        Z(t))
    }
    function xe() {
        const e = u.byChannelId;
        u = {
            byChannelId: {}
        },
        G(),
        Ce();
        try {
            for (const [t,n] of Object.entries(e))
                if (!(!Array.isArray(n) || !n.length))
                    for (const i of n)
                        r.FluxDispatcher?.dispatch?.({
                            type: "MESSAGE_DELETE",
                            channelId: t,
                            id: i.id,
                            message: i
                        })
        } catch (t) {
            d("Failed to notify message deletions during clearAllMessages", t)
        }
    }
    function H(e) {
        return e ? e.match(/https?:\/\/\S+/)?.[0] ?? null : null
    }
    function Me(e) {
        try {
            const t = e;
            t.suppressNotifications = !0,
            t.suppressPushNotification = !0,
            t.isLocalRelay = !0,
            t.localOnly = !0,
            t.fromBot = !0,
            t.alreadyRead = !0,
            t.mentioned = !1
        } catch (t) {
            R("Failed to apply local delivery guards", t)
        }
    }
    function K(e, t) {
        try {
            r.FluxDispatcher?.dispatch?.({
                type: "CHANNEL_ACK",
                channelId: e,
                messageId: t,
                immediate: !0,
                local: !0
            })
        } catch (n) {
            R("Failed to ACK local message", n)
        }
    }
    function ae() {
        try {
            for (const [e,t] of Object.entries(u.byChannelId)) {
                if (!Array.isArray(t) || t.length === 0)
                    continue;
                const n = t[t.length - 1];
                n && K(e, n.id)
            }
        } catch (e) {
            R("Failed to ACK all local messages", e)
        }
    }
    function ke(e) {
        if (typeof e != "string")
            return;
        const t = e.trim();
        if (t && /^https?:\/\//i.test(t))
            return t
    }
    function Fe() {
        try {
            return f.storage[A]?.showEmbed === !0
        } catch {
            return !1
        }
    }
    function re(e) {
        const t = `${e.channelId ?? ""}`.trim()
          , n = `${e.userId ?? ""}`.trim()
          , i = e.id?.trim() || ie()
          , a = `${e.content ?? ""}`.trim()
          , o = te(e.timestamp ?? Date.now())
          , l = e.guildId ?? B?.getChannel?.(t)?.guild_id ?? null
          , p = n ? ye?.getUser?.(n) ?? {} : {}
          , $ = ne(p, n);
        e.avatarDecoration && ($.avatarDecoration = e.avatarDecoration);
        const s = {
            id: i,
            type: 0,
            channel_id: t,
            guild_id: l,
            content: a,
            author: $,
            timestamp: o,
            embeds: [],
            edited_timestamp: null,
            mentions: [],
            mention_roles: [],
            mention_everyone: !1,
            mention_channels: [],
            pinned: !1,
            attachments: [],
            reactions: [],
            sticker_items: [],
            components: [],
            flags: 0,
            state: "SENT",
            nonce: `local-${i}`,
            [D]: !0
        };
        Me(s);
        const m = e.embedImage?.trim()
          , C = H(a);
        if (Boolean(e.embedTitle || e.embedDescription || e.embedThumbnail)) {
            const b = Ue({
                title: e.embedTitle,
                description: e.embedDescription,
                thumbnail: e.embedThumbnail || m,
                image: void 0,
                fallbackUrl: C
            });
            b && (s.embeds = [b])
        } else if (e.detectLinks !== !1 && C && (!s.embeds || s.embeds.length === 0))
            try {
                s.embeds = [Ne(C)]
            } catch (b) {
                d("Failed to build link embed", b)
            }
        return oe(s, m, C),
        s
    }
    function $e(e) {
        const t = B?.getChannel?.(e.channelId);
        return t ? re({
            channelId: e.channelId,
            userId: e.userId,
            content: e.content,
            guildId: t.guild_id ?? null,
            embedTitle: e.embedTitle,
            embedDescription: e.embedDescription,
            embedThumbnail: e.embedThumbnail,
            embedImage: e.embedImage,
            detectLinks: e.detectLinks
        }) : (R("Invalid channel", e.channelId),
        null)
    }
    function Ne(e) {
        let t = "";
        try {
            t = new URL(e).hostname
        } catch {
            t = ""
        }
        return {
            type: "link",
            url: e,
            title: t || e,
            description: e
        }
    }
    function Ue(e) {
        const {title: t, description: n, thumbnail: i, image: a, fallbackUrl: o} = e;
        if (!t && !n && !i && !a && !o)
            return null;
        const l = {
            type: "link"
        };
        return o && (l.url = o),
        t && (l.title = t),
        n && (l.description = n),
        i && (l.thumbnail = {
            url: i
        }),
        a && (l.image = {
            url: a
        }),
        l
    }
    function oe(e, t, n) {
        const i = ke(t);
        if (!i)
            return;
        Array.isArray(e.embeds) || (e.embeds = []),
        (!e.embeds.length || !e.embeds[0] || typeof e.embeds[0] != "object") && (e.embeds[0] = {
            type: "rich"
        });
        const a = e.embeds[0];
        a.type || (a.type = "rich"),
        n && !a.url && (a.url = n),
        a.image && delete a.image,
        a.thumbnail = {
            url: i,
            proxy_url: i,
            width: 80,
            height: 80
        }
    }
    function Le(e) {
        return !e || typeof e != "object" ? null : e.message ?? e.notification?.message ?? e.notification ?? e.data?.message ?? e.payload?.message ?? null
    }
    function se(e) {
        return Boolean(e && typeof e == "object" && e[D])
    }
    function Be(e) {
        if (!e || typeof e != "object")
            return !1;
        const t = typeof e.type == "string" ? e.type : "";
        if (!(t.includes("PUSH_NOTIFICATION") || t.includes("PUSH_NOTIFICATIONS") || e.isPushNotification === !0 || e.notification || Array.isArray(e.notifications)))
            return !1;
        let n = !1
          , i = !1;
        if (Array.isArray(e.notifications)) {
            const o = e.notifications.filter(function(l) {
                const p = l?.message ?? l;
                return !se(p)
            });
            n = n || o.length !== e.notifications.length,
            o.length === 0 ? (i = !0,
            delete e.notifications) : e.notifications = o
        }
        const a = Le(e);
        return se(a) && (n = !0,
        i = i || !e.notifications || e.notifications.length === 0,
        delete e.notification,
        "message"in e && delete e.message,
        "isPushNotification"in e && (e.isPushNotification = !1)),
        n && i
    }
    function Oe(e) {
        const t = Array.isArray(e.embeds) ? e.embeds[0] : null
          , n = typeof t?.thumbnail?.url == "string" ? t.thumbnail.url : typeof t?.thumbnail?.proxy_url == "string" ? t.thumbnail.proxy_url : void 0
          , i = typeof t?.image?.url == "string" ? t.image.url : typeof t?.image?.proxy_url == "string" ? t.image.proxy_url : void 0
          , a = Date.parse(e.timestamp ?? "");
        return {
            id: e.id,
            channelId: e.channel_id,
            text: e.content,
            embedTitle: typeof t?.title == "string" ? t.title : void 0,
            embedDescription: typeof t?.description == "string" ? t.description : void 0,
            embedThumbnail: n,
            embedImage: i,
            userId: e.author?.id ?? "0",
            timestamp: Number.isFinite(a) ? a : Date.now(),
            avatarDecoration: e.author?.avatarDecoration
        }
    }
    function ce(e) {
        Se(Oe(e))
    }
    function Pe(e) {
        const t = `${e.channelId ?? ""}`.trim()
          , n = `${e.userId ?? ""}`.trim();
        if (!t || !n)
            return null;
        const i = Fe();
        return re({
            channelId: t,
            userId: n,
            content: `${e.text ?? ""}`,
            guildId: B?.getChannel?.(t)?.guild_id ?? null,
            timestamp: e.timestamp,
            id: e.id,
            embedTitle: i ? e.embedTitle : void 0,
            embedDescription: i ? e.embedDescription : void 0,
            embedThumbnail: i ? e.embedThumbnail : void 0,
            embedImage: i ? e.embedImage : void 0,
            avatarDecoration: e.avatarDecoration,
            detectLinks: i && !(e.embedTitle || e.embedDescription || e.embedThumbnail || e.embedImage)
        })
    }
    function le(e) {
        if (!e || !e.includes("&"))
            return e;
        const t = {
            amp: "&",
            lt: "<",
            gt: ">",
            quot: '"',
            apos: "'",
            nbsp: " "
        };
        return e.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, function(n, i) {
            const a = i.toLowerCase();
            if (a.startsWith("#x")) {
                const o = Number.parseInt(a.slice(2), 16);
                return Number.isFinite(o) ? String.fromCodePoint(o) : n
            }
            if (a.startsWith("#")) {
                const o = Number.parseInt(a.slice(1), 10);
                return Number.isFinite(o) ? String.fromCodePoint(o) : n
            }
            return t[a] ?? n
        })
    }
    function k(e, t) {
        for (const n of t) {
            const i = new RegExp(`<meta[^>]+?(?:property|name)=["']${n}["'][^>]*>`,"i")
              , a = e.match(i);
            if (!a)
                continue;
            const o = a[0].match(/content\s*=\s*["']([^"']*)["']/i);
            if (o?.[1])
                return le(o[1].trim())
        }
        return null
    }
    function je(e) {
        const t = e.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        return t?.[1] ? le(t[1].trim()) : null
    }
    function ze(e, t) {
        if (e)
            try {
                return new URL(e,t).toString()
            } catch {
                return
            }
    }
    async function Ve(e) {
        try {
            const t = await be.safeFetch(e, {
                headers: {
                    "User-Agent": "MessagingPlugin/1.0"
                }
            }, 1e4);
            if (!t?.ok)
                return null;
            const n = t.headers.get("content-type");
            if (n && !n.includes("text"))
                return null;
            const i = await t.text()
              , a = (i.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? i).slice(0, 2e4)
              , o = {};
            return o.title = k(a, ["og:title", "twitter:title"]) ?? je(a) ?? void 0,
            o.description = k(a, ["og:description", "twitter:description", "description"]) ?? void 0,
            o.image = ze(k(a, ["og:image", "og:image:secure_url", "twitter:image"]), e),
            o.siteName = k(a, ["og:site_name"]) ?? void 0,
            o.title || o.description || o.image ? o : null
        } catch (t) {
            return R("Failed to fetch link metadata", t),
            null
        }
    }
    async function Ge(e, t) {
        const n = H(t);
        if (!n)
            return;
        const i = await Ve(n);
        if (!i)
            return;
        let a = "";
        try {
            a = new URL(n).hostname
        } catch {
            a = n
        }
        const o = i.siteName ?? a
          , l = {
            type: "link",
            url: n,
            title: i.title ?? a,
            description: i.description ?? i.title ?? n
        };
        o && (l.provider = {
            name: o
        }),
        i.image && (l.thumbnail = {
            url: i.image
        }),
        e.embeds = [l]
    }
    function We(e) {
        if (!e)
            return "Unknown time";
        try {
            return new Date(e).toLocaleString()
        } catch {
            return `${e}`
        }
    }
    function He(e) {
        const t = e.text?.trim() || e.embedTitle?.trim() || e.embedDescription?.trim() || (e.embedThumbnail?.trim() ? `Embed thumbnail: ${e.embedThumbnail}` : null) || (e.embedImage?.trim() ? `Embed image: ${e.embedImage}` : null) || "Embed-only message";
        return t.length > 160 ? `${t.slice(0, 157)}...` : t
    }
    function Ke(e, t) {
        try {
            const n = O?.getMessage?.(e, t);
            return Boolean(n)
        } catch {
            return !1
        }
    }
    function F(e, t, n=!1) {
        const i = t ?? u.byChannelId[e]?.slice(-1)?.[0];
        if (i && !Ke(e, i.id) && !n)
            try {
                r.FluxDispatcher?.dispatch?.({
                    type: "MESSAGE_CREATE",
                    channelId: e,
                    message: i,
                    isPushNotification: !1,
                    suppressPushNotification: !0,
                    isLocallyInjected: !0,
                    optimistic: !1,
                    silent: !0
                })
            } catch (a) {
                d("Failed to dispatch MESSAGE_CREATE", a)
            }
    }
    function de(e={}) {
        const t = [];
        try {
            const n = z();
            if (!n.length)
                return t;
            for (const i of n) {
                const a = ue(i, {
                    dispatch: e.dispatch
                });
                a && t.push(a)
            }
        } catch (n) {
            d("Failed to replay stored messages", n)
        }
        return t
    }
    function ue(e, t={}) {
        try {
            const n = Pe(e);
            return n ? (W(n),
            t.dispatch && F(n.channel_id, n),
            n) : null
        } catch (n) {
            return d("Failed to replay stored message", e, n),
            null
        }
    }
    function Je(e) {
        const t = u.byChannelId[e.channelId];
        if (Array.isArray(t) && t.some(function(n) {
            return n.id === e.id
        })) {
            M(e.channelId, e.id);
            try {
                r.FluxDispatcher?.dispatch?.({
                    type: "MESSAGE_DELETE",
                    channelId: e.channelId,
                    id: e.id
                })
            } catch (n) {
                d("Failed to dispatch MESSAGE_DELETE for stored removal", n)
            }
            return
        }
        Z(e.id)
    }
    function fe(e) {
        const t = u.byChannelId[e];
        if (!(!Array.isArray(t) || !t.length))
            for (const n of t)
                F(e, n)
    }
    function qe() {
        try {
            for (const e of Object.keys(u.byChannelId))
                fe(e)
        } catch (e) {
            d("Failed to rehydrate cached messages", e)
        }
    }
    function Xe() {
        if (!(_ || !r.FluxDispatcher?.dispatch))
            try {
                _ = q.instead("dispatch", r.FluxDispatcher, function(e, t) {
                    const n = e?.[0];
                    if (n && Be(n))
                        return;
                    const i = t.apply(this, e);
                    return n && typeof n == "object" && Qe(n),
                    i
                })
            } catch (e) {
                d("Failed to monitor FluxDispatcher", e)
            }
    }
    function Ye() {
        if (_)
            try {
                _()
            } catch (e) {
                d("Failed to unpatch FluxDispatcher listener", e)
            } finally {
                _ = null
            }
    }
    function Qe(e) {
        switch (e?.type) {
        case "MESSAGE_UPDATE":
            Ze(e);
            break;
        case "MESSAGE_DELETE":
            et(e);
            break;
        case "MESSAGE_DELETE_BULK":
            tt(e);
            break;
        case "LOAD_MESSAGES_SUCCESS":
            nt(e);
            break
        }
    }
    function Ze(e) {
        const t = e?.message ?? e?.newMessage;
        if (!t?.[D])
            return;
        const n = `${t.channel_id ?? e.channelId ?? ""}`;
        if (!n)
            return;
        const i = ee(t, n);
        i && (W(i),
        ce(i))
    }
    function et(e) {
        const t = e?.message
          , n = `${e?.channelId ?? t?.channel_id ?? ""}`;
        if (!n)
            return;
        if (t?.[D]) {
            M(n, t.id);
            return
        }
        const i = `${e?.id ?? e?.messageId ?? t?.id ?? ""}`;
        i && u.byChannelId[n]?.some(function(a) {
            return a.id === i
        }) && M(n, i)
    }
    function tt(e) {
        const t = `${e?.channelId ?? ""}`;
        if (!t)
            return;
        const n = Array.isArray(e?.ids) ? e.ids : Array.isArray(e?.messages) ? e.messages.map(function(i) {
            return i?.id
        }).filter(Boolean) : [];
        if (n.length)
            for (const i of n)
                M(t, `${i}`)
    }
    function nt(e) {
        const t = `${e?.channelId ?? e?.channel?.id ?? ""}`;
        t && fe(t)
    }
    function it() {
        if (O?.getMessages) {
            if (E)
                try {
                    E()
                } catch (e) {
                    d("Failed to remove previous patch", e)
                } finally {
                    E = null
                }
            try {
                E = q.instead("getMessages", O, function(e, t) {
                    const n = e?.[0]
                      , i = typeof n == "string" ? n : n?.channelId ?? n?.channel?.id ?? null
                      , a = t(...e);
                    if (!i)
                        return a;
                    const o = u.byChannelId[i];
                    if (!o?.length)
                        return a;
                    try {
                        const l = De(a)
                          , p = Re(l, o);
                        return _e(a, p)
                    } catch (l) {
                        return d("Error merging local messages", l),
                        a
                    }
                })
            } catch (e) {
                d("Failed to patch MessageStore", e)
            }
        }
    }
    function at() {
        if (E)
            try {
                E()
            } catch (e) {
                d("Failed to unpatch MessageStore", e)
            } finally {
                E = null
            }
    }
    function rt() {
        const e = f.storage[A] ?? {}
          , t = {
            targetChannelId: `${e.targetChannelId ?? ""}`.trim(),
            targetUserId: `${e.targetUserId ?? ""}`.trim(),
            messageContent: `${e.messageContent ?? ""}`,
            embedImage: `${e.embedImage ?? ""}`,
            showEmbed: e.showEmbed === !0
        };
        if ("embedTitle"in e || "embedDescription"in e || "embedThumbnail"in e) {
            const n = {
                ...e,
                ...t
            };
            delete n.embedTitle,
            delete n.embedDescription,
            delete n.embedThumbnail,
            f.storage[A] = n
        }
        return t
    }
    function ot(e) {
        const t = {
            ...f.storage[A] ?? {},
            ...e,
            showEmbed: e.showEmbed === !0
        };
        delete t.embedTitle,
        delete t.embedDescription,
        delete t.embedThumbnail,
        f.storage[A] = t
    }
    function st() {
        if (!r.ReactNative)
            return r.React.createElement(r.React.Fragment, null, r.React.createElement("Text", null, "React Native is unavailable. Configure Messaging on-device."));
        const {ScrollView: e, View: t, Text: n, TextInput: i, TouchableOpacity: a, StyleSheet: o, KeyboardAvoidingView: l, Platform: p, Switch: $, Animated: It} = r.ReactNative
          , Tt = r.React.useRef(new It.Value(0)).current
          , Et = r.React.useRef(new It.Value(0)).current
          , St = r.React.useRef(new It.Value(0)).current;
        r.React.useEffect(function() {
            const c = It.loop(It.sequence([It.timing(Tt, {
                toValue: 1,
                duration: 3e3,
                useNativeDriver: !1
            }), It.timing(Tt, {
                toValue: 0,
                duration: 3e3,
                useNativeDriver: !1
            })]));
            c.start();
            const h = It.loop(It.sequence([It.timing(Et, {
                toValue: 1,
                duration: 4e3,
                useNativeDriver: !1
            }), It.timing(Et, {
                toValue: 0,
                duration: 4e3,
                useNativeDriver: !1
            })]));
            h.start();
            const S = It.loop(It.sequence([It.timing(St, {
                toValue: 1,
                duration: 5e3,
                useNativeDriver: !1
            }), It.timing(St, {
                toValue: 0,
                duration: 5e3,
                useNativeDriver: !1
            })]));
            return S.start(),
            function() {
                c.stop(),
                h.stop(),
                S.stop()
            }
        }, []);
        const Ct = Tt.interpolate({
            inputRange: [0, .5, 1],
            outputRange: ["#ff0080", "#00ffff", "#ff0080"]
        })
          , At = Et.interpolate({
            inputRange: [0, .5, 1],
            outputRange: ["#00ffff", "#ff00ff", "#00ffff"]
        })
          , Dt = St.interpolate({
            inputRange: [0, .5, 1],
            outputRange: ["#ff00ff", "#ffff00", "#ff00ff"]
        })
          , _t = Tt.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"]
        })
          , s = r.React.useMemo(function() {
            return o.create({
                container: {
                    padding: 24,
                    paddingBottom: 50,
                    backgroundColor: "#0a0a0f"
                },
                rgbBorder: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 20,
                    borderWidth: 3,
                    opacity: .8
                },
                section: {
                    backgroundColor: "rgba(10, 10, 20, 0.95)",
                    borderRadius: 20,
                    padding: 24,
                    marginBottom: 20,
                    overflow: "hidden",
                    shadowColor: "#ff00ff",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.6,
                    shadowRadius: 20,
                    elevation: 10
                },
                sectionTitle: {
                    color: "#ffffff",
                    fontSize: 26,
                    fontWeight: "900",
                    marginBottom: 20,
                    letterSpacing: 1.5,
                    textShadowColor: "rgba(255, 0, 255, 0.8)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 15,
                    textTransform: "uppercase"
                },
                label: {
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: "800",
                    marginBottom: 10,
                    marginTop: 16,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    textShadowColor: "rgba(0, 255, 255, 0.6)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10
                },
                helper: {
                    color: "#a0a0ff",
                    fontSize: 13,
                    marginTop: 10,
                    lineHeight: 20,
                    fontStyle: "italic",
                    textShadowColor: "rgba(160, 160, 255, 0.3)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 5
                },
                input: {
                    borderRadius: 16,
                    backgroundColor: "rgba(20, 20, 40, 0.9)",
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    color: "#ffffff",
                    fontSize: 16,
                    borderWidth: 2,
                    borderColor: "rgba(255, 0, 255, 0.5)",
                    shadowColor: "#ff00ff",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5
                },
                inputDisabled: {
                    opacity: .3,
                    backgroundColor: "rgba(20, 20, 40, 0.5)",
                    borderColor: "rgba(100, 100, 100, 0.3)"
                },
                textArea: {
                    borderRadius: 16,
                    backgroundColor: "rgba(20, 20, 40, 0.9)",
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    color: "#ffffff",
                    fontSize: 16,
                    minHeight: 120,
                    textAlignVertical: "top",
                    borderWidth: 2,
                    borderColor: "rgba(0, 255, 255, 0.5)",
                    shadowColor: "#00ffff",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5
                },
                button: {
                    paddingVertical: 18,
                    borderRadius: 16,
                    alignItems: "center",
                    marginTop: 12,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.8,
                    shadowRadius: 15,
                    elevation: 8,
                    borderWidth: 2
                },
                buttonPrimary: {
                    backgroundColor: "rgba(255, 0, 128, 0.3)",
                    borderColor: "#ff0080",
                    shadowColor: "#ff0080"
                },
                buttonSecondary: {
                    backgroundColor: "rgba(0, 255, 255, 0.3)",
                    borderColor: "#00ffff",
                    shadowColor: "#00ffff"
                },
                buttonDanger: {
                    backgroundColor: "rgba(255, 0, 0, 0.3)",
                    borderColor: "#ff0000",
                    shadowColor: "#ff0000"
                },
                buttonDisabled: {
                    opacity: .4,
                    shadowOpacity: 0.2
                },
                buttonText: {
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "900",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    textShadowColor: "rgba(255, 255, 255, 0.5)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10
                },
                messageSection: {
                    backgroundColor: "rgba(10, 10, 20, 0.95)",
                    borderRadius: 20,
                    padding: 24,
                    marginBottom: 20,
                    overflow: "hidden",
                    shadowColor: "#00ffff",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.6,
                    shadowRadius: 20,
                    elevation: 10
                },
                toggleRow: {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(30, 30, 60, 0.8)",
                    padding: 18,
                    borderRadius: 16,
                    marginTop: 14,
                    borderWidth: 2,
                    borderColor: "rgba(255, 255, 0, 0.5)",
                    shadowColor: "#ffff00",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5
                },
                toggleLabel: {
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "700",
                    flexShrink: 1,
                    textShadowColor: "rgba(255, 255, 0, 0.5)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8
                },
                messageCard: {
                    borderRadius: 18,
                    backgroundColor: "rgba(20, 20, 40, 0.9)",
                    padding: 20,
                    marginBottom: 16,
                    borderWidth: 2,
                    borderColor: "rgba(128, 0, 255, 0.5)",
                    shadowColor: "#8000ff",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.6,
                    shadowRadius: 12,
                    elevation: 6
                },
                messageTitle: {
                    color: "#ffffff",
                    fontSize: 17,
                    fontWeight: "800",
                    marginBottom: 10,
                    lineHeight: 24,
                    textShadowColor: "rgba(128, 0, 255, 0.5)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8
                },
                messageMeta: {
                    color: "#c0c0ff",
                    fontSize: 13,
                    marginBottom: 6,
                    lineHeight: 20,
                    textShadowColor: "rgba(192, 192, 255, 0.3)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 5
                },
                messageActions: {
                    flexDirection: "row",
                    gap: 12,
                    marginTop: 14
                },
                inlineButton: {
                    flex: 1,
                    borderRadius: 14,
                    paddingVertical: 12,
                    alignItems: "center",
                    backgroundColor: "rgba(0, 255, 255, 0.2)",
                    borderWidth: 2,
                    borderColor: "rgba(0, 255, 255, 0.6)",
                    shadowColor: "#00ffff",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    elevation: 4
                },
                inlineButtonDanger: {
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    borderWidth: 2,
                    borderColor: "rgba(255, 0, 0, 0.6)",
                    shadowColor: "#ff0000"
                },
                inlineButtonText: {
                    color: "#00ffff",
                    fontSize: 14,
                    fontWeight: "900",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    textShadowColor: "rgba(0, 255, 255, 0.5)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8
                },
                inlineButtonDangerText: {
                    color: "#ff4444",
                    textShadowColor: "rgba(255, 68, 68, 0.5)"
                },
                emptyState: {
                    color: "#8080ff",
                    fontSize: 15,
                    textAlign: "center",
                    fontStyle: "italic",
                    paddingVertical: 24,
                    textShadowColor: "rgba(128, 128, 255, 0.3)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8
                },
                rgbGlow: {
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    opacity: .15
                },
                headerGlow: {
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    opacity: .2
                }
            })
        }, [o])
          , [m,C] = r.React.useState(function() {
            return rt()
        })
          , [b,me] = r.React.useState(!1)
          , [ge,ft] = r.React.useState(function() {
            return z()
        })
          , v = m.showEmbed === !0
          , y = r.React.useCallback(function() {
            ft(z())
        }, [])
          , he = r.React.useMemo(function() {
            return ge.slice().sort(function(c, h) {
                return (h.timestamp ?? 0) - (c.timestamp ?? 0)
            })
        }, [ge])
          , w = function(c) {
            C(function(h) {
                const S = {
                    ...h,
                    ...c
                };
                return ot(S),
                S
            })
        }
          , mt = r.React.useCallback(async function() {
            if (b)
                return;
            me(!0);
            const c = m.targetChannelId?.trim()
              , h = m.targetUserId?.trim()
              , S = m.messageContent?.trim()
              , N = m.showEmbed === !0
              , J = N && m.embedImage?.trim() || void 0
              , pt = N ? H(S ?? "") : null;
            try {
                if (!c) {
                    g.showToast("Set a Target Channel ID.");
                    return
                }
                if (!h) {
                    g.showToast("Set a Target User ID.");
                    return
                }
                if (!S) {
                    g.showToast("Message content cannot be empty.");
                    return
                }
                const I = $e({
                    channelId: c,
                    userId: h,
                    content: S,
                    embedImage: J,
                    detectLinks: N
                });
                if (!I) {
                    g.showToast("Unable to create message. Check settings.");
                    return
                }
                N ? (await Ge(I, S),
                J && oe(I, J, pt)) : I.embeds = [],
                W(I),
                ce(I),
                F(c),
                y(),
                g.showToast("Message created (local only).")
            } catch (I) {
                d("Send error", I),
                g.showToast("Error creating message. See console.")
            } finally {
                me(!1)
            }
        }, [m, b, y])
          , gt = r.React.useCallback(function() {
            const c = de({
                dispatch: !0
            });
            c.length ? (g.showToast(`Replayed ${c.length} cached message${c.length === 1 ? "" : "s"}.`),
            setTimeout(function() {
                return ae()
            }, 200)) : g.showToast("No cached local messages to replay."),
            y()
        }, [y])
          , ht = r.React.useCallback(function() {
            xe(),
            y(),
            g.showToast("Local message cache cleared.")
        }, [y])
          , bt = r.React.useCallback(function(c) {
            const h = ue(c, {
                dispatch: !0
            });
            h ? (g.showToast("Message replayed locally."),
            setTimeout(function() {
                h && K(h.channel_id, h.id)
            }, 200)) : g.showToast("Failed to replay message."),
            y()
        }, [y])
          , yt = r.React.useCallback(function(c) {
            Je(c),
            y(),
            g.showToast("Message removed from cache.")
        }, [y]);
        return r.React.createElement(l, {
            style: {
                flex: 1,
                backgroundColor: "#0a0a0f"
            },
            behavior: p?.OS === "ios" ? "padding" : void 0,
            keyboardVerticalOffset: 64
        }, r.React.createElement(e, {
            contentContainerStyle: s.container,
            keyboardShouldPersistTaps: "handled",
            keyboardDismissMode: "interactive"
        }, r.React.createElement(t, {
            style: s.section
        }, r.React.createElement(It.View, {
            style: [s.rgbBorder, {
                borderColor: Ct
            }]
        }), r.React.createElement(It.View, {
            style: [s.headerGlow, {
                backgroundColor: Ct
            }]
        }), r.React.createElement(It.View, {
            style: [s.rgbGlow, {
                backgroundColor: At,
                top: 100,
                left: -50
            }]
        }), r.React.createElement(n, {
            style: s.sectionTitle
        }, "🌈 SEND LOCAL MESSAGE 🌈"), r.React.createElement(n, {
            style: s.label
        }, "Target Channel ID"), r.React.createElement(i, {
            style: s.input,
            placeholder: "Channel or DM ID",
            placeholderTextColor: "rgba(255,255,255,0.4)",
            value: m.targetChannelId,
            onChangeText: function(c) {
                return w({
                    targetChannelId: c
                })
            },
            autoCapitalize: "none"
        }), r.React.createElement(n, {
            style: s.label
        }, "Target User ID"), r.React.createElement(i, {
            style: s.input,
            placeholder: "User ID to imitate locally",
            placeholderTextColor: "rgba(255,255,255,0.4)",
            value: m.targetUserId,
            onChangeText: function(c) {
                return w({
                    targetUserId: c
                })
            },
            autoCapitalize: "none"
        }), r.React.createElement(n, {
            style: s.label
        }, "Message content"), r.React.createElement(i, {
            style: s.textArea,
            placeholder: "Link or text that should appear in chat",
            placeholderTextColor: "rgba(255,255,255,0.4)",
            multiline: !0,
            value: m.messageContent,
            onChangeText: function(c) {
                return w({
                    messageContent: c
                })
            }
        }), r.React.createElement(t, {
            style: s.toggleRow
        }, r.React.createElement(n, {
            style: s.toggleLabel
        }, "Show embed preview"), r.React.createElement($, {
            value: v,
            onValueChange: function(c) {
                return w({
                    showEmbed: c
                })
            }
        })), r.React.createElement(n, {
            style: s.label
        }, "Embed image URL"), r.React.createElement(i, {
            style: [s.input, !v && s.inputDisabled],
            placeholder: "Main image for the embed",
            placeholderTextColor: "rgba(255,255,255,0.4)",
            autoCapitalize: "none",
            editable: v,
            selectTextOnFocus: v,
            value: m.embedImage,
            onChangeText: function(c) {
                return w({
                    embedImage: c
                })
            }
        }), r.React.createElement(n, {
            style: s.helper
        }, v ? "Only the image can be customized. Titles and descriptions continue to come from the detected link metadata." : "Embeds are hidden while this toggle is off. Messages will be sent as plain text."), r.React.createElement(a, {
            style: [s.button, s.buttonPrimary, b && s.buttonDisabled],
            onPress: mt,
            disabled: b
        }, r.React.createElement(n, {
            style: s.buttonText
        }, b ? "⚡ Sending... ⚡" : "🚀 Send Message 🚀")), r.React.createElement(a, {
            style: [s.button, s.buttonSecondary],
            onPress: gt
        }, r.React.createElement(n, {
            style: s.buttonText
        }, "♻️ Replay Messages ♻️")), r.React.createElement(a, {
            style: [s.button, s.buttonDanger],
            onPress: ht
        }, r.React.createElement(n, {
            style: s.buttonText
        }, "🗑️ Clear Cache 🗑️")), r.React.createElement(n, {
            style: s.helper
        }, "Local messages stay on your device for testing embeds.")), r.React.createElement(t, {
            style: [s.section, s.messageSection]
        }, r.React.createElement(It.View, {
            style: [s.rgbBorder, {
                borderColor: At
            }]
        }), r.React.createElement(It.View, {
            style: [s.headerGlow, {
                backgroundColor: Dt
            }]
        }), r.React.createElement(It.View, {
            style: [s.rgbGlow, {
                backgroundColor: Ct,
                bottom: -50,
                right: -50
            }]
        }), r.React.createElement(n, {
            style: s.sectionTitle
        }, "💾 CACHED MESSAGES 💾"), he.length ? he.map(function(c) {
            return r.React.createElement(t, {
                key: `${c.channelId}:${c.id}`,
                style: s.messageCard
            }, r.React.createElement(n, {
                style: s.messageTitle
            }, He(c)), r.React.createElement(n, {
                style: s.messageMeta
            }, `Channel: ${c.channelId} \u2022 User: ${c.userId}`), r.React.createElement(n, {
                style: s.messageMeta
            }, `Created: ${We(c.timestamp)}`), c.embedTitle || c.embedDescription || c.embedThumbnail || c.embedImage ? r.React.createElement(n, {
                style: s.messageMeta
            }, `Embed: ${c.embedTitle ?? c.embedDescription ?? c.embedThumbnail ?? c.embedImage}`) : null, r.React.createElement(t, {
                style: s.messageActions
            }, r.React.createElement(a, {
                style: s.inlineButton,
                onPress: function() {
                    return bt(c)
                }
            }, r.React.createElement(n, {
                style: s.inlineButtonText
            }, "▶️ Replay")), r.React.createElement(a, {
                style: [s.inlineButton, s.inlineButtonDanger],
                onPress: function() {
                    return yt(c)
                }
            }, r.React.createElement(n, {
                style: [s.inlineButtonText, s.inlineButtonDangerText]
            }, "❌ Remove"))))
        }) : r.React.createElement(n, {
            style: s.emptyState
        }, "✨ No cached local messages yet. ✨"))))
    }
    function ct(e) {
        !Array.isArray(e) || !e.length || setTimeout(function() {
            for (const t of e)
                try {
                    F(t.channel_id, t)
                } catch (n) {
                    d("Failed to schedule replay dispatch", n)
                }
        }, 500)
    }
    function lt() {
        Ae();
        const e = de();
        it(),
        Xe(),
        qe(),
        ct(e),
        setTimeout(function() {
            ae()
        }, 1500)
    }
    function dt() {
        Ye(),
        at()
    }
    var ut = {
        onLoad: lt,
        onUnload: dt,
        settings: st
    };
    return U.default = ut,
    Object.defineProperty(U, "__esModule", {
        value: !0
    }),
    U
}
)({}, vendetta.metro.common, vendetta.metro, vendetta.patcher, vendetta.plugin, vendetta.ui.toasts, vendetta.utils);
