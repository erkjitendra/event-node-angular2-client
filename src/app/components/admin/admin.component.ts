import { Component, OnInit } from '@angular/core';
import { Service } from '../service/service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CalendarModule} from 'primeng/primeng';

declare var $:any;


@Component({
  selector: 'test',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit { 

    value: Date; 

    private loggedUser : string;
    private loggedEmail : string;
    private id : string;
    private check : string;
    private AdminEventList : any[];
    private categoryList : any[];
    private selectedDay : any;
    private state : "Admin";
    private months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    private years = [];
    private rday : Number = 1 ;
    private rmonth = 1;
    private ryear = 1990 ;

    private Event;
    private Location;
    private by;
    private Date;
    private Ticket;
    private info;
    private T_seats;
    private B_seats;
    private F_seats;
    private Category;
    private Event_id;
    private errState;
    private history;
    private catFilter;
    private BookedEventList;
    private singleUserDetails;
    private singleHistoryDetails;
    


    constructor(private activatedRoute: ActivatedRoute, private _service : Service, private router: Router) {}

    ngOnInit() {

        this._service.checkLoginUser(localStorage.getItem('ID'))
            .subscribe(res =>{
                console.log(res);
                if(res.Active == false){
                    localStorage.removeItem('admin');
                }
            });
console.log(localStorage.getItem('admin') == 'active',"0000000");
         if(localStorage.getItem('admin') == 'active'){}
        else{
            this.router.navigate(['/']);
        }
    

    this.activatedRoute.queryParams.subscribe((params: Params) => {
        let id = params['id'];
        this.id = id;
      
    })
    this.errState = 'good';
       
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
                this.getEvents();
                this.getCategory();
                this.stateChange('Admin');
                 })
            }else{
                this.router.navigate(['/']);
            }
        });

    for(var i = 1980 ; i<2007; i++){
                this.years.push(i);
            }
    }

    stateChange(state){
        if(state){
            this.state = state;
        }
    }

    showdate(value){
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

    filterByCategory(category){
        var category:any = {
            Category : category
        }
        this._service.filterByCategory(category).subscribe(res => this.AdminEventList = res);
    }




    getEvents(){
        this._service.getEvents()
            .subscribe(res =>{
                for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
                }
                this.AdminEventList = res;
                var d = new Date();
                this.value = d;
            });
    }

    getCategory(){
        this._service.getCategory()
            .subscribe(res =>{
               this.categoryList=res;
            });
    }


    signout(id) {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        var newid = {
            id : id
        }
        this._service.signout(newid)
            .subscribe(res => {
                 this.router.navigate(['/']);
            });
    }

    createNewAdmin(fname,lname,email,M,F,pass,repass,phone) {
     if(fname.value.length > 0 && lname.value.length > 0,email.value.match(/[\w-]+@([\w-]+\.)+[\w-]+/),phone.value.length > 9){
        if(pass.value == repass.value && pass.value.length > 7){
            var month1 = this.months[this.rmonth-1];
            var date = new Date(this.rday+"/"+this.rmonth+"/"+this.ryear);
            var dob = date.toLocaleDateString();


            if(M.value.length){
              var gender = 'M';
            }else if(F.value.length){
              var gender = 'F';
            }else{
              var gender = 'M';
            }
          
                var newUserData = {
                    fname : fname.value,
                    lname : lname.value,
                    email : email.value,
                    pass  : pass.value,
                    repass : repass.value,
                    gender : gender,
                    dob : dob,
                    Admin: true
            };

            this._service.addUser(newUserData)
                .subscribe(res => {});
                    }else{
                    this.stateChange('passerr');
                    
                    }

            fname.value = '';
            lname.value = '';
            email.value = '';
            pass.value = '';
            repass.value = '';
            M.value = '';
            F.value = '';
            this.rday = 1;
            this.ryear = 1990;
            this.rmonth = 1;
     } else{
         this.errState = 'fillAllAdminDetails';
     }  
        
      
        
    }

    addNewEvent(eventNm,loc,by,date,ticket,seats,info,catName){
        var date1 = new Date(date.value);
        var Date1 = date1.getTime();
        if(catName.value == '0' || !eventNm.value.length || !loc.value.length || !by.value.length || !date.value.length || !ticket.value.length || !seats.value.length || !info.value.length){
            this.errState = 'fillAllData';
        }else{
            var newEvent = {
            Event : eventNm.value,
            Location : loc.value,
            Sponsor : by.value,
            Date : Date1,
            Ticket: ticket.value,
            seats: seats.value,
            info: info.value,
            Category : catName.value
            }
            
            this._service.addNewEvent(newEvent)
                .subscribe(res =>{
                        var d = new Date(res.Date);
                        res.Date = d.toLocaleDateString();
                    this.AdminEventList.push(res);
                });
                this.stateChange('Admin');
        }

    }
            




    addNewCategory(newCatName){
        if(this.errState != 'category'){
        this._service.addNewCategory(newCatName.value)
            .subscribe(res => {
                this.categoryList.push(res);
                this.stateChange('Category');
            });
        }

    }

    deleteEvent(id){
        id = {
            id : id
        }
        this._service.deleteEvent(id).subscribe(res => {

            for(var i=0;i<this.AdminEventList.length;i++){
                
                if(this.AdminEventList[i]._id == id.id){
                    this.AdminEventList.splice(i,1);
                }
                
            }
            
        });
    }

    deleteCategory(id){
        id = {
            id : id
        }
        this._service.deleteCategory(id).subscribe(res => {

            for(var i=0;i<this.categoryList.length;i++){
                
                if(this.categoryList[i]._id == id.id){
                    this.categoryList.splice(i,1);
                }
                
            }
            
        });
    }

    editiEvent(event){
        this.stateChange('editEvent');

            this.Event = event.Event,
            this.Location = event.Location,
            this.by = event.Sponsor,
            this.Date = event.Date,
            this.Ticket = event.Ticket,
            this.T_seats = event.T_seats,
            this.info = event.info,
            this.Category = event.Category,
            this.B_seats = event.B_seats,
            this.F_seats = event.F_seats,
            this.Event_id = event._id
    }

    updateEvent(){
         var date1 = new Date(this.Date);
        var Date1 = date1.getTime();
       var newEvent = {
            id : this.Event_id,
            Event : this.Event,
            Location : this.Location,
            Sponsor : this.by,
            Date : Date1,
            Ticket : this.Ticket,
            info : this.info,
            T_seats : this.T_seats,
            B_seats : this.B_seats,
            F_seats : this.T_seats - this.B_seats,
            Category : this.Category
        }
        
        if(newEvent.T_seats <newEvent.B_seats|| !newEvent.Category.length || !newEvent.Event.length || !newEvent.Location.length || !newEvent.Sponsor.length || Date1< (new Date()).getTime() || newEvent.Ticket <= 0 || !newEvent.info.length){
            if(newEvent.T_seats <newEvent.B_seats){
                this.errState = 'editAllDataSeatError'
            }else{
                this.errState = 'editAllData';
            }
            
        }else{
            this._service.updateEvent(newEvent)
            .subscribe(res =>{
                for(var i=0;i<this.AdminEventList.length;i++){
                    if(this.AdminEventList[i]._id == this.Event_id){
                        this.AdminEventList.splice(i,1);
                        this.AdminEventList.push(newEvent);
                        this.stateChange('Admin');
                    }
                }
            });
        }
        
    }

    showDetailsEvent(event){
        this.stateChange('eventDetails');
            this.Event = event.Event,
            this.Location = event.Location,
            this.by = event.Sponsor,
            this.Date = event.Date,
            this.Ticket = event.Ticket,
            this.T_seats = event.T_seats,
            this.info = event.info,
            this.Category = event.Category,
            this.B_seats = event.B_seats,
            this.F_seats = event.F_seats,
            this.Event_id = event._id
    }
        historyOfBooking(){
        this.stateChange('history');
        this._service.historyOfBooking(this.id,'admin')
            .subscribe(res =>{
                for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
            console.log(this.history);
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
        this._service.historyOfBookingbydate(c_date,'admin').subscribe(res =>{
       for(var i=0;i<res.length;i++){
                    var d = new Date(res[i].Date);
                    res[i].Date = d.toLocaleDateString();
            }
            this.history = res
            
        });
    }


    filterByCategoryUser(type){
       var catFilter = this.catFilter;
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

    showcompleteDetailsAdmin(bid,uid){
        this._service.showcompleteDetailsAdmin(bid,uid)
            .subscribe(res =>{ 
                this.stateChange('singleHistory');
                console.log("sdfsd",res);
                var d = new Date(res.data1[0].Date);
                res.data1[0].Date = d.toLocaleDateString();
                this.singleUserDetails = res.data2[0];
                this.singleHistoryDetails = res.data1[0];

            });
    }

    checkError(typeCheck,data){
        if(typeCheck == 'ticket'){
            if(data > 0){
                this.errState = 'good';
            }else{
                this.errState = 'ticket';
            }
        }
        if(typeCheck == 'seat'){
            if(data.value > 0){
                this.errState = 'good';
            }else{
                this.errState = 'seat';
            }
        }
        if(typeCheck == 'date'){
            var d1 = (new Date(data)).getTime();
            var d2 = (new Date()).getTime();
            if(d1 >= d2){
                this.errState = 'good';
            }else{
                this.errState = 'date';
            }
        }
        if(typeCheck == 'category'){
            if(data.value.length != 0){
                this.errState = 'good';
            }else{
                this.errState = 'category';
            }
        }
        if(typeCheck == 'email'){
            if(data.value.match(/[\w-]+@([\w-]+\.)+[\w-]+/)){
                this.errState = 'good';
            }else{
                this.errState = 'email'
            }
        }
        if(typeCheck == 'phone'){
            if(data.value.match(/[7-9]{1}([0-9]{9})/) && data.value.length == 10){
                this.errState = 'good'
            }else{
                this.errState = 'phone'
            }
        }if(typeCheck == 'fname'){
            if(data.value.length > 0){
                this.errState = 'good';
            }else{
                this.errState = 'fname';
            }
        }if(typeCheck == 'lname'){
            if(data.value.length > 0){
                this.errState = 'good';
            }else{
                this.errState = 'lname';
            }
        }if(typeCheck == 'pass'){
            if(data.value.length >= 8){
                this.errState = 'good';
            }else{
                this.errState = 'pass';
            }
        }if(typeCheck == 'repass'){
            if(data.value.length >= 8){
                this.errState = 'good';
            }else{
                this.errState = 'repass';
            }
        }if(typeCheck == 'T_seats'){
            if(data.value >= this.B_seats){
                this.errState = 'good';
            }else{
                this.errState = 'T_seats';
            }
        }
    }

    removeCheck(typeCheck){
        if(typeCheck == 'ticket'){
            if(this.errState == 'ticket')
            this.errState = 'good';
        }
        if(typeCheck == 'seat'){
            if(this.errState == 'seat')
            this.errState = 'good';
        }
        if(typeCheck == 'date'){
            if(this.errState == 'date'){
                this.errState = 'good';
            }
        }
        if(typeCheck == 'category'){
            if(this.errState == 'category'){
                this.errState = 'good';
            }
        }
          if(typeCheck == 'email'){
            if(this.errState == 'email'){  
                this.errState = 'none';
            }
        }
        if(typeCheck=='phone'){
            if(this.errState == 'phone'){
                this.errState = 'none';
            }
        }if(typeCheck=='fname'){
            if(this.errState == 'fname'){
                this.errState = 'none';
            }
        }if(typeCheck=='lname'){
            if(this.errState == 'lname'){
                this.errState = 'none';
            }
        }if(typeCheck=='pass'){
            if(this.errState == 'pass'){
                this.errState = 'none';
            }
        }if(typeCheck=='repass'){
            if(this.errState == 'repass'){
                this.errState = 'none';
            }
        }if(typeCheck=='T_seats'){
            if(this.errState == 'T_seats'){
                this.errState = 'none';
            }
        }

    }

}



