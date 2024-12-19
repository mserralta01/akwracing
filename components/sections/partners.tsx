import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PartnerHighlight {
  icon: string;
  text: string;
}

interface Partner {
  name: string;
  logoPath: string;
  description: string;
  highlights: PartnerHighlight[];
  imagePath: string;
  link: string;
  features: string[];
}

const partners: Partner[] = [
  {
    name: 'SodiKart',
    logoPath: '/images/partners/SodiLogo.png',
    description: 'When you\'re pushing the limits at 60mph just inches from the ground, you need a kart that\'s built for glory. That\'s SodiKart - the undisputed titan of professional karting for over three decades. Every chassis that leaves their factory is a masterpiece of racing engineering, tested to F1-grade standards and ready for battle. From the precision-welded frame to the cutting-edge aerodynamics, these machines aren\'t just karts - they\'re the launching pad for future champions.',
    highlights: [
      { icon: '🌍', text: '#1 Kart Manufacturer Worldwide' },
      { icon: '🛠️', text: '30+ Years of Innovation' },
      { icon: '🏁', text: '100+ Championship Titles' },
      { icon: '💪', text: '50,000+ Karts Built Annually' }
    ],
    imagePath: '/images/partners/sodi.png',
    link: '/blog/sodikart',
    features: []
  },
  {
    name: 'Rotax',
    logoPath: '/images/partners/RotaxLogo.webp',
    description: 'Feel the raw power of Austrian engineering excellence in every throttle response. Rotax engines are the beating heart of karting greatness, trusted by champions worldwide. Each powerplant is a masterpiece of precision engineering, delivering explosive performance with unwavering reliability. When milliseconds matter and failure isn\'t an option, Rotax engines deliver the power to win, lap after lap. From grassroots racing to international championships, we power the dreams of future champions.',
    highlights: [
      { icon: '⚡', text: '34 HP Max Performance' },
      { icon: '🔧', text: '40+ Years of Innovation' },
      { icon: '🌟', text: '250,000+ Engines Produced' },
      { icon: '🏆', text: '15+ World Championships' }
    ],
    imagePath: '/images/partners/Rotax.png',
    link: '/blog/rotax',
    features: []
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Partners() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-gradient-to-b from-navy-900 to-black">
      {/* Racing line accents */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
        }} />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Our Trusted Partners in
            <span className="text-racing-red"> Racing Excellence</span>
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            We partner with the world's leading manufacturers to provide our students with the finest racing equipment and technology.
          </p>
        </motion.div>

        {/* Partner Cards */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl
                        hover:shadow-racing-red/20 transition-all duration-500"
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col h-full">
                <div className="relative h-64 mb-8">
                  <Image
                    src={partner.imagePath}
                    alt={`${partner.name} logo`}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>
                
                <div className="px-8 pb-8">
                  <div className="relative mb-6 h-20">
                    <Image
                      src={partner.logoPath}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">{partner.description}</p>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                    {partner.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        variants={featureVariants}
                        className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 shadow-sm"
                      >
                        <span className="text-xl flex-shrink-0 w-8">{highlight.icon}</span>
                        <span className="text-sm font-medium text-slate-700 font-racing leading-tight">
                          {highlight.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-racing-red text-white hover:bg-white hover:text-racing-red border-racing-red
                             transition-all duration-300 group-hover:scale-105"
                    asChild
                  >
                    <a href={partner.link}>Learn More</a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-2xl text-white/80 font-light italic">
            Driving excellence through world-class partnerships
          </p>
        </motion.div>
      </div>
    </section>
  );
} 