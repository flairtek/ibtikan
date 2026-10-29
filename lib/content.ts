import "server-only";
import { getSetting } from "./repo";

/**
 * Editable page content. Each key has a shipped default defined here; the
 * /admin/pages dashboard can override any of these values (stored in the
 * settings table), so the company can refine copy without a release.
 */

export interface ContentKeyDef {
  label: string;
  description: string;
  defaults: string;
}

export const CONTENT_KEYS: Record<string, ContentKeyDef> = {
  "home.intro": {
    label: "Homepage — company introduction",
    description:
      "Body copy for the 'Property. Purpose. Possibility.' section of the homepage.",
    defaults:
      "Ibtikan Ibn Adams Properties Limited is a Ghana-focused real estate company dedicated to responsible property development, land sales, residential housing, commercial properties and real estate investment opportunities.\n\nGuided by a commitment to integrity, professionalism and customer-focused service, we work to contribute to well-planned communities and lasting property value — helping people across Ghana and the diaspora make confident property decisions.",
  },
  "about.intro": {
    label: "About page — company introduction",
    description: "Main introduction on the About Us page.",
    defaults:
      "Ibtikan Ibn Adams Properties Limited is a Ghana-focused real estate company dedicated to property development, land sales, residential housing, commercial properties, and real estate investment opportunities. Guided by a commitment to integrity, professionalism, and customer-focused service, the company aspires to contribute to well-planned communities and lasting property value.",
  },
  "property-management.scope": {
    label: "Property Management — service scope",
    description:
      "Describe the property management services the company actually provides today. Leave as a draft if the scope is not yet confirmed.",
    defaults:
      "Property management services are being finalised. This page will be updated after the company confirms the exact scope of its management offering.\n\nIf you would like to discuss the management of a property you own, please enquire directly so our team can confirm what is currently available.",
  },
};

export async function getPageContent(key: string): Promise<string> {
  "use cache";
  const def = CONTENT_KEYS[key];
  if (!def) return "";
  try {
    const stored = await getSetting<string | null>(`content:${key}`, null);
    return stored ?? def.defaults;
  } catch {
    return def.defaults;
  }
}
