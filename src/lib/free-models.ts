export type FreeModelCategory = "Elite" | "Solide" | "Leger";

export interface RankedFreeModel {
    id: string;
    name: string;
    chef: string;
    chefSlug: string;
    providers: string[];
    isReasoning: boolean;
    popularityRank: number;
    performanceRank: number;
    category: FreeModelCategory;
}

// Classement manuel combine (popularite + performance) pour l'UX du selecteur.
export const FREE_MODELS: RankedFreeModel[] = [
    {
        id: "z-ai/glm-4.5-air:free",
        name: "GLM 4.5 Air",
        chef: "Z-AI",
        chefSlug: "zai",
        providers: ["zai"],
        isReasoning: false,
        popularityRank: 12,
        performanceRank: 8,
        category: "Elite",
    },
    {
        id: "arcee-ai/trinity-large-preview:free",
        name: "Trinity Large Preview",
        chef: "Arcee AI",
        chefSlug: "arcee-ai",
        providers: ["arcee-ai"],
        isReasoning: false,
        popularityRank: 15,
        performanceRank: 9,
        category: "Solide",
    },
    {
        id: "nvidia/nemotron-3-super-120b-a12b:free",
        name: "Nemotron 3 Super 120B",
        chef: "NVIDIA",
        chefSlug: "nvidia",
        providers: ["nvidia"],
        isReasoning: false,
        popularityRank: 11,
        performanceRank: 17,
        category: "Solide",
    },
    {
        id: "arcee-ai/trinity-mini:free",
        name: "Trinity Mini",
        chef: "Arcee AI",
        chefSlug: "arcee-ai",
        providers: ["arcee-ai"],
        isReasoning: false,
        popularityRank: 17,
        performanceRank: 14,
        category: "Solide",
    },
    {
        id: "stepfun/step-3.5-flash:free",
        name: "Step 3.5 Flash",
        chef: "StepFun",
        chefSlug: "stepfun",
        providers: ["stepfun"],
        isReasoning: false,
        popularityRank: 16,
        performanceRank: 15,
        category: "Solide",
    },
    {
        id: "nvidia/nemotron-3-nano-30b-a3b:free",
        name: "Nemotron 3 Nano 30B",
        chef: "NVIDIA",
        chefSlug: "nvidia",
        providers: ["nvidia"],
        isReasoning: false,
        popularityRank: 21,
        performanceRank: 20,
        category: "Leger",
    },
    {
        id: "nvidia/nemotron-nano-12b-v2-vl:free",
        name: "Nemotron Nano 12B V2 VL",
        chef: "NVIDIA",
        chefSlug: "nvidia",
        providers: ["nvidia"],
        isReasoning: false,
        popularityRank: 22,
        performanceRank: 22,
        category: "Leger",
    },
    {
        id: "nvidia/nemotron-nano-9b-v2:free",
        name: "Nemotron Nano 9B V2",
        chef: "NVIDIA",
        chefSlug: "nvidia",
        providers: ["nvidia"],
        isReasoning: false,
        popularityRank: 24,
        performanceRank: 24,
        category: "Leger",
    },
    {
        id: "openrouter/free",
        name: "OpenRouter Free (auto)",
        chef: "OpenRouter",
        chefSlug: "openrouter",
        providers: ["openrouter"],
        isReasoning: false,
        popularityRank: 27,
        performanceRank: 11,
        category: "Leger",
    },
];

export const FREE_MODEL_IDS = FREE_MODELS.map((model) => model.id);
