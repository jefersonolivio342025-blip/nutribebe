import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingSupportButton = () => {
  const handleClick = () => {
    window.open('https://wa.me/5547991158519?text=Oi%20Sara!%20Preciso%20de%20ajuda%20com%20o%20NutriBeb%C3%AA', '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={20} />
      <span className="font-semibold text-sm">Suporte Sara</span>
    </motion.button>
  );
};

export default FloatingSupportButton;
