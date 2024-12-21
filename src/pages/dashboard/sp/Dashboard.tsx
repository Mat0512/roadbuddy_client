import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box, } from '@mui/material';
import { FaHourglassHalf, FaCheckCircle, FaClock } from 'react-icons/fa'; // Font Awesome icons
import ServiceProviderNotifications from 'components/notification/ServiceProviderNotifications';
import { useStore } from 'store';
import { useEffect, useState } from 'react';
import axiosInstance from 'configs/axios';

export default function ServiceProviderDashboard() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const user_id = user ? user.user_id : null; // Check if user is not null


  const [summaryData, setSummaryData] = useState({
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    if (user_id) {
      const fetchRequestCounts = async () => {
        try {
          const response = await axiosInstance.get(
            `/service-requests/counts/${user_id}`
          );
          const data = response.data.data;
          setSummaryData({
            pendingRequests: data.pending,
            inProgressRequests: data.in_progress,
            completedRequests: data.completed,
          });
        } catch (error) {
          console.error('Error fetching service request counts:', error);
        }
      };

      fetchRequestCounts();
    }
  }, [user_id]);

  interface SummaryCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    onClick?: () => void;
  }

  const SummaryCard = ({ title, value, icon, onClick }: SummaryCardProps) => (
    <Paper elevation={3} sx={{ p: 2, cursor: 'pointer' }} onClick={onClick}>
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

  // Google Maps configuration

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <ServiceProviderNotifications providerId={user_id} />
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Pending Requests"
            value={summaryData.pendingRequests}
            icon={<FaClock color="gray" />}
            onClick={() => navigate('/pages/sp/service-requests')}

          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="In-Progress Requests"
            value={summaryData.inProgressRequests}
            icon={<FaHourglassHalf color="gray" />}
            onClick={() => navigate('/pages/sp/service-requests-accepted')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Completed/Cancelled Requests"
            value={summaryData.completedRequests}
            icon={<FaCheckCircle color="gray" />}
            onClick={() => navigate('/pages/sp/service-history')}
          />
        </Grid>
      </Grid>

      
    </Box>
  );
}
