// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Server entry point for the Leptos platform.

#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
    use axum::Router;
    use leptos::prelude::*;
    use leptos_axum::{generate_route_list, LeptosRoutes};
    use leptos_platform_chirho::app_chirho::AppChirho;
    use leptos_platform_chirho::db_chirho;
    use leptos_platform_chirho::server_chirho::app_state_chirho::AppStateChirho;
    use tower_http::compression::CompressionLayer;
    use tower_http::trace::TraceLayer;
    use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

    // Load environment variables from .env file
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "leptos_platform_chirho=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Initialize database pool
    let database_url_chirho =
        std::env::var("DATABASE_URL_CHIRHO").expect("DATABASE_URL_CHIRHO must be set");
    let pool_chirho = db_chirho::create_pool_chirho(&database_url_chirho)
        .await
        .expect("Failed to create database pool");

    // Run migrations
    db_chirho::run_migrations_chirho(&pool_chirho)
        .await
        .expect("Failed to run migrations");

    // Get Leptos configuration
    let conf_chirho = get_configuration(None).unwrap();
    let leptos_options_chirho = conf_chirho.leptos_options;
    let addr_chirho = leptos_options_chirho.site_addr;

    // Generate route list for SSR
    let routes_chirho = generate_route_list(AppChirho);

    // Create app state
    let app_state_chirho = AppStateChirho::new_chirho(pool_chirho.clone(), leptos_options_chirho.clone());

    // Build the router
    let app_chirho = Router::new()
        .leptos_routes_with_context(
            &app_state_chirho,
            routes_chirho,
            {
                let state_chirho = app_state_chirho.clone();
                move || {
                    provide_context(state_chirho.pool_chirho.clone());
                }
            },
            {
                let options_chirho = leptos_options_chirho.clone();
                move || {
                    use leptos::prelude::*;
                    view! {
                        <!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="utf-8"/>
                                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                                <AutoReload options=options_chirho.clone()/>
                                <HydrationScripts options=options_chirho.clone()/>
                                <leptos_meta::MetaTags/>
                            </head>
                            <body class="min-h-screen bg-slate-50 dark:bg-slate-900">
                                <AppChirho/>
                            </body>
                        </html>
                    }
                }
            },
        )
        .fallback(leptos_axum::file_and_error_handler::<AppStateChirho, _>(|options_chirho| {
            use leptos::prelude::*;
            view! {
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="utf-8"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1"/>
                        <AutoReload options=options_chirho.clone()/>
                        <HydrationScripts options=options_chirho.clone()/>
                        <leptos_meta::MetaTags/>
                    </head>
                    <body class="min-h-screen bg-slate-50 dark:bg-slate-900">
                        <AppChirho/>
                    </body>
                </html>
            }
        }))
        .layer(CompressionLayer::new())
        .layer(TraceLayer::new_for_http())
        .with_state(app_state_chirho);

    // Start server
    tracing::info!("Starting server at http://{}", addr_chirho);
    let listener_chirho = tokio::net::TcpListener::bind(&addr_chirho).await.unwrap();
    axum::serve(listener_chirho, app_chirho.into_make_service())
        .await
        .unwrap();
}

#[cfg(not(feature = "ssr"))]
fn main() {
    // Client-side entry point - hydration is handled by lib.rs
}
