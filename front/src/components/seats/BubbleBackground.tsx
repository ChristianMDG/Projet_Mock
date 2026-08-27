import React, { useRef, useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';

export interface BubbleColors {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
}

export interface BubbleBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  interactive?: boolean;
  colors?: BubbleColors;
}

const DEFAULT_COLORS: BubbleColors = {
  first: '18,113,255',
  second: '221,74,255',
  third: '0,220,255',
  fourth: '200,50,50',
  fifth: '180,180,50',
  sixth: '140,100,255',
};

export const BubbleBackground: React.FC<BubbleBackgroundProps> = ({
  className,
  children,
  interactive = false,
  colors = DEFAULT_COLORS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const blendMode = isDark ? 'hard-light' : 'multiply';

  useEffect(() => {
    const el = containerRef.current;

    if (interactive && el) {
      let rafId: number | null = null;
      const handleMouseMove = (e: MouseEvent) => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left - rect.width / 2,
            y: e.clientY - rect.top - rect.height / 2,
          });
        });
      };

      el.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }
  }, [interactive]);

  return (
    <Box
      ref={containerRef}
      style={
        {
          '--first-color': colors.first,
          '--second-color': colors.second,
          '--third-color': colors.third,
          '--fourth-color': colors.fourth,
          '--fifth-color': colors.fifth,
          '--sixth-color': colors.sixth,
        } as React.CSSProperties
      }
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #161a36 0%, #0a0d20 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
        borderRadius: 'inherit',
        zIndex: 0,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
      className={className}
    >
      <style>
        {`
          @keyframes floatY {
            0%, 100% { transform: translateY(-30px); }
            50% { transform: translateY(30px); }
          }
          @keyframes floatX {
            0%, 100% { transform: translateX(-30px); }
            50% { transform: translateX(30px); }
          }
          @keyframes rotateCW {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* SVG filter defines the liquid "gooey" blend */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Bubbles container with the filter applied */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: 'url(#goo) blur(30px)',
          opacity: isDark ? 0.35 : 0.25,
        }}
      >
        {/* Bubble 1: Floating vertically */}
        <Box
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            mixBlendMode: blendMode,
            background:
              'radial-gradient(circle at center, rgba(var(--first-color), 0.8) 0%, rgba(var(--first-color), 0) 50%)',
            animation: 'floatY 30s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* Bubble 2: Rotating clockwise */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformOrigin: 'calc(50% - 200px)',
            animation: 'rotateCW 20s linear infinite',
            willChange: 'transform',
          }}
        >
          <Box
            sx={{
              borderRadius: '50%',
              width: '80%',
              height: '80%',
              mixBlendMode: blendMode,
              background:
                'radial-gradient(circle at center, rgba(var(--second-color), 0.8) 0%, rgba(var(--second-color), 0) 50%)',
            }}
          />
        </Box>

        {/* Bubble 3: Rotating with different offset */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformOrigin: 'calc(50% + 200px)',
            animation: 'rotateCW 40s linear infinite',
            willChange: 'transform',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              width: '80%',
              height: '80%',
              background:
                'radial-gradient(circle at center, rgba(var(--third-color), 0.8) 0%, rgba(var(--third-color), 0) 50%)',
              mixBlendMode: blendMode,
              top: 'calc(50% - 200px)',
              left: 'calc(50% - 200px)',
            }}
          />
        </Box>

        {/* Bubble 4: Floating horizontally */}
        <Box
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            mixBlendMode: blendMode,
            background:
              'radial-gradient(circle at center, rgba(var(--fourth-color), 0.8) 0%, rgba(var(--fourth-color), 0) 50%)',
            opacity: 0.7,
            animation: 'floatX 40s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* Bubble 5: Slow massive rotation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformOrigin: 'calc(50% - 400px) calc(50% + 100px)',
            animation: 'rotateCW 25s linear infinite',
            willChange: 'transform',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              width: '120%',
              height: '120%',
              mixBlendMode: blendMode,
              background:
                'radial-gradient(circle at center, rgba(var(--fifth-color), 0.8) 0%, rgba(var(--fifth-color), 0) 50%)',
              top: 'calc(50% - 60%)',
              left: 'calc(50% - 60%)',
            }}
          />
        </Box>

        {/* Bubble 6: Interactive (tracks cursor) */}
        {interactive && (
          <Box
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              width: '80%',
              height: '80%',
              mixBlendMode: blendMode,
              background:
                'radial-gradient(circle at center, rgba(var(--sixth-color), 0.8) 0%, rgba(var(--sixth-color), 0) 50%)',
              opacity: 0.7,
              transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
              transition: 'transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1)',
              willChange: 'transform',
              top: '10%',
              left: '10%',
            }}
          />
        )}
      </Box>

      {/* Children content rendered on top of bubbles */}
      <Box sx={{ position: 'relative', zIndex: 1, height: '100%', width: '100%' }}>{children}</Box>
    </Box>
  );
};
