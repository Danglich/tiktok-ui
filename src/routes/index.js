import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Upload from '~/pages/Upload';
import Profile from '~/pages/Profile';
import { OnlyHeader } from '~/layouts';
import FullLayout from '~/layouts/FullLayout';
import Search from '~/pages/Search';
import DetailVideo from '~/pages/DetailVideo';
import Message from '~/pages/Message';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following },
    { path: '/@:nickname', component: Profile, layout: FullLayout },
    { path: '/search', component: Search },
    { path: '/messages', component: Message, layout: OnlyHeader },
    { path: '/search/user', component: Search },
    { path: '/search/video', component: Search },
    {
        path: '/@:nickname/video/:videoId',
        component: DetailVideo,
        layout: FullLayout,
    },
];

const privateRoutes = [
    { path: '/upload', redirect: '/', component: Upload, layout: OnlyHeader },
];

export { publicRoutes, privateRoutes };
