

const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];

const TechStack = () => {
  return (
    <div className="techstack" style={{ padding: '50px 0', textAlign: 'center' }}>
      <h2> My Techstack</h2>
      <div 
        className="tech-grid" 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '30px', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginTop: '60px',
          maxWidth: '800px',
          margin: '60px auto 0 auto'
        }}
      >
        {imageUrls.map((url, i) => (
          <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
            <img 
              src={url} 
              alt={`Tech stack ${i}`} 
              style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
