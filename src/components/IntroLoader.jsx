import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const IntroLoader = ({ onFinish }) => {
  const loaderRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        loaderRef.current.style.display = 'none';
        onFinish();
      },
    });

    // 1. Initial appear
    tl.fromTo(
      textRef.current,
      { scale: 0.8, opacity: 0, y: 0 },
      { scale: 1.1, opacity: 1, duration: 1.4, ease: 'power2.out' }
    )

    // 2. Zoom out & move upward
    .to(textRef.current, {
      scale: 6,
      y: -500,
      opacity: 0,
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.3,
    });
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-black via-[#0f172a] to-[#3b0764] flex justify-center items-center"
    >
      <h1
        ref={textRef}
        className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-blue-500 to-purple-500 bg-clip-text text-transparent tracking-widest"
      >
        Track2Crack 🚀
      </h1>
    </div>
  );
};

export default IntroLoader;
