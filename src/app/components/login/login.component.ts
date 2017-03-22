import { Component, OnInit } from '@angular/core';
import { Service } from '../service/service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {  

private email : string;
private pass : string;
private id : any;
private name : string;
private years = [];
private months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

private rday : Number = 1 ;
private rmonth = 1;
private ryear = 1990 ;
private state : string;
private error;


parentRouter : Router;

    constructor(private _service : Service, private router: Router) {}
    
    ngOnInit() {
        this.email = '';
        this.pass = '';
        this.id = '';
        this.name = '';
        for(var i = 1980 ; i<2007; i++){
            this.years.push(i);
        }
    localStorage.removeItem('google');    
       
    }

    stateChange(state){
      if(state){
        this.state = state;
      }
    }

    checkpass(){
    }

      addUser(fname,lname,email,M,F,pass,repass,phone){
    if(fname.value.length > 0 && lname.value.length > 0,email.value.match(/w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/),phone.value.length > 9){
      

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
                phone : phone.value,
                gender : gender,
                dob : dob
          };

           this._service.addUser(newUserData)
             .subscribe(res => {
               for(var i=0;i<res.length;i++){
                  if(res[i].param == 'email'){
                 this.error = 'email error'
                }
                if(res[i].param == 'phone'){
                  this.error = 'phone error';
                }
               }
               
             });


        }else{
          this.stateChange('passerr');
          
        }

    }else{
      this.state = 'filldatacorrectly';
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
  }

    getUser(email1,pass1) {
      this.email = email1;
      this.pass = pass1;

      this._service.getUser(this.email,this.pass)
        .subscribe(res => {
          this.id = res._id;
          this.name = res.fname;
          if(res.admin) {
            localStorage.setItem('admin','active');
           this.router.navigate(['admin'], {queryParams:{'name':this.name,'email' : this.email , 'pass' : pass1, 'id' : this.id}});
          }
          else{
             if(res.email == email1){
              localStorage.setItem('user','active');
              this.router.navigate(['user'], {queryParams:{'name':this.name, 'email' : this.email, 'id' : this.id, 'res':res }});
            }
            else {
                  if(res.notuser){
                    this.router.navigate(['error'], {queryParams:{'error':'notRegisteredUser'}});
                  }else{
                    this.router.navigate(['/']);
                  }
              
            }
          }
         
          
        });
    }


  googleSignIn(){
    var x = 'signIn';
    localStorage.setItem('googleSignIn','signIn');
    console.log(localStorage.getItem('googleSignIn'));
    if(localStorage.getItem('googleSignIn')=='signIn'){
        this.router.navigate(["/"]).then(result=>{window.location.href = 'http://localhost:3000/auth/google';});
    }
  }


  
  checkError(type,data){
    if(type == 'email'){
      if(data.value.match(/[\w-]+@([\w-]+\.)+[\w-]+/)){
        this.error = 'none';
      }else{
        this.error = 'email'
      }
    }
    if(type == 'phone'){
      if(data.value.match(/[7-9]{1}([0-9]{9})/) && data.value.length == 10){
        this.error = 'none'
      }else{
        this.error = 'phone'
      }
    }
  }

  removeError(type){
    if(type == 'email'){
      if(this.error == 'email'){  
        this.error = 'none';
      }
    }
    if(type=='phone'){
      if(this.error == 'phone'){
        this.error = 'none';
      }
    }
  }



}


