from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from apps.categories.models import Category, SubCategory
from apps.profiles.models import FreelancerProfile, ClientProfile, Skill, FreelancerSkill, Portfolio, Service
from apps.projects.models import Project, ProjectAttachment
from apps.proposals.models import Proposal
from apps.reviews.models import Review

User = get_user_model()

CATEGORY_DATA = {
    "Personal Services": ["Tailoring", "Beauty", "Massage", "Personal Training", "Pet Care", "Yoga", "Nutrition", "Event Planning"],
    "Construction & Maintenance": ["Electrician", "Plumber", "Carpenter", "Mason", "Painter", "Welder", "Roofer", "Flooring", "HVAC", "Land Surveying", "Scaffolding"],
    "IT & Technology": ["Web Development", "Software Development", "Mobile Development", "Machine Learning", "Data Analysis", "Cloud", "DevOps", "Cyber Security", "Blockchain", "IT Support", "Networking"],
    "Creative & Design": ["UI/UX Design", "Graphic Design", "Illustration", "Branding", "3D Design", "Interior Design", "Animation", "Motion Graphics", "Photography"],
    "Writing & Content": ["Content Writing", "Copywriting", "Translation", "Editing", "Technical Writing"],
    "Marketing": ["Digital Marketing", "SEO", "Social Media Marketing", "Advertising", "Market Research"],
    "Business": ["Business Consulting", "Finance", "Accounting", "Legal", "HR", "Virtual Assistance"],
    "Video & Audio": ["Video Editing", "Video Production", "Audio Production", "Voice Over", "Music"],
    "Engineering & Manufacturing": ["Civil Engineering", "Mechanical Engineering", "Manufacturing", "CAD"],
    "Healthcare & Wellness": ["Healthcare", "Wellness", "Fitness", "Nutrition Care"],
    "Agriculture": ["Agriculture Consulting", "Farming Services", "Landscaping"],
    "Household": ["Cleaning", "Laundry", "Home Services"],
    "Transportation": ["Drivers", "Delivery", "Logistics", "Transport Management"],
    "Retail & Sales": ["Sales", "Retail", "Product Promotion"],
    "Security": ["Security Services", "Safety Consulting"]
}

CATEGORY_IMAGES = {
    "Personal Services": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    "Construction & Maintenance": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    "IT & Technology": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "Creative & Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    "Writing & Content": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    "Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "Business": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "Video & Audio": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    "Engineering & Manufacturing": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    "Healthcare & Wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    "Agriculture": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    "Household": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    "Transportation": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    "Retail & Sales": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    "Security": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80"
}

SKILLS_BY_CATEGORY = {
    "Personal Services": ["Custom Tailoring", "Hair Styling", "Personal Fitness", "Pet Grooming", "Yoga Instruction", "Meal Planning", "Event Coordination"],
    "Construction & Maintenance": ["Wiring & Outlets", "Plumbing Installation", "Custom Carpentry", "Interior Painting", "HVAC Repair", "Flooring & Tiles", "Roof Repair"],
    "IT & Technology": ["React", "Node.js", "Python", "Django", "TypeScript", "Tailwind CSS", "AWS Cloud", "Docker & Kubernetes", "Cyber Security", "Flutter Mobile"],
    "Creative & Design": ["Figma", "UI/UX", "Graphic Design", "Photoshop", "Illustrator", "3D Blender", "Logo Design", "Motion Graphics", "Product Photography"],
    "Writing & Content": ["SEO Copywriting", "Technical Writing", "Blog Writing", "Proofreading", "German Translation", "Ghostwriting", "Press Releases"],
    "Marketing": ["Google Ads", "SEO Audit", "Instagram Growth", "Facebook Campaigns", "Email Marketing", "Brand Strategy", "Market Research"],
    "Business": ["Financial Modeling", "Business Plans", "QuickBooks", "Legal Contracts", "HR Consulting", "Virtual Assistance", "Executive Support"],
    "Video & Audio": ["Premiere Pro", "DaVinci Resolve", "Audio Mastering", "Voice Over", "Podcast Production", "Sound Effects", "Video Animation"],
    "Engineering & Manufacturing": ["AutoCAD", "SolidWorks", "Civil Blueprinting", "Structural Design", "3D CAD Modeling", "Manufacturing Processes"],
    "Healthcare & Wellness": ["Clinical Dietetics", "Holistic Wellness", "Physical Therapy Support", "Mental Health Coaching", "Keto Nutrition"],
    "Agriculture": ["Organic Farming", "Soil Testing", "Hydroponics Design", "Landscaping Design", "Irrigation Systems"],
    "Household": ["Deep House Cleaning", "Laundry & Ironing", "Carpet Cleaning", "Organizing & Decluttering"],
    "Transportation": ["Chauffeur Driving", "Express Delivery", "Supply Chain Logistics", "Fleet Management"],
    "Retail & Sales": ["B2B Sales Outreach", "Retail Merchandising", "E-Commerce Sales Growth", "Product Promotion"],
    "Security": ["Property Security", "Safety Compliance", "CCTV Installation", "Risk Assessment"]
}

