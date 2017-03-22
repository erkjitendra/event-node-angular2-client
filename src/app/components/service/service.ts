import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class Service {
    constructor(private _http : Http){}

    addUser(newUserData) {
        var regUrl = 'http://localhost:3000/api/v5/addUser';
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        
        return this._http.post(regUrl,JSON.stringify(newUserData),{headers : headers})
            .map(res => res.json());
    }

    getUser(email1,pass1) {
        var signinUrl = 'http://localhost:3000/api/v5/login';
           return this._http.get(signinUrl+'?email='+email1+'&pass='+pass1)
            .map(res => res.json());
    }

    checkLoginUser(id) {
        var checkUserUrl = 'http://localhost:3000/api/v5/checkLogin';
        var headers = new Headers();
        var check = {
            id : id
        }
        headers.append('Content-Type','application/json');
        return this._http.post(checkUserUrl,JSON.stringify(check),{headers : headers})
            .map(res =>res.json());
    }

    getEvents(){
         var getEventUrl = 'http://localhost:3000/api/v5/getEvent';
           return this._http.get(getEventUrl)
            .map(res => res.json());
    }

    getEventsForUser(){
        var d = new Date();
        var d2 = d.getTime();
        var getEventUrl = 'http://localhost:3000/api/v5/getEvent/user';
           return this._http.get(getEventUrl+'?date='+d2)
            .map(res => res.json());
    }

    addNewCategory(newCatName){
         var headers = new Headers();
         headers.append('Content-Type','application/json');
         var newCat = {
             category_name : newCatName
         }
         console.log(newCat);
        return this._http.post("http://localhost:3000/api/v5/addCat",JSON.stringify(newCat),{headers : headers})
            .map(res =>res.json());
    }

    addNewEvent(event){
         var headers = new Headers();
         headers.append('Content-Type','application/json');
         console.log(event);
         return this._http.post("http://localhost:3000/api/v5/addEvents",JSON.stringify(event),{headers : headers})
            .map(res => res.json());
    }

    signout(id) {
        var signOutUrl = 'http://localhost:3000/api/v5/logout';
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.post(signOutUrl,JSON.stringify(id),{headers : headers})
            .map(res =>res.json());
    }
    
    getCategory() {
        return this._http.get("http://localhost:3000/api/v5/getCategory")
            .map(res => res.json());
    }

    filterEvents(date){
        var date:any = {
            Date : date
        }
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.post("http://localhost:3000/api/v5/filterEvents/date",JSON.stringify(date),{headers : headers})
            .map(res =>res.json());
    }
    deleteEvent(id){
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.post("http://localhost:3000/api/v5/delete/event",JSON.stringify(id),{headers : headers})
            .map(res =>res.json());
    }

    deleteCategory(id){
    var headers = new Headers();
    headers.append('Content-Type','application/json');
    return this._http.post("http://localhost:3000/api/v5/delete/category",JSON.stringify(id),{headers : headers})
        .map(res =>res.json());
    }

    filterByCategory(category){
    var headers = new Headers();
    headers.append('Content-Type','application/json');
    return this._http.post("http://localhost:3000/api/v5/filterByCategory",JSON.stringify(category),{headers : headers})
        .map(res =>res.json());
    }

    updateEvent(newEvent){
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.put("http://localhost:3000/api/v5/event/update",JSON.stringify(newEvent),{headers : headers})
            .map(res =>res.json());
        }   
    createGoogleAcc(data){
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.post("http://localhost:3000/api/v5/google/user/add",JSON.stringify(data),{headers : headers})
            .map(res =>res.json());
        } 
     

    getGoogleUserAsSignIn(){
        return this._http.get("http://localhost:3000/api/v5/getGoogleUserAsSignIn")
            .map(res => res.json());
    }

    signoutGoogle() {
        this._http.get('http://localhost:3000/google/user/logout');
    }

    createAccountViaGoogle(newData){
          var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.post("http://localhost:3000/api/v5/google/createAccount",JSON.stringify(newData),{headers : headers})
            .map(res =>res.json());
        } 

     bookEvent(data){
         var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.put("http://localhost:3000/api/v5/bookEvent",JSON.stringify(data),{headers : headers})
            .map(res => res.json());
    }

    showBookedEvent(id){
        return this._http.get("http://localhost:3000/api/v5/showBookedEvent?id="+id)
            .map(res => res.json());
    }

    cancelEvent(data){
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.put("http://localhost:3000/api/v5/cancelEvent",JSON.stringify(data),{headers : headers})
            .map(res => res.json());
    }

    filterBookedEvents(data){
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this._http.post("http://localhost:3000/api/v5/filterBookedEvents/date",JSON.stringify(data),{headers : headers})
            .map(res =>res.json());
    }

    historyOfBooking(id,userType){
        return this._http.get("http://localhost:3000/api/v5/history?id="+id+"&type="+userType)
            .map(res => res.json());
    }
    filterByCategoryUser(type,cat){
        return this._http.get("http://localhost:3000/api/v5/filterByCategoryUser?type="+type+"&cat="+cat)
            .map(res => res.json());
    }

    checkIfGoogleUser(){
        return this._http.get("http://localhost:3000/api/v5/google/user/check")
            .map(res => res.json());
    }
    historyOfBookingbydate(data,type){
        return this._http.get("http://localhost:3000/api/v5/historyAdmin?data="+data+"&type="+type)
            .map(res => res.json());
    }
    showcompleteDetailsAdmin(_id,User_id){
        return this._http.get("http://localhost:3000/api/v5/historyAdmin/info?id="+_id+"&User_id="+User_id)
            .map(res => res.json());
    }
}
  