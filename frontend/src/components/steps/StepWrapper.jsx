import { motion } from 'framer-motion';

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction) => ({
        x: direction < 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95
    })
};

export default function StepWrapper({ children, className, ...props }) {
    return (
        <motion.div
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
