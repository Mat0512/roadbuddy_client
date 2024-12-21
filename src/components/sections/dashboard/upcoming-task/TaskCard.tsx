import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconifyIcon from 'components/base/IconifyIcon';
import { Task } from 'data/tasks';

interface TaskCardProps {
  data: Task;
}

const TaskCard = ({ data }: TaskCardProps) => {
  return (
    <Card sx={{ userSelect: 'none' }}>
      <CardMedia component="img" height="110" image={data.thumb} alt="task_today_image" />
      <CardContent>
        <Box mt={1.5}>
          <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
            {data.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {data.category}
          </Typography>
        </Box>

        <Box mt={1.5}>
          <Stack justifyContent="space-between">
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              Progress
            </Typography>
            <Typography variant="body1" color="primary.main" fontWeight={500}>
              {data.progress}%
            </Typography>
          </Stack>
          <Slider
            defaultValue={data.progress}
            color="primary"
            aria-label="Default"
            valueLabelDisplay="auto"
            disabled
          />
        </Box>

        <Stack mt={2} alignItems="center" justifyContent="space-between">
          <Stack alignItems="center" spacing={1}>
            <IconifyIcon icon="mynaui:clock-circle" color="text.secondary" fontSize="h4.fontSize" />
            <Typography variant="body1" fontWeight={500}>
              {data.daysLeft} Days Left
            </Typography>
          </Stack>

          <AvatarGroup max={5}>
            {data.avatars.map((avatar) => (
              <Avatar key={avatar} alt="avatar_img" src={avatar} />
            ))}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
