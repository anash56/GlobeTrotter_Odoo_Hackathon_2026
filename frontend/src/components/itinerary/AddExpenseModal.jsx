import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Calendar, MapPin, Loader2, Plus, Edit } from 'lucide-react';

const CATEGORIES = ['Transport', 'Stay', 'Activity', 'Meals', 'Miscellaneous'];

export function AddExpenseModal({ isOpen, onClose, onSubmit, stops = [], initialData, isLoading }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Transport');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [tripStopId, setTripStopId] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Transport');
      setAmount(initialData.amount !== undefined ? String(initialData.amount) : '');
      setExpenseDate(initialData.expenseDate ? new Date(initialData.expenseDate).toISOString().split('T')[0] : '');
      setTripStopId(initialData.tripStopId || '');
    } else {
      setTitle('');
      setCategory('Transport');
      setAmount('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      setTripStopId('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Expense title is required.';
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount.';
    }
    if (!expenseDate) {
      newErrors.expenseDate = 'Date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      category,
      amount: parseFloat(amount),
      expenseDate,
      tripStopId: tripStopId || null,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="add-expense-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <DollarSign size={20} color="#10B981" />
            <h2>{initialData ? 'Edit Expense' : 'Add Trip Expense'}</h2>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              Expense Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Flight to Paris, Boutique Hotel, Seine Boat Ticket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
            {errors.title && <span className="field-error-text">{errors.title}</span>}
          </div>

          {/* Row: Category & Amount */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <Tag size={13} /> Category <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <DollarSign size={13} /> Amount ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${errors.amount ? 'input-error' : ''}`}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
              {errors.amount && <span className="field-error-text">{errors.amount}</span>}
            </div>
          </div>

          {/* Row: Date & Optional Stop */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={13} /> Date <span className="required">*</span>
              </label>
              <input
                type="date"
                className={`form-input ${errors.expenseDate ? 'input-error' : ''}`}
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                disabled={isLoading}
              />
              {errors.expenseDate && <span className="field-error-text">{errors.expenseDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin size={13} /> Associated Stop (Optional)
              </label>
              <select
                className="form-select"
                value={tripStopId}
                onChange={(e) => setTripStopId(e.target.value)}
                disabled={isLoading}
              >
                <option value="">General Trip Expense</option>
                {stops.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.city?.name || 'Stop'} ({new Date(stop.startDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="spinner" /> Saving...
                </>
              ) : initialData ? (
                <>
                  <Edit size={16} /> Update Expense
                </>
              ) : (
                <>
                  <Plus size={16} /> Record Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
