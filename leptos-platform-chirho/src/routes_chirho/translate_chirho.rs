// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Translation view route component.

use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::{components::A, hooks::use_params_map};

/// Translation page - word-by-word translation interface.
#[component]
pub fn TranslatePageChirho() -> impl IntoView {
    let params_chirho = use_params_map();

    let code_chirho = move || {
        params_chirho
            .read()
            .get("code")
            .unwrap_or_default()
    };

    let verse_chirho = move || {
        params_chirho
            .read()
            .get("verse")
            .unwrap_or_default()
    };

    view! {
        <Title text=move || format!("Translate {} | Global Bible Tools", verse_chirho())/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
            // Navigation bar
            <nav class="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <A href="/" attr:class="text-2xl">
                            "📖"
                        </A>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm font-medium">
                                {code_chirho}
                            </span>
                            <span class="text-slate-400">"|"</span>
                            <span class="text-slate-600 dark:text-slate-400 text-sm">{verse_chirho}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                            "← Prev Verse"
                        </button>
                        <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                            "Next Verse →"
                        </button>
                    </div>
                </div>
            </nav>

            // Main translation area
            <main class="max-w-7xl mx-auto px-4 py-8">
                <div class="grid lg:grid-cols-3 gap-6">
                    // Left: Source text and translation grid
                    <div class="lg:col-span-2 space-y-6">
                        // Verse reference
                        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h1 class="text-xl font-bold text-slate-800 dark:text-white mb-4">
                                "Verse Translation"
                            </h1>

                            // Source text (Hebrew/Greek)
                            <div class="mb-6">
                                <h2 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">"Source Text"</h2>
                                <p class="text-2xl text-slate-800 dark:text-white font-serif" dir="auto">
                                    // TODO: Load verse words
                                    "Ἐν ἀρχῇ ἦν ὁ λόγος..."
                                </p>
                            </div>

                            // Translation grid
                            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
                                <h2 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">"Word-by-Word Translation"</h2>

                                // TODO: Word translation grid from server
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    <WordCardChirho
                                        source="Ἐν"
                                        transliteration="En"
                                        gloss=""
                                        lemma="G1722"
                                    />
                                    <WordCardChirho
                                        source="ἀρχῇ"
                                        transliteration="archē"
                                        gloss=""
                                        lemma="G746"
                                    />
                                    <WordCardChirho
                                        source="ἦν"
                                        transliteration="ēn"
                                        gloss=""
                                        lemma="G1510"
                                    />
                                    <WordCardChirho
                                        source="ὁ"
                                        transliteration="ho"
                                        gloss=""
                                        lemma="G3588"
                                    />
                                    <WordCardChirho
                                        source="λόγος"
                                        transliteration="logos"
                                        gloss=""
                                        lemma="G3056"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    // Right: Lexicon panel
                    <div class="space-y-6">
                        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-20">
                            <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">"Lexicon"</h2>
                            <p class="text-slate-600 dark:text-slate-400 text-sm">
                                "Click on a word to see its lexicon entry, forms, and translation suggestions."
                            </p>

                            // Placeholder for selected word info
                            <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <p class="text-slate-500 dark:text-slate-400 text-sm">"No word selected"</p>
                            </div>
                        </div>

                        // Machine suggestions
                        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">"AI Suggestions"</h2>
                            <p class="text-slate-600 dark:text-slate-400 text-sm">
                                "Machine-generated translation suggestions will appear here."
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    }
}

/// Word card component for translation grid.
#[component]
fn WordCardChirho(
    source: &'static str,
    transliteration: &'static str,
    gloss: &'static str,
    lemma: &'static str,
) -> impl IntoView {
    let (editing_chirho, set_editing_chirho) = signal(false);
    let (local_gloss_chirho, set_local_gloss_chirho) = signal(gloss.to_string());

    view! {
        <div
            class="p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            on:click=move |_| set_editing_chirho.set(true)
        >
            // Source word
            <div class="text-lg font-serif text-slate-800 dark:text-white mb-1">{source}</div>

            // Transliteration
            <div class="text-xs text-slate-500 dark:text-slate-400 mb-2">{transliteration}</div>

            // Gloss input or display
            {move || if editing_chirho.get() {
                view! {
                    <input
                        type="text"
                        class="w-full px-2 py-1 text-sm border border-blue-500 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none"
                        placeholder="Enter translation"
                        prop:value=local_gloss_chirho
                        on:input=move |ev| set_local_gloss_chirho.set(event_target_value(&ev))
                        on:blur=move |_| set_editing_chirho.set(false)
                        on:keydown=move |ev| {
                            if ev.key() == "Enter" || ev.key() == "Escape" {
                                set_editing_chirho.set(false);
                            }
                        }
                    />
                }.into_any()
            } else {
                let display_chirho = if local_gloss_chirho.get().is_empty() {
                    "Click to translate".to_string()
                } else {
                    local_gloss_chirho.get()
                };
                view! {
                    <div class="text-sm text-blue-600 dark:text-blue-400">
                        {display_chirho}
                    </div>
                }.into_any()
            }}

            // Lemma reference
            <div class="text-xs text-slate-400 dark:text-slate-500 mt-1">{lemma}</div>
        </div>
    }
}
