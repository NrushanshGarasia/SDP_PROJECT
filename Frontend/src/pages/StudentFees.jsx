import { useEffect, useState } from 'react';
import api from '../utils/axios';

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setError('');
        const res = await api.get('/api/fees/me');
        setFees(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load fees');
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const formatDate = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString();
  };

  const buildPdf = async (fee, kind) => {
    const { jsPDF } = await import('jspdf');

    const isReceipt = kind === 'receipt';
    const studentId = fee.student?.studentId || 'N/A';
    const studentName = fee.student?.user?.name || fee.student?.user?.email || 'N/A';
    const docId = String(fee.id || fee._id || '');
    const shortId = docId ? docId.slice(-8).toUpperCase() : 'N/A';
    const label = isReceipt ? 'Fee Receipt' : 'Fee Invoice';
    const numberLabel = isReceipt ? 'Receipt No' : 'Invoice No';

    const doc = new jsPDF();
    const left = 14;
    let y = 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('HOSTEL MANAGEMENT SYSTEM', left, y);
    y += 6;
    doc.setFontSize(12);
    doc.text(label, left, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y += 8;
    doc.text(`${numberLabel}: ${shortId}`, left, y);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 120, y);
    y += 8;

    doc.setDrawColor(229, 231, 235);
    doc.line(left, y, 196, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Student Details', left, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Student ID: ${studentId}`, left, y);
    y += 5;
    doc.text(`Name/Email: ${studentName}`, left, y);
    y += 9;

    doc.setFont('helvetica', 'bold');
    doc.text('Fee Details', left, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${String(fee.feeType || '').toUpperCase()}`, left, y);
    y += 5;
    doc.text(`Amount: INR ${fee.amount}`, left, y);
    y += 5;
    doc.text(`Due Date: ${formatDate(fee.dueDate)}`, left, y);
    y += 5;
    doc.text(`Status: ${String(fee.status || '').toUpperCase()}`, left, y);
    y += 7;

    if (isReceipt) {
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', left, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Paid Date: ${formatDate(fee.paidDate)}`, left, y);
      y += 5;
      doc.text(`Payment Method: ${fee.paymentMethod || '-'}`, left, y);
      y += 5;
      doc.text(`Transaction ID: ${fee.transactionId || '-'}`, left, y);
      y += 5;
      doc.text(`Remarks: ${fee.remarks || '-'}`, left, y);
      y += 10;
    } else {
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.text('Note: This invoice is generated for payment reference.', left, y);
      y += 9;
      doc.setTextColor(0, 0, 0);
    }

    doc.setDrawColor(229, 231, 235);
    doc.line(left, y, 196, y);
    y += 8;
    doc.setFontSize(9);
    doc.text('This is a system generated document.', left, y);

    const baseName = isReceipt ? 'fee-receipt' : 'fee-invoice';
    const fileName = `${baseName}_${studentId}_${shortId}.pdf`.replaceAll(' ', '_');
    return { doc, fileName, title: `${label} • ${studentId}` };
  };

  const handleDownload = async (fee) => {
    try {
      setBusyId(fee.id || fee._id);
      const kind = fee.status === 'paid' ? 'receipt' : 'invoice';
      const { doc, fileName } = await buildPdf(fee, kind);
      doc.save(fileName);
    } catch (e) {
      setError('Failed to generate receipt. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const handleView = async (fee) => {
    try {
      setBusyId(fee.id || fee._id);
      setError('');
      const kind = fee.status === 'paid' ? 'receipt' : 'invoice';
      const { doc, title } = await buildPdf(fee, kind);
      const blob = doc.output('blob');
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewTitle(title);
      setPreviewUrl(url);
    } catch {
      setError('Failed to generate preview. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setPreviewTitle('');
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>My Fees</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        View all your hostel-related fee records, due dates, and payment status.
      </p>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div>Loading fees...</div>
        ) : error ? (
          <div style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.id || f._id}>
                  <td style={{ textTransform: 'capitalize' }}>{f.feeType}</td>
                  <td>₹{f.amount}</td>
                  <td>{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={
                        f.status === 'paid'
                          ? 'badge badge-success'
                          : f.status === 'overdue'
                          ? 'badge badge-danger'
                          : 'badge badge-warning'
                      }
                      style={{ textTransform: 'capitalize' }}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleView(f)}
                      disabled={busyId === (f.id || f._id)}
                      className="btn"
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        marginRight: '0.4rem',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                        cursor: busyId === (f.id || f._id) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {busyId === (f.id || f._id) ? 'Generating...' : 'View'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(f)}
                      disabled={busyId === (f.id || f._id)}
                      className="btn btn-primary"
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        cursor: busyId === (f.id || f._id) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {busyId === (f.id || f._id)
                        ? 'Generating...'
                        : f.status === 'paid'
                        ? 'Download Receipt'
                        : 'Download Invoice'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50,
          }}
          onClick={closePreview}
        >
          <div
            className="card"
            style={{
              width: 'min(980px, 100%)',
              height: 'min(80vh, 720px)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                  {previewTitle || 'Document Preview'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Use Download to save a copy.
                </div>
              </div>
              <button type="button" className="btn" onClick={closePreview} style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                Close
              </button>
            </div>
            <div style={{ flex: 1, borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <iframe
                title="Fee document preview"
                src={previewUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFees;

