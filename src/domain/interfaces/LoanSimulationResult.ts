export interface LoanSimulationResult {
    totalAmount: number; // Valor total a ser pago
    monthlyInstallment: number; // Valor das parcelas mensais
    totalInterest: number; // Total de juros pagos
}
