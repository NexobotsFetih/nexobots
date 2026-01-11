import { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
    { id: 1, name: 'Bronze Package', price: 9.99, description: 'Basic item set to get you started.' },
    { id: 2, name: 'Silver Package', price: 29.99, description: 'Advanced items for serious players.' },
    { id: 3, name: 'Gold Package', price: 99.99, description: 'Ultimate domination kit with rare items.' },
];

const Home = () => {
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (selectedService) {
            // In a real app, dispatch to a global cart store
            console.log('Added to cart:', selectedService);
            navigate('/payment-chat', { state: { service: selectedService } });
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h1 style={{ fontSize: '3.5rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Dominate Fetih Altınçağ
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Premium service packages delivered manually by experts. Secure, fast, and reliable.
                </p>
                <a href="#services" className="btn-primary" style={{ fontSize: '1.1rem' }}>Get Started</a>
            </section>

            {/* Services Section */}
            <section id="services" style={{ padding: '4rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Choose Your Package</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {SERVICES.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            selected={selectedService?.id === service.id}
                            onSelect={setSelectedService}
                        />
                    ))}
                </div>

                {selectedService && (
                    <div style={{ textAlign: 'center', marginTop: '3rem', position: 'sticky', bottom: '2rem' }}>
                        <div style={{ background: '#1e293b', padding: '1rem 2rem', borderRadius: '1rem', display: 'inline-flex', alignItems: 'center', gap: '2rem', border: '1px solid #3b82f6', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                            <div>
                                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Selected Package</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedService.name} - ${selectedService.price}</div>
                            </div>
                            <button onClick={handleAddToCart} className="btn-primary">
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
