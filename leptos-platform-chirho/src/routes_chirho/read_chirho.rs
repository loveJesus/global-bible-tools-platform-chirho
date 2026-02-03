// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Reader view route component.

use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::{components::A, hooks::use_params_map};

/// Bible reader page - displays chapter text with word-level detail.
#[component]
pub fn ReadPageChirho() -> impl IntoView {
    let params_chirho = use_params_map();

    let code_chirho = move || {
        params_chirho
            .read()
            .get("code")
            .unwrap_or_default()
    };

    let chapter_chirho = move || {
        params_chirho
            .read()
            .get("chapter")
            .unwrap_or_default()
    };

    view! {
        <Title text=move || format!("{} | Reader | Global Bible Tools", chapter_chirho())/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
            // Navigation bar
            <nav class="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <A href="/" attr:class="text-2xl">
                            "📖"
                        </A>
                        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span class="font-medium text-slate-800 dark:text-white">{code_chirho}</span>
                            <span>"/"</span>
                            <span class="font-medium text-slate-800 dark:text-white">{chapter_chirho}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        // Chapter navigation
                        <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                            "← Prev"
                        </button>
                        <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                            "Next →"
                        </button>
                    </div>
                </div>
            </nav>

            // Main content area
            <main class="max-w-4xl mx-auto px-4 py-8">
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                    <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                        {move || format!("{} - {}", code_chirho(), chapter_chirho())}
                    </h1>

                    // TODO: Load chapter data via server function
                    <div class="prose dark:prose-invert max-w-none">
                        <p class="text-slate-600 dark:text-slate-400">
                            "Chapter content will be loaded here..."
                        </p>
                        <p class="text-slate-600 dark:text-slate-400 mt-4">
                            "Each word will be clickable to show lexicon information."
                        </p>
                    </div>
                </div>

                // Word detail panel (shown when word is selected)
                <div class="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">"Word Details"</h2>
                    <p class="text-slate-600 dark:text-slate-400">"Select a word to see its lexicon entry, forms, and translation suggestions."</p>
                </div>
            </main>
        </div>
    }
}
