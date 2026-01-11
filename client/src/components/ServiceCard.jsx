const ServiceCard = ({ service, onSelect, selected }) => {
    return (
        <div
            className="card"
            style={{
                border: selected ? '2px solid #3b82f6' : '1px solid #334155',
                opacity: selected ? 1 : 0.7,
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
            onClick={() => onSelect(service)}
        >
            <h3 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>{service.name}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                ${service.price}
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                {service.description}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem', color: '#cbd5e1' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ 24/7 Support</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Fast Delivery</li>
                <li>✓ Secure Payment</li>
            </ul>
        </div>
    );
};

export default ServiceCard;
