import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-medspa-800 mb-2">
        Skin Scanner AI
      </h1>
      <p className="text-lg text-medspa-600 italic">
        Because radiant skin is just a scan away
      </p>
    </motion.div>
  );
};