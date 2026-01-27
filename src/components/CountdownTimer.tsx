import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialMinutes?: number;
  onComplete?: () => void;
}

const CountdownTimer = ({ initialMinutes = 15, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Check if there's a saved end time in sessionStorage
    const savedEndTime = sessionStorage.getItem('nutribebe_countdown_end');
    if (savedEndTime) {
      const remaining = Math.max(0, Math.floor((parseInt(savedEndTime) - Date.now()) / 1000));
      return remaining;
    }
    // Set new end time
    const endTime = Date.now() + initialMinutes * 60 * 1000;
    sessionStorage.setItem('nutribebe_countdown_end', endTime.toString());
    return initialMinutes * 60;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-mono font-bold">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
};

export default CountdownTimer;
