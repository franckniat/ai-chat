import next from "eslint-config-next";

/**
 * `eslint-config-next` 16 exporte directement un flat config.
 *
 * L'ancienne version passait par `FlatCompat` (le pont vers l'ancien format
 * `.eslintrc`), ce qui plantait au demarrage sous ESLint 9 :
 * « Converting circular structure to JSON ». `pnpm lint` etait donc inutilisable,
 * en plus d'appeler `next lint`, retire de Next 16.
 */
const eslintConfig = [
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "src/generated/**",
            "next-env.d.ts",
        ],
    },

    ...next,

    {
        /**
         * Code copie depuis des registres externes (ai-elements du AI SDK,
         * primitives shadcn/ui). Les regles du compilateur React y remontent de
         * vrais signalements, mais les corriger revient a diverger de l'amont :
         * la prochaine mise a jour du registre ecraserait les correctifs.
         *
         * On les garde visibles en `warn` plutot que de les desactiver.
         */
        files: ["src/components/ai-elements/**", "src/components/ui/**"],
        rules: {
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/static-components": "warn",
            "react-hooks/purity": "warn",
            "react-hooks/refs": "warn",
        },
    },

    {
        /**
         * Code applicatif : ces signalements sont a corriger.
         * Maintenus en `warn` le temps de reprendre `chat-provider.tsx`
         * (deux `setState` dans des effets y provoquent des rendus en cascade).
         */
        files: ["src/components/chat/**", "src/hooks/**"],
        rules: {
            "react-hooks/set-state-in-effect": "warn",
        },
    },
];

export default eslintConfig;
