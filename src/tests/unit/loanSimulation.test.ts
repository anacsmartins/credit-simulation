
import { validationResult } from 'express-validator';
import { LoanSimulationEntity } from '../../domain/entities/LoanSimulationEntity';
import { Interest } from '../../domain/interfaces/types';

describe('LoanSimulationEntity', () => {
  describe('Constructor', () => {
    it('should correctly create an instance of LoanSimulationEntity', () => {
      const data = {
        loanAmount: 20000,
        birthDate: new Date('1990-01-01'),
        termMonths: 24,
        interestType: 'fixed' as Interest,
        currency: 'BRL',
      };
      
      const entity = new LoanSimulationEntity(data);
      
      expect(entity.loanAmount).toBe(20000);
      expect(entity.birthDate).toEqual(new Date('1990-01-01'));
      expect(entity.termMonths).toBe(24);
      expect(entity.interestType).toBe('fixed');
      expect(entity.currency).toBe('BRL');
    });
  });

  describe('Method validate', () => {
    it('should throw an error if the currency is unsupported', () => {
      const entity = new LoanSimulationEntity({
        loanAmount: 20000,
        birthDate: new Date('1990-01-01'),
        termMonths: 24,
        currency: 'INR',
      });

      expect(() => entity.validate()).toThrowError('Unsupported currency: INR. Supported currencies are BRL, USD, EUR, GBP.');
    });

    it('should return true if the data is valid', () => {
      const entity = new LoanSimulationEntity({
        loanAmount: 20000,
        birthDate: new Date('1990-01-01'),
        termMonths: 24,
        currency: 'BRL',
      });

      expect(entity.validate()).toBe(true);
    });

    it('should throw an error if there are validation failures', () => {
      const entity = new LoanSimulationEntity({
        loanAmount: 50,
        birthDate: new Date('1990-01-01'),
        termMonths: 24,
        currency: 'BRL',
      });

      expect(() => entity.validate()).toThrow('Loan amount must be between 100 and 1000000.');
    });
  });

  describe('Custom validations', () => {
    it('should correctly validate the loanAmount', () => {
      const entity = new LoanSimulationEntity({
        loanAmount: 5000,
        birthDate: new Date('1990-01-01'),
        termMonths: 24,
        currency: 'BRL',
      });

      const errors = validationResult(entity);
      expect(errors.isEmpty()).toBe(true);
      console.log(errors)
    });

    it('should correctly validate the termMonths', () => {
      const entity = new LoanSimulationEntity({
        loanAmount: 20000,
        birthDate: new Date('1990-01-01'),
        termMonths: 72, // Invalid, should be between 12 and 60
        currency: 'BRL',
      });
      expect(() => entity.validate()).toThrow('Term must be between 12 and 60 months.');

    });
  });
});
