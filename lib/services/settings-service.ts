import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface GeneralSettings {
  timezone: string;
  // ... other settings
}

export interface WebsiteContent {
  hero: {
    title: string;
    description: string;
    videoUrl: string;
  };
  about: {
    title: string;
    description: string;
    features: string[];
    imageUrl: string;
  };
  benefits: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      iconName: string;
    }>;
  };
  partners: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      logoPath: string;
      description: string;
      highlights: Array<{
        icon: string;
        text: string;
      }>;
      imagePath: string;
      link: string;
    }>;
  };
  facilities: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      features: string[];
      imageSrc: string;
      imageAlt: string;
      className?: string;
    }>;
  };
  team: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
  };
}

export const settingsService = {
  async getGeneralSettings(): Promise<GeneralSettings> {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    return docSnap.data() as GeneralSettings || { timezone: 'America/New_York' };
  },

  async updateGeneralSettings(settings: Partial<GeneralSettings>): Promise<void> {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, settings, { merge: true });
  },

  async getWebsiteContent(): Promise<WebsiteContent> {
    const docRef = doc(db, 'settings', 'website');
    const docSnap = await getDoc(docRef);
    const savedContent = docSnap.data() as Partial<WebsiteContent> || {};
    
    // Log what's in the database
    console.log('Data from database:', savedContent);
    
    // Merge the saved data with default content to ensure all sections exist
    const mergedContent = {
      hero: deepMerge(defaultWebsiteContent.hero, savedContent.hero || {}),
      about: deepMerge(defaultWebsiteContent.about, savedContent.about || {}),
      benefits: deepMerge(defaultWebsiteContent.benefits, savedContent.benefits || {}),
      partners: deepMerge(defaultWebsiteContent.partners, savedContent.partners || {}),
      facilities: deepMerge(defaultWebsiteContent.facilities, savedContent.facilities || {}),
      team: deepMerge(defaultWebsiteContent.team, savedContent.team || {}),
      contact: deepMerge(defaultWebsiteContent.contact, savedContent.contact || {})
    };
    
    console.log('Merged content:', mergedContent);
    return mergedContent;
  },

  async updateWebsiteContent(content: Partial<WebsiteContent>): Promise<void> {
    console.log('Updating with content:', content);
    const docRef = doc(db, 'settings', 'website');
    await setDoc(docRef, content, { merge: true });
  },

  getDefaultWebsiteContent(): WebsiteContent {
    return { ...defaultWebsiteContent };
  }
};

