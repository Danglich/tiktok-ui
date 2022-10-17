import { Navigate, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import { publicRoutes, privateRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { AuthContext } from '~/contexts/AuthContext';
import ModalDetailVideo from '~/pages/ModalDetailVideo';

function Routing() {
    const { authState } = useContext(AuthContext);
    const { isAuthenticated } = authState;
    const location = useLocation();
    const background = location.state && location.state.background;

    return (
        <>
            <Routes location={background || location}>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return isAuthenticated ? (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    ) : (
                        <Route
                            key={index}
                            path={route.path}
                            element={<Navigate replace to={route.redirect} />}
                        />
                    );
                })}
            </Routes>

            {background && (
                <Routes>
                    <Route
                        path="/@:nickname/video/:videoId"
                        element={<ModalDetailVideo />}
                    />
                </Routes>
            )}
        </>
    );
}

export default Routing;
