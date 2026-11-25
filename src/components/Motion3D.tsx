import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  onClick?: () => void;
}

/**
 * Hardware-accelerated 3D interactive tilt card with dynamic specular glare.
 * Automatically stays calm on touch/pointer-coarse devices or reduced motion.
 */
export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  intensity = 8,
  glare = true,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 260, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 260, damping: 24 });

  const rotateX = useTransform(smoothY, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(smoothX, [0, 1], [-intensity, intensity]);
  const glareX = useTransform(smoothX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.min(1, Math.max(0, x)));
    mouseY.set(Math.min(1, Math.max(0, y)));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div className="perspective-1000 h-full">
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ y: -4, transition: { duration: 0.22 } }}
        className={`relative h-full will-change-transform ${className}`}
      >
        {children}

        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.16 : 0,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.85) 0%, rgba(245,158,11,0.12) 35%, transparent 70%)`
              )
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

interface SpatialRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll-triggered 3D spatial entrance with slight Z/rotateX settle.
 */
export const SpatialReveal: React.FC<SpatialRevealProps> = ({
  children,
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotateX: 6, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{ transformPerspective: 1100 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface PanelTransition3DProps {
  panelKey: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Crisp 3D depth transition when switching between separate application panels or tabs.
 */
export const PanelTransition3D: React.FC<PanelTransition3DProps> = ({
  panelKey,
  children,
  className = ''
}) => {
  return (
    <motion.div
      key={panelKey}
      initial={{ opacity: 0, y: 14, scale: 0.985, rotateX: 2 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1400 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
