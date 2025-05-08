import { Grid, Box } from '@mui/material';
import DashboardLayout from '../components/DashbaordComponents/dashboardlayout';
import InfoCard from '../components/DashbaordComponents/infocard';
import { People, MedicalServices, AttachMoney, LocalCarWash } from '@mui/icons-material';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        <Grid size={{sx:12, sm:6, md:3}}>
          <InfoCard icon={<People />} label="Total Patients" value="3,256" color="purple" />
        </Grid>
        <Grid size={{sx:12, sm:6, md:3}}>
          <InfoCard icon={<MedicalServices />} label="Available Staff" value="394" color="blue" />
        </Grid>
        <Grid size={{sx:12, sm:6, md:3}}>
          <InfoCard icon={<AttachMoney />} label="Avg Treat. Costs" value="$2,536" color="green" />
        </Grid>
        <Grid size={{sx:12, sm:6, md:3}}>
          <InfoCard icon={<LocalCarWash />} label="Available Cars" value="38" color="orange" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{sx:12, md:8}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Chart: Outpatients vs. Inpatients Trend
          </Box>
        </Grid>
        <Grid size={{sx:12, md:4}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Chart: Patients by Gender
          </Box>
        </Grid>
        <Grid size={{sx:12, md:8}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Chart: Time Admitted
          </Box>
        </Grid>
        <Grid size={{sx:12, md:4}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Table: Patients by Division
          </Box>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;