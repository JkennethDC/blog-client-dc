import { Container } from "react-bootstrap";

export default function Home() {
    return (
        <Container 
            fluid={true} 
            style={{ 
                background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '20px',
            }}
        >
            <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Welcome to J - Blog</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>
                Discover insightful articles and explore various topics curated just for you.
            </p>
            <button 
                style={{ 
                    padding: '10px 20px', 
                    fontSize: '1.2rem', 
                    border: 'none', 
                    borderRadius: '5px', 
                    backgroundColor: '#feb47b', 
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff7e5f'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#feb47b'} 
                onClick={() => window.location.href = '/blogs'}
            >
                Explore Blogs
            </button>
        </Container>
    );
}
