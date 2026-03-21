import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, User, Heart, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HopeAndHavenBlogPost = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Why Trust Matters',
    },
    {
      id: 'funding-gap',
      title: 'The Gap Between Funding and Delivery',
    },
    {
      id: 'community-rooted-response',
      title: 'A Community-Rooted Response',
    },
    {
      id: 'discernment',
      title: 'Giving with Discernment',
    },
    {
      id: 'references',
      title: 'References',
    }
  ];

  const photos = [
    {
      src: 'https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/HopeandHaven/man_distributing_food.png',
      alt: 'Volunteer distributing food aid to community members',
      caption: "In the week of November 10, 2026, Hope and Haven's food kitchens served over 1,050 free meals each day across Khartoum North, Al Jazirah, and White Nile State."
    },
    {
      src: 'https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/HopeandHaven/food_collage.png',
      alt: 'Hope and Haven food distribution and medical support collage',
      caption: 'In addition to food distribution, Hope and Haven also operates health clinics, providing medical care and emergency supplies to displaced families.'
    },
    {
      src: 'https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/HopeandHaven/we_need_your_help.png',
      alt: 'Hope and Haven team and beneficiaries in André, Chad',
      caption: 'Photo courtesy of the Hope and Haven Refugee Association team in André, Chad.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sudan Action Hub partners with Hope and Haven Refugees International | Sudan Action Hub</title>
        <meta
          name="description"
          content="A feature article from Sudan Action Hub on trust, accountability, and the importance of supporting community-rooted humanitarian response through Hope and Haven Refugee Association."
        />
        <meta
          name="keywords"
          content="Sudan Action Hub, Hope and Haven, Sudan humanitarian crisis, Sudan blog, Ramadan campaign, Sudan refugees, Darfur aid, Sudan diaspora giving"
        />
        <link rel="canonical" href="https://sudanactionhub.org/blog/HopeandHaven" />

        <meta property="og:title" content="Sudan Action Hub partners with Hope and Haven Refugees International" />
        <meta
          property="og:description"
          content="A feature article on trust, accountability, and community-rooted humanitarian response for displaced families from Sudan."
        />
        <meta property="og:url" content="https://sudanactionhub.org/blog/HopeandHaven" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Sudan Action Hub" />
        <meta
          property="og:image"
          content="https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/HopeandHaven/man_distributing_food.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sudan Action Hub partners with Hope and Haven Refugees International" />
        <meta
          name="twitter:description"
          content="A feature article on trust, accountability, and community-rooted humanitarian response for displaced families from Sudan."
        />
        <meta
          name="twitter:image"
          content="https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/HopeandHaven/man_distributing_food.png"
        />
      </Helmet>

        <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-950 text-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4 py-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-green-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium tracking-wide mb-6">
                Ramadan Campaign
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
                Sudan Action Hub partners with Hope and Haven Refugees International
              </h1>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 text-green-100 text-sm md:text-base mb-8">
                <div className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>By Selsbiel Mertami</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>March 6, 2026</span>
                </div>
              </div>

             {/*
             <div className="flex flex-col sm:flex-row gap-4">
                <a href="#article-content">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white bg-transparent hover:bg-white/10"
                  >
                    Read the Article
                  </Button>
                </a>
              </div>
              */}
            </motion.div>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/95">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto">
            <nav className="flex items-center gap-3 min-w-max">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-800 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <main id="article-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <img
              src={photos[0].src}
              alt={photos[0].alt}
              className="w-full h-[280px] md:h-[460px] object-cover rounded-2xl shadow-sm"
            />
            <p className="text-sm text-gray-500 mt-3">{photos[0].caption}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-12">
            <article className="min-w-none">
              <motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="max-w-none"
>
  <section id="introduction" className="scroll-mt-28">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Trust Matters</h2>
    <p className="text-gray-700 text-lg leading-8 mb-5">
      In moments of crisis, generosity is almost automatic, but trust is not. When
      images of displacement, hunger, and violence emerge from Sudan, the instinct to
      give is immediate. Families abroad wire money. Students organize fundraisers.
      Communities mobilize. As Sudan faces one of the largest humanitarian emergencies
      in the world, many in the diaspora want to help in any way they can.
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      Yet too often, we hesitate.
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      We pause before clicking “donate.” We ask where the money goes. We question
      whether it reaches families in Darfur, Khartoum, or Gezira, or whether it is
      absorbed by layers of coordination long before it touches the ground. That
      hesitation is not apathy. It is accountability. It reflects a deeper concern
      about whether humanitarian systems are structured to prioritize proximity,
      transparency, and impact.
    </p>
  </section>

  <div className="my-12">
    <img
      src={photos[1].src}
      alt={photos[1].alt}
      className="w-full h-[240px] md:h-[380px] object-cover rounded-2xl shadow-sm"
    />
    <p className="text-sm text-gray-500 mt-3">{photos[1].caption}</p>
  </div>

  <section id="funding-gap" className="scroll-mt-28">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">The Gap Between Funding and Delivery</h2>
    <p className="text-gray-700 text-lg leading-8 mb-5">
      This mistrust is not imagined. Sudan’s 2025 Humanitarian Response Plan aimed to
      assist 20.9 million vulnerable people with $4.16 billion in required funding,
      yet by the end of 2025 only approximately $1.06 billion had been recorded,
      roughly one quarter of what was requested (OCHA 2025). When appeals remain
      underfunded, the consequences are concrete. In December 2025, the World Food
      Programme announced that it would reduce food rations in Sudan beginning in
      January 2026 due to severe funding shortages, even as hunger levels continued to
      escalate (Reuters 2025).
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      Data supports donor skepticism around whether funding reaches frontline
      responders in Sudan. According to Refugees International, in 2024 only 1
      percent of Sudan Humanitarian Fund resources, $1.4 million, went directly to
      local and national actors. In the first eight months of 2025, that figure fell
      to zero percent, with only 16 percent reaching local actors indirectly
      (Refugees International 2025). Patterns of funding inefficiencies are visible
      across the wider response: of the $1.3 billion contributed to Sudan’s 2024
      Humanitarian Response Plan, only $3.3 million reached national or local NGOs and
      community-based organizations directly (Refugees International 2025).
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      Together, financial figures illuminate a widening gap between resources pledged
      and relief delivered, a gap that fuels skepticism among diaspora communities
      eager to help but cautious about how aid is structured and distributed.
    </p>
  </section>

  <div className="my-12 rounded-2xl border border-green-100 bg-green-50 p-6 md:p-8">
    <h3 className="text-2xl font-bold text-green-900 mb-4">
      Why this matters for donors
    </h3>
    <p className="text-gray-700 text-lg leading-8 mb-0">
      For many supporters, especially in the Sudanese diaspora, responsible giving is
      not just about generosity. It is about making sure aid reaches families
      directly, quickly, and with dignity. Trust grows when response models are rooted
      in transparency, local knowledge, and close community ties.
    </p>
  </div>

  <section id="community-rooted-response" className="scroll-mt-28">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">A Community-Rooted Response</h2>
    <p className="text-gray-700 text-lg leading-8 mb-5">
      For communities searching for ways to give responsibly, the answer is not
      necessarily in larger systems alone, but in organizations embedded within the
      very communities they serve.
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      Organizations operating in close proximity to displaced communities, with real
      stakes and real accountability. Hope and Haven Refugee Association represents
      this kind of model.
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      Founded from the Sudanese-rooted Saving AlGeneina Initiative in 2023, Hope and
      Haven works across Sudan and in Chad to help refugees and internally displaced
      people seeking safety from war by providing essential medical care, food, and
      emergency supplies. Its teams operate community kitchens that serve more than a
      thousand hot meals daily to displaced families, distribute food parcels and
      shelter materials, and run medical outreach camps that deliver care in high-need
      areas such as North Darfur and Khartoum. In a context where funding gaps and
      structural bottlenecks continue to widen, Hope and Haven offers something
      increasingly rare: direct, community-rooted response built on proximity, trust,
      and lived experience.
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      Hope and Haven does not stand apart from the broader humanitarian system. It
      operates from within it, but closer to the communities most affected. In doing
      so, it disrupts the discourse around who holds the resources and who makes the
      decisions, prioritizing community voices and values. It offers a reminder that
      effective aid is not only about the size of an appeal or the scale of an
      institution, but about who holds the resources and who makes the decisions.
    </p>
  </section>

  <div className="my-12">
    <img
      src={photos[2].src}
      alt={photos[2].alt}
      className="w-full h-[240px] md:h-[380px] object-cover rounded-2xl shadow-sm"
    />
    <p className="text-sm text-gray-500 mt-3">{photos[2].caption}</p>
  </div>

  <section id="discernment" className="scroll-mt-28">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Giving with Discernment</h2>
    <p className="text-gray-700 text-lg leading-8 mb-5">
      For communities navigating how to give responsibly, this moment calls for
      discernment rather than disengagement. The question is not whether to give; the
      question is how to give in ways that strengthen local leadership and sustain the
      networks already keeping communities alive.
    </p>
    <p className="text-gray-700 text-lg leading-8 mb-5 indent-8">
      If Sudan’s humanitarian response is to become more accountable and more
      resilient, its impact will depend on investing in the people and organizations
      that have remained present when others could not.
    </p>
  </section>
{/*
  <section className="scroll-mt-28">
    <div className="rounded-2xl bg-gray-900 text-white p-8 md:p-10 mt-10">
      <h2 className="text-3xl font-bold mb-4">Support the work</h2>
      <p className="text-gray-200 text-lg leading-8 mb-6">
        an Action Hub’s humanitarian aid and advocacy efforts by making a donationSupport Sud.
      </p>
      <a
        href="https://donate.stripe.com/6oUcN5e5rd6Zdos3Kr9sk01"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          <Heart className="h-4 w-4 mr-2" />
          Donate Now
          <ArrowUpRight className="h-4 w-4 ml-2" />
        </Button>
      </a>
    </div>
  </section>
  */}

                <section id="references" className="scroll-mt-28 mt-16">
                  <h2 className="text-3xl font-bold mb-6">References</h2>
                  <div className="not-prose rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
                    <ul className="space-y-5 text-sm md:text-base text-gray-700 leading-7">
                      <li>
                        <span className="font-semibold">Office for the Coordination of Humanitarian Affairs (OCHA).</span>{' '}
                        <em>Sudan Humanitarian Needs and Response Plan 2025.</em> United Nations, 2025.{' '}
                        <a
                          href="https://www.unocha.org/publications/report/sudan/sudan-humanitarian-needs-and-response-plan-2025-overview"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-900 underline break-all"
                        >
                          www.unocha.org/publications/report/sudan/sudan-humanitarian-needs-and-response-plan-2025-overview
                        </a>
                      </li>

                      <li>
                        <span className="font-semibold">OCHA.</span>{' '}
                        <em>Country Focus: Sudan.</em> Humanitarian Action, United Nations, 2025.{' '}
                        <a
                          href="https://humanitarianaction.info/article/country-focus-sudan"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-900 underline break-all"
                        >
                          humanitarianaction.info/article/country-focus-sudan
                        </a>
                      </li>

                      <li>
                        <span className="font-semibold">Refugees International.</span>{' '}
                        <em>Accelerating Localization: A Roadmap for the Sudan Humanitarian Fund.</em> 2025.{' '}
                        <a
                          href="https://www.refugeesinternational.org/reports-briefs/accelerating-localization-a-roadmap-for-the-sudan-humanitarian-fund/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-900 underline break-all"
                        >
                          www.refugeesinternational.org/reports-briefs/accelerating-localization-a-roadmap-for-the-sudan-humanitarian-fund/
                        </a>
                      </li>

                      <li>
                        <span className="font-semibold">Reuters.</span>{' '}
                        <em>Food Rations in Sudan to Be Reduced Due to Funding Shortages, WFP Says.</em> 12 Dec. 2025.{' '}
                        <a
                          href="https://www.reuters.com/world/africa/food-rations-sudan-be-reduced-due-funding-shortages-wfp-says-2025-12-12/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-900 underline break-all"
                        >
                          www.reuters.com/world/africa/food-rations-sudan-be-reduced-due-funding-shortages-wfp-says-2025-12-12/
                        </a>
                      </li>

                      <li>
                        <span className="font-semibold">Hope and Haven Refugee Association.</span>{' '}
                        <em>About Us.</em> Hope and Haven for Refugees, 2023.{' '}
                        <a
                          href="https://www.hopeandhavenforrefugees.org/about"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-900 underline break-all"
                        >
                          www.hopeandhavenforrefugees.org/about
                        </a>
                      </li>

                      <li>
                        <span className="font-semibold">Refugees International.</span>{' '}
                        <em>One Year On: Sudanese Voices Are Still Speaking Out on Sudan.</em> 2024.{' '}
                        <a
                          href="https://www.refugeesinternational.org/perspectives-and-commentaries/one-year-on-sudanese-voices-are-still-speaking-out-on-sudan/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-900 underline break-all"
                        >
                          www.refugeesinternational.org/perspectives-and-commentaries/one-year-on-sudanese-voices-are-still-speaking-out-on-sudan/
                        </a>
                      </li>

                      <li>
                        <span className="font-semibold">Défis Humanitaires.</span>{' '}
                        <em>Summary: Humanitarian Funding and Reform.</em> 2024.{' '}
                        <a
                          href="https://defishumanitaires.com/en/2024/10/29/summary-humanitarian-funding-and-reform/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-900 underline break-all"
                        >
                          defishumanitaires.com/en/2024/10/29/summary-humanitarian-funding-and-reform/
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>
              </motion.div>
            </article>

            <aside className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:sticky lg:top-28 space-y-6"
              >
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Article Details</h3>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Author</p>
                      <p className="font-semibold text-gray-900">Selsbiel Mertami</p>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Published</p>
                      <p className="font-semibold text-gray-900">March 6, 2026</p>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Category</p>
                      <p className="font-semibold text-gray-900">Ramadan Campaign</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-3">Quick Navigation</h3>
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block text-sm text-green-800 hover:text-green-950 transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </div>
                </div>
                {/** 
                 <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Take Action</h3>
                  <p className="text-sm text-gray-600 leading-7 mb-4">
                    Support Sudan Action Hub’s humanitarian aid and advocacy efforts by making a donation.
                  </p>
                  <a
                    href="https://donate.stripe.com/4gM6oHe5r0kd98cft99sk00?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Donate
                    </Button>
                  </a>
                </div>
                  */}
              </motion.div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

const blogMeta = {
  slug: '/blog/HopeandHaven',
  title: 'Sudan Action Hub partners with Hope and Haven Refugees International',
  author: 'Selsbiel Mertami',
  dateDisplay: 'March 6, 2026',
  dateISO: '2026-03-06',
  category: 'Ramadan Campaign',
  excerpt:
    'A feature article on trust, accountability, and the importance of supporting community-rooted humanitarian response for displaced families from Sudan.',
  coverImage:
    'https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/HopeandHaven/man_distributing_food.png',
};

export { blogMeta };

export default HopeAndHavenBlogPost;