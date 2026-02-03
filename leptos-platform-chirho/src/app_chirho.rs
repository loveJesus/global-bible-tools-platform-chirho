// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Main application component and routing configuration.

use leptos::prelude::*;
use leptos_meta::{provide_meta_context, Meta, Stylesheet, Title};
use leptos_router::{
    components::{Route, Router, Routes},
    path,
};

use crate::routes_chirho::{
    admin_chirho::{
        AdminPageChirho, AnalyticsPageChirho, FeedbackPageChirho, JobsPageChirho,
        LanguagesPageChirho, UsersPageChirho,
    },
    auth_chirho::{LoginPageChirho, LogoutPageChirho, RegisterPageChirho},
    home_chirho::HomePageChirho,
    not_found_chirho::NotFoundPageChirho,
    profile_chirho::ProfilePageChirho,
    read_chirho::ReadPageChirho,
    translate_chirho::TranslatePageChirho,
};

/// Main application component with routing.
#[component]
pub fn AppChirho() -> impl IntoView {
    // Provides context for meta tags
    provide_meta_context();

    view! {
        // Base metadata
        <Meta name="description" content="Bible translation tools for the global church"/>
        <Meta name="viewport" content="width=device-width, initial-scale=1"/>

        // Tailwind CSS
        <Stylesheet id="leptos" href="/pkg/leptos-platform-chirho.css"/>

        // Default title (can be overridden by pages)
        <Title text="Global Bible Tools"/>

        // Router with all application routes
        <Router>
            <main>
                <Routes fallback=|| view! { <NotFoundPageChirho/> }>
                    // Public routes
                    <Route path=path!("/") view=HomePageChirho/>

                    // Auth routes
                    <Route path=path!("/login-chirho") view=LoginPageChirho/>
                    <Route path=path!("/logout-chirho") view=LogoutPageChirho/>
                    <Route path=path!("/register-chirho") view=RegisterPageChirho/>

                    // Reader routes
                    <Route path=path!("/read-chirho/:code/:chapter") view=ReadPageChirho/>

                    // Translation routes
                    <Route path=path!("/translate-chirho/:code/:verse") view=TranslatePageChirho/>

                    // User routes
                    <Route path=path!("/profile-chirho") view=ProfilePageChirho/>

                    // Admin routes
                    <Route path=path!("/admin-chirho") view=AdminPageChirho/>
                    <Route path=path!("/admin-chirho/users-chirho") view=UsersPageChirho/>
                    <Route path=path!("/admin-chirho/languages-chirho") view=LanguagesPageChirho/>
                    <Route path=path!("/admin-chirho/feedback-chirho") view=FeedbackPageChirho/>
                    <Route path=path!("/admin-chirho/jobs-chirho") view=JobsPageChirho/>
                    <Route path=path!("/admin-chirho/analytics-chirho") view=AnalyticsPageChirho/>
                </Routes>
            </main>
        </Router>
    }
}
