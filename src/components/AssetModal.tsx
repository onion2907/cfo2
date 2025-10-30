import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Asset, AssetType } from '../types/portfolio';
import { getGoldInrPerGram, getSilverInrPerGram } from '../services/metalPriceApi';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsset: (asset: Omit<Asset, 'id'>) => void;
  editingAsset: Asset | null;
}

const ASSET_TYPES: { value: AssetType; label: string; icon: string }[] = [
  { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit', icon: '🏦' },
  { value: 'RECURRING_DEPOSIT', label: 'Recurring Deposit', icon: '💳' },
  { value: 'BONDS', label: 'Bonds', icon: '📄' },
  { value: 'MUTUAL_FUNDS', label: 'Mutual Funds', icon: '📈' },
  { value: 'GOLD', label: 'Gold', icon: '🥇' },
  { value: 'SILVER', label: 'Silver', icon: '🥈' },
  { value: 'JEWELS', label: 'Jewels', icon: '💎' },
  { value: 'REAL_ESTATE', label: 'Real Estate', icon: '🏠' },
  { value: 'PROVIDENT_FUND', label: 'Provident Fund', icon: '🏛️' },
  { value: 'PENSION_FUND', label: 'Pension Fund', icon: '👴' },
  { value: 'RECEIVABLES', label: 'Receivables', icon: '💰' },
  { value: 'STOCKS', label: 'Stocks', icon: '📊' },
  { value: 'INSURANCE_LINKED', label: 'Insurance-Linked Assets', icon: '🛡️' },
  { value: 'CASH_BANK', label: 'Cash & Bank Balances', icon: '💵' }
];

const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  onSaveAsset,
  editingAsset
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'FIXED_DEPOSIT' as AssetType,
    description: '',
    isActive: true,
    
    // Value fields
    currentValue: '',
    principalAmount: '',
    monthlyDepositAmount: '',
    faceValue: '',
    unitsHeld: '',
    quantity: '',
    weight: '',
    ownershipPercentage: '',
    amountReceivable: '',
    currentBalance: '',
    
    // Optional fields
    startDate: '',
    maturityDate: '',
    interestRate: '',
    bankName: '',
    accountNumber: '',
    autoRenew: false,
    tenure: '',
    issuerName: '',
    bondType: '',
    couponRate: '',
    purchasePrice: '',
    purchaseDate: '',
    isin: '',
    fundName: '',
    fundHouse: '',
    fundType: '',
    folioNumber: '',
    assetForm: '',
    purity: '',
    purchaseRate: '',
    certificate: '',
    hallmark: '',
    insuranceDetails: '',
    propertyAddress: '',
    propertyType: '',
    linkedMortgage: '',
    rentalIncome: '',
    documents: '',
    employerName: '',
    schemeName: '',
    uan: '',
    pran: '',
    fundManager: '',
    tier: '',
    dueDate: '',
    debtorName: '',
    status: '',
    symbol: '',
    exchange: '',
    averagePurchasePrice: '',
    dematReference: '',
    sector: '',
    policyNumber: '',
    insurer: '',
    policyType: '',
    annualPremium: '',
    accountType: '',
    lastSyncDate: ''
  });

  // Live INR/gram rates for auto-calculation
  const [goldInrPerGram, setGoldInrPerGram] = useState<number | null>(null);
  const [silverInrPerGram, setSilverInrPerGram] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        name: editingAsset.name,
        type: editingAsset.type,
        description: editingAsset.description || '',
        isActive: editingAsset.isActive,
        currentValue: editingAsset.currentValue?.toString() || '',
        principalAmount: editingAsset.principalAmount?.toString() || '',
        monthlyDepositAmount: editingAsset.monthlyDepositAmount?.toString() || '',
        faceValue: editingAsset.faceValue?.toString() || '',
        unitsHeld: editingAsset.unitsHeld?.toString() || '',
        quantity: editingAsset.quantity?.toString() || '',
        weight: editingAsset.weight?.toString() || '',
        ownershipPercentage: editingAsset.ownershipPercentage?.toString() || '',
        amountReceivable: editingAsset.amountReceivable?.toString() || '',
        currentBalance: editingAsset.currentBalance?.toString() || '',
        startDate: editingAsset.startDate || '',
        maturityDate: editingAsset.maturityDate || '',
        interestRate: editingAsset.interestRate?.toString() || '',
        bankName: editingAsset.bankName || '',
        accountNumber: editingAsset.accountNumber || '',
        autoRenew: editingAsset.autoRenew || false,
        tenure: editingAsset.tenure || '',
        issuerName: editingAsset.issuerName || '',
        bondType: editingAsset.bondType || '',
        couponRate: editingAsset.couponRate?.toString() || '',
        purchasePrice: editingAsset.purchasePrice?.toString() || '',
        purchaseDate: editingAsset.purchaseDate || '',
        isin: editingAsset.isin || '',
        fundName: editingAsset.fundName || '',
        fundHouse: editingAsset.fundHouse || '',
        fundType: editingAsset.fundType || '',
        folioNumber: editingAsset.folioNumber || '',
        assetForm: editingAsset.assetForm || '',
        purity: editingAsset.purity || '',
        purchaseRate: editingAsset.purchaseRate?.toString() || '',
        certificate: editingAsset.certificate || '',
        hallmark: editingAsset.hallmark || '',
        insuranceDetails: editingAsset.insuranceDetails || '',
        propertyAddress: editingAsset.propertyAddress || '',
        propertyType: editingAsset.propertyType || '',
        linkedMortgage: editingAsset.linkedMortgage || '',
        rentalIncome: editingAsset.rentalIncome?.toString() || '',
        documents: editingAsset.documents || '',
        employerName: editingAsset.employerName || '',
        schemeName: editingAsset.schemeName || '',
        uan: editingAsset.uan || '',
        pran: editingAsset.pran || '',
        fundManager: editingAsset.fundManager || '',
        tier: editingAsset.tier || '',
        dueDate: editingAsset.dueDate || '',
        debtorName: editingAsset.debtorName || '',
        status: editingAsset.status || '',
        symbol: editingAsset.symbol || '',
        exchange: editingAsset.exchange || '',
        averagePurchasePrice: editingAsset.averagePurchasePrice?.toString() || '',
        dematReference: editingAsset.dematReference || '',
        sector: editingAsset.sector || '',
        policyNumber: editingAsset.policyNumber || '',
        insurer: editingAsset.insurer || '',
        policyType: editingAsset.policyType || '',
        annualPremium: editingAsset.annualPremium?.toString() || '',
        accountType: editingAsset.accountType || '',
        lastSyncDate: editingAsset.lastSyncDate || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'FIXED_DEPOSIT',
        description: '',
        isActive: true,
        currentValue: '',
        principalAmount: '',
        monthlyDepositAmount: '',
        faceValue: '',
        unitsHeld: '',
        quantity: '',
        weight: '',
        ownershipPercentage: '',
        amountReceivable: '',
        currentBalance: '',
        startDate: '',
        maturityDate: '',
        interestRate: '',
        bankName: '',
        accountNumber: '',
        autoRenew: false,
        tenure: '',
        issuerName: '',
        bondType: '',
        couponRate: '',
        purchasePrice: '',
        purchaseDate: '',
        isin: '',
        fundName: '',
        fundHouse: '',
        fundType: '',
        folioNumber: '',
        assetForm: '',
        purity: '',
        purchaseRate: '',
        certificate: '',
        hallmark: '',
        insuranceDetails: '',
        propertyAddress: '',
        propertyType: '',
        linkedMortgage: '',
        rentalIncome: '',
        documents: '',
        employerName: '',
        schemeName: '',
        uan: '',
        pran: '',
        fundManager: '',
        tier: '',
        dueDate: '',
        debtorName: '',
        status: '',
        symbol: '',
        exchange: '',
        averagePurchasePrice: '',
        dematReference: '',
        sector: '',
        policyNumber: '',
        insurer: '',
        policyType: '',
        annualPremium: '',
        accountType: '',
        lastSyncDate: ''
      });
    }
  }, [editingAsset, isOpen]);

  // Fetch metal rates when needed
  useEffect(() => {
    const loadRate = async () => {
      if (formData.type === 'GOLD' && goldInrPerGram == null) {
        try {
          setRateLoading(true);
          const rate = await getGoldInrPerGram();
          setGoldInrPerGram(rate);
        } catch (e) {
          // ignore, user can still enter manual value for non-metal types
        } finally {
          setRateLoading(false);
        }
      }
      if (formData.type === 'SILVER' && silverInrPerGram == null) {
        try {
          setRateLoading(true);
          const rate = await getSilverInrPerGram();
          setSilverInrPerGram(rate);
        } catch (e) {
          // ignore
        } finally {
          setRateLoading(false);
        }
      }
    };
    if (isOpen) loadRate();
  }, [formData.type, isOpen, goldInrPerGram, silverInrPerGram]);

  // Auto-calc current value for GOLD/SILVER when quantity or rate changes
  useEffect(() => {
    const qty = parseFloat(formData.quantity || '');
    if (!isNaN(qty) && qty > 0) {
      if (formData.type === 'GOLD' && goldInrPerGram) {
        const v = Number((qty * goldInrPerGram).toFixed(2));
        setFormData(prev => ({ ...prev, currentValue: String(v) }));
      }
      if (formData.type === 'SILVER' && silverInrPerGram) {
        const v = Number((qty * silverInrPerGram).toFixed(2));
        setFormData(prev => ({ ...prev, currentValue: String(v) }));
      }
    }
  }, [formData.type, formData.quantity, goldInrPerGram, silverInrPerGram]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: for GOLD/SILVER, require quantity; for others, require currentValue
    const isMetal = formData.type === 'GOLD' || formData.type === 'SILVER';
    if (!formData.name.trim()) {
      return;
    }
    if (isMetal) {
      if (!formData.quantity) {
        return;
      }
    } else if (!formData.currentValue) {
      return;
    }

    const currentValue = parseFloat(formData.currentValue || '0');
    if (!isMetal) {
      if (isNaN(currentValue) || currentValue < 0) {
        return;
      }
    }

    const assetData: Omit<Asset, 'id'> = {
      name: formData.name.trim(),
      type: formData.type,
      currency: 'INR',
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
      lastUpdated: new Date().toISOString(),
      currentValue: isMetal ? parseFloat(formData.currentValue || '0') : currentValue,
      
      // Value fields
      principalAmount: formData.principalAmount ? parseFloat(formData.principalAmount) : undefined,
      monthlyDepositAmount: formData.monthlyDepositAmount ? parseFloat(formData.monthlyDepositAmount) : undefined,
      faceValue: formData.faceValue ? parseFloat(formData.faceValue) : undefined,
      unitsHeld: formData.unitsHeld ? parseFloat(formData.unitsHeld) : undefined,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      ownershipPercentage: formData.ownershipPercentage ? parseFloat(formData.ownershipPercentage) : undefined,
      amountReceivable: formData.amountReceivable ? parseFloat(formData.amountReceivable) : undefined,
      currentBalance: formData.currentBalance ? parseFloat(formData.currentBalance) : undefined,
      
      // Optional fields
      startDate: formData.startDate || undefined,
      maturityDate: formData.maturityDate || undefined,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
      bankName: formData.bankName.trim() || undefined,
      accountNumber: formData.accountNumber.trim() || undefined,
      autoRenew: formData.autoRenew,
      tenure: formData.tenure.trim() || undefined,
      issuerName: formData.issuerName.trim() || undefined,
      bondType: formData.bondType.trim() || undefined,
      couponRate: formData.couponRate ? parseFloat(formData.couponRate) : undefined,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
      purchaseDate: formData.purchaseDate || undefined,
      isin: formData.isin.trim() || undefined,
      fundName: formData.fundName.trim() || undefined,
      fundHouse: formData.fundHouse.trim() || undefined,
      fundType: formData.fundType.trim() || undefined,
      folioNumber: formData.folioNumber.trim() || undefined,
      assetForm: formData.assetForm.trim() || undefined,
      purity: formData.purity.trim() || undefined,
      purchaseRate: formData.purchaseRate ? parseFloat(formData.purchaseRate) : undefined,
      certificate: formData.certificate.trim() || undefined,
      hallmark: formData.hallmark.trim() || undefined,
      insuranceDetails: formData.insuranceDetails.trim() || undefined,
      propertyAddress: formData.propertyAddress.trim() || undefined,
      propertyType: formData.propertyType.trim() || undefined,
      linkedMortgage: formData.linkedMortgage.trim() || undefined,
      rentalIncome: formData.rentalIncome ? parseFloat(formData.rentalIncome) : undefined,
      documents: formData.documents.trim() || undefined,
      employerName: formData.employerName.trim() || undefined,
      schemeName: formData.schemeName.trim() || undefined,
      uan: formData.uan.trim() || undefined,
      pran: formData.pran.trim() || undefined,
      fundManager: formData.fundManager.trim() || undefined,
      tier: formData.tier.trim() || undefined,
      dueDate: formData.dueDate || undefined,
      debtorName: formData.debtorName.trim() || undefined,
      status: formData.status.trim() || undefined,
      symbol: formData.symbol.trim() || undefined,
      exchange: formData.exchange.trim() || undefined,
      averagePurchasePrice: formData.averagePurchasePrice ? parseFloat(formData.averagePurchasePrice) : undefined,
      dematReference: formData.dematReference.trim() || undefined,
      sector: formData.sector.trim() || undefined,
      policyNumber: formData.policyNumber.trim() || undefined,
      insurer: formData.insurer.trim() || undefined,
      policyType: formData.policyType.trim() || undefined,
      annualPremium: formData.annualPremium ? parseFloat(formData.annualPremium) : undefined,
      accountType: formData.accountType.trim() || undefined,
      lastSyncDate: formData.lastSyncDate || undefined
    };

    onSaveAsset(assetData);
    onClose();
  };

  const getFieldsForAssetType = (type: AssetType) => {
    switch (type) {
      case 'FIXED_DEPOSIT':
        return (
          <>
            <div>
              <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Principal Amount (₹) *
              </label>
              <input
                type="number"
                id="principalAmount"
                value={formData.principalAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, principalAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter principal amount"
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
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                FD / Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter FD/Account number"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRenew"
                checked={formData.autoRenew}
                onChange={(e) => setFormData(prev => ({ ...prev, autoRenew: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRenew" className="ml-2 block text-sm text-gray-700">
                Auto-renew flag
              </label>
            </div>
          </>
        );
      
      case 'RECURRING_DEPOSIT':
        return (
          <>
            <div>
              <label htmlFor="monthlyDepositAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Deposit Amount (₹) *
              </label>
              <input
                type="number"
                id="monthlyDepositAmount"
                value={formData.monthlyDepositAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyDepositAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter monthly deposit amount"
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
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
                Tenure / End Date
              </label>
              <input
                type="text"
                id="tenure"
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 12 months, 2 years"
              />
            </div>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Account / RD Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter account/RD number"
              />
            </div>
          </>
        );
      
      case 'BONDS':
        return (
          <>
            <div>
              <label htmlFor="faceValue" className="block text-sm font-medium text-gray-700 mb-1">
                Face Value per Bond (₹) *
              </label>
              <input
                type="number"
                id="faceValue"
                value={formData.faceValue}
                onChange={(e) => setFormData(prev => ({ ...prev, faceValue: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter face value per bond"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="unitsHeld" className="block text-sm font-medium text-gray-700 mb-1">
                Units Held / Quantity *
              </label>
              <input
                type="number"
                id="unitsHeld"
                value={formData.unitsHeld}
                onChange={(e) => setFormData(prev => ({ ...prev, unitsHeld: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter number of bonds"
                step="1"
              />
            </div>
            <div>
              <label htmlFor="issuerName" className="block text-sm font-medium text-gray-700 mb-1">
                Issuer Name
              </label>
              <input
                type="text"
                id="issuerName"
                value={formData.issuerName}
                onChange={(e) => setFormData(prev => ({ ...prev, issuerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter issuer name"
              />
            </div>
            <div>
              <label htmlFor="bondType" className="block text-sm font-medium text-gray-700 mb-1">
                Bond Type
              </label>
              <select
                id="bondType"
                value={formData.bondType}
                onChange={(e) => setFormData(prev => ({ ...prev, bondType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select bond type</option>
                <option value="GOVT">Government</option>
                <option value="CORPORATE">Corporate</option>
                <option value="PSU">PSU</option>
                <option value="NCD">NCD</option>
              </select>
            </div>
            <div>
              <label htmlFor="couponRate" className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Rate (%)
              </label>
              <input
                type="number"
                id="couponRate"
                value={formData.couponRate}
                onChange={(e) => setFormData(prev => ({ ...prev, couponRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter coupon rate"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="isin" className="block text-sm font-medium text-gray-700 mb-1">
                ISIN
              </label>
              <input
                type="text"
                id="isin"
                value={formData.isin}
                onChange={(e) => setFormData(prev => ({ ...prev, isin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter ISIN"
              />
            </div>
          </>
        );
      
      case 'MUTUAL_FUNDS':
        return (
          <>
            <div>
              <label htmlFor="unitsHeld" className="block text-sm font-medium text-gray-700 mb-1">
                Units Held *
              </label>
              <input
                type="number"
                id="unitsHeld"
                value={formData.unitsHeld}
                onChange={(e) => setFormData(prev => ({ ...prev, unitsHeld: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter number of units"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="fundName" className="block text-sm font-medium text-gray-700 mb-1">
                Fund Name
              </label>
              <input
                type="text"
                id="fundName"
                value={formData.fundName}
                onChange={(e) => setFormData(prev => ({ ...prev, fundName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter fund name"
              />
            </div>
            <div>
              <label htmlFor="fundHouse" className="block text-sm font-medium text-gray-700 mb-1">
                Fund House / AMC
              </label>
              <input
                type="text"
                id="fundHouse"
                value={formData.fundHouse}
                onChange={(e) => setFormData(prev => ({ ...prev, fundHouse: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter fund house"
              />
            </div>
            <div>
              <label htmlFor="fundType" className="block text-sm font-medium text-gray-700 mb-1">
                Fund Type
              </label>
              <select
                id="fundType"
                value={formData.fundType}
                onChange={(e) => setFormData(prev => ({ ...prev, fundType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select fund type</option>
                <option value="EQUITY">Equity</option>
                <option value="DEBT">Debt</option>
                <option value="HYBRID">Hybrid</option>
                <option value="BALANCED">Balanced</option>
                <option value="INDEX">Index</option>
                <option value="ETF">ETF</option>
              </select>
            </div>
            <div>
              <label htmlFor="folioNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Folio No.
              </label>
              <input
                type="text"
                id="folioNumber"
                value={formData.folioNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, folioNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter folio number"
              />
            </div>
          </>
        );
      
      case 'GOLD':
        return (
          <>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (grams or units) *
              </label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter quantity"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="assetForm" className="block text-sm font-medium text-gray-700 mb-1">
                Asset Form
              </label>
              <select
                id="assetForm"
                value={formData.assetForm}
                onChange={(e) => setFormData(prev => ({ ...prev, assetForm: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select asset form</option>
                <option value="PHYSICAL">Physical</option>
                <option value="SGB">Sovereign Gold Bond</option>
                <option value="ETF">Gold ETF</option>
                <option value="FUND">Gold Fund</option>
              </select>
            </div>
            <div>
              <label htmlFor="purity" className="block text-sm font-medium text-gray-700 mb-1">
                Purity
              </label>
              <input
                type="text"
                id="purity"
                value={formData.purity}
                onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 24K, 999, 22K"
              />
            </div>
            <div>
              <label htmlFor="purchaseRate" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Rate (₹ per gram)
              </label>
              <input
                type="number"
                id="purchaseRate"
                value={formData.purchaseRate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter purchase rate"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="certificate" className="block text-sm font-medium text-gray-700 mb-1">
                Certificate
              </label>
              <input
                type="text"
                id="certificate"
                value={formData.certificate}
                onChange={(e) => setFormData(prev => ({ ...prev, certificate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter certificate details"
              />
            </div>
          </>
        );
      
      case 'SILVER':
        return (
          <>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (grams) *
              </label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter quantity in grams"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="purity" className="block text-sm font-medium text-gray-700 mb-1">
                Purity
              </label>
              <input
                type="text"
                id="purity"
                value={formData.purity}
                onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 999, 925"
              />
            </div>
            <div>
              <label htmlFor="purchaseRate" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Rate (₹ per gram)
              </label>
              <input
                type="number"
                id="purchaseRate"
                value={formData.purchaseRate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter purchase rate"
                step="0.01"
              />
            </div>
          </>
        );
      
      case 'JEWELS':
        return (
          <>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (grams) *
              </label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter weight in grams"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="purity" className="block text-sm font-medium text-gray-700 mb-1">
                Purity / Hallmark
              </label>
              <input
                type="text"
                id="purity"
                value={formData.purity}
                onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 18K, 22K, Hallmark"
              />
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                id="purchasePrice"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter purchase price"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="insuranceDetails" className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Details
              </label>
              <input
                type="text"
                id="insuranceDetails"
                value={formData.insuranceDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, insuranceDetails: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter insurance details"
              />
            </div>
          </>
        );
      
      case 'REAL_ESTATE':
        return (
          <>
            <div>
              <label htmlFor="ownershipPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Ownership % *
              </label>
              <input
                type="number"
                id="ownershipPercentage"
                value={formData.ownershipPercentage}
                onChange={(e) => setFormData(prev => ({ ...prev, ownershipPercentage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter ownership percentage"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Property Address
              </label>
              <textarea
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter property address"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select property type</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LAND">Land</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
              </select>
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                id="purchasePrice"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter purchase price"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="linkedMortgage" className="block text-sm font-medium text-gray-700 mb-1">
                Linked Mortgage Reference
              </label>
              <input
                type="text"
                id="linkedMortgage"
                value={formData.linkedMortgage}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedMortgage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter mortgage reference"
              />
            </div>
            <div>
              <label htmlFor="rentalIncome" className="block text-sm font-medium text-gray-700 mb-1">
                Rental Income (₹ per month)
              </label>
              <input
                type="number"
                id="rentalIncome"
                value={formData.rentalIncome}
                onChange={(e) => setFormData(prev => ({ ...prev, rentalIncome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter monthly rental income"
                step="0.01"
              />
            </div>
          </>
        );
      
      case 'PROVIDENT_FUND':
        return (
          <>
            <div>
              <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-700 mb-1">
                Current Balance / Corpus (₹) *
              </label>
              <input
                type="number"
                id="currentBalance"
                value={formData.currentBalance}
                onChange={(e) => setFormData(prev => ({ ...prev, currentBalance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter current balance"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="employerName" className="block text-sm font-medium text-gray-700 mb-1">
                Employer / Scheme Name
              </label>
              <input
                type="text"
                id="employerName"
                value={formData.employerName}
                onChange={(e) => setFormData(prev => ({ ...prev, employerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter employer/scheme name"
              />
            </div>
            <div>
              <label htmlFor="uan" className="block text-sm font-medium text-gray-700 mb-1">
                UAN
              </label>
              <input
                type="text"
                id="uan"
                value={formData.uan}
                onChange={(e) => setFormData(prev => ({ ...prev, uan: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter UAN"
              />
            </div>
          </>
        );
      
      case 'PENSION_FUND':
        return (
          <>
            <div>
              <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-700 mb-1">
                Current Balance / Latest NAV (₹) *
              </label>
              <input
                type="number"
                id="currentBalance"
                value={formData.currentBalance}
                onChange={(e) => setFormData(prev => ({ ...prev, currentBalance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter current balance"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="schemeName" className="block text-sm font-medium text-gray-700 mb-1">
                Scheme / Fund Manager
              </label>
              <input
                type="text"
                id="schemeName"
                value={formData.schemeName}
                onChange={(e) => setFormData(prev => ({ ...prev, schemeName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter scheme/fund manager"
              />
            </div>
            <div>
              <label htmlFor="pran" className="block text-sm font-medium text-gray-700 mb-1">
                PRAN
              </label>
              <input
                type="text"
                id="pran"
                value={formData.pran}
                onChange={(e) => setFormData(prev => ({ ...prev, pran: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter PRAN"
              />
            </div>
            <div>
              <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-1">
                Tier
              </label>
              <select
                id="tier"
                value={formData.tier}
                onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select tier</option>
                <option value="TIER_I">Tier I</option>
                <option value="TIER_II">Tier II</option>
              </select>
            </div>
          </>
        );
      
      case 'RECEIVABLES':
        return (
          <>
            <div>
              <label htmlFor="amountReceivable" className="block text-sm font-medium text-gray-700 mb-1">
                Amount Receivable (₹) *
              </label>
              <input
                type="number"
                id="amountReceivable"
                value={formData.amountReceivable}
                onChange={(e) => setFormData(prev => ({ ...prev, amountReceivable: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount receivable"
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
              <label htmlFor="debtorName" className="block text-sm font-medium text-gray-700 mb-1">
                Debtor Name
              </label>
              <input
                type="text"
                id="debtorName"
                value={formData.debtorName}
                onChange={(e) => setFormData(prev => ({ ...prev, debtorName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter debtor name"
              />
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
      
      case 'STOCKS':
        return (
          <>
            <div>
              <label htmlFor="unitsHeld" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity / Shares Held *
              </label>
              <input
                type="number"
                id="unitsHeld"
                value={formData.unitsHeld}
                onChange={(e) => setFormData(prev => ({ ...prev, unitsHeld: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter number of shares"
                step="1"
              />
            </div>
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter stock symbol"
              />
            </div>
            <div>
              <label htmlFor="exchange" className="block text-sm font-medium text-gray-700 mb-1">
                Exchange
              </label>
              <select
                id="exchange"
                value={formData.exchange}
                onChange={(e) => setFormData(prev => ({ ...prev, exchange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select exchange</option>
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </div>
            <div>
              <label htmlFor="averagePurchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Average Purchase Price (₹)
              </label>
              <input
                type="number"
                id="averagePurchasePrice"
                value={formData.averagePurchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, averagePurchasePrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter average purchase price"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="dematReference" className="block text-sm font-medium text-gray-700 mb-1">
                Demat Reference
              </label>
              <input
                type="text"
                id="dematReference"
                value={formData.dematReference}
                onChange={(e) => setFormData(prev => ({ ...prev, dematReference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter demat reference"
              />
            </div>
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                Sector
              </label>
              <input
                type="text"
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter sector"
              />
            </div>
          </>
        );
      
      case 'INSURANCE_LINKED':
        return (
          <>
            <div>
              <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-700 mb-1">
                Current Surrender Value / Fund Value (₹) *
              </label>
              <input
                type="number"
                id="currentBalance"
                value={formData.currentBalance}
                onChange={(e) => setFormData(prev => ({ ...prev, currentBalance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter current surrender value"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Policy Number
              </label>
              <input
                type="text"
                id="policyNumber"
                value={formData.policyNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, policyNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter policy number"
              />
            </div>
            <div>
              <label htmlFor="insurer" className="block text-sm font-medium text-gray-700 mb-1">
                Insurer
              </label>
              <input
                type="text"
                id="insurer"
                value={formData.insurer}
                onChange={(e) => setFormData(prev => ({ ...prev, insurer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter insurer name"
              />
            </div>
            <div>
              <label htmlFor="policyType" className="block text-sm font-medium text-gray-700 mb-1">
                Policy Type
              </label>
              <select
                id="policyType"
                value={formData.policyType}
                onChange={(e) => setFormData(prev => ({ ...prev, policyType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select policy type</option>
                <option value="ULIP">ULIP</option>
                <option value="ENDOWMENT">Endowment</option>
                <option value="MONEY_BACK">Money-back</option>
                <option value="WHOLE_LIFE">Whole Life</option>
                <option value="TERM">Term</option>
              </select>
            </div>
            <div>
              <label htmlFor="annualPremium" className="block text-sm font-medium text-gray-700 mb-1">
                Annual Premium (₹)
              </label>
              <input
                type="number"
                id="annualPremium"
                value={formData.annualPremium}
                onChange={(e) => setFormData(prev => ({ ...prev, annualPremium: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter annual premium"
                step="0.01"
              />
            </div>
          </>
        );
      
      case 'CASH_BANK':
        return (
          <>
            <div>
              <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-700 mb-1">
                Current Balance (₹) *
              </label>
              <input
                type="number"
                id="currentBalance"
                value={formData.currentBalance}
                onChange={(e) => setFormData(prev => ({ ...prev, currentBalance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter current balance"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select account type</option>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
                <option value="CASH">Cash</option>
                <option value="WALLET">Digital Wallet</option>
              </select>
            </div>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter account number"
              />
            </div>
            <div>
              <label htmlFor="lastSyncDate" className="block text-sm font-medium text-gray-700 mb-1">
                Last Sync Date
              </label>
              <input
                type="date"
                id="lastSyncDate"
                value={formData.lastSyncDate}
                onChange={(e) => setFormData(prev => ({ ...prev, lastSyncDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
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
            {editingAsset ? 'Edit Asset' : 'Add Asset'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Asset Type Selection */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Asset Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssetType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              {ASSET_TYPES.map((assetType) => (
                <option key={assetType.value} value={assetType.value}>
                  {assetType.icon} {assetType.label}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter asset name"
                required
              />
            </div>

            {formData.type === 'GOLD' || formData.type === 'SILVER' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Value (₹)
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                  {rateLoading ? 'Fetching live rate…' : (formData.currentValue ? Number(formData.currentValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '—')}
                </div>
                <p className="mt-1 text-xs text-gray-500">Auto-calculated from live INR/gram × quantity.</p>
              </div>
            ) : (
              <div>
                <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Value (₹) *
                </label>
                <input
                  type="number"
                  id="currentValue"
                  value={formData.currentValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            )}
          </div>

          {/* Type-specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFieldsForAssetType(formData.type)}
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
              <label htmlFor="maturityDate" className="block text-sm font-medium text-gray-700 mb-1">
                Maturity Date
              </label>
              <input
                type="date"
                id="maturityDate"
                value={formData.maturityDate}
                onChange={(e) => setFormData(prev => ({ ...prev, maturityDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              {editingAsset ? 'Update Asset' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;