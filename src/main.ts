import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LoggerService } from '@core/services/logger/logger.service';

bootstrapApplication(App, appConfig)
  .catch((err) => new LoggerService().error('bootstrap', 'No se pudo inicializar la aplicación:', err));
