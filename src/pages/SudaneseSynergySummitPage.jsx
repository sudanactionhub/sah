import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Play, Mail, ExternalLink} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { DivIcon } from 'leaflet';

const SudaneseSynergySummitPage = () => {
  const { toast } = useToast();
  const [involvementData, setInvolvementData] = useState({ name: '', email: '', organization: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
  const photoUrls = Array.from({ length: 86 }, (_, i) => {
    const fileNumber = i + 1;
    return supabase.storage
      .from('ssm26')
      .getPublicUrl(`photos/${fileNumber}.jpg`).data.publicUrl;
  });

  setPhotos(photoUrls);
}, []);

  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInvolvementData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('synergy_involvement').insert([involvementData]);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your inquiry. Please try again.' });
    } else {
      toast({ title: 'Thank you!', description: "We've received your interest in getting involved. We'll be in touch soon!" });
      setInvolvementData({ name: '', email: '', organization: '', message: '' });
    }
    setLoading(false);
  };

  const panels = [
    {
      title: 'PANEL 1: MEDICINE, DISPLACEMENT, AND GLOBAL RESPONSIBILITY',
      description: 'Health, Displacement, and Crisis examined the far-reaching humanitarian consequences of war through the lens of public health, forced displacement, and access to care. This panel brought together experts and advocates to discuss the collapse of health systems in conflict, the realities faced by displaced populations, and the broader global implications of Sudan’s humanitarian crisis. From urgent medical needs to long-term public health challenges, the conversation emphasized the interconnectedness of health, human rights, and humanitarian response, while calling attention to the sustained action needed from the international community.',
      panelists: [
        { name: 'Professor Mohamed Satti', bio: '', 
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Satti.png`).data.publicUrl},
        { name: 'Ismail Kushkush', bio: '', 
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Kushkush.png`).data.publicUrl},
        { name: 'Dr. Farashin Silevany', bio: '', 
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Silevany.png`).data.publicUrl},
        { name: 'Dr. Jacob Atem', bio: '', 
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Atem.png`).data.publicUrl},
        { name: 'Farhad Ebrahim', bio: '', 
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Ebrahim.jpeg`).data.publicUrl}
      ],
      moderator: [
        { name: 'Samia Basheir',
            image: "https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/sign/Board%20Headshots/Samia.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mODU5YWMwYy1lOGI0LTQ5Y2MtODExMC0yMjUwNjM3ZDU1OTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCb2FyZCBIZWFkc2hvdHMvU2FtaWEucG5nIiwiaWF0IjoxNzc1NzcyNDM0LCJleHAiOjIwOTExMzI0MzR9.0B7rbFToUcwsMxDRn0iWFuodO91HvDcoBd7afa58BQ4"}
      ],
      videoUrl: 'https://www.youtube.com/embed/nshJLM11FzU?start=5070', 
      thumbnailUrl: supabase.storage
  .from('ssm26')
  .getPublicUrl('video_thumbnails/panel-1.jpg').data.publicUrl,
    },
    {
      title: 'PANEL 2: UNFILTERED & SUDANESE: THE NEXT GENERATION',
      description: 'The Next Generation, Unfiltered brought together young Sudanese voices shaping advocacy and cultural storytelling in real time. From digital organizers and journalists to creatives, comedians, and influencers, this conversation explored how youth are using their platforms to raise awareness, preserve Sudanese history and identity, challenge narratives, and mobilize action. Panelists spoke candidly about the responsibility and power of stepping into our roots unapologetically, and about what it means for this generation to be at the forefront of the movement for Sudan. The discussion was both energizing and honest, underscoring that youth are not simply the future of advocacy—they are actively shaping its present.',
      panelists: [
        { name: 'Tarek Abdelkhalig', bio: '',
          image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Tarek.png`).data.publicUrl},
        { name: 'Bebo Ibrahim', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/bebo.png`).data.publicUrl},
        { name: 'Ahmed Helal', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Ahmed.png`).data.publicUrl},
        { name: 'Mina Mafhouz', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Mina.png`).data.publicUrl},
        { name: 'Lubna Daldum', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Lubna.png`).data.publicUrl},
        { name: 'Abubaker Al Siddiq', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Abubaker.png`).data.publicUrl},
        { name: 'Ayman Elshabik', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Ayman.png`).data.publicUrl},

      ],
       moderator: [
        { name: 'Mozen Mertami',
            image: "https://i.imgur.com/igdojnp.png"
         }
      ],
      videoUrl: 'https://www.youtube.com/embed/nshJLM11FzU?start=13260',
      thumbnailUrl: supabase.storage
  .from('ssm26')
  .getPublicUrl('video_thumbnails/panel-2.jpg').data.publicUrl,
    },
    {
      title: 'PANEL 3:  WOMEN AT THE FOREFRONT',
      description: 'Women at the Forefront centered the critical role women play in movements for liberation, while also addressing the disproportionate burden women and girls carry in times of conflict. Featuring advocates, organizers, and political leaders, the panel explored the realities women are facing amid the war in Sudan, from gender-based violence and displacement to the broader humanitarian crisis. The conversation also highlighted cross-cultural solidarity, with voices like Rashida Tlaib and Linda Sarsour reflecting on how our struggles and freedoms are interconnected. Grounded in both lived experience and global advocacy, the panel affirmed that women are not only among those most affected by war, but also among those leading resistance, survival, and change.',
      panelists: [
        { name: 'Rashida Tlaib', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Tlaib.png`).data.publicUrl},
        { name: 'Zeinab Bakhiet', bio: '',            
          image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Bakhiet.png`).data.publicUrl},
        { name: 'Ashley Boulos', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Boulos.png`).data.publicUrl},
        { name: 'Suehaila Amen', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Amen.png`).data.publicUrl},
        { name: 'Khadega Mohammed', bio: '',
            image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Khadega.png`).data.publicUrl}

      ],
       moderator: [
        { name: 'Mozen Mertami',
            image: "https://i.imgur.com/igdojnp.png"}
      ],
      videoUrl: 'https://www.youtube.com/embed/y1LyZ9JOxno?start=4370',
      thumbnailUrl: supabase.storage
  .from('ssm26')
  .getPublicUrl('video_thumbnails/panel-3.jpg').data.publicUrl,
    }
  ];

  const FashionShowThumbnailUrl = supabase.storage
  .from('ssm26')
  .getPublicUrl('video_thumbnails/fashionshow.jpg').data.publicUrl;

  const keynoteSpeakers = [
    { name: 'Adbulrazik Mohamed', bio: 'Founder of Kudusi, Scholar of International Affairs, and Darfur Researcher', image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Abdulrazik.png`).data.publicUrl},
    { name: 'Suheila Amen', bio: 'National Organizing Director, American-Arab Anti-Discrimination', image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Amen.png`).data.publicUrl},
    { name: 'Adeeb Yousif', bio: 'Human Rights Activist, Peacebuilding Scholar, and Former Governor of Central Darfur', image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Yousif.png`).data.publicUrl},
    { name: 'Zul Qurnain', bio: 'Community Advocate, Founder of One Love One Ummah, And Co-founder of Kudusi', image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Qurnain.png`).data.publicUrl},
    { name: 'Dr.Jacob Atem', bio: 'Public Health Practitioner, Refugee Advocate, and Co-Founder of the Southern Sudan Healthcare Organization', image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Atem.png`).data.publicUrl},
    { name: 'Linda Sarsour', bio: 'Author, Activist, and Community Organizer', image: supabase.storage.from('ssm26').getPublicUrl(`speaker_headshots/Sarsour.png`).data.publicUrl}
  ];

  const decorativeBgUrl = 'https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/ssm26/ArabicSudan.png';
