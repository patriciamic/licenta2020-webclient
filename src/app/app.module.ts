import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PacientComponent } from './pacient/pacient.component';
import { FormsModule } from '@angular/forms';
import { PacientViewComponent } from './pacient-view/pacient-view.component';
import { ConversationComponent } from './conversation/conversation.component';
import { CreateConversationComponent } from './create-conversation/create-conversation.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PacientComponent,
    PacientViewComponent,
    ConversationComponent,
    CreateConversationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}


