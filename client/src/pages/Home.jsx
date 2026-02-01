import { Experience } from '../components/Canvas/Experience';
import { AboutSection } from '../components/AboutSection';
import { ArsenalSection } from '../components/ArsenalSection';
import { MediaSection } from '../components/MediaSection';
import { DownloadSection } from '../components/DownloadSection';
import { LightningText } from '../components/LightningText';
import { motion } from 'framer-motion';

export const Home = () => {
    return (
        <div className="w-full min-h-screen text-white selection:bg-neon-purple selection:text-white overflow-x-hidden">

            {/* HERO SECTION */}
            <section className="relative w-full h-screen">
                <Experience />

                <main className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-center bg-black/10 backdrop-blur-sm border border-white/5 rounded-[2rem] p-8 md:px-16 md:py-32 shadow-[0_0_50px_rgba(0,0,0,0.2)] w-full max-w-7xl mx-auto"
                    >
                        <LightningText text="project : Z" />
                        <p className="text-xl md:text-2xl font-tech text-cyber-cyan tracking-[0.5em] mb-10 mt-12 opacity-90">
                            SYSTEM <span className="text-mystic-gold">ERROR</span>
                        </p>

                        <motion.button
                            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.5)", borderColor: "#a855f7" }}
                            whileTap={{ scale: 0.95 }}
                            className="pointer-events-auto mt-8 px-10 py-4 bg-black/80 backdrop-blur-md border-2 border-neon-purple/70 text-neon-purple font-tech text-xl uppercase tracking-[0.2em] relative overflow-hidden group shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all cursor-pointer z-50"
                        >
                            <span className="relative z-10">BAŞLAT</span>
                            <div className="absolute inset-0 bg-neon-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </motion.button>
                    </motion.div>
                </main>

                {/* Visual Noise for Hero */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyber-cyan font-tech text-sm opacity-70 pointer-events-none"
                >
                    ŞİFREYİ ÇÖZMEK İÇİN KAYDIR
                    <div className="w-[1px] h-8 bg-gradient-to-b from-cyber-cyan to-transparent mx-auto mt-2"></div>
                </motion.div>
            </section>

            {/* SECTIONS */}
            <AboutSection />
            <ArsenalSection />
            <MediaSection />
            <DownloadSection />

        </div>
    );
};
