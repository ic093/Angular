// import { RowstationsModule } from './weather.module';
import { routes } from './app.routes';
export interface ThModule {
  text: string;
  value: number;
  colspan: number;
  backgroundColor: string;
}
export interface RowsModule {
  type: string;
  data: string[];
}

export interface RowstationsModule {
  city: string;
  count: string;
}
