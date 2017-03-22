import { Component, OnInit } from '@angular/core';
import { Service } from '../service/service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CalendarModule} from 'primeng/primeng';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {  
    value: Date; 

    private loggedUser : string;
    private loggedEmail : string;
    private id : string;
    private state = 'user';
    private check : boolean=false;
    private index = 0;
    private google = false;
    private history : any;
    private AdminEventList = [];
    private categoryList : any[];
    private BookedEventList : any[];
    private selectedEvent : any[];
    private selectedEventID : string;
    private selectedEventDate : string;
    private showEventsDetails : string;
    private Eventtext : string;
    private catFilter;
    private error;
    private B_seats;
    private F_seats;
     private google2;
    
    constructor(private activatedRoute: ActivatedRoute, private _service : Service, private router: Router) {}

    ngOnInit() {


        if(localStorage.getItem('user') == 'active'){}
        else{
            this.router.navigate(['/']);
        }
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        let id = params['id'];
        this.id = id;
        let google = params['google'];
        if(google){
            this.google = google;  
        }else{
            this.google2 = localStorage.getItem('google');
        }
        

    });
     this._service.checkLoginUser(this.id)
        .subscribe(res => {
            
            this.check = res;
            if(this.check){
                this.activatedRoute.queryParams.subscribe((params: Params) => {
                let userId = params['name'];
                let email = params['email'];
                let id = params['id'];
                localStorage.setItem('ID',id);
                this.loggedUser = userId;
                this.loggedEmail = email;
                this.id = id;
                this.getCategory();
                this.getEventsForUser();
                });
            }else{
                this.router.navigate(['/']);
            }
        }); 
    }

    stateChange(state){
        if(state){
            this.state = state;
        }

    }

     getBydate(value){
        var c_date = value.toLocaleDateString();
        c_date = new Date(c_date)
        c_date = c_date.getTime();
        this._service.filterEvents(c_date).subscribe(res =>{
            for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
            this.AdminEventList = res
        });
    }

    signout(id) {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
     this._service.signoutGoogle();
            var newid = {
            id : id
            }
            this._service.signout(newid)
                .subscribe(res => {
                    this.router.navigate(['/']);
                }); 
        }
    
    getCategory(){
    this._service.getCategory()
            .subscribe(res =>{
               this.categoryList=res;
            });
    }

    getEventsForUser(){
    this._service.getEventsForUser()
        .subscribe(res =>{
            for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
                 this.AdminEventList=res;
           
            this.stateChange('user');
            var d = new Date();
            this.value = d;
            this.catFilter = "0";
        });
    }

    showEventDetails(id,type){
        this.stateChange('detail-show');
        if(type == 'event'){
                    for(var i=0;i<this.AdminEventList.length;i++){
                if(this.AdminEventList[i]._id == id){
                    this.showEventsDetails = this.AdminEventList[i];
                    this.Eventtext = "Events";
                }
            }
        }
        else if(type == 'history'){
            for(var i=0;i<this.history.length;i++){
                if(this.history[i]._id == id){
                    this.showEventsDetails = this.history[i];
                    this.Eventtext = "history of events";
                }
            }
        }
        else{
            for(var i=0;i<this.BookedEventList.length;i++){
                if(this.BookedEventList[i]._id == id){
                    this.showEventsDetails = this.BookedEventList[i];
                    this.Eventtext = "Booked events";
                }
        }

     }
    }

    bookEventDetails(event,id,date){
        this.selectedEvent = event;
        this.F_seats = event.F_seats;
        this.selectedEventID = id;
        this.selectedEventDate = date;
        this.stateChange('book');
    }

    bookEvent(){
        var B_seats = this.B_seats;
    if(B_seats <=10 && B_seats <= this.F_seats){
        var date1 = new Date(this.selectedEventDate);
        var Date1 = date1.getTime();
        var data = {
            event : this.selectedEvent,
            date : Date1,
            user_id : this.id,
            B_seats : B_seats
        }
                for(var i=0;i<this.AdminEventList.length;i++){
            if(this.AdminEventList[i]._id == this.selectedEventID){
                this.AdminEventList[i].F_seats = this.AdminEventList[i].F_seats - B_seats;
                this.AdminEventList[i].B_seats = B_seats;
            }
        }

            this._service.bookEvent(data)
                .subscribe(res => {
                    this.stateChange('user');
                });
        }

        
    }

    showBookedEvent(state){
        var d = new Date();
        this.value = d;
        this.stateChange(state);
        this._service.showBookedEvent(this.id)
                .subscribe(res =>{
                    for(var i=0;i<res.length;i++){
                        var d = new Date(res[i].Date);
                        res[i].Date = d.toLocaleDateString();
                }
                    this.BookedEventList = res;
                    this.catFilter = "0";
                });
            
    }

    cancelEvent(id,Event_id,B_seats){
        var data = {
            _id : id,
            Event_id : Event_id,
            B_seats : B_seats
        }
        this._service.cancelEvent(data)
            .subscribe(res =>{this.stateChange('user')});
            
    }

    getBydateBookedEvent(value){
        var c_date = value.toLocaleDateString();
        c_date = new Date(c_date)
        c_date = c_date.getTime();
        var data = {
            Date : c_date,
            user_id : this.id
        }
        this._service.filterBookedEvents(data).subscribe(res =>{
            for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
            this.BookedEventList = res;
        });
    }

    historyOfBooking(){
        this.stateChange('history');
        this._service.historyOfBooking(this.id,'user')
            .subscribe(res =>{
                for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
                this.history = res;
                this.catFilter = "0";
                var d = new Date();
                this.value = d;
            });
    }

 historyOfBookingbydate(value){
    
        var c_date = value.toLocaleDateString();
        c_date = new Date(c_date)
        c_date = c_date.getTime();
        this._service.historyOfBookingbydate(c_date,this.id).subscribe(res =>{
       for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
            this.history = res
            
        });
    }
    
   filterByCategoryUser(type){
       var catFilter = this.catFilter;
       if(type == 'user'){
               this._service.getEventsForUser()
                .subscribe(res =>{
                    for(var i=0;i<res.length;i++){
                            var d = new Date(res[i].Date);
                            res[i].Date = d.toLocaleDateString();
                    }
                    this.AdminEventList = res;
                    var d = new Date();
                    this.value = d;
                    for(var i=0;i<this.AdminEventList.length;i++){
                        if(this.AdminEventList[i].Category == catFilter){
                            var x = this.AdminEventList[i]; 
                            this.AdminEventList.length = 0;
                            this.AdminEventList.push(x);
                        }else if(catFilter == '0'){
                            this.getEventsForUser();
                            
                        }else{
                            this.AdminEventList.length = 0;
                        }
                    }
                });
           
           
       }else{
        this._service.filterByCategoryUser(type,catFilter)
            .subscribe(res =>{
                for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
                if(type == "booked"){
                        this.BookedEventList = res;
                }else{
                        this.history = res;
                }
            });
       }
   }

   checkError(err){
        if(err == 'maxSeat'){
            if(this.B_seats >10){
                this.error = 'maxSeat';
                this.B_seats = '';
            }
        }
        if(err == 'maxSeat'){
            if(this.B_seats > this.F_seats){
                this.error = 'noSeat';
                this.B_seats = '';
            }
        }
        
    }

    removeError(err){
        if(err == 'maxSeat'){
            if(this.B_seats <10)
            this.error = 'none';
        }
        if(err == 'maxSeat'){
            if(this.B_seats < this.F_seats){
                this.error = 'none';
            }
        }
    }

}



    
