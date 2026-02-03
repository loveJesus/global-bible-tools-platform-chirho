// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Home/landing page component.

use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::components::A;

/// Landing page with hero section and feature highlights.
#[component]
pub fn HomePageChirho() -> impl IntoView {
    view! {
        <Title text="Global Bible Tools - Word-for-Word Bible Translation"/>

        <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            // Navigation
            <nav class="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16 items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">"📖"</span>
                            <span class="font-bold text-xl text-slate-800 dark:text-white">"Global Bible Tools"</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <A href="/login-chirho" attr:class="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">
                                "Sign In"
                            </A>
                            <A
                                href="/register-chirho"
                                attr:class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                "Get Started"
                            </A>
                        </div>
                    </div>
                </div>
            </nav>

            // Hero section
            <section class="py-20 px-4">
                <div class="max-w-4xl mx-auto text-center">
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
                        "Word-for-Word Bible Translation"
                    </h1>
                    <p class="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                        "A collaborative platform for creating accurate, literal translations of the Bible into every language."
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <A
                            href="/read-chirho/eng/GEN.1"
                            attr:class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                        >
                            "Start Reading"
                        </A>
                        <A
                            href="/translate-chirho/fra/01001001"
                            attr:class="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-lg font-medium"
                        >
                            "Start Translating"
                        </A>
                    </div>
                </div>
            </section>

            // Features section
            <section class="py-16 px-4 bg-white dark:bg-slate-800">
                <div class="max-w-6xl mx-auto">
                    <h2 class="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">
                        "Why Global Bible Tools?"
                    </h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        <FeatureCardChirho
                            icon="🎯"
                            title="Word-Level Precision"
                            description="Translate each Hebrew and Greek word individually, maintaining the exact structure of the original text."
                        />
                        <FeatureCardChirho
                            icon="🤝"
                            title="Collaborative"
                            description="Work together with translators worldwide. Review, approve, and improve translations as a community."
                        />
                        <FeatureCardChirho
                            icon="📚"
                            title="Rich Lexicon"
                            description="Access detailed lexicon entries, word forms, and translation suggestions for every word."
                        />
                    </div>
                </div>
            </section>

            // Stats section
            <section class="py-16 px-4">
                <div class="max-w-4xl mx-auto">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatCardChirho number="66" label="Books"/>
                        <StatCardChirho number="31K" label="Verses"/>
                        <StatCardChirho number="780K" label="Words"/>
                        <StatCardChirho number="100+" label="Languages"/>
                    </div>
                </div>
            </section>

            // Footer
            <footer class="py-8 px-4 border-t border-slate-200 dark:border-slate-700">
                <div class="max-w-6xl mx-auto text-center text-slate-600 dark:text-slate-400">
                    <p>"Built with ❤️ for the global church"</p>
                    <p class="mt-2 text-sm">"Powered by Leptos + Rust"</p>
                </div>
            </footer>
        </div>
    }
}

/// Feature card component for the landing page.
#[component]
fn FeatureCardChirho(
    icon: &'static str,
    title: &'static str,
    description: &'static str,
) -> impl IntoView {
    view! {
        <div class="p-6 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <span class="text-4xl">{icon}</span>
            <h3 class="mt-4 text-xl font-semibold text-slate-800 dark:text-white">{title}</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
    }
}

/// Statistics card component.
#[component]
fn StatCardChirho(number: &'static str, label: &'static str) -> impl IntoView {
    view! {
        <div>
            <div class="text-4xl font-bold text-blue-600 dark:text-blue-400">{number}</div>
            <div class="text-slate-600 dark:text-slate-400">{label}</div>
        </div>
    }
}
