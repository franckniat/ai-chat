import type { NextConfig } from "next";

/**
 * Aucune cle `env` ici volontairement.
 *
 * `env` inline les valeurs dans le bundle navigateur : y lister des secrets
 * (BETTER_AUTH_SECRET, *_CLIENT_SECRET, RESEND_API_KEY, DATABASE_URL...)
 * revient a les publier des qu'un composant client les reference.
 *
 * Le code serveur lit directement `process.env.*`. Pour exposer une valeur au
 * navigateur, prefixer explicitement la variable par `NEXT_PUBLIC_`.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
