import { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

type Client = {
  [key: string]: string;
};

export default function Home() {
  const [data, setData] = useState<Client[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (typeof bstr !== 'string') return;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      const keys = parsedData[0];
      const formattedData = parsedData.slice(1).map(row =>
        Object.fromEntries(row.map((cell: any, i: number) => [keys[i], cell]))
      );
      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const sendEmails = async () => {
    if (!data.length) return alert("Please upload a valid Excel file first!");
    try {
      await axios.post('/api/send-emails', { clients: data });
      alert('✅ Emails sent!');
    } catch (err: any) {
      alert('❌ Failed to send emails: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #dbeafe, #fce7f3, #ede9fe)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '768px',
          background: 'white',
          padding: '32px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          backdropFilter: 'blur(10px)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            textAlign: 'center',
            background: 'linear-gradient(to right, #6366f1, #ec4899, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '2rem',
            fontFamily: 'Segoe UI, sans-serif',
          }}
        >
          ✨ AI Email Outreach Tool
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{
              padding: '12px',
              border: '2px dashed #6366f1',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '400px',
              background: '#fff',
              color: '#374151',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          />

          <button
            onClick={sendEmails}
            style={{
              background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
              color: '#fff',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transform: 'scale(1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(99,102,241,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🚀 Send Emails
          </button>
        </div>

        <div
          style={{
            marginTop: '2rem',
            background: '#f3f4f6',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
            maxHeight: '300px',
            overflowY: 'auto',
            fontSize: '0.875rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            📄 Preview Excel Data
          </h2>
          {data.length > 0 ? (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                color: '#1f2937',
                fontSize: '0.75rem',
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p style={{ color: '#6b7280' }}>
              No data loaded. Please upload an Excel file to preview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
