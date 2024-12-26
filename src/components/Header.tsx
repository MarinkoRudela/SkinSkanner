import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-medspa-800 mb-4">
        Consult Club
      </h1>
      <p className="text-medspa-600 text-lg max-w-2xl mx-auto">
        Get personalized treatment recommendations based on your unique features
      </p>
    </motion.div>
  );
};