import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
    return (
        <div className="app-container">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};