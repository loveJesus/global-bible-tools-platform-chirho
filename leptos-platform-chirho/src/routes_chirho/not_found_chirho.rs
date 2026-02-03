// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! 404 Not Found page component.

use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::components::A;

/// 404 Not Found page.
#[component]
pub fn NotFoundPageChirho() -> impl IntoView {
    view! {
        <Title text="Page Not Found | Global Bible Tools"/>

        <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <div class="text-center">
                <div class="text-6xl mb-4">"📖"</div>
                <h1 class="text-4xl font-bold text-slate-800 dark:text-white mb-2">"404"</h1>
                <p class="text-xl text-slate-600 dark:text-slate-400 mb-8">
                    "Page not found"
                </p>
                <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                    "The page you're looking for doesn't exist or has been moved."
                </p>
                <A
                    href="/"
                    attr:class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    "Go Home"
                </A>
            </div>
        </div>
    }
}
