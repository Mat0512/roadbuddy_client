import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconifyIcon from 'components/base/IconifyIcon';
import ActivityChart from './ActivityChart';

const chartData = {
  thisWeek: [1.7, 2, 1.4, 3, 1.8, 2.4, 1.9],
  lastWeek: [1.3, 2, 1, 3, 1, 2.6, 2.8],
  twoWeeksAgo: [2.9, 2.5, 3, 1, 2, 1, 2],
};

const Activity = () => {
  const [data, setData] = useState(chartData.thisWeek);
  const [week, setWeek] = useState('this-week');
  const [open, setOpen] = useState(false);

  const handleSelectChange = (event: SelectChangeEvent) => {
    const week = event.target.value;
    setWeek(week);

    setTimeout(() => {
      if (week === 'this-week') {
        setData(chartData.thisWeek);
      } else if (week === 'last-week') {
        setData(chartData.lastWeek);
      } else {
        setData(chartData.twoWeeksAgo);
      }
    }, 100);
  };

  return (
    <Paper sx={{ flex: 1, bgcolor: 'info.main' }}>
      <Stack alignItems="center" justifyContent="space-between" mt={-0.5}>
        <Typography variant="body1" color="text.primary" fontWeight={700}>
          Activity
        </Typography>

        <FormControl
          variant="filled"
          sx={{
            width: 100,
            '& .MuiInputBase-root': {
              '&:focus-within': {
                borderColor: 'transparent !important',
                boxShadow: 'none',
              },
            },
          }}
        >
          <Select
            id="select-filled"
            value={week}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={handleSelectChange}
            IconComponent={() => (
              <IconifyIcon
                icon="iconamoon:arrow-down-2-duotone"
                sx={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            )}
          >
            <MenuItem value="this-week">This Week</MenuItem>
            <MenuItem value="last-week">Last Week</MenuItem>
            <MenuItem value="two-weeks-ago">Two Weeks Ago</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box mt={2} bgcolor="info.lighter" borderRadius={3}>
        <ActivityChart data={data} sx={{ height: '130px !important' }} />
      </Box>
    </Paper>
  );
};

export default Activity;
