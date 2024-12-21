import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconifyIcon from 'components/base/IconifyIcon';
import { Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Thumb5 } from 'data/images';

interface TaskDetail {
  id: number;
  details: string;
}

const taskDetails: TaskDetail[] = [
  {
    id: 1,
    details: 'Understanding the tools in Figma',
  },
  {
    id: 2,
    details: 'Understand the basics of making designs',
  },
  {
    id: 3,
    details: 'Design a mobile application with figma',
  },
];

const TaskToday = () => {
  return (
    <Card sx={{ width: 1 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <IconifyIcon
              icon="lets-icons:meatballs-menu"
              color="primary.dark"
              fontSize="h4.fontSize"
            />
          </IconButton>
        }
        title="Task Today"
      />
      <CardMedia component="img" height={160} image={Thumb5} alt="task_today_image" />
      <CardContent>
        <Box mt={2}>
          <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
            Creating Awesome Mobile Apps
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            UI / UX Designer
          </Typography>
        </Box>

        <Box mt={2}>
          <Stack justifyContent="space-between">
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              Progress
            </Typography>
            <Typography variant="body1" color="primary.main" fontWeight={500}>
              90%
            </Typography>
          </Stack>
          <Slider
            defaultValue={80}
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
              1 Hour
            </Typography>
          </Stack>

          <AvatarGroup max={5}>
            <Avatar alt="avatar1" src={Avatar1} />
            <Avatar alt="avatar2" src={Avatar2} />
            <Avatar alt="avatar3" src={Avatar3} />
            <Avatar alt="avatar4" src={Avatar4} />
            <Avatar alt="avatar5" src={Avatar5} />
          </AvatarGroup>
        </Stack>

        <Divider />

        <Stack alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="primary.dark" fontWeight={700}>
            Detail Task
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            UI / UX Designer
          </Typography>
        </Stack>

        <Stack direction="column" spacing={2} mt={2}>
          {taskDetails.map((task) => (
            <Stack key={task.id} alignItems="center" spacing={1.5}>
              <Stack
                alignItems="center"
                justifyContent="center"
                height={36}
                width={36}
                borderRadius={2.5}
                bgcolor="info.main"
              >
                <Typography variant="body2" fontWeight={500}>
                  {task.id}
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500}>
                {task.details}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>

      <CardActions disableSpacing sx={{ mt: 7 }}>
        <Button variant="contained" color="primary" size="medium" fullWidth>
          Go To Detail
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskToday;
