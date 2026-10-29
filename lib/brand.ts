/**
 * Central brand, contact and navigation constants.
 * Business details are the official ones supplied by the company.
 */
export const company = {
  name: "Ibtikan Ibn Adams Properties Limited",
  shortName: "Ibtikan Properties",
  ceo: "Mr. Armiyaw Abubakar",
  website: "https://www.ibtikanproperties.com",
  email: "info@ibtikanproperties.com",
  phone: "+233 24 420 1019",
  phoneDisplay: "+233 24 420 1019",
  phoneHref: "tel:+233244201019",
  location: "Accra, Ghana",
  motto: "People • Places • Possibilities",
  vision: "Building Better Communities for a Brighter Tomorrow",
} as const;

export const propertyCategories = [
  "land",
  "residential",
  "commercial",
  "luxury",
  "gated-community",
] as const;
export type PropertyCategory = (typeof propertyCategories)[number];

export const propertyCategoryLabels: Record<PropertyCategory, string> = {
  land: "Land for Sale",
  residential: "Residential Properties",
  commercial: "Commercial Properties",
  luxury: "Luxury Homes",
  "gated-community": "Gated Communities",
};

export const transactionTypes = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
] as const;

export const enquiryStatuses = ["new", "opened", "responded", "closed"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const projectStatuses = [
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "on-hold", label: "On hold" },
  { value: "completed", label: "Completed" },
] as const;

export function projectStatusLabel(value: string): string {
  return projectStatuses.find((s) => s.value === value)?.label ?? value;
}

export const enquiryTypes = [
  { value: "general", label: "General enquiry" },
  { value: "property", label: "Property enquiry" },
  { value: "invest", label: "Investment enquiry" },
  { value: "diaspora", label: "Diaspora enquiry" },
  { value: "project", label: "Project enquiry" },
] as const;

export const nav: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "CEO Profile", href: "/about/ceo" },
    ],
  },
  {
    label: "Properties",
    href: "/properties",
    children: [
      { label: "All Properties", href: "/properties" },
      { label: "Land for Sale", href: "/land-sales" },
      { label: "Residential Properties", href: "/residential-properties" },
      { label: "Luxury Homes", href: "/luxury-homes" },
      { label: "Commercial Properties", href: "/commercial-properties" },
      { label: "Gated Communities", href: "/gated-communities" },
    ],
  },
  {
    label: "Services",
    href: "/property-development",
    children: [
      { label: "Property Development", href: "/property-development" },
      { label: "Property Management", href: "/property-management" },
      { label: "Investment Opportunities", href: "/investment-opportunities" },
      { label: "Diaspora Investment", href: "/diaspora-investment" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Investment", href: "/investment-opportunities" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

/** Editorial architecture/interior imagery used while the company supplies its
 *  own media. Every URL below was verified returning HTTP 200. These are
 *  decorative placeholders and are never presented as company listings. */
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80`;

export const media = {
  hero: u("1613490493576-7fde63acd811"),
  aboutBuilding: u("1486406146926-c627a92ad1ab"),
  skylineDusk: u("1477959858617-67f85cf4f1df"),
  interior: u("1600585154340-be6161a56a0c"),
  livingRoom: u("1560448204-e02f11c3d0e2"),
  hallway: u("1600607687920-4e2a09cf159d"),
  bedroom: u("1600566753086-00f18fb6b3ea"),
  bathInterior: u("1600566753190-17f0baa2a6c3"),
  kitchen: u("1600585154526-990dced4db0d"),
  houseLawn: u("1494526585095-c41746248156"),
  housePool: u("1518780664697-55e3ad937233"),
  houseWhite: u("1600047509807-ba8f99d2cdde"),
  buildingCorner: u("1582407947304-fd86f028f716"),
  buildingLight: u("1507089947368-19c1da9775ae"),
  towers: u("1568992687947-868a62a9f521"),
  openLand: u("1466978913421-dad2ebd01d17"),
} as const;
