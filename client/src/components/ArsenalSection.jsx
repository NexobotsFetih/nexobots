import { motion } from 'framer-motion';

export const ArsenalSection = () => {
    const weapons = [
        {
            name: "EGE_KOCA",
            description: "The Main Creator, Coder, Map Designer, VFX Designer Of Project Z.",
            stats: [
                { label: "CODING", value: 90, color: "bg-red-500" },
                { label: "VISION", value: 100, color: "bg-blue-500" }
            ]
        },
        {
            name: "HARITO_SANAI",
            description: "The Main Creator Of Project Z",
            stats: [
                { label: "DESIGN", value: 70, color: "bg-purple-500" },
                { label: "STORY", value: 100, color: "bg-green-500" }
            ]
        },
    ];

    return (
        <section className="w-full py-24 bg-void-black text-white relative overflow-hidden">
            {/* Background decor */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-horror text-center mb-16 text-neon-purple drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                >
                    YARATICILAR <br /> <span className="text-2xl md:text-3xl font-tech text-white opacity-80">BE_AFRAID_OF_THEM</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {weapons.map((w, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-black/80 border border-white/10 p-6 relative overflow-hidden hover:border-cyber-cyan transition-all group"
                        >


                            {/* Creator Image */}
                            <div className="h-64 w-full bg-gradient-to-t from-gray-900 to-gray-800 mb-6 flex items-center justify-center border-b border-white/5 relative overflow-hidden rounded-md">
                                <img
                                    src={`/assets/creators/${i + 1}.png`}
                                    alt={w.name}
                                    className="w-full h-full object-cover transition-transform duration-500
                                               filter grayscale-[50%] brightness-90
                                               group-hover:scale-105 group-hover:filter-none group-hover:brightness-110"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} // Fallback if image missing
                                />
                                <div className="absolute inset-0 hidden items-center justify-center opacity-30 font-horror text-6xl text-white select-none">?</div>
                            </div>

                            <h3 className="text-2xl font-tech text-mystic-gold mb-2 group-hover:text-neon-purple transition-colors">{w.name}</h3>
                            <p className="font-sans text-sm text-gray-400 mb-6 h-12">{w.description}</p>

                            {/* Stats */}
                            <div className="space-y-3 font-tech text-xs">
                                {w.stats.map((stat, sIndex) => (
                                    <div key={sIndex} className="flex items-center gap-2">
                                        <span className="w-16 text-gray-500 uppercase">{stat.label}</span>
                                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${stat.value}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (sIndex * 0.2) }}
                                                className={`h-full ${stat.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Hover Corner visuals */}
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
