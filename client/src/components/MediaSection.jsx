import { motion } from 'framer-motion';

export const MediaSection = () => {
    // Placeholders for now, can be replaced with real assets later
    const mediaItems = [
        { type: "image", src: "/gallery/1.png", caption: "ANA_MENU_01: ÖLÜM HABERCİSİ" },
        { type: "image", src: "/gallery/2.png", caption: "KONUM_X9: SON?" },
    ];

    return (
        <section className="w-full py-24 bg-void-black relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-horror text-white mb-12 border-b border-white/10 pb-4"
                >
                    ŞİFRELİ_<span className="text-neon-purple">VERİ</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {mediaItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative border border-white/20 bg-white/5 overflow-hidden hover:border-cyber-cyan transition-colors duration-300"
                        >
                            {/* Image Placeholder */}
                            <div className="aspect-video w-full bg-black relative overflow-hidden">
                                <img
                                    src={item.src}
                                    alt={item.caption}
                                    className="w-full h-full object-cover transition-all duration-500
                                               filter grayscale brightness-75 contrast-125 
                                               group-hover:filter-none group-hover:scale-105 group-hover:brightness-100"
                                />
                                {/* Cyber Tint Overlay */}
                                <div className="absolute inset-0 bg-cyber-cyan/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500"></div>
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                            </div>

                            {/* Caption Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-cyber-cyan">
                                <p className="font-tech text-cyber-cyan text-sm tracking-widest">{item.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
