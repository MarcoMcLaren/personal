import { MotionConfig } from 'framer-motion';
import { HomePage } from '@/components/pages/HomePage/HomePage';

export default function App() {
  // MotionConfig makes every framer-motion animation respect reduced-motion.
  return (
    <MotionConfig reducedMotion="user">
      <HomePage />
    </MotionConfig>
  );
}
