'use client';

import { useState, useEffect, useRef } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Wait for DOM to be ready and then find actual heading elements
    const timer = setTimeout(() => {
      const actualHeadings = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');

      const extractedHeadings: Heading[] = Array.from(actualHeadings).map((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';

        // Create ID from text or use existing ID
        let id = heading.id || text.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .trim();

        // Ensure unique IDs
        if (!id) {
          id = `heading-${index}`;
        }

        // Add ID to the heading element if it doesn't exist
        if (!heading.id) {
          heading.id = id;
        }

        return { id: heading.id, text, level };
      });

      setHeadings(extractedHeadings);

      // Set up intersection observer for scroll tracking
      if (extractedHeadings.length > 0) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveId(entry.target.id);
              }
            });
          },
          {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
          }
        );

        // Observe all heading elements
        extractedHeadings.forEach(({ id }) => {
          const element = document.getElementById(id);
          if (element && observerRef.current) {
            observerRef.current.observe(element);
          }
        });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [content]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Contents
      </h3>
      <nav>
        <ul className="space-y-1 border-l border-gray-200 dark:border-gray-700">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={`
                  w-full text-left text-sm py-1 pl-3 -ml-px border-l-2 transition-colors cursor-pointer
                  ${level === 2 ? 'pl-3' : ''}
                  ${level === 3 ? 'pl-5' : ''}
                  ${level === 4 ? 'pl-7' : ''}
                  ${
                    activeId === id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                  }
                `}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
