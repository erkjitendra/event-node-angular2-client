import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit  {
    private error : 'no';
         constructor(private router: Router,private activatedRoute: ActivatedRoute) {}

         ngOnInit(){
             this.activatedRoute.queryParams.subscribe((params: Params) => {
                let error = params['error'];
                this.error = error;
            });
         }
}
