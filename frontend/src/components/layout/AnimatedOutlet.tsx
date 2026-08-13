import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// useOutlet (rather than <Outlet />) captures the current route's element
// before it's replaced, so AnimatePresence can play an exit animation on the
// outgoing page while the incoming one enters — <Outlet /> alone always
// reflects the latest route and skips the exit phase entirely.
export function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedOutlet;
