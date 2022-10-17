import AuthContextProvider from './contexts/AuthContext';
import Routing from './components/Routing';
import UserContextProvider from './contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import MessageProvider from './contexts/MessageContext';
import CommentProvider from './contexts/CommentContext';

function App() {
    return (
        <AuthContextProvider>
            <MessageProvider>
                <CommentProvider>
                    <UserContextProvider>
                        <div className="App">
                            <Router>
                                <Routing />
                            </Router>
                            <ToastContainer
                                position="top-center"
                                autoClose={1000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />
                        </div>
                    </UserContextProvider>
                </CommentProvider>
            </MessageProvider>
        </AuthContextProvider>
    );
}

export default App;
