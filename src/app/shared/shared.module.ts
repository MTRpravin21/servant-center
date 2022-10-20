import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetterCase } from '../veteran/components/assessment/letterCaseForAssessment.pipe';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import {PasswordModule} from 'primeng/password';
import { ToolbarModule } from 'primeng/toolbar';
import { NgxMaskModule } from 'ngx-mask';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { KeysPipe } from '../case-worker/components/resident-search/rs-initial-assessment/ia-form-page-three/ia-form-page-three.component';
import { ConsentDataComponent } from './components/consent-data/consent-data.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ItemHeaderComponent } from './components/item-header/item-header.component';
import { WelcomeHeaderComponent } from './components/welcome-header/welcome-header.component';
import { NoSpecialSymbolsDirective } from './directives/no-special-symbols.directive';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { livingPipe } from "../case-worker/components/resident-search/rs-initial-assessment/ia-form-page-one/ia-form-page-one.component";

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  listPlugin,
  timeGridPlugin,
  interactionPlugin,
]);
const MODULES = [
  InputTextModule,
  ButtonModule,
  CalendarModule,
  DividerModule,
  MenuModule,
  DropdownModule,
  FullCalendarModule,
  FormsModule,
  ReactiveFormsModule,
  InputTextareaModule,
  RadioButtonModule,
  CheckboxModule,
  TooltipModule,
  DialogModule,
  HttpClientModule,
  PasswordModule,
  ToolbarModule,
  NgxMaskModule,
  TableModule,
  ToastModule,
  ProgressSpinnerModule
];

const COMPONENTS = [
  ItemHeaderComponent,
  HeaderComponent,
  FooterComponent,
  WelcomeHeaderComponent,
  KeysPipe,
  livingPipe,
  LetterCase,
  ConsentDataComponent,
  NoSpecialSymbolsDirective,
  ProfileFormComponent
];

@NgModule({
  declarations: [...COMPONENTS, LoginPageComponent],
  imports: [CommonModule, ...MODULES],
  exports: [...MODULES, ...COMPONENTS],
})
export class SharedModule {}