const heroVideoUrl =
  'https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/ssm26/Recap_Video.mp4';

const FashionShowVideoUrl =
  'https://www.youtube.com/embed/y1LyZ9JOxno?start=7612&rel=0';

const YouTubeEmbedWithThumbnail = ({videoUrl, title, thumbnailUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
      {!isPlaying ? (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 group"
          aria-label={`Play ${title}`}
        >
          <img
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-red-700 ml-1" />
            </div>
          </div>
        </button>
      ) : (
        <iframe
          className="w-full h-full"
          src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
};

  return (
    <>
      <Helmet>
        <link rel="preload" as="video" href={heroVideoUrl} type="video/mp4" />
        <title>Sudanese Synergy Summit | Sudan Action Hub</title>
        <meta name="description" content="Recap of the inaugural Sudanese Synergy Summit 2026. Overview of panels, speakers, and recordings from the event." />
        <meta name="keywords" content="Sudanese Synergy Summit, Sudan event, diaspora summit, Sudanese community" />
        <link rel="canonical" href="https://sudanactionhub.org/sss26" />
        <meta property="og:title" content="Sudanese Synergy Summit | Sudan Action Hub" />
        <meta property="og:description" content="Recap of the inaugural Sudanese Synergy Summit 2026." />
        <meta property="og:image" content="https://via.placeholder.com/1200x630" />
        <meta property="og:url" content="https://sudanactionhub.org/sss26" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

    <main className="relative overflow-hidden bg-white">
      {/* Alternating left-right repeating background */}
        <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url("${decorativeBgUrl}"), url("${decorativeBgUrl}")`,
          backgroundRepeat: 'repeat-y, repeat-y',
          backgroundPosition: 'right 1rem top 0px, left 0rem top 260px',
          backgroundSize: '520px auto, 520px auto',
          opacity: 0.70,
        }}
      />

      {/* Page content */}
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* <img className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Sudanese Synergy Summit" src="https://via.placeholder.com/1920x1080" /> */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">Sudanese Synergy Summit 2026</h1>
            {/*
            <p className="text-xl lg:text-2xl text-blue-200 max-w-3xl mx-auto">
              Displacement shapes us. Community sustains us. Culture defines us.
            </p>
            */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <Calendar className="w-6 h-6" />
              <span>April 11-12, 2026</span>
            </div>
            <div className="mx-auto mt-10 max-w-[960px]">
  <div className="mx-auto mt-10 max-w-[960px]">
    <video
      src={heroVideoUrl}
      volume={7}
      preload="auto"
      autoPlay
      playsInline
      loop
      controls={false}
      onCanPlay={(e) => {
        e.currentTarget.play().catch(() => {});
      }}
      ref={(el) => {
        if (!el || el.__heroVideoObserver) return;

        el.__heroVideoObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                el.play().catch(() => {});
              } else {
                el.pause();
              }
            });
          },
          { threshold: 0.5 }
        );

        el.__heroVideoObserver.observe(el);
      }}
    />
  </div>
</div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-gray-50/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl py-2 font-bold text-blue-950">About the Summit</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-4xl mx-auto">
              The Sudanese Summit was a powerful weekend of community, culture, advocacy, and collective visioning created as a space for Sudanese people and allies to come together during an incredibly urgent moment for Sudan. Co-hosted with the Najwa Foundation, the summit celebrated the richness of Sudanese identity while fostering meaningful dialogue around how we continue raising awareness, mobilizing support, and building sustained advocacy for Sudan. Across the weekend, attendees engaged with advocates, elected officials, community organizers, artists, influencers, creators, and thought leaders, all contributing to conversations rooted in justice, solidarity, and community care. More than an event, the summit was a reminder of the importance of creating spaces for us, by us spaces where the Sudanese community can gather, heal, strategize, and imagine what collective liberation can look like.
            </p>
          </div>
        </div>
      </section>

      {/* Contents Overview */}
      <section className="py-20 bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">Event Contents</h2>
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center ">
                  <Users className="w-6 h-6 mr-2" />
                  Panels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>In-depth discussions on key topics</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="w-6 h-6 mr-2" />
                  Keynote Speakers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Inspiring talks from experts</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white">
              <CardHeader>
                <CardTitle>Cultural Showcase</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Fashion show and performances</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white">
              <CardHeader>
                <CardTitle>Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Building connections for future collaboration</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Panels Section */}
      <section className="py-20 bg-gray-50/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">Panels</h2>
          <div className="space-y-12">
            {panels.map((panel, index) => (
              <Card key={index} className="bg-gradient-to-br from-red-900 to-red-600 text-white overflow-hidden">
                <CardHeader>
                  <CardTitle className = "py-4">
                    {panel.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {panel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Panelists</h4>
                      {panel.panelists.map((panelist, i) => (
                        <div key={i} className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                             <img
                                 src={panelist.image}
                                     alt={panelist.name}
                                         className="w-full h-full object-cover"
                                           />
                          </div>
                          <div>
                            <p className="font-medium">{panelist.name}</p>
                            <p className="text-sm text-gray-300">{panelist.bio}</p>
                          </div>
                        </div>
                      ))}
                      <Button asChild className="mt-4">
                        <a href={panel.videoUrl} target="_blank" rel="noopener noreferrer">
                          Watch Panel <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                    <div className="flex justify-center items-center">
  <div className="w-full max-w-xl">
    <div className="flex justify-center items-center">
  <div className="w-full max-w-xl">
    <YouTubeEmbedWithThumbnail
      videoUrl={panel.videoUrl}
      title={panel.title}
      thumbnailUrl={panel.thumbnailUrl}
    />
  </div>
</div>
</div>
</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Keynote Speakers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">Keynote Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keynoteSpeakers.map((speaker, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-6 flex-shrink-0">
                      <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{speaker.name}</h3>
                      <p className="text-gray-600">{speaker.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fashion Show Video */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">Fashion Show</h2>
          <div className="max-w-4xl mx-auto">
            <YouTubeEmbedWithThumbnail
  videoUrl={FashionShowVideoUrl}
  title="Sudanese Synergy Summit Fashion Show"
  thumbnailUrl={FashionShowThumbnailUrl}
/>
            <div className="text-center mt-6">
              <Button asChild>
                <a href={FashionShowVideoUrl} target="_blank" rel="noopener noreferrer">
                  Watch Full Fashion Show <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">Photo Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Summit photo ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Partners/Sponsors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">Partners & Sponsors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center items-center"> 
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/1.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/2.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/3.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/4.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/5.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/6.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/7.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/8.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/9.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/10.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/11.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/12.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/13.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/14.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/15.png`).data.publicUrl} alt="Partner 1" className="h-36" />
            <img src={supabase.storage.from('ssm26').getPublicUrl(`partner_logos/16.png`).data.publicUrl} alt="Partner 1" className="h-36" />
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-20 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Get Involved</h2>
            <p className="text-xl text-gray-600 mt-4">
              Interested in participating in next year's summit? Email us at <a href="mailto:admin@sudanhub.org" className="text-blue-600">admin@sudanhub.org</a>
            </p>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Express Your Interest</CardTitle>
              <CardDescription>Fill out the form below to get involved in future events.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={involvementData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={involvementData.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="organization">Organization (Optional)</Label>
                  <Input id="organization" value={involvementData.organization} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={involvementData.message} onChange={handleInputChange} />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
  </div>
  </main>
    </>
  );
};

export default SudaneseSynergySummitPage;