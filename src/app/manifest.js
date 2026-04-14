export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "TaskManager - Gestion de tâches",
    short_name: "TaskManager",
    description:
      "Application de gestion des taches pour organiser votre quotidien efficacement",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#155dfc",
    lang: "fr",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
