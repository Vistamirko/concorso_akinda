import "../App.css";
import Navbar from "../navbar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-5 position-relative">
        <div className="hero-glow" style={{ background: 'radial-gradient(circle, rgba(0, 132, 255, 0.15) 0%, transparent 70%)' }}></div>
        
        <div className="row text-center mb-5">
          <div className="col-12 py-5">
            <h1 className="h1-premium mb-3">SCRAPER.HUB</h1>
            <p className="text-secondary lead mx-auto" style={{ maxWidth: '600px' }}>
              Piattaforma professionale per il monitoraggio, la raccolta dati 
              e l'estrazione automatizzata per campagne social Instagram e Facebook.
            </p>
          </div>
        </div>

        <div className="row g-5 mt-4">
          {/* CONCORSO 1: EUROBET */}
          <div className="col-12 col-lg-6">
            <Link to="/eurobet-instagram" className="dashboard-card group">
              <div className="glass-card" style={{ borderLeft: '4px solid #0084ff' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="badge-premium" style={{ background: 'rgba(0, 132, 255, 0.1)', color: '#0084ff' }}>Eurobet Exclusive</div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px', boxShadow: '0 0 10px #00ff00' }}></div>
                    <span className="text-success small fw-bold tracking-widest">ATTIVO</span>
                  </div>
                </div>
                <h2 className="mb-3 text-white">Campagna Eurobet</h2>
                <p className="text-secondary mb-4" style={{ minHeight: '60px' }}>
                  Monitoraggio hashtag Instagram. Raccolta automatizzata delle partecipazioni 
                  e gestione delle estrazioni periodiche.
                </p>
                <div className="d-flex justify-content-between align-items-center mt-auto pt-4 border-top border-white border-opacity-10">
                  <div className="d-flex gap-4 text-secondary small">
                    <div>
                        <div className="text-white fw-bold">Aprile - Maggio</div>
                        <div className="opacity-50 text-uppercase" style={{ fontSize: '0.6rem' }}>Periodo</div>
                    </div>
                    <div>
                        <div className="text-white fw-bold">4 Estrazioni</div>
                        <div className="opacity-50 text-uppercase" style={{ fontSize: '0.6rem' }}>Obiettivo</div>
                    </div>
                  </div>
                  <div className="text-white opacity-50">ENTRA →</div>
                </div>
              </div>
            </Link>
          </div>

          {/* CONCORSO 2: PENNY */}
          <div className="col-12 col-lg-6">
            <Link to="/penny-facebook" className="dashboard-card group">
              <div className="glass-card" style={{ borderLeft: '4px solid #00f2fe' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="badge-premium" style={{ background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe' }}>Penny Social Hub</div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px', boxShadow: '0 0 10px #00ff00' }}></div>
                    <span className="text-success small fw-bold tracking-widest">ATTIVO</span>
                  </div>
                </div>
                <h2 className="mb-3 text-white">Concorsi Penny</h2>
                <p className="text-secondary mb-4" style={{ minHeight: '60px' }}>
                  Hub centralizzato per i commenti Facebook e Instagram. 
                  Gestione engagement e estrazioni per i post promozionali.
                </p>
                <div className="d-flex justify-content-between align-items-center mt-auto pt-4 border-top border-white border-opacity-10">
                  <div className="d-flex gap-4 text-secondary small">
                    <div>
                        <div className="text-white fw-bold">Aprile - Giugno</div>
                        <div className="opacity-50 text-uppercase" style={{ fontSize: '0.6rem' }}>Periodo</div>
                    </div>
                    <div>
                        <div className="text-white fw-bold">3 Estrazioni</div>
                        <div className="opacity-50 text-uppercase" style={{ fontSize: '0.6rem' }}>Obiettivo</div>
                    </div>
                  </div>
                  <div className="text-white opacity-50">ENTRA →</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ARCHIVE SECTION */}
        <div className="row mt-5 pt-5">
           <div className="col-12 mb-4">
              <h2 className="text-white h3">Archivio Storico</h2>
              <p className="text-secondary">Consulta i dati delle estrazioni precedenti e lo storico delle partecipazioni.</p>
           </div>
           <div className="col-md-4">
              <Link to="/FbPost" className="dashboard-card">
                 <div className="glass-card py-4 text-center">
                    <div className="h5 mb-1 text-white">Facebook Archive</div>
                    <div className="small text-secondary">Hashtag Legacy</div>
                 </div>
              </Link>
           </div>
           <div className="col-md-4">
              <Link to="/IgPost" className="dashboard-card">
                 <div className="glass-card py-4 text-center">
                    <div className="h5 mb-1 text-white">Instagram Archive</div>
                    <div className="small text-secondary">Hashtag Legacy</div>
                 </div>
              </Link>
           </div>
           <div className="col-md-4">
              <Link to="/IgComment" className="dashboard-card">
                 <div className="glass-card py-4 text-center">
                    <div className="h5 mb-1 text-white">Instagram Review</div>
                    <div className="small text-secondary">Commenti Legacy</div>
                 </div>
              </Link>
           </div>
        </div>

        <div className="row mt-5 pb-5 text-center">
             <div className="col-12 mt-5">
                <p className="small text-secondary opacity-50 tracking-widest text-uppercase">
                    Advanced Social Scraper System &bull; Enterprise Edition
                </p>
             </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
