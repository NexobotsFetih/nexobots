import { motion } from 'framer-motion';

export const DownloadSection = () => {
    return (
        <section className="w-full py-32 bg-gradient-to-t from-black to-[#0a0a0a] relative overflow-hidden text-center">

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-tech text-white mb-6 uppercase tracking-wider"
                >
                    SİSTEM <span className="text-white">HAZIR MI?</span>
                </motion.h2>

                <p className="font-sans text-gray-400 mb-12 max-w-2xl mx-auto">
                    Portal kararsız. Senkronizasyon yüksek bant genişlikli nöral bağlantı gerektirir.
                    Donanımını hazırla.
                </p>

                <motion.a
                    href="https://www.transferxl.com/tr/download/08jjLJCzVWbQw1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-16 py-6 bg-neon-purple text-white font-tech text-2xl font-bold rounded-sm shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:shadow-[0_0_100px_rgba(168,85,247,0.8)] transition-all relative overflow-hidden group cursor-pointer no-underline"
                >
                    <span className="relative z-10">PROTOKOLÜ İNDİR</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-pulse"></div>
                </motion.a>

                {/* System Specs - Terminal Style */}
                <div className="mt-20 text-left bg-black border border-white/20 p-6 rounded-md font-tech text-sm text-green-500 shadow-2xl max-w-lg mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <p className="mb-2">&gt; SİSTEM_KONTROL...</p>
                    <p className="mb-2">&gt; GPU: <span className="text-white">NVIDIA RTX 4090 (Önerilen)</span></p>
                    <p className="mb-2">&gt; RAM: <span className="text-white">64GB NÖRAL BELLEK</span></p>
                    <p className="mb-2">&gt; DEPOLAMA: <span className="text-white">1PB QUANTUM SÜRÜCÜ</span></p>
                    <p className="animate-pulse">&gt; DURUM: <span className="text-green-400">OPTIMAL</span></p>
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none"></div>
        </section>
    );
};
