// import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button"
import { CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from 'components/base/IconifyIcon';

// import Footer from 'components/common/Footer';

interface CategoryCardProps {
    type: string;
    handleClick: (type: string) => void;
}

const CategoryCard = ({ type, handleClick }: CategoryCardProps) => {
    return <Card variant="outlined" onClick={() => handleClick(type)} sx={{
        cursor: 'pointer',
        bgcolor: 'transparent',
        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
        color: 'white',
    }}>
            <CardContent sx={{ width: "100%", display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2 }} >
            <IconifyIcon icon="material-symbols:store" fontSize={36}/>
            <Typography >{type}</Typography>
        </CardContent>
    </Card>
}

// Utility function to capitalize words separated by hyphens
const capitalizeHyphenatedWords = (str: string): string => {
    return str
        .split('-') // Split the string by hyphen
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words with a space
}

const Home = () => {
    const navigate = useNavigate()
    const handleClick = (type: string) => {
        navigate(`/pages/service-providers/${type}`)
    }
    const handleNavigateToMaps = () => {
        navigate(`/pages/sp-maps`)

    }
    const storeTypes = ['vulcanizing-shop', 'gasoline-station']


    return (
        <Stack
            direction={{ xs: 'column' }}
            width={1}
            //  bgcolor="info.dark"
            px={3.5}
            py={3.5}
            spacing={3.5}
        >   <Grid container spacing={1}>
                <Grid item xs={12} sx={{display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" sx={{width: 150}} onClick={handleNavigateToMaps}>Maps</Button>
                </Grid>
                {storeTypes.map(type => <Grid item key={type} xs={6}><CategoryCard type={capitalizeHyphenatedWords(type)} handleClick={() => handleClick(type)} /></Grid>)}
            </Grid>
        </Stack>
    );
};

export default Home;
