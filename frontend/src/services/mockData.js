export const MOCK_CATEGORIES = [
  { id: 1, name: "IT & Technology", slug: "it-technology", subcategory_count: 11, description: "Software development, web design, cloud computing, and DevOps." },
  { id: 2, name: "Construction & Maintenance", slug: "construction-maintenance", subcategory_count: 11, description: "Electricians, plumbers, carpenters, masons, and painters." },
  { id: 3, name: "Personal Services", slug: "personal-services", subcategory_count: 8, description: "Custom tailoring, personal training, beauty, and pet care." },
  { id: 4, name: "Creative & Design", slug: "creative-design", subcategory_count: 9, description: "UI/UX, 3D modeling, graphic design, and video editing." },
  { id: 5, name: "Writing & Content", slug: "writing-content", subcategory_count: 5, description: "Copywriting, blog posts, translations, and proofreading." },
  { id: 6, name: "Marketing", slug: "marketing", subcategory_count: 5, description: "SEO, Google Ads, social media growth, and brand strategy." },
  { id: 7, name: "Business", slug: "business", subcategory_count: 6, description: "Financial consulting, accounting, HR, and virtual assistance." },
  { id: 8, name: "Healthcare & Wellness", slug: "healthcare-wellness", subcategory_count: 4, description: "Clinical dietetics, holistic fitness, and mental wellness." }
];

export const MOCK_FREELANCERS = [
  {
    id: 1,
    user: { id: 10, username: "alex_morgan", first_name: "Alex", last_name: "Morgan", is_verified: true },
    title: "Senior Full-Stack Architect & Cloud Lead",
    hourly_rate: "1500.00",
    experience_years: 8,
    location: "Bengaluru, India",
    rating_avg: 4.95,
    rating_count: 38,
    completed_projects_count: 42,
    bio: "Passionate engineer specializing in Django, React, WebSockets, and AWS Cloud infrastructure.",
    skills_data: [{ id: 1, name: "React" }, { id: 2, name: "Django" }, { id: 3, name: "Python" }]
  },
  {
    id: 2,
    user: { id: 11, username: "sophia_chen", first_name: "Sophia", last_name: "Chen", is_verified: true },
    title: "Master Electrician & Automation Specialist",
    hourly_rate: "1200.00",
    experience_years: 9,
    location: "Mumbai, India",
    rating_avg: 4.98,
    rating_count: 52,
    completed_projects_count: 64,
    bio: "Licensed industrial electrician specializing in smart panel wiring, HVAC controls, and solar setups.",
    skills_data: [{ id: 4, name: "Wiring & Outlets" }, { id: 5, name: "HVAC Controls" }]
  },
  {
    id: 3,
    user: { id: 12, username: "rohan_verma", first_name: "Rohan", last_name: "Verma", is_verified: true },
    title: "Lead UI/UX & Product Designer",
    hourly_rate: "1800.00",
    experience_years: 7,
    location: "Pune, India",
    rating_avg: 4.92,
    rating_count: 29,
    completed_projects_count: 31,
    bio: "Crafting beautiful, high-converting digital products, design systems, and mobile applications.",
    skills_data: [{ id: 6, name: "Figma" }, { id: 7, name: "UI/UX" }, { id: 8, name: "Branding" }]
  }
];

export const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Enterprise Full-Scale E-Commerce Marketplace Development",
    slug: "enterprise-full-scale-e-commerce-marketplace-development",
    description: "Seeking a senior full-stack team to build a high-performance marketplace with Razorpay payments and live chat.",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    category_data: { name: "IT & Technology" },
    budget_type: "FIXED",
    min_budget: "45000.00",
    max_budget: "125000.00",
    proposals_count: 8,
    location_type: "Remote",
    skills_required_data: [{ id: 1, name: "React" }, { id: 2, name: "Django" }],
    attachments: []
  },
  {
    id: 2,
    title: "Commercial Office Complex Smart Electrical Wiring",
    slug: "commercial-office-complex-smart-electrical-wiring",
    description: "Urgent contract for complete electrical wiring overhaul, LED fixture installation, and panel testing.",
    image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    category_data: { name: "Construction & Maintenance" },
    budget_type: "HOURLY",
    min_budget: "25000.00",
    max_budget: "65000.00",
    proposals_count: 5,
    location_type: "Onsite",
    skills_required_data: [{ id: 4, name: "Wiring & Outlets" }],
    attachments: []
  }
];
