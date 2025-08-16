import { useState, useEffect, useRef } from 'react';
import { useScrollToBottom } from './use-scroll-bottom';
import type { UseChatHelpers } from '@ai-sdk/react';

export function useMessages({
  chatId,
  status,
}: {
  chatId: string;
  status: UseChatHelpers['status'];
}) {
  const {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
  } = useScrollToBottom();

  const [hasSentMessage, setHasSentMessage] = useState(false);
  const previousStatusRef = useRef<UseChatHelpers['status']>('ready');

  useEffect(() => {
    if (chatId) {
      scrollToBottom('instant');
      setHasSentMessage(false);
    }
  }, [chatId, scrollToBottom]);

  useEffect(() => {
    // Détecter quand l'utilisateur soumet un message
    if (status === 'submitted' && previousStatusRef.current !== 'submitted') {
      setHasSentMessage(true);
      // Scroll immédiat vers le nouveau message de l'utilisateur
      setTimeout(() => scrollToBottom('smooth'), 100);
    }

    // Détecter le début du streaming pour continuer le scroll
    if (status === 'streaming') {
      // Pendant le streaming, on scroll régulièrement
      const interval = setInterval(() => {
        scrollToBottom('smooth');
      }, 200);

      return () => clearInterval(interval);
    }

    previousStatusRef.current = status;
  }, [status, scrollToBottom]);

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  };
}
