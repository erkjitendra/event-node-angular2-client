import { Component, OnInit } from '@angular/core';
import { Service } from '../service/service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'google',
  templateUrl: './google.component.html'
})
export class GoogleComponent implements OnInit {

  private years = [];  
  private months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  private rday : Number = 1 ;
  private rmonth = 1;
  private ryear = 1990 ;
  private email : string;
  private pass : string;
  private id : any;
  private name : string;
  private state = 'any';
 

  constructor(private _service : Service, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    
    
      for(var i = 1980 ; i<2007; i++){
            this.years.push(i);
        }
        if(localStorage.getItem('googleSignIn') == 'signIn'){
          this.state = (localStorage.getItem('googleSignIn'));
          localStorage.removeItem('googleSignIn');
          localStorage.setItem('google','true');
          this.getGoogleUserAsSignIn();
        }else{
          this._service.checkIfGoogleUser().
            subscribe(res =>{
              if(res.warning == 'user exists'){
                this.router.navigate(['error'], {queryParams:{'error':'user exists'}});
              }
            });
        }
  }

  
  getGoogleUserAsSignIn(){
     localStorage.setItem('user','active');
    this._service.getGoogleUserAsSignIn().subscribe(res =>{
      //res = JSON.parse(res);
      this.name = res.fname;
      this.email = res.email;
      this.id = res._id;

      if(res.email){
        this.router.navigate(['user'], {queryParams:{'name':this.name, 'email' : this.email, 'id' : this.id, 'google' : res.google }});
      }else{
        this.router.navigate(['/']);
      }
    });
  }

  createAccountViaGoogle(pass,repass,gender){
    localStorage.setItem('google','true');
     localStorage.removeItem('user');
      if(pass.value == repass.value){
            var month1 = this.months[this.rmonth-1];
        
            var date = new Date(this.rday+"/"+this.rmonth+"/"+this.ryear);
            var dob = date.toLocaleDateString();

            var newData = {
              pass : pass.value,
              dob : dob,
              gender : gender.value
            }
            this._service.createAccountViaGoogle(newData)
              .subscribe(res => {
                this.router.navigate([]).then(result=>{window.location.href = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:4200';});
              });
        }
  }
}


