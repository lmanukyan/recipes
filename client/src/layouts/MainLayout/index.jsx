import { styled } from '@mui/system';
import { Container } from '@mui/material';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const SiteContainer = styled(Container)({
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
    padding: '0 !important'
});

const Main = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
});

export default function MainLayout({ children, noPadding = false }) {
    return (
        <SiteContainer maxWidth="xl">
            <Header />
            <Main style={ noPadding ? {} : {paddingTop: 32, paddingBottom: 32}}>
                {children}
            </Main>
            <Footer />
        </SiteContainer>
    );
}
