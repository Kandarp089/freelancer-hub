from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.categories.models import Category, SubCategory
from apps.projects.models import Project
from apps.proposals.models import Proposal

User = get_user_model()

class FreelancerHubAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.client_user = User.objects.create_user(
            username='client_test',
            email='client@test.com',
            password='password123',
            role=User.Role.CLIENT
        )

        self.freelancer_user = User.objects.create_user(
            username='freelancer_test',
            email='freelancer@test.com',
            password='password123',
            role=User.Role.FREELANCER
        )

        # Category
        self.category = Category.objects.create(
            name='IT & Technology',
            slug='it-technology',
            description='Tech services'
        )

        self.subcategory = SubCategory.objects.create(
            category=self.category,
            name='Web Development',
            slug='web-development'
        )

    def test_user_authentication(self):
        """Test registration and JWT token login."""
        response = self.client.post('/api/auth/login/', {
            'email': 'client@test.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_project_lifecycle(self):
        """Test client posting a project, freelancer bidding, and proposal acceptance."""
        # 1. Login Client
        self.client.force_authenticate(user=self.client_user)

        # 2. Post Project
        proj_resp = self.client.post('/api/projects/', {
            'title': 'Build React Web Portal',
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'budget_type': 'FIXED',
            'min_budget': '500.00',
            'max_budget': '1500.00',
            'description': 'Construct a modern Web portal',
            'status': 'OPEN'
        })
        self.assertEqual(proj_resp.status_code, status.HTTP_201_CREATED)
        project_id = proj_resp.data['id']

        # 3. Login Freelancer
        self.client.force_authenticate(user=self.freelancer_user)

        # 4. Submit Proposal
        prop_resp = self.client.post('/api/proposals/', {
            'project': project_id,
            'bid_amount': '800.00',
            'estimated_delivery_days': 10,
            'cover_letter': 'I have built React portals before.'
        })
        self.assertEqual(prop_resp.status_code, status.HTTP_201_CREATED)
        proposal_id = prop_resp.data['id']

        # 5. Client accepts proposal
        self.client.force_authenticate(user=self.client_user)
        accept_resp = self.client.post(f'/api/proposals/{proposal_id}/accept/')
        self.assertEqual(accept_resp.status_code, status.HTTP_200_OK)

        # 6. Verify project status updated to ASSIGNED
        proj = Project.objects.get(id=project_id)
        self.assertEqual(proj.status, 'ASSIGNED')
        self.assertEqual(proj.assigned_freelancer, self.freelancer_user)
