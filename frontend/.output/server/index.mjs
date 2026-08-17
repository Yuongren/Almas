globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HookableCore } from "./_libs/hookable.mjs";
import { d as defineLazyEventHandler, H as HTTPError, a as H3Core } from "./_libs/h3.mjs";
import { a as FastResponse } from "./_libs/srvx.mjs";


import "./_libs/rou3.mjs";





function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/assets/Footer-C2zMikyq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c4a-d1Q3wItkkakw8cPL92jkfv/6cIk"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 3146,
    "path": "../public/assets/Footer-C2zMikyq.js"
  },
  "/assets/AudioWave-DtUEKMEG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"212-PO89qM8mFzcskqcghgdI9/Jw5v8"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 530,
    "path": "../public/assets/AudioWave-DtUEKMEG.js"
  },
  "/assets/Header-TEpMPRn4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fa0-khnfG8QlQe0YlhoJbUdkrSiiNpk"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 4e3,
    "path": "../public/assets/Header-TEpMPRn4.js"
  },
  "/assets/auth-4Tvn-weI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9c3-N8pF3QCa4tcMhPPjBIAqedTLUrQ"',
    "mtime": "2026-07-25T10:53:22.150Z",
    "size": 2499,
    "path": "../public/assets/auth-4Tvn-weI.js"
  },
  "/assets/check-BmzXmBLx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"79-6i1G2rrWMCrk7qmseTLMohtduI4"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 121,
    "path": "../public/assets/check-BmzXmBLx.js"
  },
  "/assets/contact-TKoeF65P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e6b-6JB4rRsf+G1Y8f0dILn/cRrb75w"',
    "mtime": "2026-07-25T10:53:22.150Z",
    "size": 3691,
    "path": "../public/assets/contact-TKoeF65P.js"
  },
  "/assets/features-CFQk1Yr1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"143e-GcxiDVCa3KGAAF3G8MXxRhltKHY"',
    "mtime": "2026-07-25T10:53:22.150Z",
    "size": 5182,
    "path": "../public/assets/features-CFQk1Yr1.js"
  },
  "/assets/hero-waves-BFuezyf3.jpg": {
    "type": "image/jpeg",
    "etag": '"2482c-T9yvNLk9S6RIGtJ2AbOOUmJX1gY"',
    "mtime": "2026-07-25T10:53:22.146Z",
    "size": 149548,
    "path": "../public/assets/hero-waves-BFuezyf3.jpg"
  },
  "/assets/index-D3C2VBwl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5cf1-dQSe29a5Qy8sX2XdZIxjGakTsWw"',
    "mtime": "2026-07-25T10:53:22.150Z",
    "size": 23793,
    "path": "../public/assets/index-D3C2VBwl.js"
  },
  "/assets/index-DvYIOWFi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2c72-W2lPyGtxFgkZRS6dI34mrS8rRy4"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 11378,
    "path": "../public/assets/index-DvYIOWFi.js"
  },
  "/assets/phone-BTHASboC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"144-ighP+QyHVPvh9ZFqQ+BPvhQwzN0"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 324,
    "path": "../public/assets/phone-BTHASboC.js"
  },
  "/assets/pricing-UpjC9_mC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"efe-99U4H3TuaFXufeof5Id8IfWFXFY"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 3838,
    "path": "../public/assets/pricing-UpjC9_mC.js"
  },
  "/assets/route-BD5IXT_F.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5f-GWnDI9WeVinxjAmuqTydF7tLc6c"',
    "mtime": "2026-07-25T10:53:22.150Z",
    "size": 95,
    "path": "../public/assets/route-BD5IXT_F.js"
  },
  "/assets/sparkles-BDPE8FXh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f0-KAoHwKz6y7G18r/nozWoNfnKC1A"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 496,
    "path": "../public/assets/sparkles-BDPE8FXh.js"
  },
  "/assets/studio-mic-QDpYlZ9k.jpg": {
    "type": "image/jpeg",
    "etag": '"f82b-3Y/tv/rieErrFEE9r2dSzo2v9Gk"',
    "mtime": "2026-07-25T10:53:22.150Z",
    "size": 63531,
    "path": "../public/assets/studio-mic-QDpYlZ9k.jpg"
  },
  "/assets/styles-cGCfH1Cs.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"15c88-wuQrEZd0ttOHTevel2VexS9RVI8"',
    "mtime": "2026-07-25T10:53:22.150Z",
    "size": 89224,
    "path": "../public/assets/styles-cGCfH1Cs.css"
  },
  "/assets/useAuth-ByrDRUrg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a1f-YxPYbvez1M/7iRrgOcwaFnZQbyg"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 2591,
    "path": "../public/assets/useAuth-ByrDRUrg.js"
  },
  "/assets/zap-S0g45_7c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7ea-X02aeb/I8apXw0Khk1nzKfMs8Wo"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 2026,
    "path": "../public/assets/zap-S0g45_7c.js"
  },
  "/assets/index-BjvGfDEf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"97d78-daS8EgBlDR/hTLGvMmRsQQHSHlU"',
    "mtime": "2026-07-25T10:53:22.151Z",
    "size": 621944,
    "path": "../public/assets/index-BjvGfDEf.js"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_a_o7vV = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_a_o7vV };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function createHandler(hooks) {
  const nitroApp = useNitroApp();
  const nitroHooks = useNitroHooks();
  return {
    async fetch(request, env, context) {
      globalThis.__env__ = env;
      augmentReq(request, {
        env,
        context
      });
      const ctxExt = {};
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url, ctxExt);
        if (res) {
          return res;
        }
      }
      return await nitroApp.fetch(request);
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
        controller,
        env,
        context
      }) || Promise.resolve());
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:email", {
        message,
        event: message,
        env,
        context
      }) || Promise.resolve());
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
        batch,
        event: batch,
        env,
        context
      }) || Promise.resolve());
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
        traces,
        env,
        context
      }) || Promise.resolve());
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
        traces,
        env,
        context
      }) || Promise.resolve());
    }
  };
}
function augmentReq(cfReq, ctx) {
  const req = cfReq;
  req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx
  };
  req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