FREELANCER_DATA_TEMPLATES = [
    ("{cat_prefix}_pro1@freelancerhub.com", "{cat_prefix}_alex", "Alex", "Morgan", "Senior {cat_name} Specialist", 1200.00, 7, "Mumbai, India", 4.95, 32),
    ("{cat_prefix}_pro2@freelancerhub.com", "{cat_prefix}_sophia", "Sophia", "Chen", "Lead {cat_name} Expert", 1800.00, 9, "Bengaluru, India", 4.98, 48),
    ("{cat_prefix}_pro3@freelancerhub.com", "{cat_prefix}_david", "David", "Miller", "Certified {cat_name} Consultant", 850.00, 5, "Delhi, India", 4.88, 21),
    ("{cat_prefix}_pro4@freelancerhub.com", "{cat_prefix}_elena", "Elena", "Russo", "Master {cat_name} Professional", 1500.00, 6, "Pune, India", 4.92, 29),
    ("{cat_prefix}_pro5@freelancerhub.com", "{cat_prefix}_rohan", "Rohan", "Verma", "Experienced {cat_name} Provider", 650.00, 4, "Hyderabad, India", 4.85, 18),
]

PROJECT_DATA_TEMPLATES = [
    ("Enterprise {cat_name} Implementation", "Seeking a top-tier certified professional to handle enterprise-scale {cat_name} requirements. Full documentation and dedicated support required.", 35000.00, 95000.00),
    ("Custom {cat_name} Solution & Consulting", "Looking for an expert to design and execute customized {cat_name} deliverables with fast turn-around.", 18000.00, 48000.00),
    ("Ongoing Monthly {cat_name} Retainer Contract", "Long-term collaboration for regular weekly work. Clear milestones and prompt payments guaranteed.", 45000.00, 135000.00),
    ("Urgent High-Priority {cat_name} Work", "Urgent requirement needing completion within 4 days. Premium payout offered for top quality.", 25000.00, 65000.00),
    ("Strategic Consultation & Audit for {cat_name}", "Need a senior specialist to review existing setups and provide optimization recommendations.", 12000.00, 32000.00),
    ("Full-Scale {cat_name} Upgrade & Overhaul", "Comprehensive overhaul project requiring end-to-end management and quality testing.", 50000.00, 150000.00),
    ("Local {cat_name} Specialist Required", "Require an experienced local professional for immediate onsite/remote coordination.", 15000.00, 40000.00),
    ("Specialized {cat_name} Technical Deliverable", "Technical contract for specific specialized sub-tasks in {cat_name}. Attention to detail mandatory.", 28000.00, 70000.00),
]

