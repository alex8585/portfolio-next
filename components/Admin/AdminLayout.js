
import AdminMenu from "./AdminMenu"
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Head from 'next/head';
function AdminLayout({ children }) {
    return(
        <Box sx={{ display: 'flex' }}>
            <Head>
                {/* <link rel="favicon icon" href="favicon.ico" /> */}
            </Head>
            <AdminMenu/>
            <Box component="main"
                sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                }}>
        
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {children}
            </Container>   
            </Box>
        </Box>
    )
}

export default AdminLayout

