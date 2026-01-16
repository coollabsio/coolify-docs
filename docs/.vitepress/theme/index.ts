// https://vitepress.dev/guide/custom-theme
// Import types
import type { Theme } from "vitepress";

// Import OpenAPI components
import { theme, useOpenapi } from "vitepress-openapi/client";

// Import default theme
import DefaultTheme from "vitepress/theme";

// Import styles
import "./style.css";
import "./custom.css";
import "./tailwind.css";
import "vitepress-openapi/dist/style.css";
import 'virtual:group-icons.css'


// Import plugins
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";

// Import components
import Card from "./components/Card.vue";
import CardGroup from "./components/CardGroup.vue";
import Landing from "./layouts/Landing.vue";
import Sections from "./components/Landing/Sections.vue";
import ServicesList from "./components/Services/List.vue";
import Features from "./components/Landing/Features.vue";
import Installer from "./components/Landing/Installer.vue";
import Referral from "./components/Landing/Referral.vue";
import Callout from "./components/Callout.vue";
import TabBlock from "./components/TabBlock.vue";
import ZoomableImage from "./components/ZoomableImage.vue";
import Globe from "./components/Landing/Globe.vue";
import Browser from "./components/Landing/Browser.vue";
import KorrektlySearch from "./components/KorrektlySearch.vue";

// Import Vdoc overrides
import VPDoc from "./components/VPDoc.vue";
import VPDocAside from "./components/VPDocAside.vue";
import { DirectiveBinding } from "vue";

export default {
  extends: DefaultTheme,
  Layout: Landing,
  async enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app);

    // Dynamically fetch the OpenAPI spec
    try {
      // Use GitHub's raw content API to avoid CORS issues
      const response = await fetch("https://raw.githubusercontent.com/coollabsio/coolify/v4.x/openapi.json", { cache: "no-store" });
      const spec = await response.json();

      useOpenapi({
        spec,
      });
    } catch (error) {
      console.error("Failed to load OpenAPI spec from GitHub, falling back to local file:", error);
      // Fallback to local file if GitHub fetch fails
      try {
        const localSpec = await import("./openapi.json", { assert: { type: "json" } });
        useOpenapi({
          spec: localSpec.default,
        });
      } catch (localError) {
        console.error("Failed to load local OpenAPI spec:", localError);
      }
    }

    theme.enhanceApp({ app, router, siteData });
    app.component("Card", Card);
    app.component("CardGroup", CardGroup);
    app.component("LandingSection", Sections);
    app.component("LandingFeatures", Features);
    app.component("ServicesList", ServicesList);
    app.component("Referral", Referral);
    app.component("Quickstart", Installer);
    app.component("Callout", Callout);
    app.component("TabBlock", TabBlock);
    app.component("ZoomableImage", ZoomableImage);
    app.component("Globe", Globe);
    app.component("Browser", Browser);
    app.component("KorrektlySearch", KorrektlySearch);

    // Register Vdoc overrides
    app.component("VPDoc", VPDoc);
    app.component("VPDocAside", VPDocAside);

    router.onAfterRouteChange = () => {
      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("pageview");
      }
    };
    app.directive("plausible", {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        const eventName = binding.arg;
        const eventData = binding.value || {};

        el.addEventListener("click", () => {
          if (
            typeof window !== "undefined" &&
            (window as any).plausible &&
            eventName
          ) {
            (window as any).plausible(eventName, { props: eventData });
          }
        });
      },
    });
  },
} satisfies Theme;
