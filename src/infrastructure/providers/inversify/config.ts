import { Container } from 'inversify';
import { SendgridProvider } from '../email/SendgridProvider';
import { LoanSimulationService } from '../../../domain/services/LoanSimulationService';
import { LoanSimulationController } from '../../../application/loan/controllers/LoanSimulationController';
import { TYPES } from './types';

// Inicializar o container
const container = new Container();

// Registrar os serviços no container
container.bind<SendgridProvider>(TYPES.SendgridProvider).to(SendgridProvider).inRequestScope();
container.bind<LoanSimulationService>(TYPES.LoanSimulationService).to(LoanSimulationService).inRequestScope();
container.bind<LoanSimulationController>(TYPES.LoanSimulationController).to(LoanSimulationController).inRequestScope();

// Exportar o container como readonly singleton
export const inversifyContainer = Object.freeze(container);
