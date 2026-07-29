'use client';
import { useState, useEffect, useMemo } from 'react';

export function useTypewriterPlaceholder(phrasesStr, typingSpeed = 60, deletingSpeed = 30, pauseTime = 2500) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Parse phrases from pipe-separated string to avoid dependency array issues
  const phrases = useMemo(() => phrasesStr.split('|'), [phrasesStr]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    const phrase = phrases[phraseIdx];
    let timeoutId;

    if (!isDeleting && text === phrase) {
      // Pause at the end of typing
      timeoutId = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === '') {
      // Pause before typing next phrase
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
      }, 500);
    } else {
      // Typing or deleting
      timeoutId = setTimeout(() => {
        setText(prev => 
          isDeleting 
            ? phrase.substring(0, prev.length - 1) 
            : phrase.substring(0, prev.length + 1)
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }
    
    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return text + (showCursor ? '|' : '');
}
