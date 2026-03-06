import react from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from "@/components/ScrollToTop";

// Public Pages
import HomePage from '@/pages/HomePage';
import NewsPage from '@/pages/NewsPage';
import ResearchPage from '@/pages/ResearchPage';
import EvidencePage from '@/pages/EvidencePage';
import AdvocacyPage from '@/pages/AdvocacyPage';
import EventsPage from '@/pages/EventsPage';
import HumanitarianPage from '@/pages/HumanitarianPage';
import GalaPage from '@/pages/GalaPage';
import DonationsPage from '@/pages/DonationsPage';
import DonatePage from '@/pages/DonatePage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import OrganizationDirectoryPage from '@/pages/OrganizationDirectoryPage';
import DirectoryDataPage from '@/pages/DirectoryDataPage';
import DonationSuccessPage from '@/pages/DonationSuccessPage';
import PastInitiativesPage from '@/pages/PastInitiativesPage';
import EventDetailPage from '@/pages/EventDetailPage';
import DiasporaSupportPage from '@/pages/DiasporaSupportPage';
import JoinUsPage from '@/pages/JoinUsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import BlogPostPage from '@/pages/BlogPostsPage';
import HopeAndHavenBlogPost from '@/pages/BlogPages/HopeandHaven';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterOrganizationPage from '@/pages/auth/RegisterOrganizationPage';
import RegisterUserPage from '@/pages/auth/RegisterUserPage';

// Dashboard Pages
//import UserDashboard from '@/pages/dashboard/UserDashboard';
import InternalAdminDashboard from '@/pages/admin/InternalAdminDashboard';

function App() {
	return (
		<AuthProvider>
			<Helmet>
				<meta name="keywords" content="sudan war, sudan news, sudan civil war, war in sudan, sudan people, sudan africa, sudan genocide, sudan conflict, sudan time" />
				<meta property="og:image" content="https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/sign/sah_logo/SAHLogoTransparent_White.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mODU5YWMwYy1lOGI0LTQ5Y2MtODExMC0yMjUwNjM3ZDU1OTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzYWhfbG9nby9TQUhMb2dvVHJhbnNwYXJlbnRfV2hpdGUucG5nIiwiaWF0IjoxNzcyMTU5MDA2LCJleHAiOjIwODc1MTkwMDZ9.FI6s3PSsUB6Tdx7H1v0p4mb1XUg0Gufb5oI0_apf6E0" />   
			</Helmet>
			<Router>
				<CartProvider>
					<div className="min-h-screen flex flex-col">
						<Navigation />
						 <ScrollToTop />
						<main className="flex-grow">
							<Routes>
								{/* Public Routes */}
								<Route path="/" element={<HomePage />} />
								<Route path="/news" element={<NewsPage />} />
								<Route path="/research" element={<ResearchPage />} />
								<Route path="/organization-directory" element={<OrganizationDirectoryPage />} />
								<Route path="/organization-directory/data" element={<DirectoryDataPage />} />
								<Route path="/evidence-collection" element={<EvidencePage />} />
								<Route path="/advocacy" element={<AdvocacyPage />} />
								<Route path="/events" element={<EventsPage />} />
								<Route path="/events/:id" element={<EventDetailPage />} />
								<Route path="/event-programming" element={<PastInitiativesPage />} />
								<Route path="/humanitarian" element={<HumanitarianPage />} />
								<Route path="/diaspora" element={<DiasporaSupportPage />} />
								<Route path="/gala" element={<GalaPage />} />
								<Route path="/donations" element={<DonationsPage />} />
								<Route path="/donate" element={<DonatePage />} />
							
								<Route path="/blog" element={<BlogPostPage />} />
								<Route path="/blog/HopeandHaven" element={<HopeAndHavenBlogPost />} />

								<Route path="/donation-success" element={<DonationSuccessPage />} />
								<Route path="/contact" element={<ContactPage />} />
								<Route path="/about" element={<AboutPage />} />
								<Route path="/joinus" element={<JoinUsPage />} />
								<Route path="/privacypolicy" element={<PrivacyPolicyPage />} />

								{/* Auth Routes */}
								<Route path="/login" element={<LoginPage />} />
								<Route path="/register-org" element={<RegisterOrganizationPage />} />
								<Route path="/register-user" element={<RegisterUserPage />} />

								{/* Protected Routes */}
								{/*<Route
									path="/dashboard"
									element={
										<ProtectedRoute>
											<UserDashboard />
										</ProtectedRoute>
									}
								/> */}
								<Route
									path="/admin/portal"
									element={
										<ProtectedRoute requiredRole="super_admin">
											<InternalAdminDashboard />
										</ProtectedRoute>
									}
								/>
							</Routes>
						</main>
						<Footer />
						<Toaster />
					</div>
				</CartProvider>
			</Router>
		</AuthProvider>
	);
}

export default App;
	