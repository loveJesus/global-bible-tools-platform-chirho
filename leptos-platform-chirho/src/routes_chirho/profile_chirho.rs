// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! User profile page component.

use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::components::A;

/// User profile page.
#[component]
pub fn ProfilePageChirho() -> impl IntoView {
    let (name_chirho, set_name_chirho) = signal(String::new());
    let (email_chirho, _set_email_chirho) = signal(String::new());
    let (saving_chirho, set_saving_chirho) = signal(false);

    let save_profile_chirho = move |ev: leptos::ev::SubmitEvent| {
        ev.prevent_default();
        set_saving_chirho.set(true);

        // TODO: Call server function to update profile

        set_saving_chirho.set(false);
    };

    view! {
        <Title text="Profile | Global Bible Tools"/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div class="max-w-2xl mx-auto">
                // Header
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">"Your Profile"</h1>
                        <p class="text-slate-600 dark:text-slate-400">"Manage your account settings"</p>
                    </div>
                    <A href="/" attr:class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        "← Back to Home"
                    </A>
                </div>

                // Profile picture section
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
                    <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">"Profile Picture"</h2>

                    <div class="flex items-center gap-6">
                        // Avatar placeholder
                        <div class="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <svg class="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>

                        <div class="flex flex-col gap-2">
                            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                "Upload Picture"
                            </button>
                            <p class="text-xs text-slate-500 dark:text-slate-400">"JPG, PNG. Max 2MB."</p>
                        </div>
                    </div>
                </div>

                // Profile form
                <form
                    on:submit=save_profile_chirho
                    class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
                >
                    <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">"Account Information"</h2>

                    // Name field
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Name"
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your name"
                            prop:value=name_chirho
                            on:input=move |ev| set_name_chirho.set(event_target_value(&ev))
                        />
                    </div>

                    // Email field (read-only)
                    <div class="mb-6">
                        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Email"
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            disabled
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            prop:value=email_chirho
                        />
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">"Email cannot be changed"</p>
                    </div>

                    // Submit button
                    <button
                        type="submit"
                        disabled=saving_chirho
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                        {move || if saving_chirho.get() { "Saving..." } else { "Save Changes" }}
                    </button>
                </form>

                // Language memberships
                <div class="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">"Language Teams"</h2>
                    <p class="text-slate-600 dark:text-slate-400 text-sm">
                        "You are not a member of any translation teams yet."
                    </p>
                    <A
                        href="/admin-chirho/languages-chirho"
                        attr:class="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                        "Browse available languages →"
                    </A>
                </div>

                // Danger zone
                <div class="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50 p-6">
                    <h2 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">"Danger Zone"</h2>
                    <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">
                        "Permanently delete your account and all associated data."
                    </p>
                    <button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                        "Delete Account"
                    </button>
                </div>
            </div>
        </div>
    }
}
