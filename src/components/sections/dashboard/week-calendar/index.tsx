import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import IconifyIcon from 'components/base/IconifyIcon';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';

dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);

const daysOfWeekLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const WeekCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startOfCurrentWeek = dayjs(selectedDate).startOf('week');

  const daysOfWeek = Array.from(new Array(7)).map((_, index) =>
    startOfCurrentWeek.add(index, 'day'),
  );

  const handlePrevMonth = () => {
    const newDate = dayjs(selectedDate).subtract(1, 'month');
    setSelectedDate(newDate.toDate());
  };

  const handleNextMonth = () => {
    const newDate = dayjs(selectedDate).add(1, 'month');
    setSelectedDate(newDate.toDate());
  };

  return (
    <Stack component={Paper} direction="column" spacing={3}>
      <Stack width={1} alignItems="center" justifyContent="space-between">
        <IconButton
          size="medium"
          onClick={handlePrevMonth}
          sx={{ border: 'none', bgcolor: 'transparent !important' }}
        >
          <IconifyIcon icon="oui:arrow-left" color="text.secondary" />
        </IconButton>
        <Typography variant="body1" fontWeight={600}>
          {dayjs(selectedDate).format('MMMM YYYY')}
        </Typography>
        <IconButton
          size="medium"
          onClick={handleNextMonth}
          sx={{ border: 'none', bgcolor: 'transparent !important' }}
        >
          <IconifyIcon icon="oui:arrow-right" color="text.secondary" />
        </IconButton>
      </Stack>

      <Stack justifyContent="space-between">
        {daysOfWeek.map((day, index) => {
          const isToday = day.isSame(new Date(), 'day');
          return (
            <Stack
              key={day.format('YYYY-MM-DD')}
              direction="column"
              alignItems="center"
              justifyContent="space-between"
              width={40}
              py={0.75}
              spacing={1.25}
              borderRadius={7}
              bgcolor={isToday ? 'primary.dark' : 'info.lighter'}
              onClick={() => setSelectedDate(day.toDate())}
            >
              <Typography
                variant="body2"
                color={isToday ? 'info.lighter' : 'text.primary'}
                fontWeight={500}
              >
                {daysOfWeekLetters[index]}
              </Typography>
              <Stack
                height={32}
                width={32}
                alignItems="center"
                justifyContent="center"
                borderRadius="50%"
                bgcolor={isToday ? 'primary.main' : 'info.main'}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={isToday ? 'info.lighter' : 'text.primary'}
                >
                  {day.format('D')}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default WeekCalendar;
