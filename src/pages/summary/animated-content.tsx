import Markdown from 'react-markdown';
import { motion, type Variants } from 'framer-motion';

type AnimatedContentProps = React.ComponentPropsWithoutRef<typeof motion.article> & {
  content: string;
};

export function AnimatedContent({ content, ...props }: AnimatedContentProps) {
  return (
    <motion.article
      {...props}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.07 }}
    >
      <Markdown
        components={{
          h1: motionComponent('h1'),
          h2: motionComponent('h2'),
          h3: motionComponent('h3'),
          p: motionComponent('p'),
          li: motionComponent('li'),
        }}
      >
        {content}
      </Markdown>
    </motion.article>
  );
}

function motionComponent<T extends keyof typeof motion>(component: T) {
  const Component = motion[component];

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (props: React.ComponentProps<any>) => <Component {...props} variants={variants} />;
}
