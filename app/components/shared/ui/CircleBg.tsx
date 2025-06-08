// export default function CircleBg() {
//     return (
//       <div className="w-full h-full fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
//         <div className="h-[235px] w-[235px] rounded-full bg-paul-300 absolute top-0 right-20" />
//         <div className="h-[135px] w-[135px] rounded-full bg-paul-700 absolute bottom-60 left-20" />
//         <div className="h-[400px] w-[400px] rounded-full bg-paul-900 absolute -bottom-10 left-20 -z-10" />
//         <div className="h-[100px] w-[100px] rounded-full bg-paul-500 absolute top-32 left-1/2 -translate-x-1/2" />
//         <div className="h-[300px] w-[300px] rounded-full bg-paul-300 absolute -top-20 left-1/4 -z-20" />
//         <div className="h-[150px] w-[150px] rounded-full bg-paul-600 absolute bottom-20 right-32 z-0" />
//         <div className="h-[90px] w-[90px] rounded-full bg-paul-400 absolute top-[60%] left-[60%]" />
//         <div className="h-[220px] w-[220px] rounded-full bg-paul-400 absolute bottom-5 left-[45%] -translate-x-1/2 z-[-1]" />
//         <div className="h-[180px] w-[180px] rounded-full bg-paul-800 absolute top-10 right-[30%]" />
//         <div className="h-[120px] w-[120px] rounded-full bg-paul-200 absolute bottom-[40%] left-[70%]" />
//         <div className="h-[250px] w-[250px] rounded-full bg-paul-400 absolute top-[25%] left-[15%] -z-5" />
//         <div className="h-[75px] w-[75px] rounded-full bg-paul-600 absolute bottom-[15%] right-[10%]" />
//         <div className="h-[300px] w-[300px] rounded-full bg-paul-700 absolute top-[50%] left-[5%] -translate-y-1/2 -z-15" />
//         <div className="h-[50px] w-[50px] rounded-full bg-paul-500 absolute top-[80%] left-[80%]" />
//       </div>
//     );
//   }

import { motion } from "framer-motion";

export default function CircleBg() {
  return (
    <div className="w-full h-full fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
      <motion.div
        className="h-[235px] w-[235px] rounded-full bg-paul-300 absolute top-0 right-20"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[135px] w-[135px] rounded-full bg-paul-700 absolute bottom-60 left-20"
        animate={{ x: [0, -35, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[400px] w-[400px] rounded-full bg-paul-900 absolute -bottom-10 left-20 -z-10"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[100px] w-[100px] rounded-full bg-paul-500 absolute top-32 left-1/2 -translate-x-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[300px] w-[300px] rounded-full bg-paul-300 absolute -top-20 left-1/4 -z-20"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[150px] w-[150px] rounded-full bg-paul-600 absolute bottom-20 right-32 z-0"
        animate={{ y: [0, 35, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[90px] w-[90px] rounded-full bg-paul-400 absolute top-[60%] left-[60%]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[220px] w-[220px] rounded-full bg-paul-400 absolute bottom-5 left-[45%] -translate-x-1/2 z-[-1]"
        animate={{ x: [0, -25, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[180px] w-[180px] rounded-full bg-paul-800 absolute top-10 right-[30%]"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[120px] w-[120px] rounded-full bg-paul-200 absolute bottom-[40%] left-[70%]"
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[250px] w-[250px] rounded-full bg-paul-400 absolute top-[25%] left-[15%] -z-5"
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[75px] w-[75px] rounded-full bg-paul-600 absolute bottom-[15%] right-[10%]"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[300px] w-[300px] rounded-full bg-paul-700 absolute top-[50%] left-[5%] -translate-y-1/2 -z-15"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[50px] w-[50px] rounded-full bg-paul-500 absolute top-[80%] left-[80%]"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

