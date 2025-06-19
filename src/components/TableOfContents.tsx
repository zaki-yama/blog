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
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false); // Close mobile menu after click
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg"
        aria-label="Toggle Table of Contents"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* Table of Contents Sidebar */}
      <div
        className={`
          fixed top-24 right-4 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-lg shadow-lg p-4 z-40
          lg:block lg:top-32 lg:w-64
          ${isOpen ? 'block' : 'hidden'}
        `}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Table of Contents
        </h3>
        <nav>
          <ul className="space-y-1">
            {headings.map(({ id, text, level }) => (
              <li key={id}>
                <button
                  onClick={() => handleClick(id)}
                  className={`
                    w-full text-left text-sm py-1 px-2 rounded transition-colors
                    ${level === 1 ? 'font-medium' : ''}
                    ${level === 2 ? 'ml-2' : ''}
                    ${level === 3 ? 'ml-4' : ''}
                    ${level === 4 ? 'ml-6' : ''}
                    ${level === 5 ? 'ml-8' : ''}
                    ${level === 6 ? 'ml-10' : ''}
                    ${
                      activeId === id
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
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

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}