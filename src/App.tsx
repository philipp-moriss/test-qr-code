import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import './App.css';

interface QRCodeData {
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  timestamp: string;
}

function App() {
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScanning && scannerContainerRef.current && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scannerRef.current.render((decodedText) => {
        try {
          const data: QRCodeData = JSON.parse(decodedText);
          setScannedData(data);
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
          }
        } catch (error) {
          console.error('Error parsing QR code:', error);
        }
      }, (error) => {
        console.log('Scanning error:', error);
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  const startScanning = () => {
    setIsScanning(true);
    setScannedData(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="app-title">BAR TREKKER</h1>
        <div className="tab-indicator">
          <div className="tab-line"></div>
          <span className="tab-text">QR Scanner</span>
          <div className="tab-line"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="scanner-container">
          {!isScanning && !scannedData && (
            <div className="scan-section">
              <div className="scan-card">
                <div className="scan-icon">📷</div>
                <h2>Scan QR Code</h2>
                <p>Point your camera at the QR code to get ticket information</p>
                <button className="scan-button" onClick={startScanning}>
                  Start Scanning
                </button>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="scanner-section">
              <div className="scanner-card">
                <h2>QR Code Scanning</h2>
                <div id="qr-reader" ref={scannerContainerRef}></div>
                <button className="stop-button" onClick={stopScanning}>
                  Stop Scanning
                </button>
              </div>
            </div>
          )}

          {scannedData && (
            <div className="ticket-section">
              <div className="ticket-card">
                <div className="ticket-image">
                  <div className="prague-image">
                    <div className="image-placeholder">🏛️</div>
                  </div>
                </div>
                
                <div className="qr-code-section">
                  <div className="qr-code">
                    <div className="qr-placeholder">✅</div>
                    <p>QR code successfully scanned</p>
                  </div>
                </div>

                <div className="event-details">
                  <div className="event-bar">
                    <div className="country-flag">🇨🇿</div>
                    <span className="event-name">{scannedData.eventName}</span>
                    <span className="event-date">{formatDate(scannedData.eventDate)}</span>
                  </div>
                </div>

                <div className="user-info">
                  <h3>User Information:</h3>
                  <div className="info-item">
                    <strong>Name:</strong> {scannedData.userName}
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong> {scannedData.userEmail}
                  </div>
                  <div className="info-item">
                    <strong>User ID:</strong> {scannedData.userId}
                  </div>
                  <div className="info-item">
                    <strong>Event ID:</strong> {scannedData.eventId}
                  </div>
                </div>

                <button className="join-group-button" onClick={startScanning}>
                  Scan Another QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
