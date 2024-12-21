import { useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import { SwiperSlide } from 'swiper/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ReactSwiper from 'components/base/ReactSwiper';
import IconifyIcon from 'components/base/IconifyIcon';
import useResizeObserver from 'components/hooks/useResizeObserver';

interface HasId {
  id: string | number;
}

interface SliderWrapperProps<T> {
  title: string;
  SliderCard: React.ComponentType<{ data: T }>;
  data: T[];
}

const SliderWrapper = <T extends HasId>({ title, SliderCard, data }: SliderWrapperProps<T>) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerSize = useResizeObserver(containerRef);
  const [isSlideBegin, setIsSlideBegin] = useState(true);
  const [isSlideEnd, setIsSlideEnd] = useState(false);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <Stack ref={containerRef} direction="column" spacing={1.75} width={1}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{title}</Typography>
        <Stack mr={-1} alignItems="center" justifyContent="center">
          <IconButton
            onClick={handlePrev}
            size="large"
            sx={{
              p: 1,
              border: 'none',
              bgcolor: 'transparent !important',
              pointerEvents: isSlideBegin ? 'none' : 'auto',
            }}
          >
            <IconifyIcon
              icon="oui:arrow-left"
              color={isSlideBegin ? 'text.secondary' : 'text.primary'}
            />
          </IconButton>
          <IconButton
            onClick={handleNext}
            size="large"
            sx={{
              p: 1,
              border: 'none',
              bgcolor: 'transparent !important',
              pointerEvents: isSlideEnd ? 'none' : 'auto',
            }}
          >
            <IconifyIcon
              icon="oui:arrow-right"
              color={isSlideEnd ? 'text.secondary' : 'text.primary'}
            />
          </IconButton>
        </Stack>
      </Stack>

      <ReactSwiper
        slidesPerView={
          containerSize > 1440 ? 4 : containerSize > 1024 ? 3 : containerSize > 720 ? 2 : 1
        }
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
          setIsSlideBegin(swiper.isBeginning);
          setIsSlideEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsSlideBegin(swiper.isBeginning);
          setIsSlideEnd(swiper.isEnd);
        }}
        sx={{ '& .swiper-slide': { width: 300 } }}
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <SliderCard data={item} />
          </SwiperSlide>
        ))}
      </ReactSwiper>
    </Stack>
  );
};

export default SliderWrapper;
