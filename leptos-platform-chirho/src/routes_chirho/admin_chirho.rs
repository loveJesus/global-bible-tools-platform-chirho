// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Admin route components.

use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::components::A;

/// Admin section definition.
struct AdminSectionChirho {
    title_chirho: &'static str,
    description_chirho: &'static str,
    href_chirho: &'static str,
    icon_chirho: &'static str,
}

/// Admin dashboard page.
#[component]
pub fn AdminPageChirho() -> impl IntoView {
    let sections_chirho = vec![
        AdminSectionChirho {
            title_chirho: "Users",
            description_chirho: "Manage user accounts and permissions",
            href_chirho: "/admin-chirho/users-chirho",
            icon_chirho: "👥",
        },
        AdminSectionChirho {
            title_chirho: "Languages",
            description_chirho: "Manage translation languages and settings",
            href_chirho: "/admin-chirho/languages-chirho",
            icon_chirho: "🌐",
        },
        AdminSectionChirho {
            title_chirho: "Feedback",
            description_chirho: "View and respond to user feedback",
            href_chirho: "/admin-chirho/feedback-chirho",
            icon_chirho: "💬",
        },
        AdminSectionChirho {
            title_chirho: "Jobs",
            description_chirho: "View background job status and history",
            href_chirho: "/admin-chirho/jobs-chirho",
            icon_chirho: "⚙️",
        },
        AdminSectionChirho {
            title_chirho: "Analytics",
            description_chirho: "View translation progress and activity statistics",
            href_chirho: "/admin-chirho/analytics-chirho",
            icon_chirho: "📊",
        },
    ];

    view! {
        <Title text="Admin | Global Bible Tools"/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-3xl font-bold text-slate-800 dark:text-white">"Administration"</h1>
                <p class="mt-2 text-slate-600 dark:text-slate-400">"Manage platform settings and users"</p>

                <div class="mt-8 grid gap-6 md:grid-cols-3">
                    {sections_chirho
                        .into_iter()
                        .map(|section_chirho| {
                            view! {
                                <A
                                    href=section_chirho.href_chirho
                                    attr:class="block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
                                >
                                    <span class="text-3xl">{section_chirho.icon_chirho}</span>
                                    <h2 class="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                                        {section_chirho.title_chirho}
                                    </h2>
                                    <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {section_chirho.description_chirho}
                                    </p>
                                </A>
                            }
                        })
                        .collect_view()}
                </div>

                <div class="mt-8 text-center">
                    <A href="/" attr:class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        "← Back to Home"
                    </A>
                </div>
            </div>
        </div>
    }
}

/// Users management page.
#[component]
pub fn UsersPageChirho() -> impl IntoView {
    view! {
        <Title text="Users | Admin | Global Bible Tools"/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">"User Management"</h1>
                        <p class="text-slate-600 dark:text-slate-400">"Manage user accounts and permissions"</p>
                    </div>
                    <A href="/admin-chirho" attr:class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        "← Back to Admin"
                    </A>
                </div>

                // TODO: User list with server function
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <p class="text-slate-600 dark:text-slate-400">"User list will be loaded here..."</p>
                </div>
            </div>
        </div>
    }
}

/// Languages management page.
#[component]
pub fn LanguagesPageChirho() -> impl IntoView {
    view! {
        <Title text="Languages | Admin | Global Bible Tools"/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">"Language Management"</h1>
                        <p class="text-slate-600 dark:text-slate-400">"Manage translation languages"</p>
                    </div>
                    <A href="/admin-chirho" attr:class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        "← Back to Admin"
                    </A>
                </div>

                // TODO: Language list with server function
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <p class="text-slate-600 dark:text-slate-400">"Language list will be loaded here..."</p>
                </div>
            </div>
        </div>
    }
}

/// Feedback management page.
#[component]
pub fn FeedbackPageChirho() -> impl IntoView {
    view! {
        <Title text="Feedback | Admin | Global Bible Tools"/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">"User Feedback"</h1>
                        <p class="text-slate-600 dark:text-slate-400">"View and respond to user feedback"</p>
                    </div>
                    <A href="/admin-chirho" attr:class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        "← Back to Admin"
                    </A>
                </div>

                // Stats cards (placeholder)
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCardChirho value="0" label="Total Feedback"/>
                    <StatCardChirho value="0" label="New"/>
                    <StatCardChirho value="0" label="Bugs"/>
                    <StatCardChirho value="0" label="Praise"/>
                </div>

                // TODO: Feedback list with server function
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <p class="text-slate-600 dark:text-slate-400">"Feedback list will be loaded here..."</p>
                </div>
            </div>
        </div>
    }
}

/// Jobs monitoring page.
#[component]
pub fn JobsPageChirho() -> impl IntoView {
    view! {
        <Title text="Jobs | Admin | Global Bible Tools"/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">"Background Jobs"</h1>
                        <p class="text-slate-600 dark:text-slate-400">"View import job status and history"</p>
                    </div>
                    <A href="/admin-chirho" attr:class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        "← Back to Admin"
                    </A>
                </div>

                // TODO: Job list with server function
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <p class="text-slate-600 dark:text-slate-400">"Job list will be loaded here..."</p>
                </div>
            </div>
        </div>
    }
}

/// Analytics dashboard page.
#[component]
pub fn AnalyticsPageChirho() -> impl IntoView {
    view! {
        <Title text="Analytics | Admin | Global Bible Tools"/>

        <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">"Analytics Dashboard"</h1>
                        <p class="text-slate-600 dark:text-slate-400">"Translation progress and activity overview"</p>
                    </div>
                    <A href="/admin-chirho" attr:class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        "← Back to Admin"
                    </A>
                </div>

                // Overview stats
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <StatCardChirho value="0" label="Languages"/>
                    <StatCardChirho value="0" label="Active Users"/>
                    <StatCardChirho value="0" label="Total Glosses"/>
                    <StatCardChirho value="0" label="Approved"/>
                    <StatCardChirho value="0" label="Machine Glosses"/>
                </div>

                // TODO: Charts and detailed analytics
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <p class="text-slate-600 dark:text-slate-400">"Analytics charts will be displayed here..."</p>
                </div>
            </div>
        </div>
    }
}

/// Stats card component.
#[component]
fn StatCardChirho(value: &'static str, label: &'static str) -> impl IntoView {
    view! {
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div class="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">{label}</div>
        </div>
    }
}
