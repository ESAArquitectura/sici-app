// La app guardada en el teléfono. Los datos nunca se guardan aquí: solo la aplicación.
//  · Las páginas (HTML): primero la red, para que cada versión nueva llegue de inmediato;
//    sin señal, la última que se guardó.
//  · El código y los estilos de /_next/static/: primero lo guardado. Sus nombres cambian
//    con cada versión, así que lo guardado nunca queda viejo, y la app abre sin esperar
//    a descargarlo otra vez.
// Al publicar una versión nueva, cambie CACHE para que los teléfonos borren lo anterior.
const CACHE = "sici-next-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())));

const guardar = (pedido, respuesta) => {
  if (respuesta.ok) { const copia = respuesta.clone(); caches.open(CACHE).then(c => c.put(pedido, copia)); }
  return respuesta;
};

self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.includes("/_next/static/")) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(x => guardar(e.request, x))));
    return;
  }
  e.respondWith(fetch(e.request).then(x => guardar(e.request, x))
    .catch(() => caches.match(e.request).then(r => r || caches.match(new URL("./", self.registration.scope).href))));
});