class Command(BaseCommand):
    help = 'Seeds database with 8-10 dummy projects with images per category.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Seeding 8-10 projects with images across all 15 categories..."))

        # Admin & Primary Users
        admin_user, _ = User.objects.get_or_create(
            email='admin@freelancerhub.com',
            defaults={
                'username': 'admin',
                'role': User.Role.ADMIN,
                'first_name': 'System',
                'last_name': 'Administrator',
                'is_staff': True,
                'is_superuser': True,
                'is_verified': True
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()

        client_user, _ = User.objects.get_or_create(
            email='client@freelancerhub.com',
            defaults={
                'username': 'democlient',
                'role': User.Role.CLIENT,
                'first_name': 'Aarav',
                'last_name': 'Sharma',
                'phone': '+919876543210',
                'is_verified': True
            }
        )
        client_user.set_password('client123')
        client_user.save()

        ClientProfile.objects.get_or_create(
            user=client_user,
            defaults={
                'company_name': 'Nexus Innovations',
                'company_website': 'https://nexusinnovations.example.com',
                'location': 'Bengaluru, India',
                'total_spent': 285000.00
            }
        )

        free_user, _ = User.objects.get_or_create(
            email='freelancer@freelancerhub.com',
            defaults={
                'username': 'demofreelancer',
                'role': User.Role.FREELANCER,
                'first_name': 'Priya',
                'last_name': 'Patel',
                'phone': '+919876543211',
                'is_verified': True
            }
        )
        free_user.set_password('freelancer123')
        free_user.save()

        for cat_name, sub_list in CATEGORY_DATA.items():
            cat_slug = slugify(cat_name)
            cat, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={
                    'slug': cat_slug,
                    'description': f"Connect with top-tier verified specialists in {cat_name}.",
                    'icon': 'Briefcase'
                }
            )

            sub_objs = []
            for sub_name in sub_list:
                sub_slug = slugify(sub_name)
                sub_obj, _ = SubCategory.objects.get_or_create(
                    category=cat,
                    name=sub_name,
                    defaults={'slug': sub_slug, 'description': f"Expert {sub_name} services."}
                )
                sub_objs.append(sub_obj)

            skills_list = SKILLS_BY_CATEGORY.get(cat_name, [f"{cat_name} Skill {i}" for i in range(1, 6)])
            cat_skill_objs = []
            for sname in skills_list:
                sk, _ = Skill.objects.get_or_create(name=sname, defaults={'slug': slugify(sname), 'category': cat})
                cat_skill_objs.append(sk)

            cat_prefix = cat_slug.replace('-', '_')[:8]
            
            # Freelancers per category
            for idx, (email_tmpl, uname_tmpl, fname, lname, title_tmpl, rate, exp, loc, rating, done_cnt) in enumerate(FREELANCER_DATA_TEMPLATES):
                email = email_tmpl.format(cat_prefix=cat_prefix)
                uname = uname_tmpl.format(cat_prefix=cat_prefix)
                title = title_tmpl.format(cat_name=cat_name)

                u, _ = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': uname,
                        'role': User.Role.FREELANCER,
                        'first_name': fname,
                        'last_name': lname,
                        'phone': f'+9198765{idx}432{idx}',
                        'is_verified': True
                    }
                )
                u.set_password('demo1234')
                u.save()

                fp, _ = FreelancerProfile.objects.get_or_create(
                    user=u,
                    defaults={
                        'title': title,
                        'bio': f"Dedicated specialist with {exp} years of hands-on expertise in {cat_name}. Committed to delivering exceptional quality, clear communication, and reliable execution.",
                        'primary_category': cat,
                        'hourly_rate': rate + (idx * 200),
                        'experience_years': exp,
                        'location': loc,
                        'rating_avg': rating,
                        'rating_count': 15 + (idx * 3),
                        'completed_projects_count': done_cnt
                    }
                )
                fp.hourly_rate = rate + (idx * 200)
                fp.save()

                for sk in cat_skill_objs[:4]:
                    FreelancerSkill.objects.get_or_create(freelancer=fp, skill=sk, defaults={'level': 'EXPERT'})

                Service.objects.get_or_create(
                    freelancer=fp,
                    title=f"Complete {cat_name} Package #{idx+1}",
                    defaults={
                        'description': f"Comprehensive professional {cat_name} package delivered in 3-5 days with full revisions.",
                        'category': cat,
                        'price': 5000.00 + (idx * 2500),
                        'delivery_time_days': 3 + idx
                    }
                )

            # 8 Projects per category with rich images!
            img_url = CATEGORY_IMAGES.get(cat_name, "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80")
            for p_idx, (title_tmpl, desc_tmpl, min_b, max_b) in enumerate(PROJECT_DATA_TEMPLATES):
                p_title = title_tmpl.format(cat_name=cat_name)
                p_desc = desc_tmpl.format(cat_name=cat_name)
                p_slug = f"{slugify(p_title)}-{cat_prefix}-{p_idx+1}"

                proj, _ = Project.objects.get_or_create(
                    slug=p_slug,
                    defaults={
                        'client': client_user,
                        'title': p_title,
                        'description': p_desc,
                        'image_url': f"{img_url}&sig={p_idx}",
                        'category': cat,
                        'subcategory': sub_objs[p_idx % len(sub_objs)] if sub_objs else None,
                        'budget_type': Project.BudgetType.FIXED if p_idx % 2 == 0 else Project.BudgetType.HOURLY,
                        'min_budget': min_b,
                        'max_budget': max_b,
                        'experience_level': Project.ExperienceLevel.EXPERT if p_idx % 2 == 0 else Project.ExperienceLevel.INTERMEDIATE,
                        'status': Project.Status.OPEN
                    }
                )
                proj.image_url = f"{img_url}&sig={p_idx}"
                proj.min_budget = min_b
                proj.max_budget = max_b
                proj.save()

                if cat_skill_objs:
                    proj.skills_required.set(cat_skill_objs[:3])

                # Create ProjectAttachment image record
                ProjectAttachment.objects.get_or_create(
                    project=proj,
                    filename=f"{cat_slug}_spec_{p_idx+1}.jpg",
                    defaults={'file_url': proj.image_url}
                )

        self.stdout.write(self.style.SUCCESS("All categories populated with 8 projects featuring custom image thumbnails!"))
