"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, Percent, Calendar, Wallet } from "lucide-react";
import { formatAed } from "@/lib/utils";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export default function MortgageCalculator({
  propertyPrice,
}: MortgageCalculatorProps) {
  const [downPayment, setDownPayment] = useState(25); // percentage
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(25);

  const calculation = useMemo(() => {
    const principal = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / numberOfPayments,
        totalPayment: principal,
        totalInterest: 0,
        loanAmount: principal,
      };
    }

    const monthlyPayment =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount: principal,
    };
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-[#C1A06E]" />
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Property Price */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Property Price
            </label>
            <span className="text-lg font-bold text-primary-dark">
              {formatAed(propertyPrice)}
            </span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#C1A06E]" />
              Down Payment
            </label>
            <span className="text-sm font-semibold text-primary-dark">
              {downPayment}% (
              {formatAed((propertyPrice * downPayment) / 100)})
            </span>
          </div>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            min={20}
            max={80}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>20%</span>
            <span>80%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#C1A06E]" />
              Interest Rate
            </label>
            <span className="text-sm font-semibold text-primary-dark">
              {interestRate}%
            </span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={2}
            max={8}
            step={0.25}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2%</span>
            <span>8%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C1A06E]" />
              Loan Term
            </label>
            <span className="text-sm font-semibold text-primary-dark">
              {loanTerm} years
            </span>
          </div>
          <Slider
            value={[loanTerm]}
            onValueChange={(value) => setLoanTerm(value[0])}
            min={5}
            max={30}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-linear-to-br from-primary-dark to-primary-dark-muted rounded-xl p-6 text-white">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-300 mb-1">
              Estimated Monthly Payment
            </p>
            <p className="text-4xl font-bold text-[#C1A06E]">
              {formatAed(Math.round(calculation.monthlyPayment))}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-gray-300 mb-1">Loan Amount</p>
              <p className="font-semibold">
                {formatAed(Math.round(calculation.loanAmount))}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-gray-300 mb-1">Total Interest</p>
              <p className="font-semibold">
                {formatAed(Math.round(calculation.totalInterest))}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          * This is an estimate only. Actual rates may vary. Consult with UAE
          banks for accurate mortgage rates.
        </p>
      </CardContent>
    </Card>
  );
}
