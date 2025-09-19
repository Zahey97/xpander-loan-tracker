import React, { useState } from 'react';
import type { Payment } from '../types';
import Card from './Card';

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
});

type PaymentFormData = Omit<Payment, 'id'>;

interface PaymentFormProps {
  onSave: (data: PaymentFormData) => void;
  onCancel: () => void;
  initialData?: PaymentFormData;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSave, onCancel, initialData }) => {
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [paymentDate, setPaymentDate] = useState(initialData?.paymentDate || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [fileName, setFileName] = useState(initialData?.fileName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onSave({ amount: parsedAmount, paymentDate, notes, fileName });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-4 rounded-lg my-2 border border-slate-200">
      <div>
        <label htmlFor="paymentDate" className="block text-sm font-medium text-slate-700">Payment Date</label>
        <input
          type="date"
          id="paymentDate"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount Paid (MYR)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="580.00"
          step="0.01"
          required
        />
      </div>
       <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes (Optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Online transfer"
        />
      </div>
      <div>
        <label htmlFor="fileUpload" className="block text-sm font-medium text-slate-700">Upload Receipt (PDF/Image)</label>
        <div className="mt-1 flex items-center">
            <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
        </div>
        {fileName && <p className="text-xs text-slate-500 mt-1">File: {fileName}</p>}
      </div>
      <div className="flex items-center space-x-4">
         <button
          type="submit"
          className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};


interface PaymentHistoryListProps {
  payments: Payment[];
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onUpdatePayment: (payment: Payment) => void;
}

const PaymentHistoryList: React.FC<PaymentHistoryListProps> = ({ payments, onAddPayment, onUpdatePayment }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <Card title="Add New Payment">
        {!showAddForm ? (
          <button
            onClick={() => {
                setShowAddForm(true);
                setEditingPaymentId(null);
            }}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Record a Payment
          </button>
        ) : (
           <PaymentForm 
                onSave={(data) => {
                    onAddPayment(data);
                    setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
            />
        )}
      </Card>
      
      <Card title="Payment History">
        {payments.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No payments recorded yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {[...payments].reverse().map(payment => (
              <li key={payment.id} className="py-3">
                {editingPaymentId === payment.id ? (
                    <PaymentForm 
                        initialData={payment}
                        onSave={(data) => {
                            onUpdatePayment({ ...payment, ...data });
                            setEditingPaymentId(null);
                        }}
                        onCancel={() => setEditingPaymentId(null)}
                    />
                ) : (
                <div className="flex justify-between items-start">
                    <div>
                    <p className="text-sm font-medium text-slate-800">{new Date(payment.paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}</p>
                    {payment.notes && <p className="text-xs text-slate-500">{payment.notes}</p>}
                    {payment.fileName && <p className="text-xs text-blue-600 font-medium mt-1">Attachment: {payment.fileName}</p>}
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm font-semibold text-green-700">{currencyFormatter.format(payment.amount)}</p>
                        <button 
                            onClick={() => {
                                setEditingPaymentId(payment.id);
                                setShowAddForm(false);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-1"
                        >
                            Edit
                        </button>
                    </div>
                </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default PaymentHistoryList;
