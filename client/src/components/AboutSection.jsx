import { motion } from 'framer-motion';

export const AboutSection = () => {
    const features = [
        { title: "ANTİK TEKNOLOJİ", description: "Unutulmuş tanrıların gücünü kuantum devreleriyle birleştir." },
        { title: "GELECEK YOLCULUĞU", description: "Fiziğin sadece bir öneri olduğu bozulmuş boyutlarda gezin." },
    ];

    return (
        <section id="about" className="relative w-full py-24 bg-void-black text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-96 bg-neon-purple/5 blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-96 bg-cyber-cyan/5 blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-horror text-mystic-gold mb-8 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                        PROJECT: <span className="text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">Z</span>
                    </h2>
                    <p className="font-tech text-lg text-gray-400 mb-6 leading-relaxed">
                        Yıl 1643. Otuz Yıl Savaşları'nın son yankıları Avrupa'yı hâlâ sarıyor.
                        Binlerce Japon savaşçı, Hollanda Doğu Hindistan Şirketi'nin vaatleriyle bu uzak topraklara geldi.
                        Ama savaş bitti ve onlar <span className="text-neon-purple">terk edildi</span>.
                    </p>
                    <p className="font-tech text-lg text-gray-400 mb-6 leading-relaxed">
                        Sen <span className="text-white border-b border-cyber-cyan">Takeshi</span>,
                        ana vatanına dönmeye ant içmiş bir samuray'sın.
                        Ama dönüş yolun, sadece denizaşırı bir yolculuk değil;
                        <span className="text-mystic-gold"> boyutlar arası bir geçiş</span>.
                    </p>
                    <div className="grid grid-cols-1 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                className="p-4 border-l-2 border-neon-purple bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                            >
                                <h3 className="font-tech text-xl text-cyber-cyan mb-1 tracking-wider">{feature.title}</h3>
                                <p className="font-sans text-sm text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Visual Content (Placeholder for 3D model or Graphic) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative h-[570px] w-full border border-white/20 rounded-lg overflow-hidden group"
                >
                    {/* Main Image - Techno Filter */}
                    <img
                        src="/assets/about_visual.jpg"
                        alt="Creator Visual"
                        className="w-full h-full object-cover transition-all duration-700 
                                   filter grayscale-[80%] sepia-[20%] hue-rotate-[-50deg] brightness-75 contrast-125
                                   group-hover:filter-none group-hover:scale-110 group-hover:brightness-110"
                    />
                    {/* Holographic Overlay on top */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/40 to-transparent mix-blend-overlay opacity-60 group-hover:opacity-0 transition-opacity duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    {/* Glitch Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 left-4 font-tech text-xs text-cyber-cyan">
                        THE_MAIN_CREATOR: <span className="text-red-500 animate-pulse">EGE KOCA</span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};
