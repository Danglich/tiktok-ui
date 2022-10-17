import Header from '../components/Header';
import Footer from '../components/Footer';

function OnlyHeader({ children }) {
    return (
        <div>
            <Header />
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default OnlyHeader;
