// Lo único que cambia entre instalaciones. Ninguno de estos valores es secreto:
// la llave publicable solo deja hacer lo que las reglas de la base permiten a
// cada usuario con sesión, y sin sesión no deja leer nada.
export const SUPABASE_URL = "https://khbmraaiprcjocmprzkb.supabase.co";
export const SUPABASE_KEY = "sb_publishable_lB_wlCMZcxjmvt-_ONpyrg_ML3wdOs8";

// Para listar los archivos de la carpeta de Drive de cada proyecto dentro de la
// aplicación. Es el «ID de cliente» de Google Cloud (tipo «Aplicación web»).
// Vacío: la aplicación solo muestra el botón para abrir la carpeta en Drive.
export const GOOGLE_CLIENT_ID = "";