// Helper function for deep merging objects
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else if (Array.isArray(source[key])) {
        // For arrays, use the source array if it exists
        output[key] = [...source[key]];
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Default content in case no content exists yet
const defaultWebsiteContent: WebsiteContent = {
  hero: {
    title: 'Welcome to AKW Racing Academy',
    description: 'Premier karting academy in Wellington, FL, offering professional race training for all skill levels.',
    videoUrl: 'https://www.sodikart.com/content/files/home/sodikart-home-v2.mp4'
  },
  about: {
    title: 'Excellence in Racing Education',
    description: 'Located in the heart of Wellington, FL, AKW Racing Academy partners with Piquet Race Park to provide world-class karting education. Our state-of-the-art facility and experienced instructors ensure that every student receives the highest quality training.',
    features: [
      'Professional race instructors',
      'State-of-the-art racing equipment',
      'Comprehensive training programs'
    ],
    imageUrl: '/images/AKWTeamPic1.jpg'
  },
  benefits: {
    title: 'Why Karting for Your Child?',
    items: [
      {
        title: 'Professional Racing Pathway',
        description: 'Follow in the footsteps of F1 champions who started karting at ages 5-7. Open doors to racing academies and professional teams.',
        iconName: 'Trophy'
      },
      {
        title: 'Cognitive Development',
        description: 'Enhance quick decision-making, spatial awareness, and strategic thinking while processing information under pressure.',
        iconName: 'Brain'
      },
      {
        title: 'Personal Growth',
        description: 'Build confidence, discipline, and resilience through handling victory and defeat, developing a strong work ethic.',
        iconName: 'Heart'
      },
      {
        title: 'Social Skills',
        description: 'Make lifelong friendships with like-minded peers while developing sportsmanship in a supportive racing community.',
        iconName: 'Users'
      },
      {
        title: 'Active Lifestyle',
        description: 'Trade screen time for an exciting sport that improves physical fitness, hand-eye coordination, and reflexes.',
        iconName: 'Activity'
      },
      {
        title: 'Goal Setting',
        description: 'Progress from basic skills to racing, developing a growth mindset and determination through achievement milestones.',
        iconName: 'Target'
      },
      {
        title: 'Time Management',
        description: 'Learn to balance practice schedules, race preparation, and academics while developing organizational skills.',
        iconName: 'Clock'
      },
      {
        title: 'Team Collaboration',
        description: 'Experience the power of teamwork through pit crew coordination, strategy planning, and supporting fellow racers in a collaborative environment.',
        iconName: 'Handshake'
      },
      {
        title: 'Future Driving Excellence',
        description: 'Develop advanced vehicle control, safety awareness, and crisis management skills that translate into becoming a more capable and responsible future driver.',
        iconName: 'Car'
      }
    ]
  },
  partners: {
    title: 'Our Trusted Partners in Racing Excellence',
    description: 'We partner with the world\'s leading manufacturers to provide our students with the finest racing equipment and technology.',
    items: [
      {
        name: 'SodiKart',
        logoPath: '/images/partners/SodiLogo.png',
        description: 'When you\'re pushing the limits at 60mph just inches from the ground, you need a kart that\'s built for glory. That\'s SodiKart - the undisputed titan of professional karting for over three decades.',
        highlights: [
          { icon: '🌍', text: '#1 Kart Manufacturer Worldwide' },
          { icon: '🛠️', text: '30+ Years of Innovation' },
          { icon: '🏁', text: '100+ Championship Titles' },
          { icon: '💪', text: '50,000+ Karts Built Annually' }
        ],
        imagePath: '/images/partners/sodi.png',
        link: '/blog/sodikart'
      },
      {
        name: 'Rotax',
        logoPath: '/images/partners/RotaxLogo.webp',
        description: 'Feel the raw power of Austrian engineering excellence in every throttle response. Rotax engines are the beating heart of karting greatness, trusted by champions worldwide.',
        highlights: [
          { icon: '⚡', text: '34 HP Max Performance' },
          { icon: '🔧', text: '40+ Years of Innovation' },
          { icon: '🌟', text: '250,000+ Engines Produced' },
          { icon: '🏆', text: '15+ World Championships' }
        ],
        imagePath: '/images/partners/Rotax.png',
        link: '/blog/rotax'
      }
    ]
  },
  facilities: {
    title: 'Our Facilities',
    description: 'Experience racing excellence at our premier facilities, equipped with everything needed for professional racing development.',
    items: [
      {
        title: 'AKW Racing Academy Training Center',
        description: 'Our state-of-the-art racing academy headquarters in Wellington, FL combines cutting-edge technology with professional instruction. From advanced simulators to fully-equipped maintenance bays, every aspect is optimized for youth development and safety.',
        features: [
          'Professional race strategy center',
          '2 Full motion racing simulators',
          'Advanced driver development classrooms',
          'Professional maintenance garage',
          'Equipment storage and warehouse',
          'Parts department'
        ],
        imageSrc: '/images/akwracingheadquarters.jpg',
        imageAlt: 'AKW Racing Headquarters',
        className: 'md:col-span-2'
      },
      {
        title: 'Race Track - Piquet Race Park',
        description: 'Our main racing academy track in Loxahatchee, FL features multiple configurations for different skill levels. This professional facility offers the perfect environment for young racers to progress from their first laps to competitive racing.',
        features: [
          'FIA-approved youth racing circuit',
          'Progressive track configurations',
          'Professional race control',
          'Complete safety protocols'
        ],
        imageSrc: '/images/PiquetTrack.webp',
        imageAlt: 'Piquet Entertainment Race Track',
        className: 'md:col-span-1'
      },
      {
        title: 'AMR Homestead-Miami Circuit',
        description: 'Our advanced training facility caters to developing young racers ready for more challenging experiences. This professional-grade track provides the perfect stepping stone for junior racers advancing toward professional careers.',
        features: [
          'Advanced youth racing circuits',
          'Competition preparation facilities',
          'Professional race simulation',
          'Elite safety standards'
        ],
        imageSrc: '/images/HomesteadTrack.jpg',
        imageAlt: 'AMR Homestead-Miami Racing Circuit',
        className: 'md:col-span-1'
      }
    ]
  },
  team: {
    title: 'Elite Racing Mentors Shaping Future Champions',
    description: 'Train with championship-winning professionals who\'ve mastered the art of transforming young talent into racing excellence.'
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with us to start your racing journey or learn more about our programs.',
    address: 'Piquet Race Park\nWellington, FL 33414',
    phone: '(555) 123-4567',
    email: 'info@akwracing.com'
  }
}; 