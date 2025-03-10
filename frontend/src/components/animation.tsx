'use client';

import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';

export default function LottieAnimation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Dynamically load the animation JSON
    fetch('/Animation.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error('Error loading Lottie animation:', error));
  }, []);

  if (!animationData) return <p>Loading animation...</p>;

  return <Lottie loop play animationData={animationData} className="w-64 h-64 mx-auto" />;
}
