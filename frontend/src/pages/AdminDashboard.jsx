import React, { useState, useEffect } from 'react';
import { 
  Grid, Typography, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, 
  CircularProgress, Alert, useTheme, CardContent, Divider, Stack
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArticleIcon from '@mui/icons-material/Article';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';

import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

import API from '../services/api';
import GlassCard from '../components/GlassCard';

// Register ChartJS modules
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement
);

const AdminDashboard = () => {
  const theme = useTheme();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get('reports/dashboard/');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch analytics datasets. Please verify database availability.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} />
          <Typography color="textSecondary" variant="body2">Fetching portal metrics...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const { kpi, charts, recent } = stats;

  // 1. Line Chart Data (Registrations Timeline)
  const lineChartData = {
    labels: charts.registrations.map(r => r.month),
    datasets: [
      {
        label: 'New Registrations',
        data: charts.registrations.map(r => r.count),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        tension: 0.4,
        pointBackgroundColor: '#1e3a8a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
      }
    ]
  };


  // 2. Bar Chart Data (Revenue Timeline)
  const barChartData = {
    labels: charts.revenue.map(r => r.month),
    datasets: [
      {
        label: 'Monthly Income (INR)',
        data: charts.revenue.map(r => r.revenue),
        backgroundColor: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
        backgroundColor: 'rgba(13, 148, 136, 0.75)',
        borderColor: '#0d9488',
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  };

  // 3. Doughnut Chart (Article Submissions Status)
  const doughnutChartData = {
    labels: ['Submitted', 'Under Review', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          kpi.articles.submitted,
          kpi.articles.under_review,
          kpi.articles.approved,
          kpi.articles.rejected
        ],
        backgroundColor: [
          '#64748b', 
          '#f59e0b', 
          '#10b981', 
          '#ef4444'  
        ],
        borderWidth: 1,
      }
    ]
  };

  const kpiCards = [
    { title: 'Total Registrations', value: kpi.total_registrations, subtitle: `${kpi.successful_registrations} Successful Payments`, icon: <PeopleAltIcon fontSize="large" color="primary" />, color: 'primary.main' },
    { title: 'Gross Revenue Collected', value: `₹${kpi.total_revenue.toLocaleString('en-IN')}`, subtitle: `${kpi.payments.success} Validated Transactions`, icon: <AccountBalanceIcon fontSize="large" color="secondary" />, color: 'secondary.main' },
    { title: 'Article Submissions', value: kpi.articles.total, subtitle: `${kpi.articles.approved} Approved Papers`, icon: <ArticleIcon fontSize="large" sx={{ color: '#7c3aed' }} />, color: '#7c3aed' },
    { title: 'Pending Transactions', value: kpi.payments.pending, subtitle: 'Awaiting checkout redirection', icon: <AttachMoneyIcon fontSize="large" color="warning" />, color: 'warning.main' }
  ];

  return (
    <Box>
      {/* KPI Cards Grid */}
      <Grid container spacing={3} mb={4}>
        {kpiCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <GlassCard sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ my: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" fontWeight="600">
                    {card.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(15, 23, 42, 0.03)' }}>
                  {card.icon}
                </Box>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Charts & Details Grid */}
      <Grid container spacing={3}>
        {/* Registrations Chart */}
        <Grid item xs={12} md={6}>
          <GlassCard sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary.main">
              Registrations Acquisition Timeline
            </Typography>
            <Box sx={{ height: 320, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {charts.registrations.length > 0 ? (
                <Line 
                  data={lineChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }} 
                />
              ) : (
                <Stack alignItems="center" spacing={1.5}>
                  <TimelineIcon sx={{ fontSize: 48, color: 'text.light' }} />
                  <Typography variant="body2" color="textSecondary">No data available for the period</Typography>
                </Stack>
              )}
            </Box>
          </GlassCard>
        </Grid>

        {/* Revenue Income Chart */}
        <Grid item xs={12} md={6}>
          <GlassCard sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="secondary.main">
              Revenue Generated Breakdown
            </Typography>
            <Box sx={{ height: 320, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {charts.revenue.length > 0 ? (
                <Bar 
                  data={barChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }} 
                />
              ) : (
                <Stack alignItems="center" spacing={1.5}>
                  <BarChartIcon sx={{ fontSize: 48, color: 'text.light' }} />
                  <Typography variant="body2" color="textSecondary">No revenue records logged yet</Typography>
                </Stack>
              )}
            </Box>
          </GlassCard>
        </Grid>

        {/* Recent Registrations Table */}
        <Grid item xs={12} lg={8}>
          <GlassCard sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary.main">
              Recent Participant Registrations
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Reg ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Participant</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent.registrations.map((reg) => (
                    <TableRow key={reg.id} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>{reg.registration_id}</TableCell>
                      <TableCell>{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={reg.payment_status} 
                          size="small"
                          color={
                            reg.payment_status === 'SUCCESS' ? 'success' :
                            reg.payment_status === 'PENDING' ? 'warning' : 'error'
                          }
                          sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {recent.registrations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No participants registered yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        {/* Article Status Breakdown Chart */}
        <Grid item xs={12} lg={4}>
          <GlassCard sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={3} color="primary.main">
              Articles Review Breakdown
            </Typography>
            <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {kpi.articles.total > 0 ? (
                <Doughnut 
                  data={doughnutChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
                  }} 
                />
              ) : (
                <Stack alignItems="center" spacing={1.5}>
                  <ArticleIcon sx={{ fontSize: 50, color: 'text.light' }} />
                  <Typography variant="body2" color="textSecondary">No papers submitted yet</Typography>
                </Stack>
              )}
            </Box>
          </GlassCard>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;
