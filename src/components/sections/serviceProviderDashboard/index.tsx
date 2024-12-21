import React from 'react';
import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import {
  FaClock,
  FaHourglassHalf,
  FaCheckCircle,
  FaDollarSign,
  FaMapMarkerAlt,
} from 'react-icons/fa';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography variant="h4" component="div">
      {value}
    </Typography>
  </Paper>
);

const DashboardOverview: React.FC = () => {
  const theme = useTheme();

  // Mock data for demonstration
  const summaryData = {
    pendingRequests: 5,
    inProgressRequests: 3,
    completedRequests: 12,
    earnings: 1250.0,
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Pending Requests"
            value={summaryData.pendingRequests}
            icon={<FaClock color={theme.palette.text.secondary} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="In-Progress Requests"
            value={summaryData.inProgressRequests}
            icon={<FaHourglassHalf color={theme.palette.text.secondary} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Completed Requests"
            value={summaryData.completedRequests}
            icon={<FaCheckCircle color={theme.palette.text.secondary} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Earnings"
            value={`$${summaryData.earnings.toFixed(2)}`}
            icon={<FaDollarSign color={theme.palette.text.secondary} />}
          />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Service Locations
        </Typography>
        <Box
          sx={{
            height: 0,
            paddingTop: '56.25%', // 16:9 aspect ratio
            position: 'relative',
            backgroundColor: theme.palette.grey[200],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <FaMapMarkerAlt size={48} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Google Map Placeholder
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardOverview;
