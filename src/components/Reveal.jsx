import { motion, useReducedMotion } from "framer-motion";

/* Shared motion language: one easing curve, three reveal shapes, used
   consistently so the site unfolds with a recognizable rhythm. */

export const EASE = [0.22, 1, 0.36, 1];

const VARIANTS = {
  rise: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    show: { opacity: 1, scale: 1, y: 0 },
  },
};

export function Reveal({
  as = "div",
  variant = "rise",
  delay = 0,
  duration = 0.7,
  className,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={VARIANTS[variant]}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Staggers its children (each child must be a motion element using the
   named variants "hidden"/"show" — pass them via <StaggerItem>). */
export function Stagger({ className, children, gap = 0.08, as = "div", ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ staggerChildren: gap }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ as = "div", variant = "rise", className, children, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      variants={VARIANTS[variant]}
      transition={{ duration: 0.65, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
