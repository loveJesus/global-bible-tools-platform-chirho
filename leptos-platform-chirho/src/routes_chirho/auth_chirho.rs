// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Authentication route components.

use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::components::A;

/// Login form data.
#[derive(Clone, Debug, Default)]
pub struct LoginFormChirho {
    pub email_chirho: String,
    pub password_chirho: String,
}

/// Login page component.
#[component]
pub fn LoginPageChirho() -> impl IntoView {
    let (email_chirho, set_email_chirho) = signal(String::new());
    let (password_chirho, set_password_chirho) = signal(String::new());
    let (error_chirho, set_error_chirho) = signal(Option::<String>::None);
    let (loading_chirho, set_loading_chirho) = signal(false);

    let submit_chirho = move |ev: leptos::ev::SubmitEvent| {
        ev.prevent_default();
        set_loading_chirho.set(true);
        set_error_chirho.set(None);

        // TODO: Call server function for login
        #[cfg(feature = "ssr")]
        {
            // Server-side login logic
        }

        set_loading_chirho.set(false);
    };

    view! {
        <Title text="Sign In | Global Bible Tools"/>

        <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div class="max-w-md w-full">
                <div class="text-center mb-8">
                    <A href="/" attr:class="text-4xl">
                        "📖"
                    </A>
                    <h1 class="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                        "Sign in to your account"
                    </h1>
                    <p class="mt-2 text-slate-600 dark:text-slate-400">
                        "Or "
                        <A href="/register-chirho" attr:class="text-blue-600 hover:underline">
                            "create a new account"
                        </A>
                    </p>
                </div>

                <form
                    on:submit=submit_chirho
                    class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8"
                >
                    // Error message
                    {move || error_chirho.get().map(|err| view! {
                        <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                            {err}
                        </div>
                    })}

                    // Email field
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Email"
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="you@example.com"
                            prop:value=email_chirho
                            on:input=move |ev| set_email_chirho.set(event_target_value(&ev))
                        />
                    </div>

                    // Password field
                    <div class="mb-6">
                        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Password"
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                            prop:value=password_chirho
                            on:input=move |ev| set_password_chirho.set(event_target_value(&ev))
                        />
                    </div>

                    // Submit button
                    <button
                        type="submit"
                        disabled=loading_chirho
                        class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                        {move || if loading_chirho.get() { "Signing in..." } else { "Sign In" }}
                    </button>
                </form>

                <p class="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    <A href="/" attr:class="hover:underline">
                        "← Back to home"
                    </A>
                </p>
            </div>
        </div>
    }
}

/// Registration page component.
#[component]
pub fn RegisterPageChirho() -> impl IntoView {
    let (name_chirho, set_name_chirho) = signal(String::new());
    let (email_chirho, set_email_chirho) = signal(String::new());
    let (password_chirho, set_password_chirho) = signal(String::new());
    let (confirm_password_chirho, set_confirm_password_chirho) = signal(String::new());
    let (error_chirho, set_error_chirho) = signal(Option::<String>::None);
    let (loading_chirho, set_loading_chirho) = signal(false);

    let submit_chirho = move |ev: leptos::ev::SubmitEvent| {
        ev.prevent_default();

        if password_chirho.get() != confirm_password_chirho.get() {
            set_error_chirho.set(Some("Passwords do not match".to_string()));
            return;
        }

        set_loading_chirho.set(true);
        set_error_chirho.set(None);

        // TODO: Call server function for registration

        set_loading_chirho.set(false);
    };

    view! {
        <Title text="Create Account | Global Bible Tools"/>

        <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div class="max-w-md w-full">
                <div class="text-center mb-8">
                    <A href="/" attr:class="text-4xl">
                        "📖"
                    </A>
                    <h1 class="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                        "Create your account"
                    </h1>
                    <p class="mt-2 text-slate-600 dark:text-slate-400">
                        "Already have an account? "
                        <A href="/login-chirho" attr:class="text-blue-600 hover:underline">
                            "Sign in"
                        </A>
                    </p>
                </div>

                <form
                    on:submit=submit_chirho
                    class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8"
                >
                    // Error message
                    {move || error_chirho.get().map(|err| view! {
                        <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                            {err}
                        </div>
                    })}

                    // Name field
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Name"
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your name"
                            prop:value=name_chirho
                            on:input=move |ev| set_name_chirho.set(event_target_value(&ev))
                        />
                    </div>

                    // Email field
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Email"
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="you@example.com"
                            prop:value=email_chirho
                            on:input=move |ev| set_email_chirho.set(event_target_value(&ev))
                        />
                    </div>

                    // Password field
                    <div class="mb-4">
                        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Password"
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            minlength="8"
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                            prop:value=password_chirho
                            on:input=move |ev| set_password_chirho.set(event_target_value(&ev))
                        />
                    </div>

                    // Confirm password field
                    <div class="mb-6">
                        <label for="confirm_password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            "Confirm Password"
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            required
                            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                            prop:value=confirm_password_chirho
                            on:input=move |ev| set_confirm_password_chirho.set(event_target_value(&ev))
                        />
                    </div>

                    // Submit button
                    <button
                        type="submit"
                        disabled=loading_chirho
                        class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                        {move || if loading_chirho.get() { "Creating account..." } else { "Create Account" }}
                    </button>
                </form>

                <p class="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    <A href="/" attr:class="hover:underline">
                        "← Back to home"
                    </A>
                </p>
            </div>
        </div>
    }
}

/// Logout page/handler component.
#[component]
pub fn LogoutPageChirho() -> impl IntoView {
    // TODO: Clear session and redirect to home

    view! {
        <Title text="Signing out..."/>
        <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div class="text-center">
                <p class="text-slate-600 dark:text-slate-400">"Signing out..."</p>
            </div>
        </div>
    }
}
