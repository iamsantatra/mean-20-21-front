import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AssignmentsComponent } from './assignments/assignments.component';
import { RenduDirective } from './shared/rendu.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { Routes, RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';
import { authGuard, authGuardAdmin } from './shared/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NavbarComponent } from './navbar/navbar.component';  
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { AddNoteComponent } from './assignments/add-note/add-note.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { LoadingComponent } from './loading/loading/loading.component';
import { DeleteNoteComponent } from './assignments/delete-note/delete-note.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'home',
    component: AssignmentsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add',
    component: AddAssignmentComponent
  },
  {
    path: 'assignments/:id',
    component: AssignmentDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'assignments',
    component: EditAssignmentComponent,
    canActivate: [authGuardAdmin]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
]
@NgModule({
  declarations: [
    AppComponent,
    AssignmentsComponent,
    RenduDirective,
    AssignmentDetailComponent,
    AddAssignmentComponent,
    EditAssignmentComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    LoadingComponent,
    AddNoteComponent,
    DeleteNoteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatNativeDateModule, ScrollingModule,
    MatButtonModule, MatIconModule, MatDividerModule,
    MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatListModule, MatCardModule, MatCheckboxModule, MatSlideToggleModule,
    MatTableModule, MatPaginatorModule,
    DragDropModule,
    MatDialogModule,
    MatStepperModule, 
    MatSidenavModule, MatSnackBarModule,
    DatePipe, MatProgressSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {
      provide: STEPPER_GLOBAL_OPTIONS, 
      useValue: { 
          showError: true,
          displayDefaultIndicatorType: false 
    },
    
  },
  DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
