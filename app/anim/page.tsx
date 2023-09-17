import React from "react";
import { MotionDiv } from "../motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const App = () => {
  return (
    <MotionDiv initial="hidden" animate="visible" variants={containerVariants}>
      <MotionDiv variants={childVariants}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro aliquam
        perferendis maiores quasi. Enim molestiae aspernatur dolorem labore, ex
        in id sed. Autem quasi ipsa voluptates maxime? Nisi, accusantium
        blanditiis.
      </MotionDiv>
      <MotionDiv variants={childVariants}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda
        eius, numquam aperiam animi dolorem architecto iure amet voluptate
        debitis error.
      </MotionDiv>
      <MotionDiv variants={childVariants}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic
        consectetur deleniti autem, nesciunt mollitia maiores velit tenetur,
        provident vero ullam dicta cum harum laudantium.
      </MotionDiv>
    </MotionDiv>
  );
};

export default App;
