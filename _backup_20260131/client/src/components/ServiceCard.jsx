import { Check, Package } from 'lucide-react';

const ServiceCard = ({ service, onSelect, selected }) => {
    return (
        <div
            className="card"
            style={{
                border: selected ? '2px solid #00f2ff' : '1px solid rgba(0, 242, 255, 0.2)',
                background: selected ? 'rgba(0, 242, 255, 0.05)' : 'rgba(16, 28, 45, 0.6)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '580px', // Biraz daha uzattık
                display: 'flex',
                flexDirection: 'column',
                padding: '3rem' // Padding biraz daha artırıldı
            }}
            onClick={() => onSelect(service)}
        >
            {selected && (
                <div style={{
                    position: 'absolute',
                    top: 0, right: 0,
                    background: '#00f2ff',
                    color: '#000',
                    padding: '0.5rem 2rem',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    borderBottomLeftRadius: '20px'
                }}>
                    SEÇİLEN
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div style={{
                    padding: '1.2rem',
                    background: 'rgba(0,242,255,0.08)',
                    borderRadius: '15px',
                    border: '1px solid rgba(0,242,255,0.2)'
                }}>
                    <Package size={45} color={selected ? "#00f2ff" : "#475569"} />
                </div>
                <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    color: '#fff',
                    textShadow: selected ? '0 0 40px rgba(0,242,255,0.7)' : 'none'
                }}>
                    {service.price} <span style={{ fontWeight: 'normal' }}>₺</span>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{
                    color: selected ? '#00f2ff' : '#fff',
                    marginBottom: '1.2rem',
                    fontSize: '2rem',
                    fontFamily: 'Orbitron',
                    letterSpacing: '1px'
                }}>
                    {service.name}
                </h3>

                <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                    {service.description}
                </p>
            </div>

            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '2.5rem',
                marginTop: 'auto'
            }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1' }}>
                    {[
                        '7/24 Teknik Canlı Destek',
                        'Ultra Hızlı Teslimat Sistemi',
                        '%100 Güvenli Şifreli Ödeme',
                        'Özel Elite Discord Rolü',
                        'Anlık Mobil Bildirimler',
                        'Haftalık Performans Raporu',
                        'VIP Öncelikli Operasyon'
                    ].map((feature, idx) => (
                        <li key={idx} style={{ marginBottom: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1rem' }}>
                            <Check size={20} color="#00ff55" /> {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ServiceCard;
