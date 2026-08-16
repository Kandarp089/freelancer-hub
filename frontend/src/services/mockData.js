export const MOCK_CATEGORIES = [
  { id: 1, name: "IT & Technology", slug: "it-technology", subcategory_count: 11, description: "Software development, web design, cloud computing, and DevOps." },
  { id: 2, name: "Construction & Maintenance", slug: "construction-maintenance", subcategory_count: 11, description: "Electricians, plumbers, carpenters, masons, and painters." },
  { id: 3, name: "Personal Services", slug: "personal-services", subcategory_count: 8, description: "Custom tailoring, personal training, beauty, and pet care." },
  { id: 4, name: "Creative & Design", slug: "creative-design", subcategory_count: 9, description: "UI/UX, 3D modeling, graphic design, and video editing." },
  { id: 5, name: "Writing & Content", slug: "writing-content", subcategory_count: 5, description: "Copywriting, blog posts, translations, and proofreading." },
  { id: 6, name: "Marketing", slug: "marketing", subcategory_count: 5, description: "SEO, Google Ads, social media growth, and brand strategy." },
  { id: 7, name: "Business", slug: "business", subcategory_count: 6, description: "Financial consulting, accounting, HR, and virtual assistance." },
  { id: 8, name: "Healthcare & Wellness", slug: "healthcare-wellness", subcategory_count: 4, description: "Clinical dietetics, holistic fitness, and mental wellness." },
  { id: 9, name: "Video & Audio", slug: "video-audio", subcategory_count: 5, description: "Video editing, voice over, sound design, and podcast editing." },
  { id: 10, name: "Engineering & Manufacturing", slug: "engineering-manufacturing", subcategory_count: 4, description: "AutoCAD blueprints, 3D modeling, and mechanical design." },
  { id: 11, name: "Agriculture", slug: "agriculture", subcategory_count: 3, description: "Organic farming, soil testing, and landscaping design." },
  { id: 12, name: "Household", slug: "household", subcategory_count: 4, description: "Deep cleaning, carpet washing, and organizing." },
  { id: 13, name: "Transportation", slug: "transportation", subcategory_count: 4, description: "Drivers, delivery management, and logistics." },
  { id: 14, name: "Retail & Sales", slug: "retail-sales", subcategory_count: 3, description: "Sales strategies, retail display, and product promotion." },
  { id: 15, name: "Security", slug: "security", subcategory_count: 2, description: "Security consulting, surveillance installation, and safety." }
];

export const MOCK_FREELANCERS = [
  {
    id: 1,
    user: { id: 10, username: "alex_morgan", email: "alex@freelancerhub.com", first_name: "Alex", last_name: "Morgan", is_verified: true },
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
    user: { id: 11, username: "sophia_chen", email: "sophia@freelancerhub.com", first_name: "Sophia", last_name: "Chen", is_verified: true },
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
    user: { id: 12, username: "rohan_verma", email: "rohan@freelancerhub.com", first_name: "Rohan", last_name: "Verma", is_verified: true },
    title: "Lead UI/UX & Product Designer",
    hourly_rate: "1800.00",
    experience_years: 7,
    location: "Pune, India",
    rating_avg: 4.92,
    rating_count: 29,
    completed_projects_count: 31,
    bio: "Crafting beautiful, high-converting digital products, design systems, and mobile applications.",
    skills_data: [{ id: 6, name: "Figma" }, { id: 7, name: "UI/UX" }, { id: 8, name: "Branding" }]
  },
  {
    id: 4,
    user: { id: 13, username: "priya_patel", email: "priya@freelancerhub.com", first_name: "Priya", last_name: "Patel", is_verified: true },
    title: "Chartered Financial Consultant & Tax Advisor",
    hourly_rate: "2200.00",
    experience_years: 10,
    location: "Ahmedabad, India",
    rating_avg: 4.96,
    rating_count: 45,
    completed_projects_count: 58,
    bio: "Financial planning, GST audits, corporate budgeting, and valuation services for startups.",
    skills_data: [{ id: 9, name: "Finance" }, { id: 10, name: "Accounting" }]
  },
  {
    id: 5,
    user: { id: 14, username: "kabir_singh", email: "kabir@freelancerhub.com", first_name: "Kabir", last_name: "Singh", is_verified: true },
    title: "SEO Specialist & Growth Marketer",
    hourly_rate: "1100.00",
    experience_years: 6,
    location: "Delhi, India",
    rating_avg: 4.88,
    rating_count: 34,
    completed_projects_count: 39,
    bio: "Scaling e-commerce brands with organic SEO, Google Ads, and high-converting landing pages.",
    skills_data: [{ id: 11, name: "SEO Audit" }, { id: 12, name: "Google Ads" }]
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
    status: "OPEN",
    proposals_count: 8,
    location_type: "Remote",
    client_data: { username: "democlient" },
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
    status: "IN_PROGRESS",
    proposals_count: 5,
    location_type: "Onsite",
    client_data: { username: "tech_enterprise" },
    skills_required_data: [{ id: 4, name: "Wiring & Outlets" }],
    attachments: []
  },
  {
    id: 3,
    title: "Mobile App UI/UX Redesign & Brand Guidelines",
    slug: "mobile-app-ui-ux-redesign",
    description: "Complete visual redesign of iOS and Android mobile app interfaces with dark mode design system.",
    image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    category_data: { name: "Creative & Design" },
    budget_type: "FIXED",
    min_budget: "35000.00",
    max_budget: "75000.00",
    status: "OPEN",
    proposals_count: 12,
    location_type: "Remote",
    client_data: { username: "design_agency" },
    skills_required_data: [{ id: 6, name: "Figma" }, { id: 7, name: "UI/UX" }],
    attachments: []
  },
  {
    id: 4,
    title: "Corporate Financial Audit & Tax Filing 2026",
    slug: "corporate-financial-audit",
    description: "Full accounting audit, GST reconciliation, and balance sheet certification for private limited entity.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    category_data: { name: "Business" },
    budget_type: "FIXED",
    min_budget: "50000.00",
    max_budget: "90000.00",
    status: "COMPLETED",
    proposals_count: 6,
    location_type: "Remote",
    client_data: { username: "global_ventures" },
    skills_required_data: [{ id: 9, name: "Finance" }],
    attachments: []
  }
];

export const MOCK_PROPOSALS = [
  {
    id: 1,
    project_data: { title: "Enterprise Full-Scale E-Commerce Marketplace" },
    freelancer_data: { username: "alex_morgan" },
    bid_amount: "55000.00",
    estimated_delivery_days: 14,
    cover_letter: "I have 8+ years building Django and React applications. I can deliver full payment integration and live chat in 14 days.",
    status: "PENDING"
  },
  {
    id: 2,
    project_data: { title: "Commercial Office Complex Smart Electrical Wiring" },
    freelancer_data: { username: "sophia_chen" },
    bid_amount: "32000.00",
    estimated_delivery_days: 7,
    cover_letter: "Licensed master electrician with certified industrial safety training. Can complete panel wiring in 7 days.",
    status: "ACCEPTED"
  },
  {
    id: 3,
    project_data: { title: "Mobile App UI/UX Redesign & Brand Guidelines" },
    freelancer_data: { username: "rohan_verma" },
    bid_amount: "42000.00",
    estimated_delivery_days: 10,
    cover_letter: "I specialize in Figma design systems and dark mode mobile UI. Ready to start immediately.",
    status: "PENDING"
  }
];
