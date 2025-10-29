import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Liability } from '../types/portfolio';

interface LiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLiability: (liability: Omit<Liability, 'id'>) => void;
  editingLiability: Liability | null;
}

const LIABILITY_TYPES: { value: Liability['type']; label: string; icon: string }[] = [
  { value: 'MORTGAGE', label: 'Mortgage / Home Loan', icon: '🏠' },
  { value: 'CAR_LOAN', label: 'Car Loan', icon: '🚗' },
  { value: 'PERSONAL_LOAN', label: 'Personal Loan', icon: '👤' },
  { value: 'STUDENT_LOAN', label: 'Student Loan', icon: '🎓' },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
  { value: 'GENERIC_LOAN', label: 'Generic Loan', icon: '📋' },
  { value: 'PAYABLE', label: 'Payables', icon: '📝' },
  { value: 'COMMITTED_EXPENSE', label: 'Committed Expenses', icon: '📅' },
  { value: 'OTHER', label: 'Other Liabilities', icon: '📦' }
];

const LiabilityModal: React.FC<LiabilityModalProps> = ({
  isOpen,
  onClose,
  onSaveLiability,
  editingLiability
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'MORTGAGE' as Liability['type'],
    description: '',
    isActive: true,
    
    // Value fields
    outstandingBalance: '',
    emiAmount: '',
    creditLimit: '',
    amountPerPeriod: '',
    amount: '',
    
    // Optional fields
    interestRate: '',
    linkedProperty: '',
    lenderName: '',
    startDate: '',
    tenure: '',
    loanAccountNumber: '',
    vehicleReference: '',
    purpose: '',
    borrowerName: '',
    minimumDue: '',
    dueDate: '',
    cardIdentifier: '',
    loanType: '',
    collateral: '',
    creditorName: '',
    recurrence: '',
    status: '',
    frequency: '',
    beneficiary: '',
    nextPaymentDate: '',
    paymentMode: '',
    secured: false
  });

  useEffect(() => {
    if (editingLiability) {
      setFormData({
        name: editingLiability.name,
        type: editingLiability.type,
        description: editingLiability.description || '',
        isActive: editingLiability.isActive,
        outstandingBalance: editingLiability.outstandingBalance?.toString() || '',
        emiAmount: editingLiability.emiAmount?.toString() || '',
        creditLimit: editingLiability.creditLimit?.toString() || '',
        amountPerPeriod: editingLiability.amountPerPeriod?.toString() || '',
        amount: editingLiability.amount?.toString() || '',
        interestRate: editingLiability.interestRate?.toString() || '',
        linkedProperty: editingLiability.linkedProperty || '',
        lenderName: editingLiability.lenderName || '',
        startDate: editingLiability.startDate || '',
        tenure: editingLiability.tenure || '',
        loanAccountNumber: editingLiability.loanAccountNumber || '',
        vehicleReference: editingLiability.vehicleReference || '',
        purpose: editingLiability.purpose || '',
        borrowerName: editingLiability.borrowerName || '',
        minimumDue: editingLiability.minimumDue?.toString() || '',
        dueDate: editingLiability.dueDate || '',
        cardIdentifier: editingLiability.cardIdentifier || '',
        loanType: editingLiability.loanType || '',
        collateral: editingLiability.collateral || '',
        creditorName: editingLiability.creditorName || '',
        recurrence: editingLiability.recurrence || '',
        status: editingLiability.status || '',
        frequency: editingLiability.frequency || '',
        beneficiary: editingLiability.beneficiary || '',
        nextPaymentDate: editingLiability.nextPaymentDate || '',
        paymentMode: editingLiability.paymentMode || '',
        secured: editingLiability.secured || false
      });
    } else {
      setFormData({
        name: '',
        type: 'MORTGAGE',
        description: '',
        isActive: true,
        outstandingBalance: '',
        emiAmount: '',
        creditLimit: '',
        amountPerPeriod: '',
        amount: '',
        interestRate: '',
        linkedProperty: '',
        lenderName: '',
        startDate: '',
        tenure: '',
        loanAccountNumber: '',
        vehicleReference: '',
        purpose: '',
        borrowerName: '',
        minimumDue: '',
        dueDate: '',
        cardIdentifier: '',
        loanType: '',
        collateral: '',
        creditorName: '',
        recurrence: '',
        status: '',
        frequency: '',
        beneficiary: '',
        nextPaymentDate: '',
        paymentMode: '',
        secured: false
      });
    }
  }, [editingLiability, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.outstandingBalance) {
      return;
    }

    const outstandingBalance = parseFloat(formData.outstandingBalance);
    if (isNaN(outstandingBalance) || outstandingBalance < 0) {
      return;
    }

    const liabilityData: Omit<Liability, 'id'> = {
      name: formData.name.trim(),
      type: formData.type,
      currency: 'INR',
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
      lastUpdated: new Date().toISOString(),
      outstandingBalance: outstandingBalance,
      
      // Value fields
      emiAmount: formData.emiAmount ? parseFloat(formData.emiAmount) : undefined,
      creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
      amountPerPeriod: formData.amountPerPeriod ? parseFloat(formData.amountPerPeriod) : undefined,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      
      // Optional fields
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
      linkedProperty: formData.linkedProperty.trim() || undefined,
      lenderName: formData.lenderName.trim() || undefined,
      startDate: formData.startDate || undefined,
      tenure: formData.tenure.trim() || undefined,
      loanAccountNumber: formData.loanAccountNumber.trim() || undefined,
      vehicleReference: formData.vehicleReference.trim() || undefined,
      purpose: formData.purpose.trim() || undefined,
      borrowerName: formData.borrowerName.trim() || undefined,
      minimumDue: formData.minimumDue ? parseFloat(formData.minimumDue) : undefined,
      dueDate: formData.dueDate || undefined,
      cardIdentifier: formData.cardIdentifier.trim() || undefined,
      loanType: formData.loanType.trim() || undefined,
      collateral: formData.collateral.trim() || undefined,
      creditorName: formData.creditorName.trim() || undefined,
      recurrence: formData.recurrence.trim() || undefined,
      status: formData.status.trim() || undefined,
      frequency: formData.frequency.trim() || undefined,
      beneficiary: formData.beneficiary.trim() || undefined,
      nextPaymentDate: formData.nextPaymentDate || undefined,
      paymentMode: formData.paymentMode.trim() || undefined,
      secured: formData.secured
    };

    onSaveLiability(liabilityData);
    onClose();
  };

  const getFieldsForLiabilityType = (type: Liability['type']) => {
    switch (type) {
      case 'MORTGAGE':
        return (
          <>
            <div>
              <label htmlFor="emiAmount" className="block text-sm font-medium text-gray-700 mb-1">
                EMI Amount (₹) *
              </label>
              <input
                type="number"
                id="emiAmount"
                value={formData.emiAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, emiAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter EMI amount"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter interest rate"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="linkedProperty" className="block text-sm font-medium text-gray-700 mb-1">
                Linked Property Reference
              </label>
              <input
                type="text"
                id="linkedProperty"
                value={formData.linkedProperty}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedProperty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter property reference"
              />
            </div>
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
                Lender Name
              </label>
              <input
                type="text"
                id="lenderName"
                value={formData.lenderName}
                onChange={(e) => setFormData(prev => ({ ...prev, lenderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter lender name"
              />
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
                Tenure
              </label>
              <input
                type="text"
                id="tenure"
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 20 years, 240 months"
              />
            </div>
            <div>
              <label htmlFor="loanAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Account Number
              </label>
              <input
                type="text"
                id="loanAccountNumber"
                value={formData.loanAccountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, loanAccountNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter loan account number"
              />
            </div>
          </>
        );
      
      case 'CAR_LOAN':
        return (
          <>
            <div>
              <label htmlFor="emiAmount" className="block text-sm font-medium text-gray-700 mb-1">
                EMI Amount (₹) *
              </label>
              <input
                type="number"
                id="emiAmount"
                value={formData.emiAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, emiAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter EMI amount"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter interest rate"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="vehicleReference" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Reference
              </label>
              <input
                type="text"
                id="vehicleReference"
                value={formData.vehicleReference}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleReference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter vehicle details"
              />
            </div>
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
                Lender
              </label>
              <input
                type="text"
                id="lenderName"
                value={formData.lenderName}
                onChange={(e) => setFormData(prev => ({ ...prev, lenderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter lender name"
              />
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
                Tenure
              </label>
              <input
                type="text"
                id="tenure"
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 5 years, 60 months"
              />
            </div>
          </>
        );
      
      case 'PERSONAL_LOAN':
        return (
          <>
            <div>
              <label htmlFor="emiAmount" className="block text-sm font-medium text-gray-700 mb-1">
                EMI Amount (₹) *
              </label>
              <input
                type="number"
                id="emiAmount"
                value={formData.emiAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, emiAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter EMI amount"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter interest rate"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
                Lender
              </label>
              <input
                type="text"
                id="lenderName"
                value={formData.lenderName}
                onChange={(e) => setFormData(prev => ({ ...prev, lenderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter lender name"
              />
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
                Tenure
              </label>
              <input
                type="text"
                id="tenure"
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 3 years, 36 months"
              />
            </div>
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
              <input
                type="text"
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter loan purpose"
              />
            </div>
          </>
        );
      
      case 'STUDENT_LOAN':
        return (
          <>
            <div>
              <label htmlFor="emiAmount" className="block text-sm font-medium text-gray-700 mb-1">
                EMI / Deferment Status
              </label>
              <input
                type="text"
                id="emiAmount"
                value={formData.emiAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, emiAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter EMI amount or deferment status"
              />
            </div>
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
                Lender
              </label>
              <input
                type="text"
                id="lenderName"
                value={formData.lenderName}
                onChange={(e) => setFormData(prev => ({ ...prev, lenderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter lender name"
              />
            </div>
            <div>
              <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700 mb-1">
                Borrower Name
              </label>
              <input
                type="text"
                id="borrowerName"
                value={formData.borrowerName}
                onChange={(e) => setFormData(prev => ({ ...prev, borrowerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter borrower name"
              />
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
                Tenure
              </label>
              <input
                type="text"
                id="tenure"
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 10 years, 120 months"
              />
            </div>
          </>
        );
      
      case 'CREDIT_CARD':
        return (
          <>
            <div>
              <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700 mb-1">
                Credit Limit (₹) *
              </label>
              <input
                type="number"
                id="creditLimit"
                value={formData.creditLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter credit limit"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="minimumDue" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Due (₹)
              </label>
              <input
                type="number"
                id="minimumDue"
                value={formData.minimumDue}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumDue: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter minimum due"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
                Issuer Bank
              </label>
              <input
                type="text"
                id="lenderName"
                value={formData.lenderName}
                onChange={(e) => setFormData(prev => ({ ...prev, lenderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter issuer bank"
              />
            </div>
            <div>
              <label htmlFor="cardIdentifier" className="block text-sm font-medium text-gray-700 mb-1">
                Card Identifier
              </label>
              <input
                type="text"
                id="cardIdentifier"
                value={formData.cardIdentifier}
                onChange={(e) => setFormData(prev => ({ ...prev, cardIdentifier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter card number (last 4 digits)"
              />
            </div>
          </>
        );
      
      case 'GENERIC_LOAN':
        return (
          <>
            <div>
              <label htmlFor="emiAmount" className="block text-sm font-medium text-gray-700 mb-1">
                EMI / Payment Frequency (₹) *
              </label>
              <input
                type="number"
                id="emiAmount"
                value={formData.emiAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, emiAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter EMI amount"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter interest rate"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
                Lender
              </label>
              <input
                type="text"
                id="lenderName"
                value={formData.lenderName}
                onChange={(e) => setFormData(prev => ({ ...prev, lenderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter lender name"
              />
            </div>
            <div>
              <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Type
              </label>
              <select
                id="loanType"
                value={formData.loanType}
                onChange={(e) => setFormData(prev => ({ ...prev, loanType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select loan type</option>
                <option value="LAP">Loan Against Property</option>
                <option value="GOLD_LOAN">Gold Loan</option>
                <option value="MARGIN_LOAN">Margin Loan</option>
                <option value="BUSINESS_LOAN">Business Loan</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
                Tenure
              </label>
              <input
                type="text"
                id="tenure"
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 5 years, 60 months"
              />
            </div>
            <div>
              <label htmlFor="collateral" className="block text-sm font-medium text-gray-700 mb-1">
                Collateral
              </label>
              <input
                type="text"
                id="collateral"
                value={formData.collateral}
                onChange={(e) => setFormData(prev => ({ ...prev, collateral: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter collateral details"
              />
            </div>
          </>
        );
      
      case 'PAYABLE':
        return (
          <>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount Payable (₹) *
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount payable"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="creditorName" className="block text-sm font-medium text-gray-700 mb-1">
                Creditor Name
              </label>
              <input
                type="text"
                id="creditorName"
                value={formData.creditorName}
                onChange={(e) => setFormData(prev => ({ ...prev, creditorName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter creditor name"
              />
            </div>
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
              <input
                type="text"
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter purpose"
              />
            </div>
            <div>
              <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
                Recurrence
              </label>
              <select
                id="recurrence"
                value={formData.recurrence}
                onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select recurrence</option>
                <option value="ONE_TIME">One-time</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
                <option value="PARTIAL">Partial</option>
                <option value="SETTLED">Settled</option>
              </select>
            </div>
          </>
        );
      
      case 'COMMITTED_EXPENSE':
        return (
          <>
            <div>
              <label htmlFor="amountPerPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                Amount per Period (₹) *
              </label>
              <input
                type="number"
                id="amountPerPeriod"
                value={formData.amountPerPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, amountPerPeriod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount per period"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency *
              </label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>
            <div>
              <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700 mb-1">
                Beneficiary
              </label>
              <input
                type="text"
                id="beneficiary"
                value={formData.beneficiary}
                onChange={(e) => setFormData(prev => ({ ...prev, beneficiary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter beneficiary"
              />
            </div>
            <div>
              <label htmlFor="nextPaymentDate" className="block text-sm font-medium text-gray-700 mb-1">
                Next Payment / Renewal Date
              </label>
              <input
                type="date"
                id="nextPaymentDate"
                value={formData.nextPaymentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, nextPaymentDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode
              </label>
              <select
                id="paymentMode"
                value={formData.paymentMode}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select payment mode</option>
                <option value="AUTO_DEBIT">Auto Debit</option>
                <option value="MANUAL">Manual</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </>
        );
      
      case 'OTHER':
        return (
          <>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="secured"
                checked={formData.secured}
                onChange={(e) => setFormData(prev => ({ ...prev, secured: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="secured" className="ml-2 block text-sm text-gray-700">
                Secured
              </label>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingLiability ? 'Edit Liability' : 'Add Liability'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Liability Type Selection */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Liability Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Liability['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              {LIABILITY_TYPES.map((liabilityType) => (
                <option key={liabilityType.value} value={liabilityType.value}>
                  {liabilityType.icon} {liabilityType.label}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Liability Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter liability name"
                required
              />
            </div>

            <div>
              <label htmlFor="outstandingBalance" className="block text-sm font-medium text-gray-700 mb-1">
                Outstanding Balance (₹) *
              </label>
              <input
                type="number"
                id="outstandingBalance"
                value={formData.outstandingBalance}
                onChange={(e) => setFormData(prev => ({ ...prev, outstandingBalance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Type-specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFieldsForLiabilityType(formData.type)}
          </div>

          {/* Common Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter interest rate"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              {editingLiability ? 'Update Liability' : 'Add Liability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiabilityModal;