// La app guardada en el teléfono. Los datos nunca se guardan aquí: solo la aplicación.
//  · Las páginas (HTML): primero la red, para que cada versión nueva llegue de inmediato;
//    sin señal, la última que se guardó.
//  · El código y los estilos de /_next/static/: primero lo guardado. Sus nombres cambian
//    con cada versión, así que lo guardado nunca queda viejo, y la app abre sin esperar
//    a descargarlo otra vez.
// Al publicar una versión nueva, cambie CACHE para que los teléfonos borren lo anterior.
const CACHE = "sici-next-v10";
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
  if (u.hostname === "localhost") return;   // en desarrollo no se guarda nada: solo sirve para recibir avisos
  if (u.pathname.includes("/_next/static/")) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(x => guardar(e.request, x))));
    return;
  }
  e.respondWith(fetch(e.request).then(x => guardar(e.request, x))
    .catch(() => caches.match(e.request).then(r => r || caches.match(new URL("./", self.registration.scope).href))));
});

// Avisos al celular (push). El servidor manda {titulo, cuerpo, ruta}; nunca nombres ni valores.
// En iPhone cada aviso recibido debe mostrarse, por eso siempre se llama a showNotification.
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { /* texto suelto: se muestra genérico */ }
  e.waitUntil(self.registration.showNotification(d.titulo || "SICI", {
    body: d.cuerpo || "Tiene algo nuevo en el SICI.",
    icon: "icono-192.png", badge: "icono-192.png",
    // La etiqueta junta en una sola notificación las que la llevan igual. Va con el título y la ruta: dos avisos
    // distintos que abren la misma obra o la misma tarea («Hay pagos vencidos» y «Gastos por aprobar») se ven los dos.
    tag: "sici-" + (d.titulo || "") + "-" + (d.ruta || "avisos"), data: { ruta: d.ruta || "/" },
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const destino = new URL(String((e.notification.data && e.notification.data.ruta) || "/").replace(/^\//, ""), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(ventanas => {
    for (const v of ventanas) if (v.url.startsWith(self.registration.scope) && "focus" in v) return v.navigate(destino).then(x => (x || v).focus()).catch(() => v.focus());
    return self.clients.openWindow(destino);
  }));
});
