import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
    currentName: string;
}

export const Breadcrumbs = ({ currentName }: BreadcrumbsProps) => {
    return (
        <nav style={{
            padding: '20px 40px',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            color: '#999',
            letterSpacing: '1px'
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#999', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'black'} onMouseOut={(e) => e.currentTarget.style.color = '#999'}>
                HOME
            </Link>

            <span style={{ margin: '0 10px' }}>/</span>

            <span style={{ color: 'black', fontWeight: '600' }}>
                {currentName}
            </span>
        </nav>
    );
};