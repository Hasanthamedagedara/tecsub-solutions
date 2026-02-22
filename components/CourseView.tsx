"use client";

import { motion } from "framer-motion";

export default function CourseView({ id }: { id: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-10 text-white flex flex-col items-center justify-center min-h-screen"
    >
      <h1 className="text-5xl font-extrabold text-cyan-400">Course ID: {id}</h1>
      <p className="mt-4 text-xl text-gray-300 text-center">
        Welcome to TECSUB Learning Management System. <br/>
        This content is specially designed for Course {id}.
      </p>
      <button className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-black px-8 py-3 rounded-full font-bold transition-all">
        Start Module
      </button>
    </motion.div>
  );
}