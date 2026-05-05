import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import './Particles.css';

const Particles = () => {
  const particles = Array.from({ length: 15 });

  return (
    <div className="particles-container">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0,
            rotate: 0 
          }}
          animate={{ 
            x: [null, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 0.4, 0],
            rotate: [0, 360],
            transition: {
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <Leaf size={Math.random() * 20 + 10} color="#2e8b57" />
        </motion.div>
      ))}
    </div>
  );
};

export default Particles;
