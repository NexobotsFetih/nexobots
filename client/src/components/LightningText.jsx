import { motion } from 'framer-motion';

export const LightningText = ({ text }) => {
    return (
        <div className="relative inline-block">
            {/* Main Text - Static but glowing */}
            <motion.h1
                className="text-6xl md:text-9xl font-horror text-white mb-2 tracking-wider relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                animate={{
                    textShadow: [
                        "0 0 20px rgba(168,85,247,0.6)",
                        "0 0 30px rgba(168,85,247,0.9)",
                        "0 0 20px rgba(168,85,247,0.6)"
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {text}
            </motion.h1>
        </div>
    );
};
